// auto generated by dev/system

export function make_input(cb?: (o: { username: string; address: string; ssh_auth_key: { os?: boolean; store?: boolean; file?: string } }) => void): {
    username: string;
    address: string;
    ssh_auth_key: { os?: boolean; store?: boolean; file?: string };
} {
    const item: { username: string; address: string; ssh_auth_key: { os?: boolean; store?: boolean; file?: string } } = {
        username: "",
        address: "",
        ssh_auth_key: {}
    };
    if (cb) {
        cb(item);
    }
    return item;
}

export function make_output_ok(cb?: (o: { jmeter_path: string }) => void): { jmeter_path: string } {
    const item: { jmeter_path: string } = { jmeter_path: "" };
    if (cb) {
        cb(item);
    }
    return item;
}
