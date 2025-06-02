// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import * as dir from "../../../myutils/node/dir/index.js";
import { write_json_file } from "../../../myutils/node/file/index.js";
import { Input, Output, Callback } from "./type.js";
import * as fs from "node:fs";
import { dependency_analyze } from "../dependency-analyze/export.js";

interface CopyItem {
    from: string;
    to: string;
}

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const output_dir_abs = dir.resolve(input.output_dir);
    log.variable("output_dir_abs", output_dir_abs);

    const dir_list: CopyItem[] = [
        // myutils is always needed for now
        {
            from: dir.resolve(dir.src, "myutils"),
            to: dir.resolve(output_dir_abs, "src/myutils")
        }
    ];

    const full_library_list = await dependency_analyze(
        log,
        {
            library_list: input.library_list
        },
        {
            ok: ({ library_list }) => {
                return library_list;
            },
            fail: (err) => {
                throw err;
            }
        }
    );

    full_library_list.forEach((item) => {
        dir_list.push({
            from: dir.resolve(dir.src, "library", item),
            to: dir.resolve(output_dir_abs, "src/library", item)
        });
    });

    log.variable("dir_list", dir_list);

    const file_list: CopyItem[] = [
        {
            from: dir.resolve(dir.root, "tsconfig.base.json"),
            to: dir.resolve(output_dir_abs, "tsconfig.base.json")
        }
    ];
    log.variable("file_list", file_list);

    // prepare the output directory

    await new Promise((resolve, reject) => {
        fs.mkdir(output_dir_abs, { recursive: true }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve({});
            }
        });
    });

    for (const item of file_list) {
        log.println("copy file");
        log.variable("item", item);
        await new Promise((resolve, reject) => {
            fs.copyFile(item.from, item.to, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({});
                }
            });
        });
    }

    for (const item of dir_list) {
        log.println("copy directory");
        log.variable("item", item);
        await new Promise((resolve, reject) => {
            fs.cp(item.from, item.to, { recursive: true }, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({});
                }
            });
        });
    }

    // src/library/tsconfig.json
    await write_json_file(
        log,
        dir.resolve(output_dir_abs, "src/library/tsconfig.json"),
        // content object
        {
            compilerOptions: {
                composite: true
            },
            files: [],
            references: full_library_list.map((item) => {
                return {
                    path: `./${item}`
                };
            })
        },
        {
            ok: () => {},
            fail: (err) => {
                throw err;
            }
        }
    );

    return cb.ok({});
}
