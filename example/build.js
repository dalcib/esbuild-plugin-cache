import esbuild from 'esbuild'
import { cache } from '../index.js'
import importmap from './import_map.json'

async function build() {
  const result = await esbuild
    .build({
      entryPoints: ['./app.jsx'],
      bundle: true,
      format: 'esm',
      plugins: [cache({ importmap, directory: './cache' })],
      outfile: 'bundle.js',
      loader: { '.js': 'jsx' },
    })
    .catch(() => process.exit(1))
}

build()
