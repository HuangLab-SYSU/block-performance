// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import { ssh_install_openjdk } from "../ssh-install-openjdk/export.js";
import { ssh_apt_install } from "../ssh-apt-install/export.js";
import { ssh_install_wget } from "../ssh-install-wget/export.js";
import { ssh_exec_script } from "../ssh-exec-script/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    await ssh_install_openjdk(
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

    await ssh_install_wget(
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

    // The defualt version is too old
    // await ssh_apt_install(
    //     log,
    //     {
    //         username: input.username,
    //         address: input.address,
    //         ssh_auth_key: input.ssh_auth_key,
    //         app_list: ["jmeter"]
    //     },
    //     {
    //         ok: (output) => {
    //             return output;
    //         },
    //         fail: (err) => {
    //             throw err;
    //         }
    //     }
    // );

    await ssh_exec_script(
        log,
        {
            username: input.username,
            address: input.address,
            ssh_auth_key: input.ssh_auth_key,
            script: [
                // don't switch to root, use current user  is ok
                "mkdir -p /cloud/download",
                "cd /cloud/download",
                "wget https://dlcdn.apache.org//jmeter/binaries/apache-jmeter-5.6.3.tgz",
                "tar zxvf apache-jmeter-5.6.3.tgz",
                "rm apache-jmeter-5.6.3.tgz",
                "mv apache-jmeter-5.6.3 apache-jmeter",
                "chmod -R 777 apache-jmeter", // IMPORTANT
                // create soft links (deprecated, edit /etc/profile.d/ instead)
                // "sudo ln -s /cloud/download/apache-jmeter/bin/jmeter /usr/local/bin/jmeter",
                // "sudo ln -s /cloud/download/apache-jmeter/bin/jmeter-server /usr/local/bin/jmeter-server",
                `echo 'export PATH="/cloud/download/apache-jmeter/bin/:$PATH"' > /etc/profile.d/jmeter.sh` // create file (override existing)
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

    return cb.ok({
        jmeter_path: "/cloud/download/apache-jmeter"
    });
}
