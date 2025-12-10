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
            command:
                // install nodejs for all users (global install)
                [
                    "sudo apt-get update -y",
                    "sudo apt-get install -y ca-certificates curl gnupg",
                    "sudo mkdir -p /etc/apt/keyrings",
                    "curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --yes --dearmor -o /etc/apt/keyrings/nodesource.gpg",
                    "NODE_MAJOR=22",
                    'echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list',
                    "sudo apt-get update -y",
                    "sudo apt-get install -y nodejs"
                ].join(" && ")

            // NOT WORKING (wrong file hash detected by apt system)
            // from: https://nodesource.com/products/distributions
            // [
            //     "sudo apt-get update -y",
            //     "sudo apt-get install -y curl",
            //     "curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -",
            //     "sudo apt-get install -y nodejs"
            // ].join(" && ")
            // from: https://nodejs.org/en/download

            // NOT WORKING (nvm install nodejs for current user only, and pm2 faield to spawn a node process)
            // modified: install nvm and nodejs in root (important)
            // [
            //     "sudo apt-get update -y",
            //     "sudo apt-get install -y curl",
            //     "sudo bash -i -c 'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash'", // # Download and install nvm
            //     `sudo bash -i -c 'source /root/.nvm/nvm.sh'`,
            //     "sudo bash -i -c 'nvm install 22'"
            // ].join(" && ")
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
