// this module is the same as library/url/parse/core.ts
// duplicate the same logic here is because library/*/_server/attach_page_handler.ts may use this
// but they don't want to depends on library/url directly
import { Logger } from "../logger.js";

export interface ParsedURL {
    href: string;
    protocol: string;
    username: string;
    password: string;
    hostname: string;
    port: string;
    pathname: string;
    search_params: { [key: string]: string };
    hash: string;
}

export function parse_url(plog: Logger, v: string): ParsedURL {
    const log = plog.sub("parse_url");
    log.variable("v", v);

    const url = new URL(v);

    const parsed_url: ParsedURL = {
        href: url.href,
        protocol: url.protocol,
        username: url.username,
        password: url.password,
        hostname: url.hostname,
        port: url.port,
        pathname: url.pathname,
        search_params: {},
        hash: url.hash
    };

    for (const [name, value] of url.searchParams) {
        parsed_url.search_params[name] = value;
    }

    log.variable("parsed_url", parsed_url);

    return parsed_url;
}
