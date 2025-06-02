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
            command: [
                `sudo apt-get update -y`,
                `sudo apt-get install -y wireguard`,
                `sudo sh -c "echo 'net.core.default_qdisc=fq' >> /etc/sysctl.conf"`,
                `sudo sh -c "echo 'net.ipv4.tcp_congestion_control=bbr' >> /etc/sysctl.conf"`, // this is optional, optimize tcp
                `sudo sh -c "echo 'net.ipv4.ip_forward=1' >> /etc/sysctl.conf"`,
                `sudo sysctl -p` // display it
            ].join(" && ")
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
