// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import * as url from "node:url";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    let search = "";
    const search_list: string[] = [];
    if (input.search_params) {
        Object.keys(input.search_params).forEach((name) => {
            const value = input.search_params[name];
            search_list.push(`${encodeURIComponent(name)}=${encodeURIComponent(value)}`);
        });
        if (search_list.length > 0) {
            search = "?" + search_list.join("&");
        }
    }

    let auth: string | undefined = undefined;
    if (input.username || input.password) {
        auth = [encodeURIComponent(input.username || ""), ":", encodeURIComponent(input.password || "")].join("");
    }

    const output: Output = {
        url: url.format({
            protocol: input.protocol,
            auth,
            hostname: input.hostname,
            port: input.port,
            pathname: input.pathname,
            search,
            hash: input.hash
        })
    };

    return cb.ok(output);
}
