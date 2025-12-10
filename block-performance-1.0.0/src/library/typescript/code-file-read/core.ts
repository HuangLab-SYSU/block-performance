// initialized by dev/system

import { Input, Output, Callback } from "./type.js";
import { Logger, file_system } from "../import.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const { text } = await file_system.file_read_text(
        log,
        {
            name: input.filename
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

    // TODO parse AST

    return cb.ok({
        text
    });
}
