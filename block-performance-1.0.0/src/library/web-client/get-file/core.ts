// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import * as fs from "node:fs";
import * as path from "node:path";
import * as http from "node:http";
import * as https from "node:https";
import * as url from "../../url/export.js";
import { to_nodejs_headers, from_nodejs_headers } from "../_/index.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const { protocol } = await url.parse(
        log,
        {
            url: input.url
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

    const save_to_file_abs = path.resolve(input.save_to_file);
    log.variable("save_to_file_abs", save_to_file_abs);

    const file_exists = fs.existsSync(save_to_file_abs);
    if (file_exists) {
        throw log.new_error("file existed already");
    }

    let mod: typeof http | typeof https;

    switch (protocol) {
        case "http:":
            mod = http;
            break;
        case "https:":
            mod = https;
            break;
        default:
            throw log.new_error("unknown url protocol");
    }

    const output = await new Promise<Output>((resolve, reject) => {
        mod.get(
            input.url,
            {
                headers: to_nodejs_headers(input.headers || [])
            },
            (res) => {
                log.variable("res.statusCode", res.statusCode);
                log.variable("res.statusMessage", res.statusMessage);
                log.variable("res.headers", res.headers);

                // save output to file
                // but the response status code maybe unexpected
                // handle it later

                const file = fs.createWriteStream(save_to_file_abs);
                file.on("finish", () => {
                    file.close(() => {
                        resolve({
                            status_code: res.statusCode,
                            status_message: res.statusMessage,
                            headers: from_nodejs_headers(res.headers)
                        });
                    });
                });

                res.pipe(file);
            }
        ).on("error", (err) => {
            reject(err);
        });
    });

    if (output.status_code !== 200) {
        return cb.unexpected_response(output);
    } else {
        return cb.ok(output);
    }
}
