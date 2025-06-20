// auto generated by dev/system

export function make_input(cb?: (o: { local_auth_file_path: string }) => void): { local_auth_file_path: string } {
    const item: { local_auth_file_path: string } = { local_auth_file_path: "" };
    if (cb) {
        cb(item);
    }
    return item;
}

export function make_output_ok(
    cb?: (o: {
        slave_server_id: string;
        aws_lightsail_instance: {
            id: string;
            fake?: boolean;
            create_time: string;
            update_time: string;
            region: string;
            availability_zone: string;
            instance_name: string;
            blueprint_id: string;
            bundle_id: string;
            ssh_username: string;
            address_ipv4: string;
            address_ipv6: string;
        };
    }) => void
): {
    slave_server_id: string;
    aws_lightsail_instance: {
        id: string;
        fake?: boolean;
        create_time: string;
        update_time: string;
        region: string;
        availability_zone: string;
        instance_name: string;
        blueprint_id: string;
        bundle_id: string;
        ssh_username: string;
        address_ipv4: string;
        address_ipv6: string;
    };
} {
    const item: {
        slave_server_id: string;
        aws_lightsail_instance: {
            id: string;
            fake?: boolean;
            create_time: string;
            update_time: string;
            region: string;
            availability_zone: string;
            instance_name: string;
            blueprint_id: string;
            bundle_id: string;
            ssh_username: string;
            address_ipv4: string;
            address_ipv6: string;
        };
    } = {
        slave_server_id: "",
        aws_lightsail_instance: {
            id: "",
            create_time: "",
            update_time: "",
            region: "",
            availability_zone: "",
            instance_name: "",
            blueprint_id: "",
            bundle_id: "",
            ssh_username: "",
            address_ipv4: "",
            address_ipv6: ""
        }
    };
    if (cb) {
        cb(item);
    }
    return item;
}
