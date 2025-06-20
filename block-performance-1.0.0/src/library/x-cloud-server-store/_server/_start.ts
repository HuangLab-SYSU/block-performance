// auto generated by dev/system

import express from "express";
import { Logger } from "../../../myutils/logger.js";
import { express_app } from "./express_app.js";
import { attach_rpc_handler } from "./attach_rpc_handler.js";
import { attach_rpc_handler_unsafe } from "./attach_rpc_handler_unsafe.js";
import { attach_webroot_handler } from "./attach_webroot_handler.js";
import { attach_upload_handler } from "./attach_upload_handler.js";
import { attach_proxy_handler } from "./attach_proxy_handler.js";
import { run_server } from "./run_server.js";

// the name begins with underscore to avoid name conflicts with the imported items
export function _start(plog: Logger, opt: { host: string; http_port: number; https_port: number; setup?: (exp_app: express.Express) => void }) {
    const log = plog.sub("server.start");
    log.variable("opt", opt);
    const exp_app = express_app(log);
    // auto display the index page (redirect to)
    exp_app.get("/", (req, res) => {
        res.redirect("/index/");
    });
    // additional setup (if needed)
    if (opt.setup) {
        opt.setup(exp_app);
    }
    attach_webroot_handler(log, { exp_app, url_prefix: "/" });
    attach_upload_handler(log, { exp_app, url_prefix: "/upload" });
    attach_rpc_handler(log, { exp_app });
    attach_rpc_handler_unsafe(log, { exp_app });
    attach_proxy_handler(log, { exp_app });
    run_server(log, { exp_app, host: opt.host, http_port: opt.http_port, https_port: opt.https_port });
}
