// initialized by dev/system

import { Input, Output, Callback } from "./type.js";
import { Logger, npm_public_registry_api, semver } from "../import.js";
import { dependency_ls } from "../dependency-ls/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const { list } = await dependency_ls(
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

    const output: Output = {
        list: []
    };

    for (const [i, item] of list.entries()) {
        log.println(`${i + 1}/${list.length} checking ${item.package_name}`);
        const { package_info } = await npm_public_registry_api.package_info_get(
            log,
            {
                name: item.package_name
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

        const { satisfied: version_satisfied } = await semver.satisfies(
            log,
            {
                version: package_info.version,
                range: item.version
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

        output.list.push({
            package_name: item.package_name,
            version_range: item.version,
            version_latest: package_info.version,
            version_satisfied,
            type: item.type
        });
    }

    return cb.ok(output);
}
