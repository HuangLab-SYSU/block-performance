// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import { ssh_exec } from "../ssh-exec/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    await ssh_exec(
        log,
        {
            username: input.username,
            address: input.address,
            ssh_auth_key: input.ssh_auth_key,
            command: `sudo reboot`
        },
        {
            ok: () => {},
            fail: (err) => {
                throw err;
            }
        }
    );

    return cb.ok({});
}
