// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import { slave_server_config_auth_file_upload } from "../slave-server-config-auth-file-upload/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    await slave_server_config_auth_file_upload(
        log,
        {
            slave_server_id: input.slave_server_id,
            local_auth_file_path: input.local_auth_file_path
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

    // more steps here

    return cb.ok({});
}
