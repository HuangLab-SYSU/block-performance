// initialized by dev/system
import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback, copy_output } from "./type.js";
import { LightsailClient, GetKeyPairCommand } from "@aws-sdk/client-lightsail";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const client = new LightsailClient({
        credentials: input.credentials,
        region: input.region
    });
    const cmd = new GetKeyPairCommand({
        keyPairName: input.keyPairName
    });
    const res = await client.send(cmd);
    const keyPair = res.keyPair;
    log.variable("keyPair", keyPair);
    return cb.ok(copy_output(res));
}
