// auto generated by dev/system

import { Logger, set_logger_disabled } from "../../../myutils/logger.js";
import { prompts } from "../../../myutils/index.js";
import { read_json_file } from "../../../myutils/node/file/index.js";
import { Input, Output, check_input, OutputOk } from "./type.js";
import { aws_lightsail_instance_set as target_fun } from "./export.js";
import { rpc_aws_lightsail_instance_set as rpc_target_fun } from "./rpc/client.js";
import yargs from "yargs";

const log = new Logger("cli");
run();

async function run() {
    try {
        const { input, server } = await make_input(log, {
            ok: async (input: Input, server) => {
                return { input, server };
            },
            fail: async (err) => {
                throw err;
            }
        });

        if (server) {
            await rpc_target_fun(
                log,
                {
                    server,
                    input
                },
                {
                    ok: (output) => {
                        console.log(JSON.stringify(output, null, 4));
                        console.log("😄 ok");
                    },

                    fail: (err) => {
                        throw err;
                    }
                }
            );
        } else {
            await target_fun(log, input, {
                ok: (output: OutputOk) => {
                    console.log(JSON.stringify(output, null, 4));
                    console.log("😄 ok");
                },

                fail: (err) => {
                    throw err;
                }
            });
        }
    } catch (err) {
        log.print_unknown_error(err);
        console.log("😢 fail.");
    }
}

async function make_input<R>(
    plog: Logger,
    cb: {
        ok: (input: Input, rpc_server: string) => R;
        fail: (err: Error) => R;
    }
): Promise<R> {
    const log = plog.sub("make_input");

    const args = await yargs(process.argv.slice(2))
        .option("input", {
            type: "string",
            description: "Specify the JSON input directly as a command line argument."
        })
        .option("input-file", {
            type: "string",
            description: "Specify the name of a JSON file to read input from."
        })
        .option("server", {
            type: "string",
            description: "Specify the URL of a remote server to send the request to."
        })
        .option("logger-disabled", {
            type: "boolean",
            description: "Disable logging completely."
        })
        .parse();

    const input = args.input || process.env["x_input"];
    const input_file = args.inputFile || process.env["x_input_file"];
    const server = args.server || process.env["x_server"];
    const logger_disabled = args.loggerDisabled || process.env["x_logger_disabled"] === "true";

    if (logger_disabled) {
        set_logger_disabled(true);
    }

    log.variable("input", input);
    log.variable("input_file", input_file);
    log.variable("server", server);
    log.variable("logger_disabled", logger_disabled);

    if (input && input_file) {
        return cb.fail(log.new_error("Conflicting arguments provided. You can use either --input or --input-file, but not both at the same time."));
    }

    if (input) {
        return make_input_from_args(
            log,
            { json_text: input },
            {
                ok: (input) => {
                    return cb.ok(input, server);
                },
                fail: (err) => {
                    return cb.fail(err);
                }
            }
        );
    } else if (input_file) {
        return make_input_from_file(
            log,
            { filename: input_file },
            {
                ok: (input) => {
                    return cb.ok(input, server);
                },
                fail: (err) => {
                    return cb.fail(err);
                }
            }
        );
    } else {
        return make_input_from_prompts(log, {
            ok: (input) => {
                return cb.ok(input, server);
            },
            fail: (err) => {
                return cb.fail(err);
            }
        });
    }
}

async function make_input_from_args<R>(
    plog: Logger,
    opts: { json_text: string },
    cb: {
        ok: (input: Input) => R;
        fail: (err: Error) => R;
    }
): Promise<R> {
    const log = plog.sub("make_input_from_args");
    try {
        const input = JSON.parse(opts.json_text);
        log.variable("input", input);

        return check_input(log, input, {
            ok: () => {
                return cb.ok(input);
            },
            fail: (err) => {
                return cb.fail(err);
            }
        });
    } catch (err) {
        log.print_unknown_error(err);
        return cb.fail(err);
    }
}

