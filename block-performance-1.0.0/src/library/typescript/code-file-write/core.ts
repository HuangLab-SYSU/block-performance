// initialized by dev/system

import { Input, Output, Callback } from "./type.js";
import { Logger, file_system, prettier } from "../import.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    let formatted_text = input.text;

    if (input.format) {
        formatted_text = await prettier.format_tsx(
            log,
            {
                text: input.text
            },
            {
                ok: (output) => {
                    return output.text;
                },
                fail: (err) => {
                    throw err;
                }
            }
        );
    }

    await file_system.file_write_text(
        log,
        {
            name: input.filename,
            text: formatted_text
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

    return cb.ok({});
}
