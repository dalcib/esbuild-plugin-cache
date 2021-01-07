import esbuild from 'esbuild'
import { denoCachePlugin } from '../index.js'
import importmap from './importmap.json'

async function build() {
  const result = await esbuild
    .build({
      entryPoints: ['./index.js'],
      bundle: true,
      format: 'esm',
      plugins: [denoCachePlugin({ importmap, directory: './cache' })],
      outfile: 'bundle.js',
      loader: { '.js': 'jsx' },
    })
    .catch(() => process.exit(1))
}

build()
