// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import * as file_system from "../../file-system/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const { text } = await file_system.file_read_text(
        log,
        {
            name: input.css_file
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

    const output: Output = {
        npm_package_list: []
    };

    const match = text.matchAll(/@plugin "([^"]+)"/g);
    for (const item of match) {
        output.npm_package_list.push({
            name: item[1]
        });
    }

    return cb.ok(output);
}
