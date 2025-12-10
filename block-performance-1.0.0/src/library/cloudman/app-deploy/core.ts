// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import { rsync_push } from "../rsync-push/export.js";
import { ssh_exec } from "../ssh-exec/export.js";
import { ssh_install_rsync } from "../ssh-install-rsync/export.js";
import { ssh_install_nodejs } from "../ssh-install-nodejs/export.js";
import { ssh_install_docker } from "../ssh-install-docker/export.js";
import { ssh_install_python } from "../ssh-install-python/export.js";
import { ssh_install_build_essential } from "../ssh-install-build-essential/export.js";
import { ssh_install_chromium_deps } from "../ssh-install-chromium-deps/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    // install rsync first

    await ssh_install_rsync(
        log,
        {
            username: input.username,
            address: input.address,
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

    // install nodejs

    await ssh_install_nodejs(
        log,
        {
            username: input.username,
            address: input.address,
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

    if (input.pre_installed_applications) {
        const { docker, python, build_essential, chromium_deps } = input.pre_installed_applications;

        if (docker) {
            await ssh_install_docker(
                log,
                {
                    username: input.username,
                    address: input.address,
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
        }

        if (python) {
            await ssh_install_python(
                log,
                {
                    username: input.username,
                    address: input.address,
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
        }

        if (build_essential) {
            await ssh_install_build_essential(
                log,
                {
                    username: input.username,
                    address: input.address,
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
        }

        if (chromium_deps) {
            await ssh_install_chromium_deps(
                log,
                {
                    username: input.username,
                    address: input.address,
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
        }
    }

    // upload code

    await rsync_push(
        log,
        {
            username: input.username,
            address: input.address,
            ssh_auth_key: input.ssh_auth_key,
            from_local_dir: input.from_local_dir,
            to_remote_dir: input.to_remote_dir
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

    // start it

    await ssh_exec(
        log,
        {
            username: input.username,
            address: input.address,
            ssh_auth_key: input.ssh_auth_key,
            // command: `cd '${input.to_remote_dir}' && sudo npm run stop ; sudo npm rebuild ; sudo npm run start`
            command: `sudo -i bash -c "cd '${input.to_remote_dir}' && npm run stop ; npm rebuild ; npm run start"`
        },
        {
            ok: () => {},
            fail: (err) => {
                throw err;
            }
        }
    );

    return cb.ok({});
}
