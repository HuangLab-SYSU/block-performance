// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import { key_find } from "../key-find/export.js";
import * as file_system from "../../file-system/export.js";
import * as store from "../../x-ssh-key-store/export.js";
import { key_file_path_get } from "../key-file-path-get/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    try {
        return await key_find(
            log,
            {
                username: input.username,
                address: input.address
            },
            {
                empty: async () => {
                    return cb.none();
                },
                ok: async ({ list }) => {
                    for (const item of list) {
                        // remove the temp file
                        // FIXME side effects: this function auto write file
                        await key_file_path_get(
                            log,
                            {
                                username: input.username,
                                address: input.address
                            },
                            {
                                none: async () => {
                                    // ignore
                                },
                                ok: async ({ key_file_path }) => {
                                    await file_system.file_delete(
                                        log,
                                        {
                                            name: key_file_path
                                        },
                                        {
                                            none: () => {
                                                // ignore
                                            },
                                            ok: (output) => {
                                                // ignore
                                            },
                                            fail: (err) => {
                                                // tolerate the error, it's ok
                                                log.warn(err);
                                            }
                                        }
                                    );
                                },
                                fail: async (err) => {
                                    // tolerate the error, it's ok
                                    log.warn(err);
                                }
                            }
                        );

                        await store.key_del(
                            log,
                            { id: item.id },
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
                    return cb.ok({});
                },
                fail: async (err) => {
                    throw err;
                }
            }
        );
    } catch (err) {
        log.print_unknown_error(err);
        return cb.fail(err);
    }
}
