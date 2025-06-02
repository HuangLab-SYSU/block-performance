// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import { library_reference_list } from "../../typescript/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const output: Output = {
        library_list: []
    };

    const library_set = new Set(input.library_list);

    for (const item of library_set) {
        await library_reference_list(
            log,
            {
                library_name: item,
                recursive: true
            },
            {
                empty: () => {
                    // ignore
                },
                ok: ({ library_list, other_list }) => {
                    library_list.forEach((item) => {
                        library_set.add(item);
                    });
                },
                fail: (err) => {
                    throw err;
                }
            }
        );
    }

    output.library_list = [...library_set.values()];

    return cb.ok(output);
}
