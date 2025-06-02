// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import { build } from "../../packager/export.js";
import * as os from "node:os";
import * as path from "node:path";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const temp_dir = path.resolve(os.tmpdir(), "cloudman");
    log.variable("temp_dir", temp_dir);

    const { target_dir, target_tar_zip_file } = await build(
        log,
        {
            name: input.name,
            version: input.version,
            library_list: input.library_list,
            npm_script: input.npm_script,
            customize_file_list: input.customize_file_list,
            output_dir: temp_dir
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
        target_dir,
        target_tar_zip_file
    });
}
