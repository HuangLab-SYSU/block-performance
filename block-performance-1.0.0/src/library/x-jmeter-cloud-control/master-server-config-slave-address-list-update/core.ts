// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import * as store from "../../x-jmeter-cloud-store/export.js";
import * as cloud_server_store from "../../x-cloud-server-store/export.js";
import * as cloudman from "../../cloudman/export.js";
import { master_server_get } from "../master-server-get/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const { master_server } = await master_server_get(
        log,
        {
            master_server_id: input.master_server_id
        },
        {
            none: () => {
                throw log.new_error("master server not found");
            },
            ok: (output) => {
                return output;
            },
            fail: (err) => {
                throw err;
            }
        }
    );

    const remote_hosts = await store.slave_server_ls(
        log,
        {},
        {
            empty: async (output) => {
                return "";
            },
            ok: async ({ list: slave_server_list }) => {
                let target_list: string[] = [];

                for (const slave_server of slave_server_list) {
                    const { aws_lightsail_instance } = await cloud_server_store.aws_lightsail_instance_get(
                        log,
                        {
                            id: slave_server.cloud_server.aws_lightsail_instance_id
                        },
                        {
                            none: () => {
                                throw log.new_error("aws_lightsail_instance not found");
                            },
                            ok: (output) => {
                                return output;
                            },
                            fail: (err) => {
                                throw err;
                            }
                        }
                    );

                    target_list.push(`${aws_lightsail_instance.address_ipv4}:1099`);
                }

                return target_list.join(",");
            },
            fail: async (err) => {
                throw err;
            }
        }
    );

    await cloudman.scp_update_text(
        log,
        {
            remote_ssh_auth: {
                username: master_server.ssh_username,
                address: master_server.address_ipv4,
                ssh_auth_key: {
                    store: true
                }
            },
            remote_path: "/cloud/download/apache-jmeter/bin/jmeter.properties",
            update: async (text) => {
                if (remote_hosts) {
                    return text.replace(/^remote_hosts=.+/gm, `remote_hosts=${remote_hosts}`);
                } else {
                    return text.replace(/^remote_hosts=.+/gm, `remote_hosts=127.0.0.1`); // this is the default value (means no remote hosts)
                }
            }
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

    return cb.ok({});
}
