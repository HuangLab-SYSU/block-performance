// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import * as typescript from "../../typescript/export.js";
import * as tailwind from "../../tailwind/export.js";
import * as file_system from "../../file-system/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const output: Output = {
        npm_package_list: []
    };

    await file_system.file_ls(
        log,
        {
            dir: input.input_dir,
            recursive: true
        },
        {
            empty: async () => {
                // ignore
            },
            ok: async ({ file_list }) => {
                for (const item of file_list) {
                    if (/\.css$/i.test(item.name)) {
                        await tailwind.plugin_list(
                            log,
                            {
                                css_file: item.fullname
                            },
                            {
                                empty: () => {
                                    // ignore
                                },
                                ok: ({ npm_package_list }) => {
                                    npm_package_list.forEach((item) => {
                                        output.npm_package_list.push({
                                            name: item.name
                                        });
                                    });
                                },
                                fail: (err) => {
                                    throw err;
                                }
                            }
                        );
                    } else {
                        await typescript.import_list(
                            log,
                            {
                                file: item.fullname
                            },
                            {
                                empty: () => {
                                    // ignore
                                },
                                ok: ({ npm_package_list }) => {
                                    npm_package_list.forEach((item) => {
                                        output.npm_package_list.push({
                                            name: item.name
                                        });
                                    });
                                },
                                fail: (err) => {
                                    throw err;
                                }
                            }
                        );
                    }
                }
            },
            fail: async (err) => {
                throw err;
            }
        }
    );

    // deduplicate
    const npm_package_set = new Set<string>(output.npm_package_list.map((item) => item.name));
    output.npm_package_list = [...npm_package_set].map((item) => {
        return { name: item };
    });

    // sort by name
    output.npm_package_list.sort((a, b) => a.name.localeCompare(b.name));

    return cb.ok(output);
}
