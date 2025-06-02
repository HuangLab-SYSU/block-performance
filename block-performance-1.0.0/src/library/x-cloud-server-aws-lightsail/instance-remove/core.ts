// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import * as lightsail from "../../aws-lightsail/export.js";
import * as store from "../../x-cloud-server-store/export.js";
import * as x_ssh_key_control from "../../x-ssh-key-control/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    try {
        return await store.aws_lightsail_instance_get(
            log,
            { id: input.id },
            {
                none: async () => {
                    return cb.none();
                },
                ok: async ({ aws_lightsail_instance }) => {
                    await lightsail.instance_delete(
                        log,
                        {
                            credentials: input.credentials,
                            region: aws_lightsail_instance.region,
                            instanceName: aws_lightsail_instance.instance_name
                        },
                        {
                            ok: (output) => {
                                // ignore
                            },
                            fail: (err) => {
                                // it is possible the instance has been removed
                                log.warn(err);
                                log.warn("remove lightsail server from aws failed, please check it in your dashboard");
                            }
                        }
                    );

                    await x_ssh_key_control.key_remove(
                        log,
                        {
                            username: aws_lightsail_instance.ssh_username,
                            address: aws_lightsail_instance.address_ipv4
                        },
                        {
                            none: () => {
                                // it is possible the key has been removed
                            },
                            ok: (output) => {
                                return output;
                            },
                            fail: (err) => {
                                throw err;
                            }
                        }
                    );

                    await x_ssh_key_control.key_remove(
                        log,
                        {
                            username: aws_lightsail_instance.ssh_username,
                            address: aws_lightsail_instance.address_ipv6
                        },
                        {
                            none: () => {
                                // it is possible the key has been removed
                            },
                            ok: (output) => {
                                return output;
                            },
                            fail: (err) => {
                                throw err;
                            }
                        }
                    );

                    await store.aws_lightsail_instance_del(
                        log,
                        { id: input.id },
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
    } catch (err) {
        log.print_unknown_error(err);
        return cb.fail(err);
    }
}
