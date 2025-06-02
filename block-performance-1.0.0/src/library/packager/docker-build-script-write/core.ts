// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import { docker_build_script_make } from "../docker-build-script-make/export.js";
import { write_text_file } from "../../../myutils/node/file/write_text_file.js";
import * as path from "node:path";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const { text } = await docker_build_script_make(
        log,
        {
            name: input.name,
            version: input.version
        },
        {
            ok: (output) => {
                return output;
            },
            fail: (err) => {
                throw err;
            }
        }
    );

    const filename = path.resolve(input.output_dir, "build.sh");

    await write_text_file(log, filename, text, {
        ok: () => {
            // ignore
        },
        fail: (err) => {
            throw err;
        }
    });

    return cb.ok({});
}
