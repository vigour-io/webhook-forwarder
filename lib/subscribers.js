'use strict'

const Debug = require('debug')
const log = Debug('subscribers')
log.error = Debug('error')

const urlUtil = require('url')

const list = {}

module.exports = {
  list, add, remove, load
}

function add (subscriber) {
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
}

function remove (endpoint, url) {
  log(':', 'remove subscriber', endpoint, url)
  const endpointList = list[endpoint]
  if (endpointList && endpointList[url]) {
    delete endpointList[url]
    if (!Object.keys(endpointList)) {
      delete list[endpoint]
    }
  }
}

function load () {
  log(':', 'load subscribers from database')
  log.error(':', 'load not implemented')
}