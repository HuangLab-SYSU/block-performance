// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import { key_find } from "../key-find/export.js";
import * as store from "../../x-ssh-key-store/export.js";
import { key_disabled_set } from "../key-disabled-set/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    try {
        // find all old keys matches and disable them

        const disable_id_list: string[] = [];

        for (const address of input.address_list) {
            await key_find(
                log,
                {
                    username: input.username,
                    address
                },
                {
                    empty: () => {
                        // ignore
                    },
                    ok: (output) => {
                        output.list.forEach((item) => {
                            disable_id_list.push(item.id);
                        });
                    },
                    fail: (err) => {
                        throw err;
                    }
                }
            );
        }

        log.variable("disable_id_list", disable_id_list);

        for (const disable_id of disable_id_list) {
            await key_disabled_set(
                log,
                {
                    id: disable_id,
                    disabled: true
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

        const { id } = await store.key_add(
            log,
            {
                key: {
                    username: input.username,
                    address_list: input.address_list,
                    tag_list: input.tag_list,
                    private_key: input.private_key,
                    disabled: false
                }
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

        return cb.ok({ id });
    } catch (err) {
        log.print_unknown_error(err);
        return cb.fail(err);
    }
}
