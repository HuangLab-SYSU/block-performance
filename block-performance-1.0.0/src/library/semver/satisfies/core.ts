// initialized by dev/system

import { Input, Output, Callback } from "./type.js";
import { Logger, semver } from "../import.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    return cb.ok({
        satisfied: semver.satisfies(input.version, input.range)
    });
}
