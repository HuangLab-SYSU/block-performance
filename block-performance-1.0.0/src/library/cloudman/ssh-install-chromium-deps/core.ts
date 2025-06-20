// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import { ssh_apt_install } from "../ssh-apt-install/export.js";

// references:
// https://source.chromium.org/chromium/chromium/src/+/main:chrome/installer/linux/debian/dist_package_versions.json
// https://pptr.dev/troubleshooting#chrome-doesnt-launch-on-linux

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    await ssh_apt_install(
        log,
        {
            username: input.username,
            address: input.address,
            ssh_auth_key: input.ssh_auth_key,
            app_list:
                // WARN this list only works for Debian 12
                [
                    "libasound2",
                    "libatk-bridge2.0-0",
                    "libatk1.0-0",
                    "libatspi2.0-0",
                    "libc6",
                    "libcairo2",
                    "libcups2",
                    "libdbus-1-3",
                    "libdrm2",
                    "libexpat1",
                    "libgbm1",
                    "libglib2.0-0",
                    "libnspr4",
                    "libnss3",
                    "libpango-1.0-0",
                    "libpangocairo-1.0-0",
                    "libstdc++6",
                    "libudev1",
                    "libuuid1",
                    "libx11-6",
                    "libx11-xcb1",
                    "libxcb-dri3-0",
                    "libxcb1",
                    "libxcomposite1",
                    "libxcursor1",
                    "libxdamage1",
                    "libxext6",
                    "libxfixes3",
                    "libxi6",
                    "libxkbcommon0",
                    "libxrandr2",
                    "libxrender1",
                    "libxshmfence1",
                    "libxss1",
                    "libxtst6"
                ]
        },
        {
            ok: (output) => {
                return output;
            },
            fail: (err) => {
                throw err;
            }
        }
    );
    return cb.ok({});
}
