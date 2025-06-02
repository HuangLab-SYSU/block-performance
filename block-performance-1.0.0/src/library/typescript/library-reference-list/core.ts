// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import * as dir from "../../../myutils/node/dir/index.js";
import { Input, Output, Callback } from "./type.js";
import { tsconfig_parse } from "../tsconfig-parse/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const output: Output = {
        library_list: [],
        other_list: []
    };

    const tsconfig_json = dir.resolve(dir.library(input.library_name).src, "tsconfig.json");

    const reference_list: { path: string }[] = await tsconfig_parse(
        log,
        {
            file: tsconfig_json
        },
        {
            ok: ({ result }) => {
                return result.references;
            },
            fail: (err) => {
                throw err;
            }
        }
    );
    log.variable("reference_list", reference_list);

    reference_list.forEach((item) => {
        const name = item.path.replace("../", "");
        // FIXME the test here is not solid...
        if (/^\.\.\//.test(name)) {
            output.other_list.push(name);
        } else {
            output.library_list.push(name);
        }
    });

    if (input.recursive) {
        const set = new Set([...output.library_list, ...output.other_list]);

        for (const library_name of output.library_list) {
            await core(
                log,
                {
                    library_name,
                    recursive: true // FIXME there might be some duplicated computation inside
                },
                {
                    empty: () => {
                        // ignore
                    },
                    ok: ({ library_list, other_list }) => {
                        library_list.forEach((item) => {
                            if (set.has(item)) return;
                            set.add(item);
                            output.library_list.push(item);
                        });
                        other_list.forEach((item) => {
                            if (set.has(item)) return;
                            set.add(item);
                            output.other_list.push(item);
                        });
                    },
                    fail: (err) => {
                        throw err;
                    }
                }
            );
        }
    }

    output.library_list.sort((a, b) => a.localeCompare(b));
    output.other_list.sort((a, b) => a.localeCompare(b));

    if (output.library_list.length || output.other_list.length) {
        return cb.ok(output);
    } else {
        return cb.empty({
            library_list: [],
            other_list: []
        });
    }
}
