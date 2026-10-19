import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerDMG } from "@electron-forge/maker-dmg";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { FusesPlugin } from "@electron-forge/plugin-fuses";
import type { ForgeConfig } from "@electron-forge/shared-types";
import { FuseV1Options, FuseVersion } from "@electron/fuses";

// The packaged app holds only what runs: the compiled main process, its icons and its runtime dependencies.
const SHIPPED = /^\/(package\.json|LICENSE|dist|assets|node_modules)(\/|$)/;

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    executableName: "remix-ide-desktop",
    appBundleId: "repair.ayers.remix-ide-desktop",
    appCategoryType: "public.app-category.developer-tools",
    appCopyright: "Copyright Ayers Electronics Inc",
    icon: "assets/icon",
    ignore: (file) => file !== "" && !SHIPPED.test(file),
  },
  makers: [
    new MakerSquirrel({
      name: "RemixIDEDesktop",
      authors: "Ayers Electronics",
      setupIcon: "assets/icon.ico",
    }),
    new MakerDMG({ icon: "assets/icon.icns" }),
    new MakerZIP({}, ["darwin", "linux"]),
    new MakerDeb({
      options: {
        maintainer: "Zachariah Ayers",
        homepage: "https://github.com/ZachariahAyers/remix.ide",
        icon: "assets/icon.png",
        categories: ["Development"],
      },
    }),
  ],
  plugins: [
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
      [FuseV1Options.GrantFileProtocolExtraPrivileges]: false,
    }),
  ],
};

export default config;
