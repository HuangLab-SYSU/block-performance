// auto generated by dev/system
import express from "express";
import { Logger } from "../../../myutils/logger.js";
import { handle_rpc_auth_file_upload } from "../auth-file-upload/rpc/handle.js";
import { handle_rpc_master_server_config } from "../master-server-config/rpc/handle.js";
import { handle_rpc_master_server_config_auth_file_upload } from "../master-server-config-auth-file-upload/rpc/handle.js";
import { handle_rpc_master_server_config_slave_address_list_update } from "../master-server-config-slave-address-list-update/rpc/handle.js";
import { handle_rpc_master_server_create } from "../master-server-create/rpc/handle.js";
import { handle_rpc_master_server_create_install_config } from "../master-server-create-install-config/rpc/handle.js";
import { handle_rpc_master_server_get } from "../master-server-get/rpc/handle.js";
import { handle_rpc_master_server_install } from "../master-server-install/rpc/handle.js";
import { handle_rpc_master_server_remove } from "../master-server-remove/rpc/handle.js";
import { handle_rpc_master_server_test_plan_output_download } from "../master-server-test-plan-output-download/rpc/handle.js";
import { handle_rpc_master_server_test_plan_run } from "../master-server-test-plan-run/rpc/handle.js";
import { handle_rpc_master_server_test_plan_upload } from "../master-server-test-plan-upload/rpc/handle.js";
import { handle_rpc_master_server_test_plan_upload_run_download } from "../master-server-test-plan-upload-run-download/rpc/handle.js";
import { handle_rpc_slave_server_config } from "../slave-server-config/rpc/handle.js";
import { handle_rpc_slave_server_config_auth_file_upload } from "../slave-server-config-auth-file-upload/rpc/handle.js";
import { handle_rpc_slave_server_create } from "../slave-server-create/rpc/handle.js";
import { handle_rpc_slave_server_create_install_config_run } from "../slave-server-create-install-config-run/rpc/handle.js";
import { handle_rpc_slave_server_get } from "../slave-server-get/rpc/handle.js";
import { handle_rpc_slave_server_install } from "../slave-server-install/rpc/handle.js";
import { handle_rpc_slave_server_remove } from "../slave-server-remove/rpc/handle.js";
import { handle_rpc_slave_server_run } from "../slave-server-run/rpc/handle.js";
import { handle_rpc_target_server_create } from "../target-server-create/rpc/handle.js";
import { handle_rpc_target_server_get } from "../target-server-get/rpc/handle.js";
import { handle_rpc_target_server_remove } from "../target-server-remove/rpc/handle.js";

