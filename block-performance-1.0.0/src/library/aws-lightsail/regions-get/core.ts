// initialized by dev/system
import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback, copy_output } from "./type.js";
import { LightsailClient, GetRegionsCommand } from "@aws-sdk/client-lightsail";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const client = new LightsailClient({
        credentials: input.credentials,
        region: input.region
    });
    const cmd = new GetRegionsCommand({
        includeAvailabilityZones: input.includeAvailabilityZones,
        includeRelationalDatabaseAvailabilityZones: input.includeRelationalDatabaseAvailabilityZones
    });
    try {
        const res = await client.send(cmd);
        const regions = res.regions;
        log.variable("regions", regions);
        return cb.ok(
            copy_output({
                regions
            })
        );
    } catch (err) {
        log.error(err);
        return cb.fail(err);
    }
}
