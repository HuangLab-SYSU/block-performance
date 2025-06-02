// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import * as store from "../../x-ssh-key-store/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    try {
        const { list } = await store.key_ls(
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

        const target_list = list
            .filter((item) => item.disabled === false) // ignore disabled key
            .filter((item) => {
                return (
                    item.username === input.username && // username is case sensitive
                    item.address_list.map((item) => item.toLocaleLowerCase()).indexOf(input.address.toLocaleLowerCase()) !== -1 // address is not case sensitive
                );
            });

        log.variable("target_list", target_list);

        if (target_list.length === 0) {
            return cb.empty({ list: [] });
        } else {
            return cb.ok({ list: target_list });
        }
    } catch (err) {
        log.print_unknown_error(err);
        return cb.fail(err);
    }
}
