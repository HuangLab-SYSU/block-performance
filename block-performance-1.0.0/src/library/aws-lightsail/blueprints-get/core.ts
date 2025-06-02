// initialized by dev/system
import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback, copy_output } from "./type.js";
import { LightsailClient, GetBlueprintsCommand } from "@aws-sdk/client-lightsail";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const client = new LightsailClient({
        credentials: input.credentials,
        region: input.region
    });
    const cmd = new GetBlueprintsCommand({
        // TODO
    });
    const res = await client.send(cmd);
    const blueprints = res.blueprints;
    log.variable("blueprints", blueprints);
    return cb.ok(
        copy_output({
            blueprints
        })
    );
}
