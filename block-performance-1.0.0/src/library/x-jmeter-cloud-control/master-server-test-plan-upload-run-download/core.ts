// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import { master_server_test_plan_upload } from "../master-server-test-plan-upload/export.js";
import { master_server_test_plan_run } from "../master-server-test-plan-run/export.js";
import { master_server_test_plan_output_download } from "../master-server-test-plan-output-download/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const { remote_test_plan_file_path } = await master_server_test_plan_upload(
        log,
        {
            master_server_id: input.master_server_id,
            local_test_plan_file_path: input.local_test_plan_file_path
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

    const { output_jtl_file_path, output_html_report_directory_path } = await master_server_test_plan_run(
        log,
        {
            master_server_id: input.master_server_id,
            remote_test_plan_file_path
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

    await master_server_test_plan_output_download(
        log,
        {
            master_server_id: input.master_server_id,
            remote_output_jtl_file_path: output_jtl_file_path,
            remote_output_html_report_directory_path: output_html_report_directory_path,
            local_output_jtl_file_path: input.download_jtl_file_to_path,
            local_output_html_report_directory_path: input.download_html_report_directory_to_path
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
