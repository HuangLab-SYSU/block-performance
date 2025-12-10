// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { post_json } from "../../../myutils/index.js";
import { Input, Output, Callback } from "./type.js";
import { proxy_url_parse } from "../proxy-url-parse/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    // DEBUG
    // input.proxy_url = "http://localhost:1234";

    const res = await post_json(
        log,
        {
            url: input.url,
            url_params: input.url_params,
            headers: input.headers,
            proxy: input.proxy_url
                ? await proxy_url_parse(
                      log,
                      {
                          proxy_url: input.proxy_url
                      },
                      {
                          ok: (output) => {
                              return output.proxy;
                          },
                          fail: (err) => {
                              throw err;
                          }
                      }
                  )
                : undefined,
            data: input.data
        },
        {
            ok: (res: any) => {
                return res;
            },
            fail: (err) => {
                throw err;
            }
        }
    );
    return cb.ok({ json_value: res });
}
