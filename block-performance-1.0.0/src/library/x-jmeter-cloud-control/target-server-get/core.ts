// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import * as store from "../../x-jmeter-cloud-store/export.js";
import * as cloud_server_store from "../../x-cloud-server-store/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    return await store.target_server_get(
        log,
        {
            id: input.target_server_id
        },
        {
            none: async () => {
                return cb.none();
            },
            ok: async ({ target_server }) => {
                const { aws_lightsail_instance } = await cloud_server_store.aws_lightsail_instance_get(
                    log,
                    {
                        id: target_server.cloud_server.aws_lightsail_instance_id
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

                return cb.ok({
                    target_server: {
                        ...target_server,
                        ssh_username: aws_lightsail_instance.ssh_username,
                        address_ipv4: aws_lightsail_instance.address_ipv4
                    }
                });
            },
            fail: async (err) => {
                throw err;
            }
        }
    );
}
