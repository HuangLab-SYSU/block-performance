// auto generated by dev/system

export function make_input(
    cb?: (o: { username: string; address: string; ssh_auth_key: { os?: boolean; store?: boolean; file?: string }; command: string }) => void
): { username: string; address: string; ssh_auth_key: { os?: boolean; store?: boolean; file?: string }; command: string } {
    const item: { username: string; address: string; ssh_auth_key: { os?: boolean; store?: boolean; file?: string }; command: string } = {
        username: "",
        address: "",
        ssh_auth_key: {},
        command: ""
    };
    if (cb) {
        cb(item);
    }
    return item;
}

export function make_output_ok(cb?: (o: {}) => void): {} {
    const item: {} = {};
    if (cb) {
        cb(item);
    }
    return item;
}
