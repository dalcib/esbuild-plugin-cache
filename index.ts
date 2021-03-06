import { Plugin, Loader } from './node_modules/esbuild/lib/main'
import * as DenoCache from 'deno-cache'
import { readFile } from 'fs/promises'
import { resolve } from 'deno-importmap'
import { join } from 'path'
import { createRequire } from 'module'
const locaRequire = createRequire(import.meta.url)

interface Config {
  importmap?: { imports: { [key: string]: string } }
  directory?: string
}

export function cache({ importmap = { imports: {} }, directory }: Config): Plugin {
  DenoCache.configure({ directory })
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
        if (resolvedPath !== args.path) {
          return resolvedPath.match(/^[./]/)
            ? { path: join(args.resolveDir, resolvedPath) }
            : { path: locaRequire.resolve(resolvedPath) }
        }
      })
      build.onLoad({ filter: /.*/, namespace: 'deno-cache' }, async (args) => {
        const file = await DenoCache.cache(args.path, undefined, 'deps')
        const contents = await readFile(file.path, 'utf8')
        const ext = file.meta.url.split('.').pop()
        const loader = ext.match(/"j|tsx?$/) ? ext : ('js' as Loader)
        return { contents, loader }
      })
    },
  }
}
