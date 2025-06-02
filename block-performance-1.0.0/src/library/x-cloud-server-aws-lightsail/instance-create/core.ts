// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { sleep } from "../../../myutils/index.js";
import { Input, Output, Callback } from "./type.js";
import * as lightsail from "../../aws-lightsail/export.js";
import * as store from "../../x-cloud-server-store/export.js";
import * as x_ssh_key_control from "../../x-ssh-key-control/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    try {
        // FIXME choose availabilityZone randomly
        let availabilityZone = input.availabilityZone || `${input.region}a`;

        const operation = await lightsail.instances_create(
            log,
            {
                credentials: input.credentials,
                region: input.region,
                instanceNames: [input.instanceName],
                availabilityZone,
                blueprintId: input.blueprintId,
                bundleId: input.bundleId,
                userData: input.userData
            },
            {
                ok: (output) => {
                    return output.operations[0];
                },
                fail: (err) => {
                    throw err;
                }
            }
        );

        while (true) {
            log.warn("waiting...");
            const ready = await lightsail.instance_state_get(
                log,
                {
                    credentials: input.credentials,
                    region: input.region,
                    instanceName: input.instanceName
                },
                {
                    ok: (output) => {
                        return output.state.name === "running";
                    },
                    fail: (err) => {
                        throw err;
                    }
                }
            );
            if (ready) {
                log.warn("ready");
                break;
            } else {
                await sleep(2);
            }
        }

        // fetch address info

        const [address_ipv4, address_ipv6] = await lightsail.instance_get(
            log,
            {
                credentials: input.credentials,
                region: input.region,
                instanceName: input.instanceName
            },
            {
                ok: (output) => {
                    return [output.publicIpAddress, output.ipv6Addresses.length ? output.ipv6Addresses[0] : ""];
                },
                fail: (err) => {
                    throw err;
                }
            }
        );

        // create item in store

        const { id } = await store.aws_lightsail_instance_add(
            log,
            {
                aws_lightsail_instance: {
                    region: input.region,
                    availability_zone: availabilityZone,
                    instance_name: input.instanceName,
                    blueprint_id: input.blueprintId,
                    bundle_id: input.bundleId,
                    ssh_username: "admin",
                    address_ipv4,
                    address_ipv6
                }
            },
            {
                ok: (output) => {
                    return output;
                },
                fail: (err) => {
                    throw err;
                }
            }
        );

        const { aws_lightsail_instance } = await store.aws_lightsail_instance_get(
            log,
            { id },
            {
                none: () => {
                    throw log.new_error("unexpected, aws_lightsail_instance not found, check the code");
                },
                ok: (output) => {
                    return output;
                },
                fail: (err) => {
                    throw err;
                }
            }
        );

        // download ssh key private key and store

        const { privateKeyBase64: private_key } = await lightsail.keypair_default_download(
            log,
            {
                credentials: input.credentials,
                region: input.region
            },
            {
                ok: (output) => {
                    return output;
                },
                fail: (err) => {
                    throw err;
                }
            }
        );

        await x_ssh_key_control.key_save(
            log,
            {
                username: "admin", // default aws linux username
                address_list: [address_ipv4, address_ipv6],
                tag_list: ["x-cloud-server-aws-lightsail", input.instanceName, input.region, id],
                private_key
            },
            {
                ok: (output) => {
                    return output;
                },
                fail: (err) => {
                    throw err;
                }
            }
        );

        // setup firewall

        if (input.openPorts && input.openPorts.length > 0) {
            // FIXME: Set open ports in a single request instead of one by one.
            for (const item of input.openPorts) {
                await lightsail.instance_public_ports_open(
                    log,
                    {
                        credentials: input.credentials,
                        region: input.region,
                        instanceName: input.instanceName,
                        portInfo: item
                    },
                    {
                        ok: (output) => {
                            // ignore
                        },
                        fail: (err) => {
                            throw err;
                        }
                    }
                );
            }
        }

        // The SSH service may not be ready yet... waiting for a while.
        // FIXME: Consider using TCP connection testing instead.
        // Be cautious, as the initialization script might still be running.
        log.println("Waiting 60 seconds for the SSH service to be ready...");
        await sleep(60);

        return cb.ok({
            aws_lightsail_instance
        });
    } catch (err) {
        log.print_unknown_error(err);
        return cb.fail(err);
    }
}
