// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import * as dir from "../../../myutils/node/dir/index.js";
import { Input, Output, Callback } from "./type.js";
import * as file_system from "../../file-system/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const { text } = await file_system.file_read_text(
        log,
        {
            name: dir.resolve(dir.root, "package.json")
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
        package: JSON.parse(text)
    });
}
