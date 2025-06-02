// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import * as cloudman from "../../cloudman/export.js";
import { slave_server_get } from "../slave-server-get/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const { slave_server } = await slave_server_get(
        log,
        {
            slave_server_id: input.slave_server_id
        },
        {
            none: () => {
                throw log.new_error("slave server not found");
            },
            ok: (output) => {
                return output;
            },
            fail: (err) => {
                throw err;
            }
        }
    );

    await cloudman.ssh_install_jmeter(
        log,
        {
            username: slave_server.ssh_username,
            address: slave_server.address_ipv4,
            ssh_auth_key: {
                store: true
            }
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

    return cb.ok({});
}
