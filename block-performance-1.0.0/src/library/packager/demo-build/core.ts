// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import { build } from "../build/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    return await build(
        log,
        {
            name: "udp-proxy",
            version: "1.0.0",
            library_list: ["udp-proxy"],
            npm_script: {
                dev: "cat customize/start.json",
                start: "cat customize/start.json",
                stop: ""
            },
            customize_file_list: [
                {
                    name: "start.json",
                    json_data: { name: "test" }
                }
            ],
            custom_build_steps: [],
            output_dir: input.output_dir
        },
        {
            ok: (output) => {
                return cb.ok(output);
            },
            fail: (err) => {
                throw err;
            }
        }
    );
}
