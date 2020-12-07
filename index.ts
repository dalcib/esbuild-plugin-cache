import * as DenoCache from 'deno-cache'
import { readFile } from 'fs/promises'

export function denoCachePlugin(directory) {
  DenoCache.configure({ directory })
  return {
    name: 'deno-cache',
    setup(build) {
      build.onResolve({ filter: /^https?:\/\// }, async (args) => ({
        path: args.path,
        namespace: 'deno-cache',
      }))
      build.onResolve({ filter: /.*/, namespace: 'deno-cache' }, async (args) => ({
        path: new URL(args.path, args.importer).toString(),
        namespace: 'deno-cache',
      }))
      build.onLoad({ filter: /.*/, namespace: 'deno-cache' }, async (args) => {
        const file = await DenoCache.cache(args.path, undefined, 'deps')
        const contents = await readFile(file.path, 'utf8')
        return { contents }
      })
    },
  }
}
