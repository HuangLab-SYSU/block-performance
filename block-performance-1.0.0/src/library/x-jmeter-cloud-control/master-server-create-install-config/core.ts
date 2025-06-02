// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import { master_server_create } from "../master-server-create/export.js";
import { master_server_install } from "../master-server-install/export.js";
import { master_server_config } from "../master-server-config/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const { master_server_id, aws_lightsail_instance } = await master_server_create(
        log,
        {},
        {
            ok: (output) => {
                return output;
            },
            fail: (err) => {
                throw err;
            }
        }
    );

    await master_server_install(
        log,
        {
            master_server_id
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

    await master_server_config(
        log,
        {
            master_server_id,
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

    return cb.ok({ master_server_id, aws_lightsail_instance });
}
