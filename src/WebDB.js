// import idb from 'idb'

class WebDB {
  static checkIfSupported = () => {
    const capabilities = {}
    if (!('indexedDB' in window)) {
      console.log("This browser doesn't support IndexedDB")
      return null
    }
    capabilities.webkitGetDatabaseNames = !!indexedDB.webkitGetDatabaseNames

    if (capabilities.webkitGetDatabaseNames) {
      indexedDB.webkitGetDatabaseNames().onsuccess = function(sender, args) {
        console.log(sender.target.result)
      }
    }
    return capabilities
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
