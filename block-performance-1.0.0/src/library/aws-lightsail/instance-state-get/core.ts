// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback, copy_output } from "./type.js";
import { LightsailClient, GetInstanceStateCommand } from "@aws-sdk/client-lightsail";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const client = new LightsailClient({
        credentials: input.credentials,
        region: input.region
    });
    const cmd = new GetInstanceStateCommand({
        instanceName: input.instanceName
    });
    const res = await client.send(cmd);
    const state = res.state;
    log.variable("state", state);
    return cb.ok(
        copy_output({
            state
        })
    );
}
