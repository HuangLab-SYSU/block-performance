// auto generated by dev/system

export function make_input(
    cb?: (o: {
        app: {
            name: string;
            version: string;
            library_list: string[];
            npm_script: { dev: string; start: string; stop: string };
            customize_file_list: { name: string; json_data?: { [key: string]: any } }[];
        };
        remote: { username: string; address: string; ssh_auth_key: { os?: boolean; store?: boolean; file?: string } };
        pre_installed_applications?: { docker?: {}; python?: {}; build_essential?: {}; chromium_deps?: {} };
    }) => void
): {
    app: {
        name: string;
        version: string;
        library_list: string[];
        npm_script: { dev: string; start: string; stop: string };
        customize_file_list: { name: string; json_data?: { [key: string]: any } }[];
    };
    remote: { username: string; address: string; ssh_auth_key: { os?: boolean; store?: boolean; file?: string } };
    pre_installed_applications?: { docker?: {}; python?: {}; build_essential?: {}; chromium_deps?: {} };
} {
    const item: {
        app: {
            name: string;
            version: string;
            library_list: string[];
            npm_script: { dev: string; start: string; stop: string };
            customize_file_list: { name: string; json_data?: { [key: string]: any } }[];
        };
        remote: { username: string; address: string; ssh_auth_key: { os?: boolean; store?: boolean; file?: string } };
        pre_installed_applications?: { docker?: {}; python?: {}; build_essential?: {}; chromium_deps?: {} };
    } = {
        app: { name: "", version: "", library_list: [], npm_script: { dev: "", start: "", stop: "" }, customize_file_list: [] },
        remote: { username: "", address: "", ssh_auth_key: {} }
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
