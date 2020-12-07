import esbuild from 'esbuild'
import { denoCachePlugin } from './index.js'
import { readdirSync, rmdirSync } from 'fs'

process.env.DENO_DIR = 'cache'

async function test() {
  const result = await esbuild
    .build({
      stdin: {
        contents: `
        import * as React from 'https://cdn.skypack.dev/react@17.0.1'
        console.log(React.version)`,
      },
      bundle: true,
      plugins: [denoCachePlugin(/* 'cache' */)],
      minify: true,
      write: false,
    })
    .catch(() => process.exit(1))

  const dir = readdirSync('./cache/deps/https/cdn.skypack.dev')
  if (dir.join() === cache.join() && result.outputFiles[0].text.length === 7689) {
    console.log('✅')
  } else {
    console.error('❌')
  }
  rmdirSync('cache', { recursive: true })
}

const cache = [
  '4834c6ec23318b86dbda3e60f4b27c1e6dcc83530831a9037b48e561dd9aaf50',
  '4834c6ec23318b86dbda3e60f4b27c1e6dcc83530831a9037b48e561dd9aaf50.metadata.json',
  'dd2aa43bb2b8a969db6c96f31297b4a5952cde2658d25bfa472c97d3d649d363',
  'dd2aa43bb2b8a969db6c96f31297b4a5952cde2658d25bfa472c97d3d649d363.metadata.json',
  'f568d06d4c0672edc5dbfa79202f9c1f3591cc55d0102b8c85b3ae05558a0287',
  'f568d06d4c0672edc5dbfa79202f9c1f3591cc55d0102b8c85b3ae05558a0287.metadata.json',
]

test()
