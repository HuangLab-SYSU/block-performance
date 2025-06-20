// auto generated by dev/system

export function make_input(
    cb?: (o: { slave_server: { fake?: boolean; create_time: string; update_time: string; cloud_server: { aws_lightsail_instance_id: string } } }) => void
): { slave_server: { fake?: boolean; create_time: string; update_time: string; cloud_server: { aws_lightsail_instance_id: string } } } {
    const item: { slave_server: { fake?: boolean; create_time: string; update_time: string; cloud_server: { aws_lightsail_instance_id: string } } } = {
        slave_server: { create_time: "", update_time: "", cloud_server: { aws_lightsail_instance_id: "" } }
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
