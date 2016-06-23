'use strict'

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
  endpointList[url] = true
}

function remove (subscriber) {
  const url = subscriber.url
  const endpoint = subscriber.endpoint
  const endpointList = list[endpoint]
  if (endpointList && endpointList[url]) {
    delete endpointList[url]
  }
}

function load () {
  // load subscribers from storage
}
