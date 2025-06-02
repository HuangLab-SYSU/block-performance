import { Logger } from "../../../../myutils/logger.js";

interface Data {
    id: string;
    fake?: boolean;
    create_time: string;
    update_time: string;
    username: string;
    address_list: string[];
    tag_list: string[];
    private_key: string;
    disabled: boolean;
}

interface SortRequest {
    field_list: {
        id?: { order: "ascending" | "descending" };
        fake?: { order: "ascending" | "descending" };
        create_time?: { order: "ascending" | "descending" };
        update_time?: { order: "ascending" | "descending" };
        username?: { order: "ascending" | "descending" };
        address_list?: { index: number; item: { order: "ascending" | "descending" } };
        tag_list?: { index: number; item: { order: "ascending" | "descending" } };
        private_key?: { order: "ascending" | "descending" };
        disabled?: { order: "ascending" | "descending" };
    }[];
}

type SortFun = (a: Data, b: Data) => number;

interface Callback<R> {
    none: () => R;
    ok: (sort_fun: SortFun) => R;
    fail: (err: Error) => R;
}

export function make_sort_fun<R>(
    plog: Logger,
    opts: {
        sort_request?: SortRequest;
    },
    cb: Callback<R>
): R {
    const log = plog.sub("make_sort_fun");

    try {
        const { sort_request } = opts;

        log.variable("sort_request", sort_request);

        if (!sort_request) {
            return cb.none();
        }

        // TODO remove duplicated sort_request items

        const sort_fun_list: SortFun[] = [];

        for (const item of sort_request.field_list) {
            const sort_fun = make_root_sort_fun(log, {
                sort_option: item,
                get_value: (data) => data
            });
            if (sort_fun) {
                sort_fun_list.push(sort_fun);
            }
        }

        // combine sort function list to single one

        const final_sort_fun = merge_sort_fun_list(sort_fun_list);

        if (final_sort_fun) {
            return cb.ok(final_sort_fun);
        } else {
            return cb.none();
        }
    } catch (err) {
        log.print_unknown_error(err);
        return cb.fail(err);
    }
}

function merge_sort_fun_list(list: SortFun[]): SortFun | undefined {
    if (list.length < 1) {
        return undefined;
    }

    const fun: SortFun = (a, b) => {
        // apply sort function one by one
        // if the result is not zero (means not equal) then return it
        // else continue apply the next one
        for (const sort_fun of list) {
            const compare_result = sort_fun(a, b);
            if (compare_result !== 0) {
                return compare_result;
            }
        }
        // every one returns zero, then return zero
        return 0;
    };

    return fun;
}

