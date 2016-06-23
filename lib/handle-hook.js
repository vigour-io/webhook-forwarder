'use strict'

const Debug = require('debug')
const log = Debug('handle:hook')
log.warn = Debug('warn')
log.error = Debug('error')

const http = require('http')
const config = require('./config')
const subscribers = require('./subscribers')

module.exports = function handleHook (endpoint, req, res) {
  log(':', 'handleHook!', endpoint)
  req.on('data', doNothing) // 'end' does not fire without 'data'
  req.on('end', function () {
    log(':', 'request ended > respond with 200')
    res.writeHead(200)
    res.end()
  })

  endpoint = endpoint.slice(1)
  const endpointList = subscribers.list[endpoint]
  if (endpointList) {
    for (let url in endpointList) {
      forward(req, endpointList, url, endpoint)
    }
  }
}

function forward (req, endpointList, url, endpoint) {
  log(':', 'forwarding to', url)
  const parsedUrl = endpointList[url]
  log(':', 'pared url:', parsedUrl)
  const options = {
    method: 'POST',
    hostname: parsedUrl.hostname,
    port: parsedUrl.port,
    path: parsedUrl.path,
    headers: req.headers
  }

  const forwardReq = http.request(options, onForwardResponse)
  forwardReq.on('error', onForwardError)
  req.pipe(forwardReq)

  function onForwardResponse (forwardRes) {
    log(':', 'forward response code', forwardRes.statusCode)
    const status = forwardRes.statusCode
    if (status < 400) {
      log(':', 'forward was successful, reset strikes!')
      parsedUrl.strikes = config.strikes
    } else {
      onForwardError('statuscode: ' + status)
    }
  }

  function onForwardError (err) {
    log.warn(':', 'error forwarding hookshot on', endpoint, 'to', url)
    log.warn(':', err)
    const strikes = parsedUrl.strikes -= 1
    log.warn(':', 'strikes left', strikes)
    if (!strikes) {
      log.warn(':', 'removing subscriber')
      subscribers.remove(endpoint, url)
    }
  }
}

function doNothing () {}
