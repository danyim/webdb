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
      dbName: 'WebDB',
      objectStoreName: ''
    }
  }

  componentDidMount() {}

  log = message => {
    this.setState({
      console: [...this.state.console, message]
    })
  }

  handleCheck = () => {
    const check = WebDB.checkIfSupported()
    if (check) {
      this.log(
        'IndexedDB is supported.\r\n' +
          Object.keys(check)
            .map(v => `  ${v}: ${check[v] ? 'Supported' : 'Not Supported'}`)
            .join(',')
      )
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

  init = (dbName, objectStoreName) => {
    if (dbName === '' || objectStoreName === '') {
      this.log(`Error: Object store name can't be null`)
      return false
    }
    this.log(`Creating '${objectStoreName}' in '${dbName}'...`)
    this.db = idb
      .open(dbName, 1, upgradeDb => {
        console.log('in upgrade')
        if (!upgradeDb.objectStoreNames.contains(objectStoreName)) {
          upgradeDb.createObjectStore(objectStoreName, { keyPath: 'key' })
          this.log(`Object store '${objectStoreName}' in '${dbName}' created!`)
        } else {
          this.log(
            `Object store '${objectStoreName}' in '${dbName}' already exists!`
          )
        }
      })
      // .then(data => {
      //   console.log(data)
      // })
      .catch(() => {
        this.log(
          `Error creating object store '${objectStoreName}' in '${dbName}' created!`
        )
      })
  }

  open = dbName => {
    return idb.open(dbName, 1)
  }

  getAll = (dbName, objectStoreName) => {
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
        console.log('Fetching items', items)
      })
  }

  add = (dbName, objectStoreName, data) => {
    if (
      this.state.objectStoreName === objectStoreName &&
      this.state.items.findIndex(v => v.key === data.key) >= 0
    ) {
      this.log(
        `Write object failed. Key '${data.key}' exists in '${objectStoreName}'.`
      )
      return false
    }
    this.open(dbName)
      .then(db => {
        const tx = db.transaction(objectStoreName, 'readwrite')
        const store = tx.objectStore(objectStoreName)
        const item = {
          ...data
        }
        this.log(
          `Trying to write an object to '${objectStoreName}' in '${dbName}'...`
        )
        store.add(item)
        return tx.complete
      })
      .then(() => {
        this.getAll(dbName, objectStoreName)
      })
      .catch(err => {
        console.log('Error', err)
      })
  }

  clear = (dbName, objectStoreName) => {
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
        <header>
          <div className="container">
            <div className="App-header">
              <h2>WebDB in Preact</h2>
            </div>
          </div>
        </header>
        <div className="container">
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
          <label htmlFor="dbName">
            <span>Database Name</span>
            <input
              name="dbName"
              type="text"
              onChange={this.handleInputChange}
              defaultValue={this.state.dbName}
            />
          </label>

          <label htmlFor="objectStoreName">
            <span>Object Store Name</span>
            <input
              name="objectStoreName"
              type="text"
              defaultValue={this.state.objectStoreName}
              onChange={this.handleInputChange}
            />
          </label>
          <button
            disabled={
              this.state.dbName === '' || this.state.objectStoreName === ''
            }
            onClick={() => {
              this.init(this.state.dbName, this.state.objectStoreName)
            }}
          >
            Create DB
          </button>
          <button
            onClick={() => {
              this.getAll(this.state.dbName, this.state.objectStoreName)
            }}
          >
            Fetch all data
          </button>
          <p />

          <label htmlFor="newObjectKey">
            <span>Key</span>
            <input
              name="newObjectKey"
              type="text"
              onChange={this.handleInputChange}
            />
          </label>

          <label htmlFor="newObjectValue">
            <span>Value</span>
            <input
              name="newObjectValue"
              type="text"
              onChange={this.handleInputChange}
            />
          </label>

          <button
            onClick={() => {
              this.add(this.state.dbName, this.state.objectStoreName, {
                key: this.state.newObjectKey,
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
