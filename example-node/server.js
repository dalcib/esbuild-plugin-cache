import esbuild from 'esbuild'
import { createServer, request } from 'http'
import { spawn } from 'child_process'
import { cache } from '../index.js'

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
        console.log(clients)
        clients.forEach((res) => res.write('data: update\n\n'))
        clients.length = 0
        console.log(error ? error : '...')
      },
    },
  })
  .then((result, error) => {})
  .catch(() => process.exit(1))

esbuild.serve({ servedir: './' }, {}).then(() => {
  createServer((req, res) => {
    const { url, method, headers } = req
    if (req.url === '/esbuild')
      return clients.push(
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        })
      )
    const path = ~url.split('/').pop().indexOf('.') ? url : `/index.html`
    req.pipe(
      request({ hostname: '0.0.0.0', port: 8000, path, method, headers }, (prxRes) => {
        res.writeHead(prxRes.statusCode, prxRes.headers)
        prxRes.pipe(res, { end: true })
      }),
      { end: true }
    )
  }).listen(3000)
  setTimeout(() => {
    if (clients.length === 0) spawn('cmd', ['/c', 'start', `http://localhost:3000`])
  }, 1000)
})
