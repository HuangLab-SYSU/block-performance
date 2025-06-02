// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { guid } from "../../../myutils/common/guid.js";
import { Input, Output, Callback } from "./type.js";
import { master_server_get } from "../master-server-get/export.js";
import * as cloudman from "../../cloudman/export.js";

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

    const remote_test_plan_file_path = `/cloud/download/apache-jmeter/bin/test-plan-${guid()}.jmx`;

    await cloudman.scp_upload(
        log,
        {
            remote_ssh_auth: {
                username: master_server.ssh_username,
                address: master_server.address_ipv4,
                ssh_auth_key: {
                    store: true
                }
            },
            from_local_path: input.local_test_plan_file_path,
            to_remote_path: remote_test_plan_file_path
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
        remote_test_plan_file_path
    });
}
