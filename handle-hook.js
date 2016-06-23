'use strict'

const subscribers = require('./subscribers')
const http = require('http')

module.exports = function handleHook (endpoint, req, res) {
  console.log('handleHook!', endpoint)
  req.on('data', function () {
    console.log('???')
  })
  req.on('end', function () {
    console.log('request ended > respond with 200')
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
  console.log('forward to', url)
  const parsedUrl = endpointList[url]
  console.log('forward to', parsedUrl)
  const options = {
    method: 'POST',
    hostname: parsedUrl.hostname,
    port: parsedUrl.port,
    path: parsedUrl.path,
    headers: req.headers
  }

  const forwardReq = http.request(options, onForwardResponse)
  req.pipe(forwardReq)

  function onForwardResponse (forwardRes) {
    forwardRes.on('error', onForwardError)
  }

  function onForwardError (err) {
    console.log('error forwarding hookshot on', endpoint, 'to', url)
    console.log(err)
    const strikes = parsedUrl.strikes -= 1
    console.log('strikes left', strikes)
    if (!strikes) {
      console.log('removing subscriber')
      subscribers.remove(endpoint, url)
    }
  }
}
