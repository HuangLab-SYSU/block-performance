// auto generated by dev/system

export function make_input(cb?: (o: { master_server_id: string; local_test_plan_file_path: string }) => void): {
    master_server_id: string;
    local_test_plan_file_path: string;
} {
    const item: { master_server_id: string; local_test_plan_file_path: string } = { master_server_id: "", local_test_plan_file_path: "" };
    if (cb) {
        cb(item);
    }
    return item;
}

export function make_output_ok(cb?: (o: { remote_test_plan_file_path: string }) => void): { remote_test_plan_file_path: string } {
    const item: { remote_test_plan_file_path: string } = { remote_test_plan_file_path: "" };
    if (cb) {
        cb(item);
    }
    return item;
}
