import React from 'react'
import ReactDOM from 'react-dom'

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
      </header>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
