// auto generated by dev/system

export function make_input(cb?: (o: { username: string; address_list: string[]; tag_list: string[]; private_key: string }) => void): {
    username: string;
    address_list: string[];
    tag_list: string[];
    private_key: string;
} {
    const item: { username: string; address_list: string[]; tag_list: string[]; private_key: string } = {
        username: "",
        address_list: [],
        tag_list: [],
        private_key: ""
    };
    if (cb) {
        cb(item);
    }
    return item;
}

export function make_output_ok(cb?: (o: { id: string }) => void): { id: string } {
    const item: { id: string } = { id: "" };
    if (cb) {
        cb(item);
    }
    return item;
}
