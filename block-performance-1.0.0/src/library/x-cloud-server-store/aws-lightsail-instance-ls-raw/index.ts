// auto generated by dev/system

import { Logger, set_logger_disabled } from "../../../myutils/logger.js";
import { prompts } from "../../../myutils/index.js";
import { read_json_file } from "../../../myutils/node/file/index.js";
import { Input, Output, check_input, OutputEmpty, OutputOk } from "./type.js";
import { aws_lightsail_instance_ls_raw as target_fun } from "./export.js";
import { rpc_aws_lightsail_instance_ls_raw as rpc_target_fun } from "./rpc/client.js";
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
                    empty: (output) => {
                        console.log(JSON.stringify(output, null, 4));
                        console.log("😄 empty");
                    },

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
                empty: (output: OutputEmpty) => {
                    console.log(JSON.stringify(output, null, 4));
                    console.log("😄 empty");
                },

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
            sort?: {
                field_list: {
                    id?: { order: "ascending" | "descending" };
                    fake?: { order: "ascending" | "descending" };
                    create_time?: { order: "ascending" | "descending" };
                    update_time?: { order: "ascending" | "descending" };
                    region?: { order: "ascending" | "descending" };
                    availability_zone?: { order: "ascending" | "descending" };
                    instance_name?: { order: "ascending" | "descending" };
                    blueprint_id?: { order: "ascending" | "descending" };
                    bundle_id?: { order: "ascending" | "descending" };
                    ssh_username?: { order: "ascending" | "descending" };
                    address_ipv4?: { order: "ascending" | "descending" };
                    address_ipv6?: { order: "ascending" | "descending" };
                }[];
            };
            page?: { offset: number; limit: number };
        }) => R;
        fail: (err: Error) => R;
    }
): Promise<R> {
    const log = plog.sub("make_input_from_prompts");
    try {
        var v: {
            sort?: {
                field_list: {
                    id?: { order: "ascending" | "descending" };
                    fake?: { order: "ascending" | "descending" };
                    create_time?: { order: "ascending" | "descending" };
                    update_time?: { order: "ascending" | "descending" };
                    region?: { order: "ascending" | "descending" };
                    availability_zone?: { order: "ascending" | "descending" };
                    instance_name?: { order: "ascending" | "descending" };
                    blueprint_id?: { order: "ascending" | "descending" };
                    bundle_id?: { order: "ascending" | "descending" };
                    ssh_username?: { order: "ascending" | "descending" };
                    address_ipv4?: { order: "ascending" | "descending" };
                    address_ipv6?: { order: "ascending" | "descending" };
                }[];
            };
            page?: { offset: number; limit: number };
        } = {
            sort: await skip_or_input("sort", () =>
                input_sort(log.sub("sort"), {
                    ok: (v) => v,
                    fail: (err) => {
                        throw err;
                    }
                })
            ),
            page: await skip_or_input("page", () =>
                input_page(log.sub("page"), {
                    ok: (v) => v,
                    fail: (err) => {
                        throw err;
                    }
                })
            )
        };
    } catch (err) {
        log.error(err);
        return cb.fail(err);
    }

    return cb.ok(v);

    async function input_sort<R>(
        plog: Logger,
        cb: {
            ok: (v: {
                field_list: {
                    id?: { order: "ascending" | "descending" };
                    fake?: { order: "ascending" | "descending" };
                    create_time?: { order: "ascending" | "descending" };
                    update_time?: { order: "ascending" | "descending" };
                    region?: { order: "ascending" | "descending" };
                    availability_zone?: { order: "ascending" | "descending" };
                    instance_name?: { order: "ascending" | "descending" };
                    blueprint_id?: { order: "ascending" | "descending" };
                    bundle_id?: { order: "ascending" | "descending" };
                    ssh_username?: { order: "ascending" | "descending" };
                    address_ipv4?: { order: "ascending" | "descending" };
                    address_ipv6?: { order: "ascending" | "descending" };
                }[];
            }) => R;
            fail: (err: Error) => R;
        }
    ): Promise<R> {
        const log = plog.sub("input_sort");
        try {
            var v: {
                field_list: {
                    id?: { order: "ascending" | "descending" };
                    fake?: { order: "ascending" | "descending" };
                    create_time?: { order: "ascending" | "descending" };
                    update_time?: { order: "ascending" | "descending" };
                    region?: { order: "ascending" | "descending" };
                    availability_zone?: { order: "ascending" | "descending" };
                    instance_name?: { order: "ascending" | "descending" };
                    blueprint_id?: { order: "ascending" | "descending" };
                    bundle_id?: { order: "ascending" | "descending" };
                    ssh_username?: { order: "ascending" | "descending" };
                    address_ipv4?: { order: "ascending" | "descending" };
                    address_ipv6?: { order: "ascending" | "descending" };
                }[];
            } = {
                field_list: await input_field_list(log.sub("field_list"), {
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

        async function input_field_list<R>(
            plog: Logger,
            cb: {
                ok: (
                    v: {
                        id?: { order: "ascending" | "descending" };
                        fake?: { order: "ascending" | "descending" };
                        create_time?: { order: "ascending" | "descending" };
                        update_time?: { order: "ascending" | "descending" };
                        region?: { order: "ascending" | "descending" };
                        availability_zone?: { order: "ascending" | "descending" };
                        instance_name?: { order: "ascending" | "descending" };
                        blueprint_id?: { order: "ascending" | "descending" };
                        bundle_id?: { order: "ascending" | "descending" };
                        ssh_username?: { order: "ascending" | "descending" };
                        address_ipv4?: { order: "ascending" | "descending" };
                        address_ipv6?: { order: "ascending" | "descending" };
                    }[]
                ) => R;
                fail: (err: Error) => R;
            }
        ): Promise<R> {
            const log = plog.sub("input_field_list");
            const length = await prompts.input_number("(array.length) field_list");
            const list: {
                id?: { order: "ascending" | "descending" };
                fake?: { order: "ascending" | "descending" };
                create_time?: { order: "ascending" | "descending" };
                update_time?: { order: "ascending" | "descending" };
                region?: { order: "ascending" | "descending" };
                availability_zone?: { order: "ascending" | "descending" };
                instance_name?: { order: "ascending" | "descending" };
                blueprint_id?: { order: "ascending" | "descending" };
                bundle_id?: { order: "ascending" | "descending" };
                ssh_username?: { order: "ascending" | "descending" };
                address_ipv4?: { order: "ascending" | "descending" };
                address_ipv6?: { order: "ascending" | "descending" };
            }[] = [];
            for (let i = 0; i < length; ++i) {
                const err = await input_item(log, {
                    ok: (item) => {
                        list.push(item);
                        return null;
                    },
                    fail: (err) => {
                        return err;
                    }
                });

                if (err) {
                    return cb.fail(err);
                }
            }

            return cb.ok(list);

            async function input_item<R>(
                plog: Logger,
                cb: {
                    ok: (v: {
                        id?: { order: "ascending" | "descending" };
                        fake?: { order: "ascending" | "descending" };
                        create_time?: { order: "ascending" | "descending" };
                        update_time?: { order: "ascending" | "descending" };
                        region?: { order: "ascending" | "descending" };
                        availability_zone?: { order: "ascending" | "descending" };
                        instance_name?: { order: "ascending" | "descending" };
                        blueprint_id?: { order: "ascending" | "descending" };
                        bundle_id?: { order: "ascending" | "descending" };
                        ssh_username?: { order: "ascending" | "descending" };
                        address_ipv4?: { order: "ascending" | "descending" };
                        address_ipv6?: { order: "ascending" | "descending" };
                    }) => R;
                    fail: (err: Error) => R;
                }
            ): Promise<R> {
                const log = plog.sub("input_item");
                try {
                    var v: {
                        id?: { order: "ascending" | "descending" };
                        fake?: { order: "ascending" | "descending" };
                        create_time?: { order: "ascending" | "descending" };
                        update_time?: { order: "ascending" | "descending" };
                        region?: { order: "ascending" | "descending" };
                        availability_zone?: { order: "ascending" | "descending" };
                        instance_name?: { order: "ascending" | "descending" };
                        blueprint_id?: { order: "ascending" | "descending" };
                        bundle_id?: { order: "ascending" | "descending" };
                        ssh_username?: { order: "ascending" | "descending" };
                        address_ipv4?: { order: "ascending" | "descending" };
                        address_ipv6?: { order: "ascending" | "descending" };
                    } = {
                        id: await skip_or_input("id", () =>
                            input_id(log.sub("id"), {
                                ok: (v) => v,
                                fail: (err) => {
                                    throw err;
                                }
                            })
                        ),
                        fake: await skip_or_input("fake", () =>
                            input_fake(log.sub("fake"), {
                                ok: (v) => v,
                                fail: (err) => {
                                    throw err;
                                }
                            })
                        ),
                        create_time: await skip_or_input("create_time", () =>
                            input_create_time(log.sub("create_time"), {
                                ok: (v) => v,
                                fail: (err) => {
                                    throw err;
                                }
                            })
                        ),
                        update_time: await skip_or_input("update_time", () =>
                            input_update_time(log.sub("update_time"), {
                                ok: (v) => v,
                                fail: (err) => {
                                    throw err;
                                }
                            })
                        ),
                        region: await skip_or_input("region", () =>
                            input_region(log.sub("region"), {
                                ok: (v) => v,
                                fail: (err) => {
                                    throw err;
                                }
                            })
                        ),
                        availability_zone: await skip_or_input("availability_zone", () =>
                            input_availability_zone(log.sub("availability_zone"), {
                                ok: (v) => v,
                                fail: (err) => {
                                    throw err;
                                }
                            })
                        ),
                        instance_name: await skip_or_input("instance_name", () =>
                            input_instance_name(log.sub("instance_name"), {
                                ok: (v) => v,
                                fail: (err) => {
                                    throw err;
                                }
                            })
                        ),
                        blueprint_id: await skip_or_input("blueprint_id", () =>
                            input_blueprint_id(log.sub("blueprint_id"), {
                                ok: (v) => v,
                                fail: (err) => {
                                    throw err;
                                }
                            })
                        ),
                        bundle_id: await skip_or_input("bundle_id", () =>
                            input_bundle_id(log.sub("bundle_id"), {
                                ok: (v) => v,
                                fail: (err) => {
                                    throw err;
                                }
                            })
                        ),
                        ssh_username: await skip_or_input("ssh_username", () =>
                            input_ssh_username(log.sub("ssh_username"), {
                                ok: (v) => v,
                                fail: (err) => {
                                    throw err;
                                }
                            })
                        ),
                        address_ipv4: await skip_or_input("address_ipv4", () =>
                            input_address_ipv4(log.sub("address_ipv4"), {
                                ok: (v) => v,
                                fail: (err) => {
                                    throw err;
                                }
                            })
                        ),
                        address_ipv6: await skip_or_input("address_ipv6", () =>
                            input_address_ipv6(log.sub("address_ipv6"), {
                                ok: (v) => v,
                                fail: (err) => {
                                    throw err;
                                }
                            })
                        )
                    };
                } catch (err) {
                    log.error(err);
                    return cb.fail(err);
                }

                return cb.ok(v);

                async function input_id<R>(plog: Logger, cb: { ok: (v: { order: "ascending" | "descending" }) => R; fail: (err: Error) => R }): Promise<R> {
                    const log = plog.sub("input_id");
                    try {
                        var v: { order: "ascending" | "descending" } = {
                            order: await input_order(log.sub("order"), {
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

                    async function input_order<R>(plog: Logger, cb: { ok: (v: "ascending" | "descending") => R; fail: (err: Error) => R }): Promise<R> {
                        const log = plog.sub("input_order");
                        // FIXME implement all string constrains here
                        const v: "ascending" | "descending" = await prompts.input_string_enum("order", ["ascending", "descending"]);
                        return cb.ok(v);
                    }
                }

                async function input_fake<R>(plog: Logger, cb: { ok: (v: { order: "ascending" | "descending" }) => R; fail: (err: Error) => R }): Promise<R> {
                    const log = plog.sub("input_fake");
                    try {
                        var v: { order: "ascending" | "descending" } = {
                            order: await input_order(log.sub("order"), {
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

                    async function input_order<R>(plog: Logger, cb: { ok: (v: "ascending" | "descending") => R; fail: (err: Error) => R }): Promise<R> {
                        const log = plog.sub("input_order");
                        // FIXME implement all string constrains here
                        const v: "ascending" | "descending" = await prompts.input_string_enum("order", ["ascending", "descending"]);
                        return cb.ok(v);
                    }
                }

                async function input_create_time<R>(
                    plog: Logger,
                    cb: { ok: (v: { order: "ascending" | "descending" }) => R; fail: (err: Error) => R }
                ): Promise<R> {
                    const log = plog.sub("input_create_time");
                    try {
                        var v: { order: "ascending" | "descending" } = {
                            order: await input_order(log.sub("order"), {
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

                    async function input_order<R>(plog: Logger, cb: { ok: (v: "ascending" | "descending") => R; fail: (err: Error) => R }): Promise<R> {
                        const log = plog.sub("input_order");
                        // FIXME implement all string constrains here
                        const v: "ascending" | "descending" = await prompts.input_string_enum("order", ["ascending", "descending"]);
                        return cb.ok(v);
                    }
                }

                async function input_update_time<R>(
                    plog: Logger,
                    cb: { ok: (v: { order: "ascending" | "descending" }) => R; fail: (err: Error) => R }
                ): Promise<R> {
                    const log = plog.sub("input_update_time");
                    try {
                        var v: { order: "ascending" | "descending" } = {
                            order: await input_order(log.sub("order"), {
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

                    async function input_order<R>(plog: Logger, cb: { ok: (v: "ascending" | "descending") => R; fail: (err: Error) => R }): Promise<R> {
                        const log = plog.sub("input_order");
                        // FIXME implement all string constrains here
                        const v: "ascending" | "descending" = await prompts.input_string_enum("order", ["ascending", "descending"]);
                        return cb.ok(v);
                    }
                }

                async function input_region<R>(plog: Logger, cb: { ok: (v: { order: "ascending" | "descending" }) => R; fail: (err: Error) => R }): Promise<R> {
                    const log = plog.sub("input_region");
                    try {
                        var v: { order: "ascending" | "descending" } = {
                            order: await input_order(log.sub("order"), {
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

                    async function input_order<R>(plog: Logger, cb: { ok: (v: "ascending" | "descending") => R; fail: (err: Error) => R }): Promise<R> {
                        const log = plog.sub("input_order");
                        // FIXME implement all string constrains here
                        const v: "ascending" | "descending" = await prompts.input_string_enum("order", ["ascending", "descending"]);
                        return cb.ok(v);
                    }
                }

                async function input_availability_zone<R>(
                    plog: Logger,
                    cb: { ok: (v: { order: "ascending" | "descending" }) => R; fail: (err: Error) => R }
                ): Promise<R> {
                    const log = plog.sub("input_availability_zone");
                    try {
                        var v: { order: "ascending" | "descending" } = {
                            order: await input_order(log.sub("order"), {
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

                    async function input_order<R>(plog: Logger, cb: { ok: (v: "ascending" | "descending") => R; fail: (err: Error) => R }): Promise<R> {
                        const log = plog.sub("input_order");
                        // FIXME implement all string constrains here
                        const v: "ascending" | "descending" = await prompts.input_string_enum("order", ["ascending", "descending"]);
                        return cb.ok(v);
                    }
                }

                async function input_instance_name<R>(
                    plog: Logger,
                    cb: { ok: (v: { order: "ascending" | "descending" }) => R; fail: (err: Error) => R }
                ): Promise<R> {
                    const log = plog.sub("input_instance_name");
                    try {
                        var v: { order: "ascending" | "descending" } = {
                            order: await input_order(log.sub("order"), {
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

                    async function input_order<R>(plog: Logger, cb: { ok: (v: "ascending" | "descending") => R; fail: (err: Error) => R }): Promise<R> {
                        const log = plog.sub("input_order");
                        // FIXME implement all string constrains here
                        const v: "ascending" | "descending" = await prompts.input_string_enum("order", ["ascending", "descending"]);
                        return cb.ok(v);
                    }
                }

                async function input_blueprint_id<R>(
                    plog: Logger,
                    cb: { ok: (v: { order: "ascending" | "descending" }) => R; fail: (err: Error) => R }
                ): Promise<R> {
                    const log = plog.sub("input_blueprint_id");
                    try {
                        var v: { order: "ascending" | "descending" } = {
                            order: await input_order(log.sub("order"), {
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

                    async function input_order<R>(plog: Logger, cb: { ok: (v: "ascending" | "descending") => R; fail: (err: Error) => R }): Promise<R> {
                        const log = plog.sub("input_order");
                        // FIXME implement all string constrains here
                        const v: "ascending" | "descending" = await prompts.input_string_enum("order", ["ascending", "descending"]);
                        return cb.ok(v);
                    }
                }

                async function input_bundle_id<R>(
                    plog: Logger,
                    cb: { ok: (v: { order: "ascending" | "descending" }) => R; fail: (err: Error) => R }
                ): Promise<R> {
                    const log = plog.sub("input_bundle_id");
                    try {
                        var v: { order: "ascending" | "descending" } = {
                            order: await input_order(log.sub("order"), {
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

                    async function input_order<R>(plog: Logger, cb: { ok: (v: "ascending" | "descending") => R; fail: (err: Error) => R }): Promise<R> {
                        const log = plog.sub("input_order");
                        // FIXME implement all string constrains here
                        const v: "ascending" | "descending" = await prompts.input_string_enum("order", ["ascending", "descending"]);
                        return cb.ok(v);
                    }
                }

                async function input_ssh_username<R>(
                    plog: Logger,
                    cb: { ok: (v: { order: "ascending" | "descending" }) => R; fail: (err: Error) => R }
                ): Promise<R> {
                    const log = plog.sub("input_ssh_username");
                    try {
                        var v: { order: "ascending" | "descending" } = {
                            order: await input_order(log.sub("order"), {
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

                    async function input_order<R>(plog: Logger, cb: { ok: (v: "ascending" | "descending") => R; fail: (err: Error) => R }): Promise<R> {
                        const log = plog.sub("input_order");
                        // FIXME implement all string constrains here
                        const v: "ascending" | "descending" = await prompts.input_string_enum("order", ["ascending", "descending"]);
                        return cb.ok(v);
                    }
                }

                async function input_address_ipv4<R>(
                    plog: Logger,
                    cb: { ok: (v: { order: "ascending" | "descending" }) => R; fail: (err: Error) => R }
                ): Promise<R> {
                    const log = plog.sub("input_address_ipv4");
                    try {
                        var v: { order: "ascending" | "descending" } = {
                            order: await input_order(log.sub("order"), {
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

                    async function input_order<R>(plog: Logger, cb: { ok: (v: "ascending" | "descending") => R; fail: (err: Error) => R }): Promise<R> {
                        const log = plog.sub("input_order");
                        // FIXME implement all string constrains here
                        const v: "ascending" | "descending" = await prompts.input_string_enum("order", ["ascending", "descending"]);
                        return cb.ok(v);
                    }
                }

                async function input_address_ipv6<R>(
                    plog: Logger,
                    cb: { ok: (v: { order: "ascending" | "descending" }) => R; fail: (err: Error) => R }
                ): Promise<R> {
                    const log = plog.sub("input_address_ipv6");
                    try {
                        var v: { order: "ascending" | "descending" } = {
                            order: await input_order(log.sub("order"), {
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

                    async function input_order<R>(plog: Logger, cb: { ok: (v: "ascending" | "descending") => R; fail: (err: Error) => R }): Promise<R> {
                        const log = plog.sub("input_order");
                        // FIXME implement all string constrains here
                        const v: "ascending" | "descending" = await prompts.input_string_enum("order", ["ascending", "descending"]);
                        return cb.ok(v);
                    }
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
    }

    async function input_page<R>(plog: Logger, cb: { ok: (v: { offset: number; limit: number }) => R; fail: (err: Error) => R }): Promise<R> {
        const log = plog.sub("input_page");
        try {
            var v: { offset: number; limit: number } = {
                offset: await input_offset(log.sub("offset"), {
                    ok: (v) => v,
                    fail: (err) => {
                        throw err;
                    }
                }),
                limit: await input_limit(log.sub("limit"), {
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

        async function input_offset<R>(plog: Logger, cb: { ok: (v: number) => R; fail: (err: Error) => R }): Promise<R> {
            const log = plog.sub("input_offset");
            // FIXME implement all number constrains here
            const v = await prompts.input_number("offset");
            return cb.ok(v);
        }

        async function input_limit<R>(plog: Logger, cb: { ok: (v: number) => R; fail: (err: Error) => R }): Promise<R> {
            const log = plog.sub("input_limit");
            // FIXME implement all number constrains here
            const v = await prompts.input_number("limit");
            return cb.ok(v);
        }
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
