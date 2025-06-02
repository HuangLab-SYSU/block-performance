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
                "sudo apt-get update -y",
                "sudo apt-get install -y ca-certificates curl gnupg",
                "sudo mkdir -p /etc/apt/keyrings",
                "curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --yes --dearmor -o /etc/apt/keyrings/nodesource.gpg",
                "NODE_MAJOR=21",
                'echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list',
                "sudo apt-get update -y",
                "sudo apt-get install -y nodejs"
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
