import esbuild from 'esbuild'
import { cache } from './index.js'
import { readdirSync, rmdirSync } from 'fs'

//process.env.DENO_DIR = 'cache'

const importmap = {
  imports: {
    mimex: 'delayed-stream',
    'react-dom': 'https://cdn.skypack.dev/react-dom@17.0.1',
  },
}

async function test(del) {
  const result = await esbuild
    .build({
      stdin: {
        contents: `
        import * as React from 'https://cdn.skypack.dev/react@17.0.1'
        import * as ReactDom from 'react-dom'
        import aaa from 'mimex' 
        console.log(React.version)`,
      },
      bundle: true,
      plugins: [cache({ importmap, directory: 'cache' })],
      minify: true,
      write: false,
      platform: 'node',
    })
    .catch((error) => {
      console.log(error)

      process.exit(1)
    })

  const dir = readdirSync('./cache/deps/https/cdn.skypack.dev')
  if (dir.sort().join() === caches.sort().join() && result.outputFiles[0].text.length === 135001) {
    console.log('✅')
  } else {
    console.error('❌')
  }
  if (del) rmdirSync('cache', { recursive: true })
}

const caches = [
  '482b635d347be130833b059a44f2894d10fa66919ca87746dc387c84cdcdf540',
  '482b635d347be130833b059a44f2894d10fa66919ca87746dc387c84cdcdf540.metadata.json',
  'a1234b4c91d3a9296e81e2b96755b491b1ffb7c1a12576e47fb12bc5658908e5',
  'a1234b4c91d3a9296e81e2b96755b491b1ffb7c1a12576e47fb12bc5658908e5.metadata.json',
  'dd2aa43bb2b8a969db6c96f31297b4a5952cde2658d25bfa472c97d3d649d363',
  'dd2aa43bb2b8a969db6c96f31297b4a5952cde2658d25bfa472c97d3d649d363.metadata.json',
  'b398f091139fb7be24be830ee27461a47bc95aa514493f9f0680d487fb91f0d6',
  'b398f091139fb7be24be830ee27461a47bc95aa514493f9f0680d487fb91f0d6.metadata.json',
  'b77a893c7daedce9ab5f9bfd8de4df3c380694ea3cb9576b5a98d50666f9b8c5',
  'b77a893c7daedce9ab5f9bfd8de4df3c380694ea3cb9576b5a98d50666f9b8c5.metadata.json',
  'f3ae044f78873b16020ad754f52143bfda6146fc282b56a88075d0c143c7daaa',
  'f3ae044f78873b16020ad754f52143bfda6146fc282b56a88075d0c143c7daaa.metadata.json',
]

test(false)
