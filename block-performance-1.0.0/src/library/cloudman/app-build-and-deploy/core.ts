// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import { app_deploy } from "../app-deploy/export.js";
import { ssh_exec } from "../ssh-exec/export.js";
import { app_build } from "../app-build/export.js";
import * as path from "node:path";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const { target_dir } = await app_build(
        log,
        {
            name: input.app.name,
            version: input.app.version,
            library_list: input.app.library_list,
            npm_script: input.app.npm_script,
            customize_file_list: input.app.customize_file_list,
            custom_build_steps: input.app.custom_build_steps
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

    await ssh_exec(
        log,
        {
            username: input.remote.username,
            address: input.remote.address,
            ssh_auth_key: input.remote.ssh_auth_key,
            command: `sudo mkdir -p /cloud` // no error even when it exists
        },
        {
            ok: () => {},
            fail: (err) => {
                throw err;
            }
        }
    );

    await app_deploy(
        log,
        {
            username: input.remote.username,
            address: input.remote.address,
            ssh_auth_key: input.remote.ssh_auth_key,
            from_local_dir: target_dir,
            to_remote_dir: path.resolve("/cloud/", path.basename(target_dir)), // -> /cloud/{name}
            pre_installed_applications: input.pre_installed_applications
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
