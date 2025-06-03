// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import { credential_set } from "../../x-jmeter-cloud-credential/export.js";
import * as jmeter_cloud_control from "../../x-jmeter-cloud-control/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    if (input.slave_server_count < 1) {
        throw log.new_error("invalid slave_server_count");
    }

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

    for (let i = 0; i < input.slave_server_count; ++i) {
        await jmeter_cloud_control.slave_server_create(
            log,
            {},
            {
                ok: (output) => {
                    return output;
                },
                fail: (err) => {
                    throw err;
                }
            }
        );
    }

    await jmeter_cloud_control.master_server_create(
        log,
        {},
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
