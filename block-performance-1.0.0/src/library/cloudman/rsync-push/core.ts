// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import { run } from "../../pty/export.js";
import * as path from "node:path";
import { ssh_key_file_get } from "../ssh-key-file-get/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    // [IMPORTANT]
    // convert all dir path string to the same form:
    //   "/a/b/" -> "/a/b"
    //
    // then change the two items to
    // - input.from_local_dir: "/a/b/"
    // - input.to_remote_dir: "/a/b" (no trailing slash)
    //
    // [WHY?]
    // rsync treat these two forms differently
    // it means copy all items from local directory "/a/b/"
    // then create directory "b" in remote directory "/a/"
    // the final results is what we expected:
    // sync the same content from local "/a/b/" to remote "/a/b/"
    //
    // [EXAMPLE]
    // please always provide the full path name, both local and remote
    //
    // this is right:
    // - input.from_local_dir: /some-local-path/app-name-version
    // - input.to_remote_dir: /some-remote-path/app-name-version
    //
    // this is wrong:
    // - input.from_local_dir: /some-local-path/app-name-version
    // - input.to_remote_dir: /some-remote-path/

    const from_local_dir = path.resolve(input.from_local_dir) + "/";
    const to_remote_dir = path.resolve(input.to_remote_dir);
    log.variable("from_local_dir", from_local_dir);
    log.variable("to_remote_dir", to_remote_dir);

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
            file: "rsync",
            args: [
                "--rsync-path",
                "sudo rsync",
                "--archive",
                "--recursive",
                "--compress",
                "--progress",
                "--stats",
                ...(key_file ? ["-e", `ssh -i '${key_file}' -o StrictHostKeyChecking=no`] : []),
                from_local_dir,
                `${input.username}@${input.address}:${to_remote_dir}` // FIXME ssh key file
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
