'use strict'

const Debug = require('debug')
const log = Debug('handle:subscribe')
log.error = Debug('error')

const subscribers = require('./subscribers')

module.exports = function handleSubscribe (query, req, res) {
  log(':', 'add subscriber and respond 200')
  subscribers.add(query)
  res.writeHead(200)
  res.write(JSON.stringify(query))
  res.end()
}
