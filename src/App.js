import { h, Component } from 'preact'
import idb from 'idb'
import WebDB from './WebDB'
import Console from './Console'
import Table from './Table'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.db = null
    this.state = {
      console: ['Initialized console.'],
      items: [],
      dbName: 'Test'
    }
  }

  componentDidMount() {}

  log = message => {
    this.setState({
      console: [...this.state.console, message]
    })
  }

  handleCheck = () => {
    if (WebDB.checkIfSupported()) {
      this.log('IndexedDB is supported!')
    } else {
      this.log('IndexedDB is not supported.')
    }
  }

  handleInputChange = event => {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  init = (dbName, objectStoreName = 'Test') => {
    this.log(`Creating database '${dbName}'`)
    this.db = idb.open(dbName, 1, upgradeDb => {
      if (!upgradeDb.objectStoreNames.contains(objectStoreName)) {
        this.log(`Creating object store '${objectStoreName}' in '${dbName}'`)
        upgradeDb.createObjectStore(objectStoreName, { keyPath: 'name' })
      }
    })
  }

  open = dbName => {
    return idb.open(dbName, 1)
  }

  getAll = (dbName, objectStoreName = 'Test') => {
    this.open(dbName)
      .then(db => {
        const tx = db.transaction(objectStoreName, 'readonly')
        const store = tx.objectStore(objectStoreName)
        this.log(
          `Getting all from object store '${objectStoreName}' in '${dbName}'...`
        )
        return store.getAll()
      })
      .then(items => {
        this.log(`    ${items.length} objects returned`)
        this.setState({ items })
      })
  }

  add = (dbName, data, objectStoreName = 'Test') => {
    this.open(dbName)
      .then(db => {
        const tx = db.transaction(objectStoreName, 'readwrite')
        const store = tx.objectStore(objectStoreName)
        const item = {
          ...data
        }
        this.log(`Writing an object to '${objectStoreName}' in '${dbName}'...`)
        store.add(item)
        return tx.complete
      })
      .then(() => {
        this.getAll(dbName, objectStoreName)
      })
  }

  clear = (dbName, objectStoreName = 'Test') => {
    if (!confirm('Are you sure?')) return
    this.open(dbName)
      .then(db => {
        const tx = db.transaction(objectStoreName, 'readwrite')
        tx.objectStore(objectStoreName).clear()
        this.log(`Clearing data from '${objectStoreName}' in '${dbName}'...`)
        return tx.complete
      })
      .then(() => {
        this.getAll(dbName, objectStoreName)
      })
  }

  render() {
    return (
      <div className="App">
        <div className="container">
          <div className="App-header">
            <h2>WebDB in Preact</h2>
          </div>
          <p>
            <strong>IndexedDB</strong> is an indexed NoSQL key-value store that
            follows the{' '}
            <a href="https://www.w3.org/Security/wiki/Same_Origin_Policy">
              same-origin policy
            </a>.
          </p>
          <blockquote>
            IndexedDB is a low-level API for client-side storage of significant
            amounts of structured data, including files/blobs. This API uses
            indexes to enable high performance searches of this data. While DOM
            Storage is useful for storing smaller amounts of data, it is less
            useful for storing larger amounts of structured data. IndexedDB
            provides a solution.
          </blockquote>
          <button onClick={this.handleCheck}>
            Check if IndexDB is supported
          </button>
          <p />
          <input
            name="dbName"
            type="text"
            placeholder="Database Name"
            onChange={this.handleInputChange}
          />
          <input
            name="objectStoreName"
            type="text"
            placeholder="Store Name"
            onChange={this.handleInputChange}
          />
          <button
            onClick={() => {
              this.init(this.state.dbName)
            }}
          >
            Create DB
          </button>
          <button
            onClick={() => {
              this.getAll(this.state.dbName)
            }}
          >
            Fetch all data
          </button>
          <p />

          <input
            name="newObjectKey"
            type="text"
            placeholder="Key"
            onChange={this.handleInputChange}
          />
          <input
            name="newObjectValue"
            type="text"
            placeholder="Value"
            onChange={this.handleInputChange}
          />

          <button
            onClick={() => {
              this.add(this.state.dbName, {
                name: this.state.newObjectKey,
                value: this.state.newObjectValue
              })
            }}
          >
            Add Object
          </button>

          <p />

          <button
            onClick={() => {
              this.clear(this.state.dbName)
            }}
          >
            Clear DB
          </button>
          <p />
          <Table rows={this.state.items} />
          <Console data={this.state.console} />
          <h2>Resources</h2>
          <ul>
            <li>
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Basic_Concepts_Behind_IndexedDB"
                target="_blank"
              >
                Basic Concepts Behind IndexedDB (MDN)
              </a>
            </li>
            <li>
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB"
                target="_blank"
              >
                Using IndexedDB (MDN)
              </a>
            </li>
            <li>
              <a
                href="https://developers.google.com/web/ilt/pwa/working-with-indexeddb"
                target="_blank"
              >
                Working with IndexedDB
              </a>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

export default App
