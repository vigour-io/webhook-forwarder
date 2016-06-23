'use strict'

const urlUtil = require('url')

const list = {}

module.exports = {
  list, add, remove, load
}

function add (subscriber) {
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
  const endpointList = list[endpoint]
  if (endpointList && endpointList[url]) {
    delete endpointList[url]
  }
}

function load () {
  // load subscribers from database
}
