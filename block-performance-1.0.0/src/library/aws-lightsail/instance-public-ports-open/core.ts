// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback, copy_output } from "./type.js";
import { LightsailClient, OpenInstancePublicPortsCommand } from "@aws-sdk/client-lightsail";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const client = new LightsailClient({
        credentials: input.credentials,
        region: input.region
    });
    const cmd = new OpenInstancePublicPortsCommand({
        instanceName: input.instanceName,
        portInfo: input.portInfo
    });
    const res = await client.send(cmd);
    const operation = res.operation;
    log.variable("operation", operation);
    return cb.ok(
        copy_output({
            operation
        })
    );
}
