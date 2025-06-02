// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import { ssh_apt_install } from "../ssh-apt-install/export.js";
import { ssh_install_wget } from "../ssh-install-wget/export.js";
import { ssh_exec_script } from "../ssh-exec-script/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    // The defualt version is too old
    // await ssh_apt_install(
    //     log,
    //     {
    //         username: input.username,
    //         address: input.address,
    //         ssh_auth_key: input.ssh_auth_key,
    //         app_list: ["openjdk-17-jdk"]
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
                "wget https://download.java.net/java/GA/jdk24.0.1/24a58e0e276943138bf3e963e6291ac2/9/GPL/openjdk-24.0.1_linux-x64_bin.tar.gz",
                "tar zxvf openjdk-24.0.1_linux-x64_bin.tar.gz",
                "rm openjdk-24.0.1_linux-x64_bin.tar.gz",
                "mv jdk-24.0.1 jdk",
                "chmod -R 777 jdk", // IMPORTANT
                // create soft links (deprecated, edit /etc/profile.d/ instead)
                // "sudo ln -s /cloud/download/jdk/bin/java /usr/local/bin/java",
                // "sudo ln -s /cloud/download/jdk/bin/javac /usr/local/bin/javac",
                `echo 'export JAVA_HOME=/cloud/download/jdk' > /etc/profile.d/jdk.sh`, // create file (override existing)
                `echo 'export PATH="$JAVA_HOME/bin:$PATH"' >> /etc/profile.d/jdk.sh` // append file
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
        jdk_path: "/cloud/download/jdk"
    });
}
