// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { list_dir } from "../../../myutils/node/file/index.js";
import { Input, Output, Callback } from "./type.js";

export async function core<R>(
    log: Logger,
    input: Input & {
        filter?: (item: { name: string; fullname: string }) => boolean;
    },
    cb: Callback<R>
): Promise<R> {
    const output: Output = {
        directory_list: []
    };

    const run = async (dir: string) => {
        await list_dir(
            log,
            { dir },
            {
                empty: async () => {
                    // ignore
                },
                ok: async (list) => {
                    list.forEach((item) => {
                        output.directory_list.push({
                            name: item.name,
                            fullname: item.fullname
                        });
                    });
                },
                fail: async (err) => {
                    throw err;
                }
            }
        );

        if (!input.recursive) return;

        await list_dir(
            log,
            {
                dir
            },
            {
                empty: async () => {
                    // ignore
                },
                ok: async (list) => {
                    for (const item of list) {
                        await run(item.fullname);
                    }
                },
                fail: (err) => {
                    throw err;
                }
            }
        );
    };

    await run(input.dir);

    if (input.filter) {
        output.directory_list = output.directory_list.filter(input.filter);
    }

    if (output.directory_list.length) {
        return cb.ok(output);
    } else {
        return cb.empty({ directory_list: [] });
    }
}
