// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import { slave_server_create } from "../slave-server-create/export.js";
import { slave_server_install } from "../slave-server-install/export.js";
import { slave_server_config } from "../slave-server-config/export.js";
import { slave_server_run } from "../slave-server-run/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const { slave_server_id, aws_lightsail_instance } = await slave_server_create(
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

    await slave_server_install(
        log,
        {
            slave_server_id
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

    await slave_server_config(
        log,
        {
            slave_server_id,
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

    await slave_server_run(
        log,
        {
            slave_server_id
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

    return cb.ok({ slave_server_id, aws_lightsail_instance });
}
