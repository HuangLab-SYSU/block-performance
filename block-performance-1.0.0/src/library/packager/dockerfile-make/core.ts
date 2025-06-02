// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const dir_name = `${input.name}-${input.version}`;
    const customize_dir_name = `${dir_name}-customize`;

    return cb.ok({
        text: [
            `FROM node:latest`,
            ``,
            `ADD ./${dir_name} /cloud/${dir_name}`,
            ``,
            `# build`,
            `WORKDIR /cloud/${dir_name}`,
            `RUN npm install`,
            `RUN npm run build`,
            ``,
            `# customize`,
            input.with_customize_dir ? `ADD ./${customize_dir_name} /cloud/${dir_name}/customize` : "# no customize files, ignore",
            ``,
            `# pack`,
            `WORKDIR /cloud`,
            `RUN tar czvf ${dir_name}.tar.gz ${dir_name}/`
        ].join("\n")
    });
}
