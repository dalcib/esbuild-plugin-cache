# esbuild-plugin-deno-cache

### Esbuid plugin to use Deno cache to http/https imports.

It allows to use http/https imports in your webpage in development and bundle it in production without installing npm packages on node_modules.

```javascript
//index.js
import * as React from 'https://cdn.skypack.dev/react@17.0.1'
console.log(React.version)
```

Using with [esbuild-plugin-import-map](https://www.npmjs.com/package/esbuild-plugin-import-map), it can provide a feature similar to Snowpack 3.0, the new [Streaming NPM Imports](https://www.snowpack.dev/posts/2020-12-03-snowpack-3-release-candidate).


#### Build script:
```javascript
import esbuild from 'esbuild'
import { denoCachePlugin } from './index.js'

esbuild
    .build({
      entryPoints: ['index.js'],
      bundle: true,
      outfile: 'bundle.js',
      plugins: [denoCachePlugin('./cache')],
    })
    .catch(() => process.exit(1))
```    

#### Config:

Path or name for the directory of the cache.
Default to Deno cache directory:

`denoCachePlugin('./cache')`

Optionally the cache directory can be defined with DENO_DIR env variable:

`process.env.DENO_DIR = 'cache'`
