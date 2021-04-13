// deno run --allow-env --allow-read --allow-write --allow-net --allow-run  server.js
import * as esbuild from 'https://deno.land/x/esbuild/mod.js'
import { cache } from './../deno/mod.ts'
import { listenAndServe } from 'https://deno.land/std/http/server.ts'

const importmap = {
  imports: {
    react: 'https://cdn.skypack.dev/react',
    'react-dom': 'https://cdn.skypack.dev/react-dom',
  },
}
const clients = []

esbuild
  .build({
    entryPoints: ['./index.tsx'],
    bundle: true,
    format: 'esm',
    plugins: [cache({ importmap, directory: './cache' })],
    outfile: 'bundle.js',
    banner: { js: ' (() => new EventSource("/esbuild").onmessage = () => location.reload())();' },
    watch: {
      onRebuild(error, result) {
        clients.forEach((res) => res.write('data: update\n\n'))
        clients.length = 0
        console.log(error ? error : '...')
      },
    },
  })
  .then((result, error) => {})
  .catch(() => process.exit(1))

esbuild.serve({ servedir: './' }, {}).then(() => {
  listenAndServe({ port: 3000 }, async (req) => {
    const { url, method, headers } = req
    if (url === '/esbuild') {
      req.write = (data) => {
        req.w.write(new TextEncoder().encode(data))
        req.w.flush()
      }
      req.write(
        'HTTP/1.1 200 OK\r\nConnection: keep-alive\r\nCache-Control: no-cache\r\nContent-Type: text/event-stream\r\n\r\n'
      )
      return clients.push(req)
    }
    const path = ~url.split('/').pop().indexOf('.') ? url : `/index.html`
    const res = await fetch('http://localhost:8000' + path, { method, headers })
    const text = await res.text()
    await req.respond({ body: text, statusCode: res.statusCode, headers: res.headers })
  })
  setTimeout(() => {
    if (clients.length === 0) Deno.run({ cmd: ['cmd', '/c', 'start', `http://localhost:3000`] })
  }, 2000)
})
