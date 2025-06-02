// initialized by dev/system
import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback, copy_output } from "./type.js";
import { LightsailClient, RebootInstanceCommand } from "@aws-sdk/client-lightsail";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const client = new LightsailClient({
        credentials: input.credentials,
        region: input.region
    });
    const cmd = new RebootInstanceCommand({
        instanceName: input.instanceName
    });
    const res = await client.send(cmd);
    const operations = res.operations;
    log.variable("operations", operations);
    return cb.ok(
        copy_output({
            operations
        })
    );
}
