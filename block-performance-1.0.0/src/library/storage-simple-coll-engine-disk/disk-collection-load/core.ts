// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { read_multi_json_file } from "../../../myutils/node/file/index.js";
import * as dirname from "../_dirname/index.js";
import { Collection } from "../_type/index.js";
import { Input, Output, Callback } from "./type.js";
import * as fs from "node:fs";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const { namespace, key } = input;
    const base_dir = dirname.resolve(namespace, key);
    const data: Collection<any> = {
        namespace,
        key,
        metadata: {},
        items: []
    };
    // base_dir may not exists
    if (!fs.existsSync(base_dir)) {
        log.warn("directory not exists: " + base_dir);
        return cb.ok(data);
    }
    return await read_multi_json_file(
        log,
        {
            dir: base_dir,
            filter: (item) => {
                const accept = item.name === "metadata.json" || /^item@.+\.json$/.test(item.name);
                return accept;
            }
        },
        {
            empty: () => {
                log.println("empty, no file");
                return cb.ok(data);
            },
            ok: (items) => {
                items.forEach((item) => {
                    if (item.name === "metadata.json") {
                        data.metadata = item.content;
                    } else {
                        data.items.push(item.content);
                    }
                });
                return cb.ok(data);
            },
            fail: (err) => {
                throw err;
            }
        }
    );
}
