import { h, Component } from 'preact'
import WebDB from './WebDB'
import Console from './Console'
import Table from './Table'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.db = new WebDB()
    this.state = {
      console: 'Initialize console'
    }
  }

  componentDidMount() {}

  handleInit = () => {
    this.db.open('TestDB')

    this.db.registerHandler('onsuccess', e => {
      console.log('db', e.target.result)
    })
    this.db.registerHandler('onerror', () => {
      alert('error!')
    })
  }

  render() {
    return (
      <div className="App">
        <div className="container">
          <div className="App-header">
            <h2>WebDB in Preact</h2>
          </div>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
          <Table />
          <input type="text" placeholder="Database name" />
          <button onClick={this.handleInit}>Initialize</button>
          <button onClick={() => WebDB.hi()}>Say Hi</button>
          <Console data={this.state.console} />
        </div>
      </div>
    )
  }
}

export default App
