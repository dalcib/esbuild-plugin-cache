# esbuild-plugin-cache

### Esbuid plugin to cache http/https imports. It also allows to use [import-maps](https://github.com/WICG/import-maps) .

> This plugin uses a port of [Deno cache](https://www.npmjs.com/package/deno-cache) to nodejs. It runs in nodejs and doesn't depend on Deno.

The plugin allows to use http/https imports in your webpage in development and bundle it in production without installing npm packages on node_modules.

It can provide a feature similar to Snowpack 3.0, the new [Streaming NPM Imports](https://www.snowpack.dev/posts/2020-12-03-snowpack-3-release-candidate), which allos to skip the NPM install and node_modules.

```javascript
//index.js
import * as React from 'https://cdn.skypack.dev/react@17.0.1'
console.log(React.version)
```

Or, using import-maps:

```javascript
//importmap.json
{"imports": {"react": "https://cdn.skypack.dev/react@17.0.1"}}

//index.js
import * as React from 'react'
console.log(React.version)
```

#### Build script:

```javascript
import * as esbuild from 'https://deno.land/x/esbuild@v0.11.10/mod.js'
import { cache } from 'https://deno.land/x/esbuild_plugin_cache@v0.2.1/mod.ts'

const importap = { imports: { react: 'https://cdn.skypack.dev/react@17.0.1' } }
//the use of import-maps is optional

esbuild
  .build({
    entryPoints: ['index.js'],
    bundle: true,
    outfile: 'bundle.js',
    plugins: [cache({ importmap, directory: './cache' })],
  })
  .catch(() => process.exit(1))
```

#### Config:

`config: {importmap: {imports:{[key: string]: string}}, directory: string}`

- `importmap`: Import-map object. Default: `{}`

- `directory`: Path or name for the directory of the cache. Default to Deno cache directory. Optionally the cache directory can be defined with DENO_DIR env variable: `process.env.DENO_DIR = 'cache'`.
