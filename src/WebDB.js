// import idb from 'idb'

class WebDB {
  static checkIfSupported = () => {
    if (!('indexedDB' in window)) {
      console.err("This browser doesn't support IndexedDB")
      return false
    }
    return true
  }

  constructor() {
    this.request = null
  }

  // open = dbName => {
  //   return idb.open(dbName, 1, upgradeDB => {

  //   })
  // }

  registerHandler = (event, handler) => {
    if (!this.request) console.err('Must open a database first')
    this.request[event] = handler
  }
}

export default WebDB
