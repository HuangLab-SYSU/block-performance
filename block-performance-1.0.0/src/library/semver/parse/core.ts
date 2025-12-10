// initialized by dev/system

import { Input, Output, Callback } from "./type.js";
import { Logger, semver } from "../import.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const info = semver.parse(input.version);
    if (!info) {
        throw log.new_error("invalid text");
    }
    log.variable("info", info);
    return cb.ok({
        major: info.major,
        minor: info.minor,
        patch: info.patch
    });
}
