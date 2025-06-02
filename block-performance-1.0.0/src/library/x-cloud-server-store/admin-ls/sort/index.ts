import { Logger } from "../../../../myutils/logger.js";

interface Data {
    id: string;
    fake?: boolean;
    create_time: string;
    update_time: string;
    finger: string;
    token: string;
    username: string;
    password: string;
    avatar_url: string;
    real_name: string;
    gender: "unknown" | "male" | "female";
    birthday: string;
    email: string;
    phone_number_country_code: string;
    phone_number: string;
}

interface SortRequest {
    field_list: {
        id?: { order: "ascending" | "descending" };
        fake?: { order: "ascending" | "descending" };
        create_time?: { order: "ascending" | "descending" };
        update_time?: { order: "ascending" | "descending" };
        finger?: { order: "ascending" | "descending" };
        token?: { order: "ascending" | "descending" };
        username?: { order: "ascending" | "descending" };
        password?: { order: "ascending" | "descending" };
        avatar_url?: { order: "ascending" | "descending" };
        real_name?: { order: "ascending" | "descending" };
        gender?: { order: "ascending" | "descending" };
        birthday?: { order: "ascending" | "descending" };
        email?: { order: "ascending" | "descending" };
        phone_number_country_code?: { order: "ascending" | "descending" };
        phone_number?: { order: "ascending" | "descending" };
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
            finger?: { order: "ascending" | "descending" };
            token?: { order: "ascending" | "descending" };
            username?: { order: "ascending" | "descending" };
            password?: { order: "ascending" | "descending" };
            avatar_url?: { order: "ascending" | "descending" };
            real_name?: { order: "ascending" | "descending" };
            gender?: { order: "ascending" | "descending" };
            birthday?: { order: "ascending" | "descending" };
            email?: { order: "ascending" | "descending" };
            phone_number_country_code?: { order: "ascending" | "descending" };
            phone_number?: { order: "ascending" | "descending" };
        };
        get_value: (item: Data) =>
            | {
                  id: string;
                  fake?: boolean;
                  create_time: string;
                  update_time: string;
                  finger: string;
                  token: string;
                  username: string;
                  password: string;
                  avatar_url: string;
                  real_name: string;
                  gender: "unknown" | "male" | "female";
                  birthday: string;
                  email: string;
                  phone_number_country_code: string;
                  phone_number: string;
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
        sort_option.finger
            ? make_field_sort_fun_finger(log, {
                  sort_option: sort_option.finger,
                  get_value: (data) => {
                      const v = get_value(data);
                      return v ? v.finger : undefined;
                  }
              })
            : undefined,
        sort_option.token
            ? make_field_sort_fun_token(log, {
                  sort_option: sort_option.token,
                  get_value: (data) => {
                      const v = get_value(data);
                      return v ? v.token : undefined;
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
        sort_option.password
            ? make_field_sort_fun_password(log, {
                  sort_option: sort_option.password,
                  get_value: (data) => {
                      const v = get_value(data);
                      return v ? v.password : undefined;
                  }
              })
            : undefined,
        sort_option.avatar_url
            ? make_field_sort_fun_avatar_url(log, {
                  sort_option: sort_option.avatar_url,
                  get_value: (data) => {
                      const v = get_value(data);
                      return v ? v.avatar_url : undefined;
                  }
              })
            : undefined,
        sort_option.real_name
            ? make_field_sort_fun_real_name(log, {
                  sort_option: sort_option.real_name,
                  get_value: (data) => {
                      const v = get_value(data);
                      return v ? v.real_name : undefined;
                  }
              })
            : undefined,
        sort_option.gender
            ? make_field_sort_fun_gender(log, {
                  sort_option: sort_option.gender,
                  get_value: (data) => {
                      const v = get_value(data);
                      return v ? v.gender : undefined;
                  }
              })
            : undefined,
        sort_option.birthday
            ? make_field_sort_fun_birthday(log, {
                  sort_option: sort_option.birthday,
                  get_value: (data) => {
                      const v = get_value(data);
                      return v ? v.birthday : undefined;
                  }
              })
            : undefined,
        sort_option.email
            ? make_field_sort_fun_email(log, {
                  sort_option: sort_option.email,
                  get_value: (data) => {
                      const v = get_value(data);
                      return v ? v.email : undefined;
                  }
              })
            : undefined,
        sort_option.phone_number_country_code
            ? make_field_sort_fun_phone_number_country_code(log, {
                  sort_option: sort_option.phone_number_country_code,
                  get_value: (data) => {
                      const v = get_value(data);
                      return v ? v.phone_number_country_code : undefined;
                  }
              })
            : undefined,
        sort_option.phone_number
            ? make_field_sort_fun_phone_number(log, {
                  sort_option: sort_option.phone_number,
                  get_value: (data) => {
                      const v = get_value(data);
                      return v ? v.phone_number : undefined;
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

    function make_field_sort_fun_finger(
        plog: Logger,
        opt: {
            sort_option: { order: "ascending" | "descending" };
            get_value: (item: Data) => string | undefined; // undefined for optional field
        }
    ): SortFun | undefined {
        const log = plog.sub("make_field_sort_fun_finger");
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

    function make_field_sort_fun_token(
        plog: Logger,
        opt: {
            sort_option: { order: "ascending" | "descending" };
            get_value: (item: Data) => string | undefined; // undefined for optional field
        }
    ): SortFun | undefined {
        const log = plog.sub("make_field_sort_fun_token");
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

    function make_field_sort_fun_password(
        plog: Logger,
        opt: {
            sort_option: { order: "ascending" | "descending" };
            get_value: (item: Data) => string | undefined; // undefined for optional field
        }
    ): SortFun | undefined {
        const log = plog.sub("make_field_sort_fun_password");
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

    function make_field_sort_fun_avatar_url(
        plog: Logger,
        opt: {
            sort_option: { order: "ascending" | "descending" };
            get_value: (item: Data) => string | undefined; // undefined for optional field
        }
    ): SortFun | undefined {
        const log = plog.sub("make_field_sort_fun_avatar_url");
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

    function make_field_sort_fun_real_name(
        plog: Logger,
        opt: {
            sort_option: { order: "ascending" | "descending" };
            get_value: (item: Data) => string | undefined; // undefined for optional field
        }
    ): SortFun | undefined {
        const log = plog.sub("make_field_sort_fun_real_name");
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

    function make_field_sort_fun_gender(
        plog: Logger,
        opt: {
            sort_option: { order: "ascending" | "descending" };
            get_value: (item: Data) => string | undefined; // undefined for optional field
        }
    ): SortFun | undefined {
        const log = plog.sub("make_field_sort_fun_gender");
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

    function make_field_sort_fun_birthday(
        plog: Logger,
        opt: {
            sort_option: { order: "ascending" | "descending" };
            get_value: (item: Data) => string | undefined; // undefined for optional field
        }
    ): SortFun | undefined {
        const log = plog.sub("make_field_sort_fun_birthday");
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

    function make_field_sort_fun_email(
        plog: Logger,
        opt: {
            sort_option: { order: "ascending" | "descending" };
            get_value: (item: Data) => string | undefined; // undefined for optional field
        }
    ): SortFun | undefined {
        const log = plog.sub("make_field_sort_fun_email");
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

    function make_field_sort_fun_phone_number_country_code(
        plog: Logger,
        opt: {
            sort_option: { order: "ascending" | "descending" };
            get_value: (item: Data) => string | undefined; // undefined for optional field
        }
    ): SortFun | undefined {
        const log = plog.sub("make_field_sort_fun_phone_number_country_code");
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

    function make_field_sort_fun_phone_number(
        plog: Logger,
        opt: {
            sort_option: { order: "ascending" | "descending" };
            get_value: (item: Data) => string | undefined; // undefined for optional field
        }
    ): SortFun | undefined {
        const log = plog.sub("make_field_sort_fun_phone_number");
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
