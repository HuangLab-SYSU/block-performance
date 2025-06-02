// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { del_dir, del_file, exists_target } from "../../../myutils/node/file/index.js";
import { Input, Output, Callback } from "./type.js";
import * as path from "node:path";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const name_version = `${input.name}-${input.version}`;
    const target = {
        original: path.resolve(input.output_dir, name_version),
        dockerfile: path.resolve(input.output_dir, "Dockerfile"),
        build_script: path.resolve(input.output_dir, "build.sh"),
        tar_zip_file: path.resolve(input.output_dir, `${name_version}.tar.gz`),
        output: path.resolve(input.output_dir, "output")
    };

    await delete_item(log, target.original);
    await delete_item(log, target.dockerfile);
    await delete_item(log, target.build_script);
    await delete_item(log, target.tar_zip_file);
    await delete_item(log, target.output);

    return cb.ok({});
}

async function delete_item(plog: Logger, name: string) {
    const log = plog.sub("delete_item");
    log.variable("name", name);

    await exists_target(
        log,
        {
            name: name,
            match: (s) => s.isDirectory()
        },
        {
            no: async () => {
                await exists_target(
                    log,
                    {
                        name: name,
                        match: (s) => s.isFile()
                    },
                    {
                        no: async () => {
                            // ignore
                        },
                        yes: async () => {
                            await del_file(log, name, {
                                ok: () => {
                                    // ignore
                                },
                                fail: (err) => {
                                    throw err;
                                }
                            });
                        },
                        fail: async (err) => {
                            throw err;
                        }
                    }
                );
            },
            yes: async () => {
                await del_dir(log, name, {
                    ok: () => {
                        // ignore
                    },
                    fail: (err) => {
                        throw err;
                    }
                });
            },
            fail: async (err) => {
                throw err;
            }
        }
    );
}
