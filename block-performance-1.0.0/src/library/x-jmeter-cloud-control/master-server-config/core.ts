// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import { master_server_config_auth_file_upload } from "../master-server-config-auth-file-upload/export.js";
import { master_server_config_slave_address_list_update } from "../master-server-config-slave-address-list-update/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    await master_server_config_auth_file_upload(
        log,
        {
            master_server_id: input.master_server_id,
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

    await master_server_config_slave_address_list_update(
        log,
        {
            master_server_id: input.master_server_id
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
