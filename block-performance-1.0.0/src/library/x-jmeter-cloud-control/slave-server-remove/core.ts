// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import * as store from "../../x-jmeter-cloud-store/export.js";
import * as cloud_server from "../../x-cloud-server-aws-lightsail/export.js";
import { credential_get } from "../../x-jmeter-cloud-credential/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const { credential } = await credential_get(
        log,
        {},
        {
            ok: (output) => {
                return output;
            },
            fail: (err) => {
                throw err;
            }
        }
    );

    return await store.slave_server_get(
        log,
        {
            id: input.slave_server_id
        },
        {
            none: async () => {
                return cb.none();
            },
            ok: async ({ slave_server }) => {
                await cloud_server.instance_remove(
                    log,
                    {
                        credentials: {
                            accessKeyId: credential.aws_lightsail.access_key_id,
                            secretAccessKey: credential.aws_lightsail.secret_access_key
                        },
                        id: slave_server.cloud_server.aws_lightsail_instance_id
                    },
                    {
                        none: () => {
                            // ignore
                        },
                        ok: (output) => {
                            // ignore
                        },
                        fail: (err) => {
                            throw err;
                        }
                    }
                );

                await store.slave_server_del(
                    log,
                    {
                        id: slave_server.id
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
            },
            fail: async (err) => {
                throw err;
            }
        }
    );
}
