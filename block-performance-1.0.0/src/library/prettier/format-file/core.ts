// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import * as file_system from "../../file-system/export.js";
import { format_ts } from "../format-ts/export.js";
import { format_tsx } from "../format-tsx/export.js";

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

    let formated_text = "";

    if (/\.ts$/i.test(input.filename)) {
        await format_ts(
            log,
            {
                text
            },
            {
                ok: (output) => {
                    formated_text = output.text;
                },
                fail: (err) => {
                    throw err;
                }
            }
        );
    } else if (/\.tsx$/i.test(input.filename)) {
        await format_tsx(
            log,
            {
                text
            },
            {
                ok: (output) => {
                    formated_text = output.text;
                },
                fail: (err) => {
                    throw err;
                }
            }
        );
    } else {
        throw log.new_error("unknown file type");
    }

    await file_system.file_write_text(
        log,
        {
            name: input.filename,
            text: formated_text
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
