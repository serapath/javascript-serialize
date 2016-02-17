'use strict'
var type = require('component-type')
var CircularJSON = require('circular-json')
var domserialize = typeof window !== 'undefined' ?
  require('dom-serialize')
  : noop
var stringify = require('fnjson/source/node_modules/_stringify')

function noop () {}
var m = 'Converting circular structure to JSON'

module.exports = javascriptserialize

function javascriptserialize () {
  return [].slice.call(arguments).map(function (item) {
    var x
    try {
      if (type(item) === 'arguments') item = [].slice.call(item)
      else if (type(item) === 'element') item = domserialize(item)
      else if (type(item) === 'nan') item = 'NaN'
      // @TODO: is it possible to enrich error messages?
      else if (type(item) === 'error') item = 'Error: '+item.message
      else if (type(item) === 'regexp') item = item+''
      for(var i in item) if (!item.hasOwnProperty(i)) item[i] = item[i]
      x = JSON.parse(stringify(item))
      x = CircularJSON.stringify(x)
      if (x === undefined) throw new Error()
      else item = JSON.stringify(JSON.parse(x), null, 2)
    } catch (e) {
      if (m === e.message) {
        try {
         x = CircularJSON.stringify(item)
         if (x === undefined) throw new Error()
         else item = JSON.stringify(JSON.parse(x), null, 2)
        } catch (e) {}
      }
      item = item+''
    } finally { return item }
  })
}
