// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { guid } from "../../../myutils/common/guid.js";
import { Input, Output, Callback } from "./type.js";
import { instance_create } from "../instance-create/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    try {
        const { aws_lightsail_instance } = await instance_create(
            log,
            {
                // FIXME
                credentials: {
                    accessKeyId: "",
                    secretAccessKey: ""
                },
                region: "us-east-1",
                availabilityZone: "us-east-1a",
                instanceName: `demo-instance-${guid()}`,
                blueprintId: "debian_12",
                bundleId: "micro_2_0",
                openPorts: [
                    {
                        protocol: "udp",
                        fromPort: 50001,
                        toPort: 50001,
                        cidrs: ["0.0.0.0/0"],
                        ipv6Cidrs: ["::/0"],
                        cidrListAliases: []
                    },
                    {
                        protocol: "udp",
                        fromPort: 50002,
                        toPort: 50002,
                        cidrs: ["0.0.0.0/0"],
                        ipv6Cidrs: ["::/0"],
                        cidrListAliases: []
                    }
                ]
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

        return cb.ok({ aws_lightsail_instance });
    } catch (err) {
        log.print_unknown_error(err);
        return cb.fail(err);
    }
}
