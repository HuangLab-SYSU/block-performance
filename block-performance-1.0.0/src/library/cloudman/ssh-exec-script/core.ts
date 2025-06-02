// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { guid } from "../../../myutils/common/guid.js";
import { write_text_file } from "../../../myutils/node/file/index.js";
import { del_file } from "../../../myutils/node/file/index.js";
import { Input, Output, Callback } from "./type.js";
import { ssh_exec_script_file } from "../ssh-exec-script-file/export.js";
import * as os from "node:os";
import * as path from "node:path";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const filename = path.resolve(os.tmpdir(), `cloudman.ssh-exec-script.${guid()}.sh`);
    const content = input.script;

    await write_text_file(log, filename, content, {
        ok: () => {
            // ignore
        },
        fail: (err) => {
            throw err;
        }
    });

    await ssh_exec_script_file(
        log,
        {
            username: input.username,
            address: input.address,
            local_script_file: filename,
            ssh_auth_key: input.ssh_auth_key
        },
        {
            ok: () => {
                // ignore
            },
            fail: (err) => {
                throw err;
            }
        }
    );

    // remove the temp file
    await del_file(log, filename, {
        ok: () => {
            // ignore
            log.println("remove temp script file ok: " + filename);
        },
        fail: (err) => {
            throw err;
        }
    });

    return cb.ok({});
}
