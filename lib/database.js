'use strict'

const Debug = require('debug')
const log = Debug('database')
log.error = Debug('error')

const DEFAULT_HOST = '127.0.0.1'
const DEFAULT_PORT = 6379

const redis = require('redis')
const dbConfig = require('./config').database
const subscribers = require('./subscribers')

const url = dbConfig.url
const password = dbConfig.password
const label = dbConfig.label
const prefix = label + '/'

if (url) {
  var host
  var port
  log(':', 'url:', url, 'password:', password)
  if (url === 'true') {
    host = DEFAULT_HOST
    port = DEFAULT_PORT
  } else {
    const splitted = url.split(':')
    host = splitted[0].replace(/https?:\/\//, '')
    port = splitted[1] || DEFAULT_PORT
  }
  const options = {host, port}
  if (password) {
    options.password = password
  }
  log(':', options)
  const client = redis.createClient(options)
  const db = { client, add, remove, load }
  client.on('ready', function onReady () {
    db.load()
  })
  client.on('error', function onError (err) {
    log.error('database', 'Redis client error:', err)
  })
  module.exports = db
} else {
  log(':', 'not enabled')
  module.exports = {
    read: doNothing,
    add: doNothing,
    remove: doNothing
  }
}

function add (subscriber) {
  log(':', 'add subscriber', subscriber)
  const setKey = prefix + subscriber.endpoint
  const client = this.client
  client.sadd(label, setKey)
  client.sadd(setKey, subscriber.url)
}

function remove (subscriber) {
  log(':', 'remove subscriber', subscriber)

  const setKey = prefix + subscriber.endpoint
  const client = this.client
  client.srem(setKey, subscriber.url)
  // TODO: check if set is empty, if so remove setkey from meta set
}

function load () {
  log(':', 'load subscribers')
  const client = this.client
  client.smembers(label, gotSets)
  function gotSets (err, sets) {
    if (err) {
      log.error(':', 'error reading meta set while loading subscribers:', err)
    } else {
      log(':', 'read these keys for endpoint sets', sets)
      for (let setkey of sets) {
        let endpoint = setkey.replace(prefix, '')
        log(':', 'endpoint', endpoint)
        client.smembers(setkey, function gotSet (err, res) {
          if (err) {
            log.error(':',
              'error reading a url set while loading subscribers:', err
            )
          } else {
            log(':', 'read those members', res)
            for (let url of res) {
              log(':', 'url', url)
              subscribers.add({ endpoint, url })
            }
          }
        })
      }
    }
  }
}

function doNothing () {}
