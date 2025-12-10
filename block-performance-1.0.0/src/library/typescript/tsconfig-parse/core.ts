// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import * as dir from "../../../myutils/node/dir/index.js";
import { read_text_file } from "../../../myutils/node/file/index.js";
import { Input, Output, Callback } from "./type.js";
import { tsconfig_parse_text } from "../tsconfig-parse-text/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const file_abs = dir.resolve(input.file);
    log.variable("file_abs", file_abs);

    const text = await read_text_file(log, file_abs, {
        ok: (text) => {
            return text;
        },
        fail: (err) => {
            throw err;
        }
    });

    const { result } = await tsconfig_parse_text(
        log,
        {
            text
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
    return cb.ok({
        result
    });
}
