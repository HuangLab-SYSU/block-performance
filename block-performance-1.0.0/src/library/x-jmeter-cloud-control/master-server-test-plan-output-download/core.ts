// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import * as cloudman from "../../cloudman/export.js";
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

    await cloudman.scp_download(
        log,
        {
            remote_ssh_auth: {
                username: master_server.ssh_username,
                address: master_server.address_ipv4,
                ssh_auth_key: { store: true }
            },
            from_remote_path: input.remote_output_jtl_file_path,
            to_local_path: input.local_output_jtl_file_path
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

    await cloudman.scp_download(
        log,
        {
            remote_ssh_auth: {
                username: master_server.ssh_username,
                address: master_server.address_ipv4,
                ssh_auth_key: { store: true }
            },
            from_remote_path: input.remote_output_html_report_directory_path,
            to_local_path: input.local_output_html_report_directory_path
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
