// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
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
        mod.request(
            input.url,
            {
                method: "HEAD",
                headers: to_nodejs_headers(input.headers || [])
            },
            (res) => {
                log.variable("res.statusCode", res.statusCode);
                log.variable("res.statusMessage", res.statusMessage);
                log.variable("res.headers", res.headers);

                res.destroy(); // important
                resolve({
                    status_code: res.statusCode,
                    status_message: res.statusMessage,
                    headers: from_nodejs_headers(res.headers)
                });
            }
        )
            .on("error", (err) => {
                reject(err);
            })
            .end();
    });

    return cb.ok(output);
}
