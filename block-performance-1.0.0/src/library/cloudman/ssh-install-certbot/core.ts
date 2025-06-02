// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import { ssh_exec } from "../ssh-exec/export.js";
import { ssh_install_snapd } from "../ssh-install-snapd/export.js";

// reference:
// - https://certbot.eff.org/instructions?ws=other&os=snap
export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    await ssh_install_snapd(
        log,
        {
            username: input.username,
            address: input.address,
            ssh_auth_key: input.ssh_auth_key
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

    await ssh_exec(
        log,
        {
            username: input.username,
            address: input.address,
            ssh_auth_key: input.ssh_auth_key,
            command: ["sudo snap install --classic certbot", "sudo ln -s /snap/bin/certbot /usr/bin/certbot"].join(" && ")
        },
        {
            ok: () => {
                // ignore
            },
            fail: (err) => {
                throw err;
            }
        }
    );

    return cb.ok({});
}
