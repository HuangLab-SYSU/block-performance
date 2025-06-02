// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { guid } from "../../../myutils/common/guid.js";
import { Input, Output, Callback } from "./type.js";
import * as store from "../../x-jmeter-cloud-store/export.js";
import * as cloud_server from "../../x-cloud-server-aws-lightsail/export.js";
import { credentials } from "../_/index.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const { aws_lightsail_instance } = await cloud_server.instance_create(
        log,
        {
            credentials,
            // region: input.region,
            region: "us-east-1",
            // availabilityZone: `${input.region}a`, // random zone
            instanceName: `jmeter-master-${guid()}`,
            blueprintId: "debian_12",
            bundleId: "small_3_0", // 2GB system ram is needed (jmeter slave server need at least 1GB memory used by the process)
            openPorts: [
                {
                    protocol: "tcp",
                    // Allow any ports (not only 1099)
                    // Why? Because the slave servers could connect back to the master server on some dynamic ports.
                    fromPort: 1,
                    toPort: 65535,
                    cidrs: ["0.0.0.0/0"],
                    ipv6Cidrs: ["::/0"],
                    cidrListAliases: []
                }
            ],
            tags: [{ key: "project", value: "jmeter-cloud" }]
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

    const { id } = await store.master_server_add(
        log,
        {
            master_server: {
                cloud_server: {
                    aws_lightsail_instance_id: aws_lightsail_instance.id
                }
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

    return cb.ok({ master_server_id: id, aws_lightsail_instance });
}
