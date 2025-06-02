// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import { ssh_exec } from "../ssh-exec/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    if (input.app_list.length < 1) {
        throw log.new_error("app_list is empty");
    }

    const app_name_list = input.app_list.map((item) => JSON.stringify(item)).join(" ");

    await ssh_exec(
        log,
        {
            username: input.username,
            address: input.address,
            ssh_auth_key: input.ssh_auth_key,
            command: input.noninteractive
                ? [
                      // with environment variable
                      "sudo DEBIAN_FRONTEND=noninteractive apt-get update -y",
                      `sudo DEBIAN_FRONTEND=noninteractive apt-get install -y ${app_name_list}`
                  ].join(" && ")
                : [
                      // without environment variable
                      "sudo apt-get update -y",
                      `sudo apt-get install -y ${app_name_list}`
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
