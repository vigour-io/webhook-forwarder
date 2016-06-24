'use strict'
const log = require('debug')('main')
const config = require('./lib/config')
const server = require('./lib/server')
const port = config.port

log('starting server', 'port', port)
server.listen(port)
