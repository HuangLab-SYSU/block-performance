// initialized by dev/system
import * as path from "node:path";
import express from "express";
import { Logger } from "../../../myutils/logger.js";
import { classic } from "../../../myutils/node/classic.js";
const { __dirname } = classic(import.meta.url);

export function attach_page_handler(plog: Logger, opt: { exp_app: express.Express }) {
    const log = plog.sub("server.attach_page_handler");
    const { exp_app } = opt;
    // TODO
}
