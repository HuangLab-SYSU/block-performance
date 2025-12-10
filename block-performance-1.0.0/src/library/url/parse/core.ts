// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import * as liburl from "node:url";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const url = new URL(input.url);

    const output: Output = {
        protocol: url.protocol,
        username: url.username,
        password: url.password,
        hostname: url.hostname,
        port: url.port,
        pathname: url.pathname,
        search_params: {},
        hash: url.hash
    };

    for (const [name, value] of url.searchParams) {
        output.search_params[name] = value;
    }

    return cb.ok(output);
}
