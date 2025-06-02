// initialized by dev/system
import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback, copy_output } from "./type.js";
import { LightsailClient, GetBundlesCommand } from "@aws-sdk/client-lightsail";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const client = new LightsailClient({
        credentials: input.credentials,
        region: input.region
    });
    const cmd = new GetBundlesCommand({
        includeInactive: input.includeInactive,
        pageToken: input.pageToken
    });
    const res = await client.send(cmd);
    const bundles = res.bundles;
    log.variable("bundles", bundles);
    const nextPageToken = res.nextPageToken;
    log.variable("nextPageToken", nextPageToken);
    return cb.ok(
        copy_output({
            bundles,
            nextPageToken
        })
    );
}
