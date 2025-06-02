// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import { ssh_apt_install } from "../ssh-apt-install/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    await ssh_apt_install(
        log,
        {
            username: input.username,
            address: input.address,
            ssh_auth_key: input.ssh_auth_key,
            noninteractive: true, // avoid keyboard-configuration fail (use default config)
            app_list: ["task-gnome-desktop"]
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
