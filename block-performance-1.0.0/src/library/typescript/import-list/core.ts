// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import ts from "typescript";
import { basename, dirname, resolve } from "node:path";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const source_file = ts.createSourceFile(input.file, ts.sys.readFile(input.file) || "", ts.ScriptTarget.Latest, true);

    const set = new Set<string>();
    ts.forEachChild(source_file, (node) => {
        // collect from import declarations
        if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
            set.add(node.moduleSpecifier.text);
        }
        // YES, also collect from export declarations
        else if (ts.isExportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
            set.add(node.moduleSpecifier.text);
        }
    });
    const output: Output = {
        npm_package_list: [],
        node_module_list: [],
        file_module_list: []
    };
    const list = [...set.values()].sort();
    log.variable("list", list);
    for (const item of list) {
        if (/^\./.test(item)) {
            const js_item = item;
            const ts_item = item.replace(/\.js$/i, ".ts");
            output.file_module_list.push({
                js_name: basename(js_item),
                js_relative_path: js_item,
                js_abs_path: resolve(dirname(input.file), js_item), // works in dist
                ts_name: basename(ts_item),
                ts_relative_path: ts_item,
                ts_abs_path: resolve(dirname(input.file), ts_item) // works in src
            });
        } else if (/^node:/.test(item)) {
            output.node_module_list.push({
                name: item
            });
        } else {
            // handle "xxx/yyy/..." or "@xxx/yyy/..."
            if (item.indexOf("/") !== -1) {
                if (/^@/.test(item)) {
                    // for "@xxx/yyy/..." ignore "/..."
                    // only include "@xxx/yyy"
                    const parts = item.split("/");
                    output.npm_package_list.push({
                        name: [parts[0], parts[1]].join("/") // @xxx/yyy
                    });
                } else {
                    // for "xxx/yyy/..." ignore "/yyy/..."
                    // only include "xxx"
                    const parts = item.split("/");
                    output.npm_package_list.push({
                        name: parts[0]
                    });
                }
            } else {
                output.npm_package_list.push({
                    name: item
                });
            }
        }
    }
    if (list.length) {
        return cb.ok(output);
    } else {
        return cb.empty({
            npm_package_list: [],
            node_module_list: [],
            file_module_list: []
        });
    }
}
