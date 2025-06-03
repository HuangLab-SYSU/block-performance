// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import { credential_set } from "../../x-jmeter-cloud-credential/export.js";
import * as jmeter_cloud_control from "../../x-jmeter-cloud-control/export.js";
import * as jmeter_cloud_store from "../../x-jmeter-cloud-store/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    await credential_set(
        log,
        {
            credential: input.credential
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

    const { list: master_server_list } = await jmeter_cloud_store.master_server_ls(
        log,
        {},
        {
            empty: (output) => {
                return output;
            },
            ok: (output) => {
                return output;
            },
            fail: (err) => {
                throw err;
            }
        }
    );

    const { list: slave_server_list } = await jmeter_cloud_store.slave_server_ls(
        log,
        {},
        {
            empty: (output) => {
                return output;
            },
            ok: (output) => {
                return output;
            },
            fail: (err) => {
                throw err;
            }
        }
    );

    for (const item of master_server_list) {
        await jmeter_cloud_control.master_server_remove(
            log,
            {
                master_server_id: item.id
            },
            {
                none: () => {
                    throw log.new_error("unexpected, master server not found");
                },
                ok: (output) => {
                    return output;
                },
                fail: (err) => {
                    throw err;
                }
            }
        );
    }

    for (const item of slave_server_list) {
        await jmeter_cloud_control.slave_server_remove(
            log,
            {
                slave_server_id: item.id
            },
            {
                none: () => {
                    throw log.new_error("unexpected, slave server not found");
                },
                ok: (output) => {
                    return output;
                },
                fail: (err) => {
                    throw err;
                }
            }
        );
    }

    return cb.ok({});
}
