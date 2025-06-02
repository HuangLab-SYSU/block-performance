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

    await cloudman.ssh_exec_script(
        log,
        {
            username: slave_server.ssh_username,
            address: slave_server.address_ipv4,
            ssh_auth_key: {
                store: true
            },
            script: [
                "sudo killall jmeter-server",
                "sudo killall java", // DANGEROUS if there are other java apps on the server
                "cd /cloud/download/apache-jmeter/bin", // IMPORTANT (because the auth file is uploaded here)
                // WHY sudo -i ?
                // Because
                // - the jmeter path is set by /etc/profile.d/jmeter.sh
                // - the java path is set by /etc/profile.d/jdk.h
                // The /etc/profile.d/* files are only loaded by interactive shell, which need the -i option.
                "sudo -i nohup jmeter-server 1>/dev/null 2>/dev/null &" // https://askubuntu.com/questions/349262/run-a-nohup-command-over-ssh-then-disconnect
            ].join("\n")
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
