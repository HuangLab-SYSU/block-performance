// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import { run } from "../../pty/export.js";
import { ssh_key_file_get } from "../ssh-key-file-get/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const { username, address, local_script_file } = input;

    const key_file = await ssh_key_file_get(
        log,
        {
            username: input.username,
            address: input.address,
            ssh_auth_key: input.ssh_auth_key
        },
        {
            without_key_file: () => {
                return "";
            },
            ok: (output) => {
                return output.key_file;
            },
            fail: (err) => {
                throw err;
            }
        }
    );

    await run(
        log,
        {
            file: "bash",
            args: key_file
                ? ["-c", `cat '${local_script_file}' | ssh -o StrictHostKeyChecking=no -i '${key_file}' ${username}@${address} -T 'sudo bash'`]
                : ["-c", `cat '${local_script_file}' | ssh -o StrictHostKeyChecking=no ${username}@${address} -T 'sudo bash'`]
        },
        {
            ok: ({ exit_code }) => {
                if (exit_code !== 0) {
                    throw log.new_error("bash terminated with error");
                }
            },
            fail: (err) => {
                throw err;
            }
        }
    );

    return cb.ok({});
}
