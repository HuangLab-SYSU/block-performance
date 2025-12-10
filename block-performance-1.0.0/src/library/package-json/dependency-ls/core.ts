// initialized by dev/system

import { Input, Output, Callback } from "./type.js";
import { Logger } from "../import.js";
import { read } from "../read/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const { package: p } = await read(
        log,
        {},
        {
            ok: (output) => {
                return output;
            },
            fail: (err) => {
                throw err;
            }
        }
    );

    const dependencies: { [key: string]: string } = p.dependencies || {};
    const devDependencies: { [key: string]: string } = p.devDependencies || {};
    const output: Output = { list: [] };

    for (const key in dependencies) {
        output.list.push({
            package_name: key,
            version: dependencies[key],
            type: "dependency"
        });
    }

    for (const key in devDependencies) {
        output.list.push({
            package_name: key,
            version: devDependencies[key],
            type: "dev-dependency"
        });
    }

    output.list.sort((a, b) => {
        return a.package_name.localeCompare(b.package_name);
    });

    return cb.ok(output);
}
