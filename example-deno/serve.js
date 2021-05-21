// deno run --unstable --allow-env --allow-read --allow-write --allow-net --allow-run  serve.js
import * as esbuild from 'https://deno.land/x/esbuild/mod.js'
import { cache } from './../deno/mod.js'
//import { listenAndServe, serve } from 'https://deno.land/std/http/server.ts'

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
        clients.forEach((controller) => {
          controller.enqueue(new TextEncoder().encode('data: update\n\n'))
          controller.close()
        })
        clients.length = 0
        console.log(error ? error : '...')
      },
    },
  })
  .then((result, error) => {})
  .catch(() => process.exit(1))

const sseResponse = new Response(
  new ReadableStream({
    start(controller) {
      console.log('start')
      clients.push(controller)
    },
  }),
  {
    status: 200,
    headers: {
      Connection: 'Keep-Alive',
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Keep-Alive': `timeout=${Number.MAX_SAFE_INTEGER}`,
    },
  }
)

esbuild.serve({ servedir: './' }, {}).then(async () => {
  for await (const conn of Deno.listen({ port: 3000 })) {
    ;(async () => {
      for await (const { request, respondWith } of Deno.serveHttp(conn)) {
        const { url } = request
        if (url === '/esbuild') {
          await respondWith(sseResponse)
        } else {
          const path = ~url.split('/').pop().indexOf('.') ? url : `/index.html` //for PWA with router
          const res = await fetch('http://localhost:8000' + path, request)
          const text = await res.text()
          try {
            await respondWith(res)
          } catch (error) {
            console.error('%cResponse failed%c:', 'color: #909000', '', error)
          }
        }
      }
    })()
  }
  setTimeout(() => {
    const open = { darwin: ['open'], linux: ['xdg-open'], windows: ['cmd', '/c', 'start'] }
    if (clients.length === 0) Deno.run({ cmd: [...open[Deno.build.os], 'http://localhost:3000'] })
  }, 2000) //open the default browser only if it is not opened yet
})
