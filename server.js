'use strict'

const http = require('http')

var server = module.exports = http.createServer()

server.on('request', function (req, res) {
  if (req.method !== 'OPTIONS') {
    console.log('got a request!', req.path)
  }
  res.writeHead(200)

  res.write('this is simple-http-example with id ' + service.id.val)
  res.end()
})

server.on('error', function (err) {
  console.log('server error', err)
})
