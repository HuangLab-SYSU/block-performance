// initialized by dev/system
import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback, copy_output } from "./type.js";
import { LightsailClient, GetKeyPairsCommand } from "@aws-sdk/client-lightsail";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const client = new LightsailClient({
        credentials: input.credentials,
        region: input.region
    });
    const cmd = new GetKeyPairsCommand({
        includeDefaultKeyPair: input.includeDefaultKeyPair,
        pageToken: input.pageToken
    });
    const res = await client.send(cmd);
    const { keyPairs, nextPageToken } = res;
    log.variable("keyPairs", keyPairs);
    log.variable("nextPageToken", nextPageToken);
    return cb.ok(
        copy_output({
            keyPairs,
            nextPageToken
        })
    );
}
