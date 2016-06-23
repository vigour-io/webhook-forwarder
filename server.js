'use strict'

const http = require('http')
const urlUtil = require('url')
const querystring = require('querystring')

const handleSubscribe = require('./handle-subscribe')
const handleHook = require('./handle-hook')
const subscribers = require('./subscribers')

const server = module.exports = http.createServer()
const SUBSCRIBE = '/subscribe'
const STATUS = '/status'

server.on('request', function (req, res) {
  const request = urlUtil.parse(req.url)
  const endpoint = request.pathname

  console.log('got request on', endpoint)

  if (req.method === 'POST') { /* hook request */
    handleHook(endpoint, req, res)
  } else if (req.method === 'GET') {
    if (endpoint === SUBSCRIBE) { /* subscribe request */
      console.log('subscribe request', request)
      if (request.query) {
        const query = querystring.parse(request.query)
        handleSubscribe(query, req, res)
      } else {
        respond(400)
      }
    } else if (endpoint === STATUS) { /* status request */
      respond(200, JSON.stringify(subscribers.list))
    } else { /* random GET request */
      respond(200)
    }
  } else { /* random other method request */
    respond(200)
  }

  function respond (code, str) {
    res.writeHead(code)
    if (str) { res.write(str) }
    res.end()
  }
})

server.on('error', function (err) {
  console.log('server error', err)
})
