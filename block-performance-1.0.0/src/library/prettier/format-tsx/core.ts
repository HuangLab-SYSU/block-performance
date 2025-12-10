// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import prettier from "prettier";
import parser_typescript from "prettier/parser-typescript.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const new_text = await prettier.format(input.text, {
        parser: "typescript",
        tabWidth: 4,
        printWidth: 160,
        trailingComma: "none",
        plugins: [parser_typescript]
    });
    return cb.ok({ text: new_text });
}
