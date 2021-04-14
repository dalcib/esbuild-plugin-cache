import * as esbuild from 'https://deno.land/x/esbuild/mod.js'
//import { cache } from './../deno/mod.ts'
import { cache } from 'https://deno.land/x/esbuild_plugin_cache/mod.ts'

const importmap = {
  imports: {
    react: 'https://cdn.skypack.dev/react',
    'react-dom': 'https://cdn.skypack.dev/react-dom',
  },
}

esbuild
  .build({
    entryPoints: ['./index.tsx'],
    bundle: true,
    format: 'esm',
    plugins: [cache({ importmap, directory: './cache' })],
    outfile: 'bundle.js',
  })
  .then((result, error) => {
    esbuild.stop()
  })
