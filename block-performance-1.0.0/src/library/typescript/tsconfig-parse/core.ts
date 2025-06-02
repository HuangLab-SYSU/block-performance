// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import * as dir from "../../../myutils/node/dir/index.js";
import { read_text_file } from "../../../myutils/node/file/index.js";
import { Input, Output, Callback } from "./type.js";
import ts from "typescript";

const { parseConfigFileTextToJson } = ts;

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const file_abs = dir.resolve(input.file);
    log.variable("file_abs", file_abs);

    const text = await read_text_file(log, file_abs, {
        ok: (text) => {
            return text;
        },
        fail: (err) => {
            throw err;
        }
    });

    const { config, error } = parseConfigFileTextToJson(input.file, text);
    if (error) {
        log.variable("error", error);
        throw log.new_error("invalid content");
    }
    log.variable("config", config);
    return cb.ok({
        result: config
    });
}