async function make_input_from_file<R>(
    plog: Logger,
    opts: { filename: string },
    cb: {
        ok: (input: Input) => R;
        fail: (err: Error) => R;
    }
): Promise<R> {
    const log = plog.sub("make_input_from_file");
    return read_json_file(log, opts.filename, {
        ok: (input) => {
            return check_input(log, input, {
                ok: () => {
                    return cb.ok(input);
                },
                fail: (err) => {
                    return cb.fail(err);
                }
            });
        },
        fail: (err) => {
            return cb.fail(err);
        }
    });
}

async function make_input_from_prompts<R>(
    plog: Logger,
    cb: {
        ok: (v: {
            aws_lightsail_instance: {
                id: string;
                fake?: boolean;
                region: string;
                availability_zone: string;
                instance_name: string;
                blueprint_id: string;
                bundle_id: string;
                ssh_username: string;
                address_ipv4: string;
                address_ipv6: string;
            };
        }) => R;
        fail: (err: Error) => R;
    }
): Promise<R> {
    const log = plog.sub("make_input_from_prompts");
    try {
        var v: {
            aws_lightsail_instance: {
                id: string;
                fake?: boolean;
                region: string;
                availability_zone: string;
                instance_name: string;
                blueprint_id: string;
                bundle_id: string;
                ssh_username: string;
                address_ipv4: string;
                address_ipv6: string;
            };
        } = {
            aws_lightsail_instance: await input_aws_lightsail_instance(log.sub("aws_lightsail_instance"), {
                ok: (v) => v,
                fail: (err) => {
                    throw err;
                }
            })
        };
    } catch (err) {
        log.error(err);
        return cb.fail(err);
    }

    return cb.ok(v);

    async function input_aws_lightsail_instance<R>(
        plog: Logger,
        cb: {
            ok: (v: {
                id: string;
                fake?: boolean;
                region: string;
                availability_zone: string;
                instance_name: string;
                blueprint_id: string;
                bundle_id: string;
                ssh_username: string;
                address_ipv4: string;
                address_ipv6: string;
            }) => R;
            fail: (err: Error) => R;
        }
    ): Promise<R> {
        const log = plog.sub("input_aws_lightsail_instance");
        try {
            var v: {
                id: string;
                fake?: boolean;
                region: string;
                availability_zone: string;
                instance_name: string;
                blueprint_id: string;
                bundle_id: string;
                ssh_username: string;
                address_ipv4: string;
                address_ipv6: string;
            } = {
                id: await input_id(log.sub("id"), {
                    ok: (v) => v,
                    fail: (err) => {
                        throw err;
                    }
                }),
                fake: await skip_or_input("fake", () =>
                    input_fake(log.sub("fake"), {
                        ok: (v) => v,
                        fail: (err) => {
                            throw err;
                        }
                    })
                ),
                region: await input_region(log.sub("region"), {
                    ok: (v) => v,
                    fail: (err) => {
                        throw err;
                    }
                }),
                availability_zone: await input_availability_zone(log.sub("availability_zone"), {
                    ok: (v) => v,
                    fail: (err) => {
                        throw err;
                    }
                }),
                instance_name: await input_instance_name(log.sub("instance_name"), {
                    ok: (v) => v,
                    fail: (err) => {
                        throw err;
                    }
                }),
                blueprint_id: await input_blueprint_id(log.sub("blueprint_id"), {
                    ok: (v) => v,
                    fail: (err) => {
                        throw err;
                    }
                }),
                bundle_id: await input_bundle_id(log.sub("bundle_id"), {
                    ok: (v) => v,
                    fail: (err) => {
                        throw err;
                    }
                }),
                ssh_username: await input_ssh_username(log.sub("ssh_username"), {
                    ok: (v) => v,
                    fail: (err) => {
                        throw err;
                    }
                }),
                address_ipv4: await input_address_ipv4(log.sub("address_ipv4"), {
                    ok: (v) => v,
                    fail: (err) => {
                        throw err;
                    }
                }),
                address_ipv6: await input_address_ipv6(log.sub("address_ipv6"), {
                    ok: (v) => v,
                    fail: (err) => {
                        throw err;
                    }
                })
            };
        } catch (err) {
            log.error(err);
            return cb.fail(err);
        }

        return cb.ok(v);

        async function input_id<R>(plog: Logger, cb: { ok: (v: string) => R; fail: (err: Error) => R }): Promise<R> {
            const log = plog.sub("input_id");
            // FIXME implement all string constrains here
            const v = await prompts.input_string("id", { allow_empty: true });
            return cb.ok(v);
        }

        async function input_fake<R>(plog: Logger, cb: { ok: (v: boolean) => R; fail: (err: Error) => R }): Promise<R> {
            const log = plog.sub("input_fake");
            const v = await prompts.input_boolean("fake");
            return cb.ok(v);
        }

        async function input_region<R>(plog: Logger, cb: { ok: (v: string) => R; fail: (err: Error) => R }): Promise<R> {
            const log = plog.sub("input_region");
            // FIXME implement all string constrains here
            const v = await prompts.input_string("region", { allow_empty: true });
            return cb.ok(v);
        }

        async function input_availability_zone<R>(plog: Logger, cb: { ok: (v: string) => R; fail: (err: Error) => R }): Promise<R> {
            const log = plog.sub("input_availability_zone");
            // FIXME implement all string constrains here
            const v = await prompts.input_string("availability_zone", { allow_empty: true });
            return cb.ok(v);
        }

        async function input_instance_name<R>(plog: Logger, cb: { ok: (v: string) => R; fail: (err: Error) => R }): Promise<R> {
            const log = plog.sub("input_instance_name");
            // FIXME implement all string constrains here
            const v = await prompts.input_string("instance_name", { allow_empty: true });
            return cb.ok(v);
        }

        async function input_blueprint_id<R>(plog: Logger, cb: { ok: (v: string) => R; fail: (err: Error) => R }): Promise<R> {
            const log = plog.sub("input_blueprint_id");
            // FIXME implement all string constrains here
            const v = await prompts.input_string("blueprint_id", { allow_empty: true });
            return cb.ok(v);
        }

        async function input_bundle_id<R>(plog: Logger, cb: { ok: (v: string) => R; fail: (err: Error) => R }): Promise<R> {
            const log = plog.sub("input_bundle_id");
            // FIXME implement all string constrains here
            const v = await prompts.input_string("bundle_id", { allow_empty: true });
            return cb.ok(v);
        }

        async function input_ssh_username<R>(plog: Logger, cb: { ok: (v: string) => R; fail: (err: Error) => R }): Promise<R> {
            const log = plog.sub("input_ssh_username");
            // FIXME implement all string constrains here
            const v = await prompts.input_string("ssh_username", { allow_empty: true });
            return cb.ok(v);
        }

        async function input_address_ipv4<R>(plog: Logger, cb: { ok: (v: string) => R; fail: (err: Error) => R }): Promise<R> {
            const log = plog.sub("input_address_ipv4");
            // FIXME implement all string constrains here
            const v = await prompts.input_string("address_ipv4", { allow_empty: true });
            return cb.ok(v);
        }

        async function input_address_ipv6<R>(plog: Logger, cb: { ok: (v: string) => R; fail: (err: Error) => R }): Promise<R> {
            const log = plog.sub("input_address_ipv6");
            // FIXME implement all string constrains here
            const v = await prompts.input_string("address_ipv6", { allow_empty: true });
            return cb.ok(v);
        }

        async function skip_or_input<R>(field: string, input_cb: () => Promise<R>): Promise<R | undefined> {
            const v = await prompts.input_string_enum(field, ["skip", "input"]);
            if (v === "input") {
                return input_cb();
            } else {
                return undefined;
            }
        }
    }
}
