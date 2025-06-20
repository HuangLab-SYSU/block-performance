// auto generated by dev/system

export function make_input(cb?: (o: { file: string }) => void): { file: string } {
    const item: { file: string } = { file: "" };
    if (cb) {
        cb(item);
    }
    return item;
}

export function make_output_empty(
    cb?: (o: {
        npm_package_list: { name: string }[];
        node_module_list: { name: string }[];
        file_module_list: { js_name: string; js_relative_path: string; js_abs_path: string; ts_name: string; ts_relative_path: string; ts_abs_path: string }[];
    }) => void
): {
    npm_package_list: { name: string }[];
    node_module_list: { name: string }[];
    file_module_list: { js_name: string; js_relative_path: string; js_abs_path: string; ts_name: string; ts_relative_path: string; ts_abs_path: string }[];
} {
    const item: {
        npm_package_list: { name: string }[];
        node_module_list: { name: string }[];
        file_module_list: { js_name: string; js_relative_path: string; js_abs_path: string; ts_name: string; ts_relative_path: string; ts_abs_path: string }[];
    } = { npm_package_list: [], node_module_list: [], file_module_list: [] };
    if (cb) {
        cb(item);
    }
    return item;
}

export function make_output_ok(
    cb?: (o: {
        npm_package_list: { name: string }[];
        node_module_list: { name: string }[];
        file_module_list: { js_name: string; js_relative_path: string; js_abs_path: string; ts_name: string; ts_relative_path: string; ts_abs_path: string }[];
    }) => void
): {
    npm_package_list: { name: string }[];
    node_module_list: { name: string }[];
    file_module_list: { js_name: string; js_relative_path: string; js_abs_path: string; ts_name: string; ts_relative_path: string; ts_abs_path: string }[];
} {
    const item: {
        npm_package_list: { name: string }[];
        node_module_list: { name: string }[];
        file_module_list: { js_name: string; js_relative_path: string; js_abs_path: string; ts_name: string; ts_relative_path: string; ts_abs_path: string }[];
    } = { npm_package_list: [], node_module_list: [], file_module_list: [] };
    if (cb) {
        cb(item);
    }
    return item;
}
