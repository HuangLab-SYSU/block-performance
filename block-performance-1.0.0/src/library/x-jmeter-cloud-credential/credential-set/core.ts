// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import * as store from "../../x-jmeter-cloud-store/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    // remove all credentials
    await store.credential_ls(
        log,
        {},
        {
            empty: async (output) => {
                // ignore
            },
            ok: async ({ list }) => {
                for (const item of list) {
                    await store.credential_del(
                        log,
                        {
                            id: item.id
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
                }
            },
            fail: async (err) => {
                throw err;
            }
        }
    );

    // add new one
    await store.credential_add(
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

    return cb.ok({});
}
