import type { ForgeConfig } from "@electron-forge/shared-types";
import { AutoUnpackNativesPlugin } from "@electron-forge/plugin-auto-unpack-natives";
import { WebpackPlugin } from "@electron-forge/plugin-webpack";
import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { FuseV1Options, FuseVersion } from "@electron/fuses";

import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";

import { mainConfig } from "./webpack.main.config";
import { rendererConfig } from "./webpack.renderer.config";

const config: ForgeConfig =
{
    packagerConfig:
    {
        asar: true,
        name: "Name Slot",
        icon: "./public/icons/icon-executable",
        executableName: "name-slot",
        
        appVersion: "114.5.14",
        appBundleId: "come.name.slot",
        appCategoryType: "public.app-category.developer-tools",
        appCopyright: "Copyright text here!",

        win32metadata:
        {
            CompanyName: "Company Name",
            FileDescription: "File Description",
            OriginalFilename: "Original Filename",
            ProductName: "Product Name",
            InternalName: "Internal Name",
        }
    },
    rebuildConfig: {},
    makers:
    [
        new MakerSquirrel({}),
        new MakerZIP({}, ["darwin"]),
        new MakerRpm({}),
        new MakerDeb({})
    ],
    outDir: "./.build",
    plugins:
    [
        new AutoUnpackNativesPlugin({}),
        new WebpackPlugin
        ({
            mainConfig,
            renderer:
            {
                config: rendererConfig,
                nodeIntegration: true,
                entryPoints:
                [
                    {
                        html: "./source/renderer/index.html",
                        js: "./source/renderer/index.ts",
                        name: "main_window",
                        preload: { js: "./source/renderer/preload.ts" },
                    },
                ],
            },
        }),
        // Fuses are used to enable/disable various Electron functionality
        // at package time, before code signing the application
        new FusesPlugin
        ({
            version: FuseVersion.V1,
            [FuseV1Options.RunAsNode]: false,
            [FuseV1Options.EnableCookieEncryption]: true,
            [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
            [FuseV1Options.EnableNodeCliInspectArguments]: false,
            [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
            [FuseV1Options.OnlyLoadAppFromAsar]: true,
        }),
    ],
};

export default config;
