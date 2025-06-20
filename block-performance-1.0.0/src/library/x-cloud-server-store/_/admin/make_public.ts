// auto generated by dev/system

export function make_public(
    cb?: (o: {
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
    }) => void
): {
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
} {
    const item: {
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
    } = {
        id: "",
        create_time: "",
        update_time: "",
        finger: "",
        token: "",
        username: "",
        password: "",
        avatar_url: "",
        real_name: "",
        gender: "unknown",
        birthday: "",
        email: "",
        phone_number_country_code: "",
        phone_number: ""
    };
    if (cb) {
        cb(item);
    }
    return item;
}
