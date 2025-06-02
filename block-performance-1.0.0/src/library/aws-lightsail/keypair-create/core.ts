// initialized by dev/system
import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback, copy_output } from "./type.js";
import { LightsailClient, CreateKeyPairCommand } from "@aws-sdk/client-lightsail";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const client = new LightsailClient({
        credentials: input.credentials,
        region: input.region
    });
    const cmd = new CreateKeyPairCommand({
        keyPairName: input.keyPairName,
        tags: input.tags
    });
    const res = await client.send(cmd);
    const { keyPair, operation, privateKeyBase64, publicKeyBase64 } = res;
    log.variable("keyPair", keyPair);
    log.variable("operation", operation);
    log.variable("privateKeyBase64", privateKeyBase64);
    log.variable("publicKeyBase64", publicKeyBase64);
    return cb.ok(copy_output(res));
}
