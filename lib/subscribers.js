'use strict'

const Debug = require('debug')
const log = Debug('subscribers')
log.error = Debug('error')

const urlUtil = require('url')
const db = require('./database')

const list = exports.list = {}

exports.add = function add (subscriber, fromDb) {
  log(':', 'add subscriber', subscriber)
  const url = subscriber.url
  const endpoint = subscriber.endpoint
  var endpointList = list[endpoint]
  if (!endpointList) {
    list[endpoint] = endpointList = {}
  }
  const parsedUrl = urlUtil.parse(url)
  parsedUrl.strikes = 10
  endpointList[url] = parsedUrl
  if (!fromDb) {
    db.add(subscriber)
  }
}

exports.remove = function remove (endpoint, url) {
  log(':', 'remove subscriber', endpoint, url)
  const endpointList = list[endpoint]
  if (endpointList && endpointList[url]) {
    delete endpointList[url]
    if (!Object.keys(endpointList)) {
      delete list[endpoint]
    }
  }
  db.remove({ endpoint, url })
}
