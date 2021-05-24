# esbuild-plugin-cache

### Esbuid plugin to cache http/https imports.

The plugin allows to use http/https imports without installing npm packages on node_modules.

It also allows to use [import-maps](https://github.com/WICG/import-maps) .

It can provide a feature similar to Snowpack 3.0, the new [Streaming NPM Imports](https://www.snowpack.dev/posts/2020-12-03-snowpack-3-release-candidate), which allos to skip the NPM install and node_modules.

```javascript
//index.js
import React from 'https://cdn.skypack.dev/react@17.0.1'
console.log(React.version)
```

#### Build script:

```javascript
//build.js
import * as esbuild from 'https://deno.land/x/esbuild/mod.js'
import { cache } from 'https://deno.land/x/esbuild_plugin_cache/mod.ts'

esbuild
  .build({
    entryPoints: ['index.js'],
    bundle: true,
    outfile: 'bundle.js',
    plugins: [cache()],
  })
  .catch(() => process.exit(1))
```

#### Config:

`config: {importmap: {imports:{[key: string]: string}}, directory: string}`

- `importmap`: Import-map object. Default: `{}`

- `directory`: Path or name for the directory of the cache. Default to Deno cache directory. Optionally the cache directory can be defined with DENO_DIR env variable: `process.env.DENO_DIR = 'cache'`.

#### Using with `importmap`

```javascript
//index.js
import React from 'react'
console.log(React.version)
```

```javascript
//build.js
import * as esbuild from 'https://deno.land/x/esbuild/mod.js'
import { cache } from 'https://deno.land/x/esbuild_plugin_cache/mod.ts'

const importmap = {
  imports: {
    react: 'https://cdn.skypack.dev/react@17.0.1',
  },
}

esbuild
  .build({
    entryPoints: ['index.js'],
    bundle: true,
    outfile: 'bundle.js',
    plugins: [cache({ importmap, directory: './cache' })],
  })
  .catch(() => process.exit(1))
```
