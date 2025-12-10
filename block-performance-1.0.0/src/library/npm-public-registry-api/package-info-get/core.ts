// initialized by dev/system

import { Input, Output, Callback } from "./type.js";
import { Logger, web_client } from "../import.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const { json_value } = await web_client.get_json(
        log,
        {
            url: `https://registry.npmjs.org/${encodeURIComponent(input.name)}/${encodeURIComponent(input.version || "latest")}`,
            proxy_url: ""
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

    return cb.ok({
        package_info: json_value
    });
}
