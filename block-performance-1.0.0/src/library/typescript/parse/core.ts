// initialized by dev/system
import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import ts from "typescript";
export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const program = ts.createProgram([input.file], {});
    console.log(program);
    return cb.ok({
        result: "todo"
    });
}
