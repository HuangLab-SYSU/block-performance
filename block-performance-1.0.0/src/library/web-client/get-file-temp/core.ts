// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { guid } from "../../../myutils/common/guid.js";
import { Input, Output, Callback } from "./type.js";
import { get_file } from "../get-file/export.js";
import { temp_path_resolve } from "../../file-system/export.js";
import * as path from "node:path";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    let unique_name = `http-client_${guid()}`;

    // check input.filename
    // WRONG: "/path/to/file.xxx"
    // RIGHT: "file.xxx"
    if (input.filename) {
        const basename = path.basename(input.filename);
        log.variable("basename", basename);
        if (basename !== input.filename) {
            throw log.new_error("invalid filename");
        }

        unique_name = `http-client_${guid()}_${basename}`; // keep unique
    }

    const { path: temp_file_name } = await temp_path_resolve(
        log,
        {
            part_list: [unique_name]
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

    return await get_file(
        log,
        {
            url: input.url,
            headers: input.headers,
            save_to_file: temp_file_name
        },
        {
            unexpected_response: ({ status_code, status_message, headers }) => {
                return cb.unexpected_response({
                    status_code,
                    status_message,
                    headers,
                    temp_file_name
                });
            },
            ok: ({ status_code, status_message, headers }) => {
                return cb.ok({
                    status_code,
                    status_message,
                    headers,
                    temp_file_name
                });
            },
            fail: (err) => {
                throw err;
            }
        }
    );
}
