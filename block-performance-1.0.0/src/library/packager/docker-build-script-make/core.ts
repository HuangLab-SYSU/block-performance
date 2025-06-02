// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const name_version = `${input.name}-${input.version}`;
    const image = `${name_version}-image`;
    const container = `${name_version}-container`;

    return cb.ok({
        text: [
            `#!/bin/bash`,
            ``,
            `set -e`,
            ``,
            `docker build --tag ${image} .`,
            `docker run --name ${container} ${image}`,
            `docker cp ${container}:/cloud/${name_version}.tar.gz ./`,
            ``,
            `docker container rm ${container}`,
            `docker image rm ${image}`,
            ``,
            `mkdir output && tar zxvf ${name_version}.tar.gz -C ./output/`,
            `mv ${name_version}.tar.gz ./output/`
        ].join("\n")
    });
}
