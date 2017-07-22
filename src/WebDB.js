class WebDB {
  constructor() {
    this.request = null
  }

  open = db => {
    this.request = window.indexedDB.open('MyTestDatabase', 3)
  }

  checkIfSupported = () => {
    if (!window || !window.indexedDB) {
      window.alert(
        "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
      )
      return false
    }
    return true
  }

  registerHandler = (event, handler) => {
    if (!this.request) console.err('Must open a database first')
    this.request[event] = handler
  }
}

export default WebDB
