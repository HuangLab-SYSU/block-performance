// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import { parse } from "../parse/export.js";
import { make } from "../make/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    if (!input.search_params) {
        return cb.ok({ url: input.url });
    }

    const parsed = await parse(
        log,
        { url: input.url },
        {
            ok: (output) => {
                return output;
            },
            fail: (err) => {
                throw err;
            }
        }
    );

    Object.keys(input.search_params).forEach((name) => {
        const value = input.search_params[name];
        parsed.search_params[name] = value;
    });

    const { url } = await await make(log, parsed, {
        ok: (output) => {
            return output;
        },
        fail: (err) => {
            throw err;
        }
    });

    return cb.ok({ url });
}
