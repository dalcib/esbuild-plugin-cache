import * as esbuild from 'esbuild'
import { cache } from './../index.js'

const importmap = {
  imports: {
    react: 'https://cdn.skypack.dev/react',
    'react-dom': 'https://cdn.skypack.dev/react-dom',
  },
}

esbuild
  .build({
    entryPoints: ['./index.jsx'],
    bundle: true,
    format: 'esm',
    plugins: [cache({ importmap, directory: './cache' })],
    outfile: 'deno-bundle.js',
    loader: { '.js': 'jsx' },
  })
  .catch(() => process.exit(1))
