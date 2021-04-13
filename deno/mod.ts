import { Plugin } from 'https://deno.land/x/esbuild@v0.11.10/mod.d.ts'
import * as Cache from 'https://deno.land/x/cache/mod.ts'
import { resolve } from 'https://deno.land/x/importmap/mod.ts'
import { join } from 'https://deno.land/std/path/mod.ts'

interface Config {
  importmap: { imports: { [key: string]: string } }
  directory: string
}

export function cache({ importmap = { imports: {} }, directory }: Config): Plugin {
  Cache.configure({ directory })
  return {
    name: 'deno-cache',
    setup(build) {
      build.onResolve({ filter: /.*/ }, async (args) => {
        const resolvedPath = resolve(args.path, importmap)
        if (resolvedPath.startsWith('http')) {
          return {
            path: resolvedPath,
            namespace: 'deno-cache',
          }
        }
        if (args.namespace === 'deno-cache') {
          return {
            path: new URL(resolvedPath, args.importer).toString(),
            namespace: 'deno-cache',
          }
        }
        return { path: join(args.resolveDir, resolvedPath) }
      })
      build.onLoad({ filter: /.*/, namespace: 'deno-cache' }, async (args) => {
        const file = await Cache.cache(args.path, undefined, 'deps')
        const contents = await Deno.readTextFile(file.path)
        return { contents }
      })
    },
  }
}
