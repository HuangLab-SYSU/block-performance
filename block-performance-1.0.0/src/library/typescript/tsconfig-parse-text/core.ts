// initialized by dev/system

import { Input, Output, Callback } from "./type.js";
import { Logger } from "../import.js";
import ts from "typescript";

const { parseConfigFileTextToJson } = ts;

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const { config, error } = parseConfigFileTextToJson("tsconfig.json", input.text);
    if (error) {
        log.variable("error", error);
        throw log.new_error("invalid content");
    }
    return cb.ok({ result: config });
}
