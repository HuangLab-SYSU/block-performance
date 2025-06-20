// auto generated by dev/system

export * from "./type/index.js";
export * from "./make_private.js";
export * from "./make_public.js";
export * from "./copy_private.js";
export * from "./copy_public.js";

import * as _ from "../../../storage-simple-coll/_app/index.js";
import * as config from "./config/index.js";
import { SlaveServer } from "./type/index.js";

export const ls = _.make_ls_cb<SlaveServer>(config);
export const add = _.make_add_cb<SlaveServer>(config);
export const del_matched = _.make_del_matched_cb<SlaveServer>(config);
export const del = _.make_del_cb<SlaveServer>(config);
export const get = _.make_get_cb<SlaveServer>(config);
export const set = _.make_set_cb<SlaveServer>(config);
export const update = _.make_update_cb<SlaveServer>(config);
export const find_one = _.make_find_one_cb<SlaveServer>(config);
