import { defineConfig } from "vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import netlify from "@netlify/vite-plugin-tanstack-start"
import viteReact from "@vitejs/plugin-react"
import viteTsConfigPaths from "vite-tsconfig-paths"
import tailwindcss from "@tailwindcss/vite"
import { nitro } from "nitro/vite"

// Netlify Dev no es compatible con el runtime de Bun (omit.default). En local se omite;
// en deploy Netlify define NETLIFY=true. Para emular Netlify en local: NETLIFY_DEV=true bun run dev
const enableNetlifyPlugin =
  process.env.NETLIFY === "true" || process.env.NETLIFY_DEV === "true"

const config = defineConfig({
  plugins: [
    nitro(),
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart(),
    ...(enableNetlifyPlugin ? [netlify()] : []),
    viteReact(),
  ],
})

export default config
