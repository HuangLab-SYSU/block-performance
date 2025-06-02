// initialized by dev/system
import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback, copy_output } from "./type.js";
import { LightsailClient, CreateInstancesCommand } from "@aws-sdk/client-lightsail";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const client = new LightsailClient({
        credentials: input.credentials,
        region: input.region
    });
    const cmd = new CreateInstancesCommand({
        instanceNames: input.instanceNames,
        availabilityZone: input.availabilityZone,
        blueprintId: input.blueprintId,
        bundleId: input.bundleId,
        userData: input.userData,
        keyPairName: input.keyPairName,
        tags: input.tags,
        ipAddressType: input.ipAddressType
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
