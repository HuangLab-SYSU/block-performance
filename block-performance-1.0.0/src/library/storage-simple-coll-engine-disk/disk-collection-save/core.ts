// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { write_multi_json_file } from "../../../myutils/node/file/index.js";
import * as dirname from "../_dirname/index.js";
import { Input, Output, Callback } from "./type.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const data = input;
    const { namespace, key } = data;
    const base_dir = dirname.resolve(namespace, key);
    await write_multi_json_file(
        log,
        {
            dir: base_dir,
            items: [
                {
                    name: "metadata.json",
                    content: JSON.stringify(data.metadata)
                },
                ...data.items.map((item) => ({
                    name: `item@${item.id}.json`,
                    content: JSON.stringify(item)
                }))
            ]
        },
        {
            ok: () => {
                // ignore
            },
            fail: (err) => {
                throw err;
            }
        }
    );
    return cb.ok({});
}