function make_root_sort_fun(
    plog: Logger,
    opt: {
        sort_option: {
            id?: { order: "ascending" | "descending" };
            fake?: { order: "ascending" | "descending" };
            create_time?: { order: "ascending" | "descending" };
            update_time?: { order: "ascending" | "descending" };
            username?: { order: "ascending" | "descending" };
            address_list?: { index: number; item: { order: "ascending" | "descending" } };
            tag_list?: { index: number; item: { order: "ascending" | "descending" } };
            private_key?: { order: "ascending" | "descending" };
            disabled?: { order: "ascending" | "descending" };
        };
        get_value: (item: Data) =>
            | {
                  id: string;
                  fake?: boolean;
                  create_time: string;
                  update_time: string;
                  username: string;
                  address_list: string[];
                  tag_list: string[];
                  private_key: string;
                  disabled: boolean;
              }
            | undefined; // undefined for optional field
    }
): SortFun | undefined {
    const log = plog.sub("make_root_sort_fun");
    const { sort_option, get_value } = opt;

    const sort_fun_list: SortFun[] = [];

    // check each field and make sort function for it if needed
    [
        sort_option.id
            ? make_field_sort_fun_id(log, {
                  sort_option: sort_option.id,
                  get_value: (data) => {
                      const v = get_value(data);
                      return v ? v.id : undefined;
                  }
              })
            : undefined,
        sort_option.fake
            ? make_field_sort_fun_fake(log, {
                  sort_option: sort_option.fake,
                  get_value: (data) => {
                      const v = get_value(data);
                      return v ? v.fake : undefined;
                  }
              })
            : undefined,
        sort_option.create_time
            ? make_field_sort_fun_create_time(log, {
                  sort_option: sort_option.create_time,
                  get_value: (data) => {
                      const v = get_value(data);
                      return v ? v.create_time : undefined;
                  }
              })
            : undefined,
        sort_option.update_time
            ? make_field_sort_fun_update_time(log, {
                  sort_option: sort_option.update_time,
                  get_value: (data) => {
                      const v = get_value(data);
                      return v ? v.update_time : undefined;
                  }
              })
            : undefined,
        sort_option.username
            ? make_field_sort_fun_username(log, {
                  sort_option: sort_option.username,
                  get_value: (data) => {
                      const v = get_value(data);
                      return v ? v.username : undefined;
                  }
              })
            : undefined,
        sort_option.address_list
            ? make_field_sort_fun_address_list(log, {
                  sort_option: sort_option.address_list,
                  get_value: (data) => {
                      const v = get_value(data);
                      return v ? v.address_list : undefined;
                  }
              })
            : undefined,
        sort_option.tag_list
            ? make_field_sort_fun_tag_list(log, {
                  sort_option: sort_option.tag_list,
                  get_value: (data) => {
                      const v = get_value(data);
                      return v ? v.tag_list : undefined;
                  }
              })
            : undefined,
        sort_option.private_key
            ? make_field_sort_fun_private_key(log, {
                  sort_option: sort_option.private_key,
                  get_value: (data) => {
                      const v = get_value(data);
                      return v ? v.private_key : undefined;
                  }
              })
            : undefined,
        sort_option.disabled
            ? make_field_sort_fun_disabled(log, {
                  sort_option: sort_option.disabled,
                  get_value: (data) => {
                      const v = get_value(data);
                      return v ? v.disabled : undefined;
                  }
              })
            : undefined
    ].forEach((item) => {
        // item can be undefined, means no sort function needed
        if (item) {
            sort_fun_list.push(item);
        }
    });

    // combine the sort functions to single one
    const sort_fun = merge_sort_fun_list(sort_fun_list);

    return sort_fun;

    function make_field_sort_fun_id(
        plog: Logger,
        opt: {
            sort_option: { order: "ascending" | "descending" };
            get_value: (item: Data) => string | undefined; // undefined for optional field
        }
    ): SortFun | undefined {
        const log = plog.sub("make_field_sort_fun_id");
        const { sort_option, get_value } = opt;

        const default_value = "";
        switch (sort_option.order) {
            case "ascending":
                return (a, b) => {
                    const v_a = get_value(a) || default_value;
                    const v_b = get_value(b) || default_value;
                    return v_a.localeCompare(v_b);
                };
            case "descending":
                return (a, b) => {
                    const v_a = get_value(a) || default_value;
                    const v_b = get_value(b) || default_value;
                    return v_b.localeCompare(v_a);
                };
            default:
                throw log.new_error("unknown sort_option.order: " + sort_option.order);
        }
    }

    function make_field_sort_fun_fake(
        plog: Logger,
        opt: {
            sort_option: { order: "ascending" | "descending" };
            get_value: (item: Data) => boolean | undefined; // undefined for optional field
        }
    ): SortFun | undefined {
        const log = plog.sub("make_field_sort_fun_fake");
        const { sort_option, get_value } = opt;

        const default_value = false;
        const to_int = (v: boolean) => (v === true ? 1 : 0);
        switch (sort_option.order) {
            case "ascending":
                return (a, b) => {
                    const v_a = get_value(a) || default_value;
                    const v_b = get_value(b) || default_value;
                    return to_int(v_a) - to_int(v_b);
                };
            case "descending":
                return (a, b) => {
                    const v_a = get_value(a) || default_value;
                    const v_b = get_value(b) || default_value;
                    return to_int(v_b) - to_int(v_a);
                };
            default:
                throw log.new_error("unknown sort_option.order: " + sort_option.order);
        }
    }

    function make_field_sort_fun_create_time(
        plog: Logger,
        opt: {
            sort_option: { order: "ascending" | "descending" };
            get_value: (item: Data) => string | undefined; // undefined for optional field
        }
    ): SortFun | undefined {
        const log = plog.sub("make_field_sort_fun_create_time");
        const { sort_option, get_value } = opt;

        const default_value = 0;
        switch (sort_option.order) {
            case "ascending":
                return (a, b) => {
                    const v_a = Date.parse(get_value(a)) || default_value;
                    const v_b = Date.parse(get_value(b)) || default_value;
                    return v_a - v_b;
                };
            case "descending":
                return (a, b) => {
                    const v_a = Date.parse(get_value(a)) || default_value;
                    const v_b = Date.parse(get_value(b)) || default_value;
                    return v_b - v_a;
                };
            default:
                throw log.new_error("unknown sort_option.order: " + sort_option.order);
        }
    }

    function make_field_sort_fun_update_time(
        plog: Logger,
        opt: {
            sort_option: { order: "ascending" | "descending" };
            get_value: (item: Data) => string | undefined; // undefined for optional field
        }
    ): SortFun | undefined {
        const log = plog.sub("make_field_sort_fun_update_time");
        const { sort_option, get_value } = opt;

        const default_value = 0;
        switch (sort_option.order) {
            case "ascending":
                return (a, b) => {
                    const v_a = Date.parse(get_value(a)) || default_value;
                    const v_b = Date.parse(get_value(b)) || default_value;
                    return v_a - v_b;
                };
            case "descending":
                return (a, b) => {
                    const v_a = Date.parse(get_value(a)) || default_value;
                    const v_b = Date.parse(get_value(b)) || default_value;
                    return v_b - v_a;
                };
            default:
                throw log.new_error("unknown sort_option.order: " + sort_option.order);
        }
    }

    function make_field_sort_fun_username(
        plog: Logger,
        opt: {
            sort_option: { order: "ascending" | "descending" };
            get_value: (item: Data) => string | undefined; // undefined for optional field
        }
    ): SortFun | undefined {
        const log = plog.sub("make_field_sort_fun_username");
        const { sort_option, get_value } = opt;

        const default_value = "";
        switch (sort_option.order) {
            case "ascending":
                return (a, b) => {
                    const v_a = get_value(a) || default_value;
                    const v_b = get_value(b) || default_value;
                    return v_a.localeCompare(v_b);
                };
            case "descending":
                return (a, b) => {
                    const v_a = get_value(a) || default_value;
                    const v_b = get_value(b) || default_value;
                    return v_b.localeCompare(v_a);
                };
            default:
                throw log.new_error("unknown sort_option.order: " + sort_option.order);
        }
    }

    function make_field_sort_fun_address_list(
        plog: Logger,
        opt: {
            sort_option: { index: number; item: { order: "ascending" | "descending" } };
            get_value: (item: Data) => string[] | undefined; // undefined for optional field
        }
    ): SortFun | undefined {
        const log = plog.sub("make_field_sort_fun_address_list");
        const { sort_option, get_value } = opt;

        return make_item_sort_fun(log, {
            sort_option: sort_option.item,
            get_value: (data) => {
                const list = get_value(data);
                if (!list) {
                    return undefined;
                }
                return list[sort_option.index];
            }
        });

        function make_item_sort_fun(
            plog: Logger,
            opt: {
                sort_option: { order: "ascending" | "descending" };
                get_value: (item: Data) => string | undefined; // undefined for optional field
            }
        ): SortFun | undefined {
            const log = plog.sub("make_item_sort_fun");
            const { sort_option, get_value } = opt;

            const default_value = "";
            switch (sort_option.order) {
                case "ascending":
                    return (a, b) => {
                        const v_a = get_value(a) || default_value;
                        const v_b = get_value(b) || default_value;
                        return v_a.localeCompare(v_b);
                    };
                case "descending":
                    return (a, b) => {
                        const v_a = get_value(a) || default_value;
                        const v_b = get_value(b) || default_value;
                        return v_b.localeCompare(v_a);
                    };
                default:
                    throw log.new_error("unknown sort_option.order: " + sort_option.order);
            }
        }
    }

    function make_field_sort_fun_tag_list(
        plog: Logger,
        opt: {
            sort_option: { index: number; item: { order: "ascending" | "descending" } };
            get_value: (item: Data) => string[] | undefined; // undefined for optional field
        }
    ): SortFun | undefined {
        const log = plog.sub("make_field_sort_fun_tag_list");
        const { sort_option, get_value } = opt;

        return make_item_sort_fun(log, {
            sort_option: sort_option.item,
            get_value: (data) => {
                const list = get_value(data);
                if (!list) {
                    return undefined;
                }
                return list[sort_option.index];
            }
        });

        function make_item_sort_fun(
            plog: Logger,
            opt: {
                sort_option: { order: "ascending" | "descending" };
                get_value: (item: Data) => string | undefined; // undefined for optional field
            }
        ): SortFun | undefined {
            const log = plog.sub("make_item_sort_fun");
            const { sort_option, get_value } = opt;

            const default_value = "";
            switch (sort_option.order) {
                case "ascending":
                    return (a, b) => {
                        const v_a = get_value(a) || default_value;
                        const v_b = get_value(b) || default_value;
                        return v_a.localeCompare(v_b);
                    };
                case "descending":
                    return (a, b) => {
                        const v_a = get_value(a) || default_value;
                        const v_b = get_value(b) || default_value;
                        return v_b.localeCompare(v_a);
                    };
                default:
                    throw log.new_error("unknown sort_option.order: " + sort_option.order);
            }
        }
    }

    function make_field_sort_fun_private_key(
        plog: Logger,
        opt: {
            sort_option: { order: "ascending" | "descending" };
            get_value: (item: Data) => string | undefined; // undefined for optional field
        }
    ): SortFun | undefined {
        const log = plog.sub("make_field_sort_fun_private_key");
        const { sort_option, get_value } = opt;

        const default_value = "";
        switch (sort_option.order) {
            case "ascending":
                return (a, b) => {
                    const v_a = get_value(a) || default_value;
                    const v_b = get_value(b) || default_value;
                    return v_a.localeCompare(v_b);
                };
            case "descending":
                return (a, b) => {
                    const v_a = get_value(a) || default_value;
                    const v_b = get_value(b) || default_value;
                    return v_b.localeCompare(v_a);
                };
            default:
                throw log.new_error("unknown sort_option.order: " + sort_option.order);
        }
    }

    function make_field_sort_fun_disabled(
        plog: Logger,
        opt: {
            sort_option: { order: "ascending" | "descending" };
            get_value: (item: Data) => boolean | undefined; // undefined for optional field
        }
    ): SortFun | undefined {
        const log = plog.sub("make_field_sort_fun_disabled");
        const { sort_option, get_value } = opt;

        const default_value = false;
        const to_int = (v: boolean) => (v === true ? 1 : 0);
        switch (sort_option.order) {
            case "ascending":
                return (a, b) => {
                    const v_a = get_value(a) || default_value;
                    const v_b = get_value(b) || default_value;
                    return to_int(v_a) - to_int(v_b);
                };
            case "descending":
                return (a, b) => {
                    const v_a = get_value(a) || default_value;
                    const v_b = get_value(b) || default_value;
                    return to_int(v_b) - to_int(v_a);
                };
            default:
                throw log.new_error("unknown sort_option.order: " + sort_option.order);
        }
    }
}
