// auto generated by dev/system

import { Logger } from "../../../myutils/logger.js";

export interface Input {
    username: string;
    address_list: string[];
    tag_list: string[];
    private_key: string;
}

export interface OutputOk {
    id: string;
}

export interface OutputFail {}

export interface Callback<R> {
    ok: (output: OutputOk) => R;
    fail: (err: Error) => R;
}

export function check_input<R>(plog: Logger, v: any, cb: { ok: () => R; fail: (err: Error) => R }): R {
    const log = plog.sub("check_input");
    log.variable("v", v);
    try {
        log.println("v must be object");
        if (typeof v !== "object" || v === null) {
            throw new Error("v is not object");
        }

        Object.keys(v).forEach((field) => {
            if (field === "username") return;
            if (field === "address_list") return;
            if (field === "tag_list") return;
            if (field === "private_key") return;
            throw new Error("v contains unknown field: " + field);
        });

        log.println("v.username must be string");
        if (typeof v.username !== "string") {
            throw new Error("v.username is not string");
        }

        log.println("v.address_list must be array");
        if (!Array.isArray(v.address_list)) {
            throw new Error("v.address_list is not array");
        }

        v.address_list.forEach((item: any, i: number) => {
            log.println("check v.address_list[i]");

            log.println("item must be string");
            if (typeof item !== "string") {
                throw new Error("item is not string");
            }
        });

        log.println("v.tag_list must be array");
        if (!Array.isArray(v.tag_list)) {
            throw new Error("v.tag_list is not array");
        }

        v.tag_list.forEach((item: any, i: number) => {
            log.println("check v.tag_list[i]");

            log.println("item must be string");
            if (typeof item !== "string") {
                throw new Error("item is not string");
            }
        });

        log.println("v.private_key must be string");
        if (typeof v.private_key !== "string") {
            throw new Error("v.private_key is not string");
        }
    } catch (err) {
        log.error(err);
        return cb.fail(err);
    }
    // nothing wrong
    log.ok();
    return cb.ok();
}

// JSON stringify value before copy to handle some specific problem
// eg. Date Object probelm
export function copy_output_ok(v: any): OutputOk {
    if (v !== undefined) {
        const v_cloned = JSON.parse(JSON.stringify(v));
        return _copy_output_ok(v_cloned);
    } else {
        return _copy_output_ok(v);
    }
}

export function _copy_output_ok(v: any): OutputOk {
    if (typeof v === "object" && v !== null) {
        const obj = {
            id: copy_id(v.id)
        };
        return obj;
    } else {
        return { id: "" };
    }

    function copy_id(v: any): string {
        return typeof v === "string" ? v : "";
    }
}

// backward compatible purpose
export type Output = OutputOk;
export const copy_output = copy_output_ok;
