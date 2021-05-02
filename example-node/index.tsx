import React from 'react'
import ReactDOM from 'react-dom'
import { globToRegExp } from 'https://deno.land/std@0.95.0/path/glob.ts'

const regex = globToRegExp('foo/**/*.json', {
  flags: 'g',
  extended: true,
  globstar: true,
  caseInsensitive: false,
})

export const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Esbuild cache plugin.</h1>
        <p>
          Edit <code>index.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer">
          Learn React
        </a>
        <pre>{regex.toString()}</pre>
      </header>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
