export const localStorageMock = (function () {
  let store = {};
  return {
    getItem: function (key) {
      //return JSON.parse(store[key])
      //if (key in store) {
      return JSON.stringify(store[key])
      //}
      //return null
    },
    setItem: function (key, value) {
      store[key] = value.toString()
    },
    clear: function () {
      store = {}
    },
    removeItem: function (key) {
      delete store[key]
    }
  }
})()