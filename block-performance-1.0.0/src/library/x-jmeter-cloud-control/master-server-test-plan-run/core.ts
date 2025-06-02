// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { guid } from "../../../myutils/common/guid.js";
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

    const tag = guid();
    const output_jtl_file_path = `/cloud/download/apache-jmeter/bin/test-plan-${tag}-result.jtl`;
    const output_html_report_directory_path = `/cloud/download/apache-jmeter/bin/test-plan-${tag}-report`;

    await cloudman.ssh_exec_script(
        log,
        {
            username: master_server.ssh_username,
            address: master_server.address_ipv4,
            ssh_auth_key: { store: true },
            script: [
                "sudo -i",
                // MUST swich to the directory, or the rmi_keystore.jks will not loaded
                "cd /cloud/download/apache-jmeter/bin/",
                // FIXME SECURITY escape to path required
                // Command Breakdown:
                // -n: Runs JMeter in non-GUI mode.
                // -r: Remote mode
                // -t /path/to/your/test-plan.jmx: Specifies the test plan file to run.
                // -l /path/to/your/results.jtl: Logs the test results to the specified JTL file.
                // -e: This is the flag that tells JMeter to generate the HTML report at the end of the test.
                // -o /path/to/output/folder: Specifies the directory for the HTML report. As with the first method, this folder must be empty or not exist beforehand.
                `./jmeter -n -r -t '${input.remote_test_plan_file_path}' -l ${output_jtl_file_path} -e -o ${output_html_report_directory_path}`
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
        output_jtl_file_path,
        output_html_report_directory_path
    });
}
