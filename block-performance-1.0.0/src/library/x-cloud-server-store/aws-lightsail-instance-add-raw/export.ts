// auto generated by dev/system

export { rpc_aws_lightsail_instance_add_raw } from "./rpc/client.js";
export { Input as AwsLightsailInstanceAddRawInput, Output as AwsLightsailInstanceAddRawOutput } from "./type.js";
export { make_input as make_aws_lightsail_instance_add_raw_input, make_output_ok as make_aws_lightsail_instance_add_raw_output_ok } from "./tool/index.js";

import { core } from "./core.js";
import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";

// [Note]
// Some libraries redefine the Input type with additional fields that cannot yet be expressed in the meta-type system.
// For example, the task-queue/task-add-wait/core module adds an additional "run" function.
// To support this use case, we should fetch the input type from the core function.
type InputEx = Parameters<typeof core>["1"];

export async function aws_lightsail_instance_add_raw<R>(plog: Logger, input: InputEx, cb: Callback<R>): Promise<R> {
    const log = plog.sub_library_function("x-cloud-server-store", "aws-lightsail-instance-add-raw");
    try {
        log.variable("input", input);
        return core(log, input, {
            ok: (output) => {
                log.println("ok");
                log.variable("output", output);
                return cb.ok(output);
            },
            fail: (err) => {
                log.println("fail");
                log.print_unknown_error(err);
                return cb.fail(err);
            }
        });
    } catch (err) {
        log.print_unknown_error(err);
        return cb.fail(err);
    }
}
