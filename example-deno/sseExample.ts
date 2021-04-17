const INDEX_HTML = `<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <h1>Hello world!</h1>
    <ul id="events"></ul>
    <script>
      const sse = new EventSource("/sse");
      const ul = document.getElementById("events");
      sse.onmessage = (evt) => {
        const li = document.createElement("li");
        li.textContent = \`message: \${evt.data}\`;
        ul.appendChild(li);
      };
    </script>
  </body>
</html>
`

const encoder = new TextEncoder()

let body

function handleRequest({ request, respondWith }: Deno.RequestEvent) {
  let respond: (response: Response) => void
  const p = new Promise<Response>((r) => (respond = r))
  const respondWithPromise = respondWith(p)
  if (request.url === '/sse') {
    let id = 0
    let interval = 0
    body = new ReadableStream({
      start(controller) {
        console.log('start')
        interval = setInterval(() => {
          controller.enqueue(
            encoder.encode(`event: message\nid: ${++id}\ndata: { "hello": "deno" }\n\n`)
          )
        }, 1000)
      },
      cancel() {
        console.log('cancelled')
        clearInterval(interval)
      },
    })
    respond!(
      new Response(body, {
        headers: {
          Connection: 'Keep-Alive',
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Keep-Alive': `timeout=${Number.MAX_SAFE_INTEGER}`,
        },
      })
    )
  } else {
    respond!(
      new Response(INDEX_HTML, {
        headers: {
          'content-type': 'text/html',
        },
      })
    )
  }
  return respondWithPromise
}

for await (const conn of Deno.listen({ port: 8000 })) {
  const httpConn = Deno.serveHttp(conn)
  ;(async () => {
    for await (const requestEvent of httpConn) {
      try {
        await handleRequest(requestEvent)
        //await respondWith(new Response(body))
      } catch (error) {
        console.error('%cResponse failed%c:', 'color: #909000', '', error)
      }
    }
  })()
}

console.log('started')
