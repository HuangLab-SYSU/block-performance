// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import { auth_file_upload } from "../auth-file-upload/export.js";
import { master_server_get } from "../master-server-get/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const { master_server } = await master_server_get(
        log,
        {
            master_server_id: input.master_server_id
        },
        {
            none: () => {
                throw log.new_error("master server not found");
            },
            ok: (output) => {
                return output;
            },
            fail: (err) => {
                throw err;
            }
        }
    );

    await auth_file_upload(
        log,
        {
            username: master_server.ssh_username,
            address: master_server.address_ipv4,
            ssh_auth_key: {
                store: true
            },
            local_auth_file_path: input.local_auth_file_path,
            remote_auth_file_path: "/cloud/download/apache-jmeter/bin/rmi_keystore.jks"
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
