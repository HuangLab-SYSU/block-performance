// initialized by dev/system

import { Input, Output, Callback } from "./type.js";
import { Logger, prettier } from "../import.js";
import { code_file_read } from "../code-file-read/export.js";
import { code_file_write } from "../code-file-write/export.js";

export async function core<R>(
    log: Logger,
    input: Input & {
        should_skip?: (formatted_original_code: string) => boolean;
    },
    cb: Callback<R>
): Promise<R> {
    const formatted_old_snippet = await prettier.format_tsx(
        log,
        {
            text: input.old_snippet
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

    const { text: original_code } = await code_file_read(
        log,
        {
            filename: input.filename
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

    const formatted_original_code = await prettier.format_tsx(
        log,
        {
            text: original_code
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

    if (input.should_skip && input.should_skip(formatted_original_code)) {
        return cb.skip();
    }

    // ok, search
    if (formatted_original_code.indexOf(formatted_old_snippet) === -1) {
        return cb.skip();
    }

    const new_code = formatted_original_code.replace(formatted_old_snippet, input.new_snippet);

    await code_file_write(
        log,
        {
            filename: input.filename,
            text: new_code,
            format: true
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
