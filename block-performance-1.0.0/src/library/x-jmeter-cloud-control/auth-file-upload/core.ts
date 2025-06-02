// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import * as cloudman from "../../cloudman/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    await cloudman.scp_upload(
        log,
        {
            remote_ssh_auth: {
                username: input.username,
                address: input.address,
                ssh_auth_key: input.ssh_auth_key
            },
            from_local_path: input.local_auth_file_path,
            to_remote_path: input.remote_auth_file_path
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
