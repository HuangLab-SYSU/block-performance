type Headers = { name: string; value: string }[];

type NodejsHeaders = { [key: string]: string[] };

type NodejsHeadersEx = { [key: string]: undefined | string | string[] };

export function to_nodejs_headers(headers: Headers): NodejsHeaders {
    const result: NodejsHeaders = {};

    headers.forEach(({ name, value }) => {
        if (result[name]) {
            result[name].push(value);
        } else {
            result[name] = [value];
        }
    });

    return result;
}

export function from_nodejs_headers(headers: NodejsHeadersEx): Headers {
    const result: Headers = [];
    Object.keys(headers).forEach((name) => {
        if (Array.isArray(headers[name])) {
            const value_list = headers[name];
            for (const value of value_list) {
                result.push({ name, value });
            }
        } else if (typeof headers[name] === "string") {
            const value = headers[name] as string;
            result.push({ name, value });
        } else {
            // ignore
        }
    });
    return result;
}
