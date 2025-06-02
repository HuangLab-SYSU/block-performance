// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import { run } from "../../pty/export.js";
import { ssh_key_file_get } from "../ssh-key-file-get/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
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
            file: "ssh",
            args: [
                `${input.username}@${input.address}`,
                // don't check the host key (interactive required)
                "-o",
                "StrictHostKeyChecking=no",
                ...(key_file ? ["-i", key_file] : []), // if file is not specified, use the os default behavior (read from ~/.ssh/)
                // the command to be executed
                "-t",
                input.command
            ]
        },
        {
            ok: ({ exit_code }) => {
                if (exit_code !== 0) {
                    throw log.new_error("exit with code " + exit_code);
                }
            },
            fail: (err) => {
                throw err;
            }
        }
    );

    return cb.ok({});
}
