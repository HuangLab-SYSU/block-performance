// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import * as jmeter_cloud_control from "../../x-jmeter-cloud-control/export.js";
import * as jmeter_cloud_store from "../../x-jmeter-cloud-store/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    return await jmeter_cloud_store.master_server_ls(
        log,
        {},
        {
            empty: async (output) => {
                throw log.new_error("no jmeter cluster found");
            },
            ok: async ({ list }) => {
                if (list.length > 1) {
                    throw log.new_error("unexpected, multiple master server found");
                }

                const master_server = list[0];

                await jmeter_cloud_control.master_server_test_plan_upload_run_download(
                    log,
                    {
                        master_server_id: master_server.id,
                        local_test_plan_file_path: input.local_test_plan_file_path,
                        download_jtl_file_to_path: input.download_jtl_file_to_path,
                        download_html_report_directory_to_path: input.download_html_report_directory_to_path
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
            },
            fail: async (err) => {
                throw err;
            }
        }
    );
}
