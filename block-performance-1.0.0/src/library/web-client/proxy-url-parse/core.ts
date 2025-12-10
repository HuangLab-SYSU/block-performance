// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import * as url from "../../url/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const { protocol, hostname, port, username, password } = await url.parse(
        log,
        { url: input.proxy_url },
        {
            ok: (output) => {
                return output;
            },
            fail: (err) => {
                throw err;
            }
        }
    );

    const has_auth = username || password ? true : false;

    return cb.ok({
        proxy: {
            protocol: protocol.replace(":", ""),
            hostname,
            port: port ? parseInt(port) : protocol === "https:" ? 443 : 80,
            auth: has_auth
                ? {
                      username,
                      password
                  }
                : undefined
        }
    });
}
