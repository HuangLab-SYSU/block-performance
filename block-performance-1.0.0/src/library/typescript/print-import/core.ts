// initialized by dev/system
import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import ts from "typescript";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const program = ts.createProgram([input.file], {});
    const source_file = program.getSourceFile(input.file);
    const result: string[] = [];
    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
    ts.forEachChild(source_file, (node) => {
        if (ts.isImportDeclaration(node)) {
            // console.log(node);
            // result.push(JSON.parse(node.moduleSpecifier.getText(source_file)));
            result.push(printer.printNode(ts.EmitHint.Unspecified, node, source_file));
        }
    });
    return cb.ok({ result });
}