export function attach_rpc_handler(plog: Logger, opt: { router: express.Router }) {
    const log = plog.sub("server.attach_rpc_handler");
    const { router } = opt;

    router.post("/library/x-jmeter-cloud-control/auth-file-upload", (req, res) => {
        const input = req.body;
        const req_log = log.sub("post.library.x-jmeter-cloud-control.auth-file-upload");
        handle_rpc_auth_file_upload(req_log, input, {
            invalid_input: (err) => {
                // bad request
                req_log.error(err);
                res.status(400);
                res.end(err.message);
            },
            ok: (result) => {
                // include normal fail case
                req_log.variable("result", result);
                req_log.ok();
                res.json(result);
            },
            fail: (err) => {
                // internal error (not normal fail)
                req_log.error(err);
                res.status(500);
                res.end(err.message);
            }
        });
    });

    router.post("/library/x-jmeter-cloud-control/master-server-config", (req, res) => {
        const input = req.body;
        const req_log = log.sub("post.library.x-jmeter-cloud-control.master-server-config");
        handle_rpc_master_server_config(req_log, input, {
            invalid_input: (err) => {
                // bad request
                req_log.error(err);
                res.status(400);
                res.end(err.message);
            },
            ok: (result) => {
                // include normal fail case
                req_log.variable("result", result);
                req_log.ok();
                res.json(result);
            },
            fail: (err) => {
                // internal error (not normal fail)
                req_log.error(err);
                res.status(500);
                res.end(err.message);
            }
        });
    });

    router.post("/library/x-jmeter-cloud-control/master-server-config-auth-file-upload", (req, res) => {
        const input = req.body;
        const req_log = log.sub("post.library.x-jmeter-cloud-control.master-server-config-auth-file-upload");
        handle_rpc_master_server_config_auth_file_upload(req_log, input, {
            invalid_input: (err) => {
                // bad request
                req_log.error(err);
                res.status(400);
                res.end(err.message);
            },
            ok: (result) => {
                // include normal fail case
                req_log.variable("result", result);
                req_log.ok();
                res.json(result);
            },
            fail: (err) => {
                // internal error (not normal fail)
                req_log.error(err);
                res.status(500);
                res.end(err.message);
            }
        });
    });

    router.post("/library/x-jmeter-cloud-control/master-server-config-slave-address-list-update", (req, res) => {
        const input = req.body;
        const req_log = log.sub("post.library.x-jmeter-cloud-control.master-server-config-slave-address-list-update");
        handle_rpc_master_server_config_slave_address_list_update(req_log, input, {
            invalid_input: (err) => {
                // bad request
                req_log.error(err);
                res.status(400);
                res.end(err.message);
            },
            ok: (result) => {
                // include normal fail case
                req_log.variable("result", result);
                req_log.ok();
                res.json(result);
            },
            fail: (err) => {
                // internal error (not normal fail)
                req_log.error(err);
                res.status(500);
                res.end(err.message);
            }
        });
    });

    router.post("/library/x-jmeter-cloud-control/master-server-create", (req, res) => {
        const input = req.body;
        const req_log = log.sub("post.library.x-jmeter-cloud-control.master-server-create");
        handle_rpc_master_server_create(req_log, input, {
            invalid_input: (err) => {
                // bad request
                req_log.error(err);
                res.status(400);
                res.end(err.message);
            },
            ok: (result) => {
                // include normal fail case
                req_log.variable("result", result);
                req_log.ok();
                res.json(result);
            },
            fail: (err) => {
                // internal error (not normal fail)
                req_log.error(err);
                res.status(500);
                res.end(err.message);
            }
        });
    });

    router.post("/library/x-jmeter-cloud-control/master-server-create-install-config", (req, res) => {
        const input = req.body;
        const req_log = log.sub("post.library.x-jmeter-cloud-control.master-server-create-install-config");
        handle_rpc_master_server_create_install_config(req_log, input, {
            invalid_input: (err) => {
                // bad request
                req_log.error(err);
                res.status(400);
                res.end(err.message);
            },
            ok: (result) => {
                // include normal fail case
                req_log.variable("result", result);
                req_log.ok();
                res.json(result);
            },
            fail: (err) => {
                // internal error (not normal fail)
                req_log.error(err);
                res.status(500);
                res.end(err.message);
            }
        });
    });

    router.post("/library/x-jmeter-cloud-control/master-server-get", (req, res) => {
        const input = req.body;
        const req_log = log.sub("post.library.x-jmeter-cloud-control.master-server-get");
        handle_rpc_master_server_get(req_log, input, {
            invalid_input: (err) => {
                // bad request
                req_log.error(err);
                res.status(400);
                res.end(err.message);
            },
            ok: (result) => {
                // include normal fail case
                req_log.variable("result", result);
                req_log.ok();
                res.json(result);
            },
            fail: (err) => {
                // internal error (not normal fail)
                req_log.error(err);
                res.status(500);
                res.end(err.message);
            }
        });
    });

    router.post("/library/x-jmeter-cloud-control/master-server-install", (req, res) => {
        const input = req.body;
        const req_log = log.sub("post.library.x-jmeter-cloud-control.master-server-install");
        handle_rpc_master_server_install(req_log, input, {
            invalid_input: (err) => {
                // bad request
                req_log.error(err);
                res.status(400);
                res.end(err.message);
            },
            ok: (result) => {
                // include normal fail case
                req_log.variable("result", result);
                req_log.ok();
                res.json(result);
            },
            fail: (err) => {
                // internal error (not normal fail)
                req_log.error(err);
                res.status(500);
                res.end(err.message);
            }
        });
    });

    router.post("/library/x-jmeter-cloud-control/master-server-remove", (req, res) => {
        const input = req.body;
        const req_log = log.sub("post.library.x-jmeter-cloud-control.master-server-remove");
        handle_rpc_master_server_remove(req_log, input, {
            invalid_input: (err) => {
                // bad request
                req_log.error(err);
                res.status(400);
                res.end(err.message);
            },
            ok: (result) => {
                // include normal fail case
                req_log.variable("result", result);
                req_log.ok();
                res.json(result);
            },
            fail: (err) => {
                // internal error (not normal fail)
                req_log.error(err);
                res.status(500);
                res.end(err.message);
            }
        });
    });

    router.post("/library/x-jmeter-cloud-control/master-server-test-plan-output-download", (req, res) => {
        const input = req.body;
        const req_log = log.sub("post.library.x-jmeter-cloud-control.master-server-test-plan-output-download");
        handle_rpc_master_server_test_plan_output_download(req_log, input, {
            invalid_input: (err) => {
                // bad request
                req_log.error(err);
                res.status(400);
                res.end(err.message);
            },
            ok: (result) => {
                // include normal fail case
                req_log.variable("result", result);
                req_log.ok();
                res.json(result);
            },
            fail: (err) => {
                // internal error (not normal fail)
                req_log.error(err);
                res.status(500);
                res.end(err.message);
            }
        });
    });

    router.post("/library/x-jmeter-cloud-control/master-server-test-plan-run", (req, res) => {
        const input = req.body;
        const req_log = log.sub("post.library.x-jmeter-cloud-control.master-server-test-plan-run");
        handle_rpc_master_server_test_plan_run(req_log, input, {
            invalid_input: (err) => {
                // bad request
                req_log.error(err);
                res.status(400);
                res.end(err.message);
            },
            ok: (result) => {
                // include normal fail case
                req_log.variable("result", result);
                req_log.ok();
                res.json(result);
            },
            fail: (err) => {
                // internal error (not normal fail)
                req_log.error(err);
                res.status(500);
                res.end(err.message);
            }
        });
    });

    router.post("/library/x-jmeter-cloud-control/master-server-test-plan-upload", (req, res) => {
        const input = req.body;
        const req_log = log.sub("post.library.x-jmeter-cloud-control.master-server-test-plan-upload");
        handle_rpc_master_server_test_plan_upload(req_log, input, {
            invalid_input: (err) => {
                // bad request
                req_log.error(err);
                res.status(400);
                res.end(err.message);
            },
            ok: (result) => {
                // include normal fail case
                req_log.variable("result", result);
                req_log.ok();
                res.json(result);
            },
            fail: (err) => {
                // internal error (not normal fail)
                req_log.error(err);
                res.status(500);
                res.end(err.message);
            }
        });
    });

    router.post("/library/x-jmeter-cloud-control/master-server-test-plan-upload-run-download", (req, res) => {
        const input = req.body;
        const req_log = log.sub("post.library.x-jmeter-cloud-control.master-server-test-plan-upload-run-download");
        handle_rpc_master_server_test_plan_upload_run_download(req_log, input, {
            invalid_input: (err) => {
                // bad request
                req_log.error(err);
                res.status(400);
                res.end(err.message);
            },
            ok: (result) => {
                // include normal fail case
                req_log.variable("result", result);
                req_log.ok();
                res.json(result);
            },
            fail: (err) => {
                // internal error (not normal fail)
                req_log.error(err);
                res.status(500);
                res.end(err.message);
            }
        });
    });

    router.post("/library/x-jmeter-cloud-control/slave-server-config", (req, res) => {
        const input = req.body;
        const req_log = log.sub("post.library.x-jmeter-cloud-control.slave-server-config");
        handle_rpc_slave_server_config(req_log, input, {
            invalid_input: (err) => {
                // bad request
                req_log.error(err);
                res.status(400);
                res.end(err.message);
            },
            ok: (result) => {
                // include normal fail case
                req_log.variable("result", result);
                req_log.ok();
                res.json(result);
            },
            fail: (err) => {
                // internal error (not normal fail)
                req_log.error(err);
                res.status(500);
                res.end(err.message);
            }
        });
    });

    router.post("/library/x-jmeter-cloud-control/slave-server-config-auth-file-upload", (req, res) => {
        const input = req.body;
        const req_log = log.sub("post.library.x-jmeter-cloud-control.slave-server-config-auth-file-upload");
        handle_rpc_slave_server_config_auth_file_upload(req_log, input, {
            invalid_input: (err) => {
                // bad request
                req_log.error(err);
                res.status(400);
                res.end(err.message);
            },
            ok: (result) => {
                // include normal fail case
                req_log.variable("result", result);
                req_log.ok();
                res.json(result);
            },
            fail: (err) => {
                // internal error (not normal fail)
                req_log.error(err);
                res.status(500);
                res.end(err.message);
            }
        });
    });

    router.post("/library/x-jmeter-cloud-control/slave-server-create", (req, res) => {
        const input = req.body;
        const req_log = log.sub("post.library.x-jmeter-cloud-control.slave-server-create");
        handle_rpc_slave_server_create(req_log, input, {
            invalid_input: (err) => {
                // bad request
                req_log.error(err);
                res.status(400);
                res.end(err.message);
            },
            ok: (result) => {
                // include normal fail case
                req_log.variable("result", result);
                req_log.ok();
                res.json(result);
            },
            fail: (err) => {
                // internal error (not normal fail)
                req_log.error(err);
                res.status(500);
                res.end(err.message);
            }
        });
    });

    router.post("/library/x-jmeter-cloud-control/slave-server-create-install-config-run", (req, res) => {
        const input = req.body;
        const req_log = log.sub("post.library.x-jmeter-cloud-control.slave-server-create-install-config-run");
        handle_rpc_slave_server_create_install_config_run(req_log, input, {
            invalid_input: (err) => {
                // bad request
                req_log.error(err);
                res.status(400);
                res.end(err.message);
            },
            ok: (result) => {
                // include normal fail case
                req_log.variable("result", result);
                req_log.ok();
                res.json(result);
            },
            fail: (err) => {
                // internal error (not normal fail)
                req_log.error(err);
                res.status(500);
                res.end(err.message);
            }
        });
    });

    router.post("/library/x-jmeter-cloud-control/slave-server-get", (req, res) => {
        const input = req.body;
        const req_log = log.sub("post.library.x-jmeter-cloud-control.slave-server-get");
        handle_rpc_slave_server_get(req_log, input, {
            invalid_input: (err) => {
                // bad request
                req_log.error(err);
                res.status(400);
                res.end(err.message);
            },
            ok: (result) => {
                // include normal fail case
                req_log.variable("result", result);
                req_log.ok();
                res.json(result);
            },
            fail: (err) => {
                // internal error (not normal fail)
                req_log.error(err);
                res.status(500);
                res.end(err.message);
            }
        });
    });

    router.post("/library/x-jmeter-cloud-control/slave-server-install", (req, res) => {
        const input = req.body;
        const req_log = log.sub("post.library.x-jmeter-cloud-control.slave-server-install");
        handle_rpc_slave_server_install(req_log, input, {
            invalid_input: (err) => {
                // bad request
                req_log.error(err);
                res.status(400);
                res.end(err.message);
            },
            ok: (result) => {
                // include normal fail case
                req_log.variable("result", result);
                req_log.ok();
                res.json(result);
            },
            fail: (err) => {
                // internal error (not normal fail)
                req_log.error(err);
                res.status(500);
                res.end(err.message);
            }
        });
    });

    router.post("/library/x-jmeter-cloud-control/slave-server-remove", (req, res) => {
        const input = req.body;
        const req_log = log.sub("post.library.x-jmeter-cloud-control.slave-server-remove");
        handle_rpc_slave_server_remove(req_log, input, {
            invalid_input: (err) => {
                // bad request
                req_log.error(err);
                res.status(400);
                res.end(err.message);
            },
            ok: (result) => {
                // include normal fail case
                req_log.variable("result", result);
                req_log.ok();
                res.json(result);
            },
            fail: (err) => {
                // internal error (not normal fail)
                req_log.error(err);
                res.status(500);
                res.end(err.message);
            }
        });
    });

    router.post("/library/x-jmeter-cloud-control/slave-server-run", (req, res) => {
        const input = req.body;
        const req_log = log.sub("post.library.x-jmeter-cloud-control.slave-server-run");
        handle_rpc_slave_server_run(req_log, input, {
            invalid_input: (err) => {
                // bad request
                req_log.error(err);
                res.status(400);
                res.end(err.message);
            },
            ok: (result) => {
                // include normal fail case
                req_log.variable("result", result);
                req_log.ok();
                res.json(result);
            },
            fail: (err) => {
                // internal error (not normal fail)
                req_log.error(err);
                res.status(500);
                res.end(err.message);
            }
        });
    });

    router.post("/library/x-jmeter-cloud-control/target-server-create", (req, res) => {
        const input = req.body;
        const req_log = log.sub("post.library.x-jmeter-cloud-control.target-server-create");
        handle_rpc_target_server_create(req_log, input, {
            invalid_input: (err) => {
                // bad request
                req_log.error(err);
                res.status(400);
                res.end(err.message);
            },
            ok: (result) => {
                // include normal fail case
                req_log.variable("result", result);
                req_log.ok();
                res.json(result);
            },
            fail: (err) => {
                // internal error (not normal fail)
                req_log.error(err);
                res.status(500);
                res.end(err.message);
            }
        });
    });

    router.post("/library/x-jmeter-cloud-control/target-server-get", (req, res) => {
        const input = req.body;
        const req_log = log.sub("post.library.x-jmeter-cloud-control.target-server-get");
        handle_rpc_target_server_get(req_log, input, {
            invalid_input: (err) => {
                // bad request
                req_log.error(err);
                res.status(400);
                res.end(err.message);
            },
            ok: (result) => {
                // include normal fail case
                req_log.variable("result", result);
                req_log.ok();
                res.json(result);
            },
            fail: (err) => {
                // internal error (not normal fail)
                req_log.error(err);
                res.status(500);
                res.end(err.message);
            }
        });
    });

    router.post("/library/x-jmeter-cloud-control/target-server-remove", (req, res) => {
        const input = req.body;
        const req_log = log.sub("post.library.x-jmeter-cloud-control.target-server-remove");
        handle_rpc_target_server_remove(req_log, input, {
            invalid_input: (err) => {
                // bad request
                req_log.error(err);
                res.status(400);
                res.end(err.message);
            },
            ok: (result) => {
                // include normal fail case
                req_log.variable("result", result);
                req_log.ok();
                res.json(result);
            },
            fail: (err) => {
                // internal error (not normal fail)
                req_log.error(err);
                res.status(500);
                res.end(err.message);
            }
        });
    });
}
