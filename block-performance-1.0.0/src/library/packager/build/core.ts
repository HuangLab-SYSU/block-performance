// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import * as dir from "../../../myutils/node/dir/index.js";
import { write_json_file } from "../../../myutils/node/file/index.js";
import { Input, Output, Callback } from "./type.js";
import { copy } from "../copy/export.js";
import { npm_package_analyze } from "../npm-package-analyze/export.js";
import { dockerfile_write } from "../dockerfile-write/export.js";
import { docker_build_script_write } from "../docker-build-script-write/export.js";
import { clear } from "../clear/export.js";
import { run } from "../../pty/export.js";
import { read as pacakge_json_read } from "../../package-json/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    if (!input.name) {
        throw log.new_error("name is required");
    }

    if (!input.version) {
        throw log.new_error("version is required");
    }

    const { package: _package } = await pacakge_json_read(
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

    const name_version = `${input.name}-${input.version}`;
    const final_output_dir = dir.resolve(input.output_dir, name_version);
    const customize_output_dir = dir.resolve(input.output_dir, `${name_version}-customize`);

    const target_dir = dir.resolve(input.output_dir, "output", name_version);
    const target_tar_zip_file = dir.resolve(input.output_dir, "output", `${name_version}.tar.gz`);
    log.variable("target_dir", target_dir);
    log.variable("target_tar_zip_file", target_tar_zip_file);

    await clear(
        log,
        {
            name: input.name,
            version: input.version,
            output_dir: input.output_dir
        },
        {
            ok: () => {
                // ignore
            },
            fail: (err) => {
                throw err;
            }
        }
    );

    await copy(
        log,
        {
            library_list: input.library_list,
            output_dir: final_output_dir
        },
        {
            ok: () => {},
            fail: (err) => {
                throw err;
            }
        }
    );

    const { npm_package_list } = await npm_package_analyze(
        log,
        {
            input_dir: dir.resolve(final_output_dir, "src")
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

    const self_deps: { [key: string]: string } = {
        ..._package.devDependencies,
        ..._package.dependencies
    };

    const package_json = {
        name: input.name,
        version: input.version,
        engines: {
            node: ">=10.12.0"
        },
        scripts: {
            build: "tsc --build",
            watch: "tsc --watch",
            test: "NODE_OPTIONS=--experimental-vm-modules jest",
            dev: input.npm_script.dev,
            start: input.npm_script.start,
            stop: input.npm_script.stop
        },
        type: "module",
        private: true,
        devDependencies: {
            typescript: self_deps["typescript"] || "",
            "@types/jest": self_deps["@types/jest"] || "",
            "@jest/globals": self_deps["self_deps"] || "",
            jest: self_deps["jest"] || ""
        } as { [key: string]: string },
        dependencies: {} as { [key: string]: string },
        jest: {
            testPathIgnorePatterns: ["src"]
        }
    };

    npm_package_list.forEach((item) => {
        package_json.dependencies[item.name] = self_deps[item.name] || "";

        // some packages need @types/...
        if (self_deps[`@types/${item.name}`]) {
            package_json.devDependencies[`@types/${item.name}`] = self_deps[`@types/${item.name}`];
        }
    });

    // always add pm2 as dependency for now (server environment needs it)
    package_json.dependencies["pm2"] = "latest";

    // remove duplicated items
    // for example: @jest/globals maybe included in .dependencies
    // but actually it has been declared in .devDependencies already
    Object.keys(package_json.dependencies).forEach((item) => {
        if (package_json.devDependencies[item] !== undefined) {
            delete package_json.dependencies[item];
        }
    });

    package_json.dependencies = sort_by_key(package_json.dependencies);
    package_json.devDependencies = sort_by_key(package_json.devDependencies);

    const package_json_file = dir.resolve(final_output_dir, "package.json");
    await write_json_file(log, package_json_file, package_json, {
        ok: () => {
            // ignore
        },
        fail: (err) => {
            throw err;
        }
    });

    const tsconfig_json_file = dir.resolve(final_output_dir, "tsconfig.json");
    const tsconfig_json = {
        files: [] as any[],
        references: [
            { path: "./src/library" },
            // always needed for now
            { path: "./src/myutils" }
        ]
    };

    await write_json_file(log, tsconfig_json_file, tsconfig_json, {
        ok: () => {
            // ignore
        },
        fail: (err) => {
            throw err;
        }
    });

    // ok, create all the customize files
    for (const item of input.customize_file_list) {
        log.variable("item", item);

        if (item.json_data) {
            const item_filename = dir.resolve(customize_output_dir, item.name);
            log.variable("item_filename", item_filename);

            if (!/\.json/.test(item_filename)) {
                throw log.new_error("invalid item_filename, must end with .json");
            }

            await write_json_file(log, item_filename, item.json_data, {
                ok: () => {
                    // ignore
                },
                fail: (err) => {
                    throw err;
                }
            });
        } else {
            throw log.new_error("unknown item type");
        }
    }

    await dockerfile_write(
        log,
        { name: input.name, version: input.version, with_customize_dir: input.customize_file_list.length > 0, output_dir: input.output_dir },
        {
            ok: () => {
                // ignore
            },
            fail: (err) => {
                throw err;
            }
        }
    );

    await docker_build_script_write(
        log,
        { name: input.name, version: input.version, output_dir: input.output_dir },
        {
            ok: () => {
                // ignore
            },
            fail: (err) => {
                throw err;
            }
        }
    );

    await run(
        log,
        {
            file: "bash",
            args: [dir.resolve(input.output_dir, "build.sh")],
            cwd: dir.resolve(input.output_dir)
        },
        {
            ok: ({ exit_code }) => {
                if (exit_code !== 0) {
                    throw log.new_error("exit with code " + exit_code);
                }
            },
            fail: (err) => {
                throw err;
            }
        }
    );

    return cb.ok({
        target_dir,
        target_tar_zip_file
    });
}

function sort_by_key(obj: { [key: string]: string }): { [key: string]: string } {
    const result: { [key: string]: string } = {};
    Object.keys(obj)
        .sort((a, b) => a.localeCompare(b))
        .forEach((item) => {
            result[item] = obj[item];
        });
    return result;
}
