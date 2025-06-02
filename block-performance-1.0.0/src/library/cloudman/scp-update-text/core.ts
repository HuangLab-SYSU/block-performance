// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { guid } from "../../../myutils/common/guid.js";
import { Input, Output, Callback } from "./type.js";
import { scp_download } from "../scp-download/export.js";
import { scp_upload } from "../scp-upload/export.js";
import * as file_system from "../../file-system/export.js";

export async function core<R>(
    log: Logger,
    input: Input & {
        update?: (text: string) => Promise<string>; // return updated text
    },
    cb: Callback<R>
): Promise<R> {
    const { path: local_temp_path, dir_name } = await file_system.temp_path_resolve(
        log,
        {
            part_list: ["cloudman", "scp-update-text", `${guid()}.txt`]
        },
        {
            ok: (output) => {
                return output;
            },
            fail: (err) => {
                throw err;
            }
        }
    );

    // Must make sure the parent directory extis before invoking scp to download file

    await file_system.directory_create(
        log,
        {
            name: dir_name
        },
        {
            skip: () => {
                // ignore
            },
            ok: (output) => {
                return output;
            },
            fail: (err) => {
                throw err;
            }
        }
    );

    await scp_download(
        log,
        {
            remote_ssh_auth: input.remote_ssh_auth,
            from_remote_path: input.remote_path,
            to_local_path: local_temp_path
        },
        {
            ok: (output) => {
                return output;
            },
            fail: (err) => {
                throw err;
            }
        }
    );

    const { text } = await file_system.file_read_text(
        log,
        {
            name: local_temp_path
        },
        {
            ok: (output) => {
                return output;
            },
            fail: (err) => {
                throw err;
            }
        }
    );

    if (input.update) {
        const updated_text = await input.update(text);
        log.variable("updated_text", updated_text);

        await file_system.file_write_text(
            log,
            {
                name: local_temp_path,
                text: updated_text
            },
            {
                ok: (output) => {
                    return output;
                },
                fail: (err) => {
                    throw err;
                }
            }
        );
    }

    await scp_upload(
        log,
        {
            remote_ssh_auth: input.remote_ssh_auth,
            from_local_path: local_temp_path,
            to_remote_path: input.remote_path
        },
        {
            ok: (output) => {
                return output;
            },
            fail: (err) => {
                throw err;
            }
        }
    );

    await file_system.file_delete(
        log,
        {
            name: local_temp_path
        },
        {
            none: () => {
                throw log.new_error("unexpected, temp file not found");
            },
            ok: (output) => {
                return output;
            },
            fail: (err) => {
                throw err;
            }
        }
    );

    return cb.ok({});
}
