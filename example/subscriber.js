'use strict'

const http = require('http')
const request = require('request')
const urlUtil = require('url')

const MYPORT = 5701
const FWPORT = 5700
const MYIP = '127.0.0.1'
const FWIP = '127.0.0.1'
const ENDPOINT = 'travis'

const MYURL = 'http://' + MYIP + ':' + MYPORT + '/' + ENDPOINT
const SUBSURL = 'http://' + FWIP + ':' + FWPORT + '/subscribe'
const HOOKURL = 'http://' + FWIP + ':' + FWPORT + '/' + ENDPOINT

console.log('I am an example subscriber to the webhook-forwarder')
console.log('I will subscribe using', SUBSURL)
console.log('giving endpoint', ENDPOINT)
console.log('and forward url', MYURL)

console.log('Webhooks posted to', HOOKURL, 'will be forwarded to ', MYURL)

const server = http.createServer()

server.on('request', function (req, res) {
  const request = urlUtil.parse(req.url)
  const endpoint = request.pathname

  console.log('got request on', endpoint)

  if (req.method === 'POST') { /* hook request */
    console.log('its a POST request!')
    var payload = ''
    req.on('data', function onData (chunk) {
      payload += chunk.toString()
    })
    req.on('end', function onEnd () {
      console.log('got the data!')
      try {
        console.log(JSON.parse(payload))
      } catch (err) {
        console.log('error parsing payload:', err)
      }
      respond('thanks!')
    })
  } else {
    respond('i am example subscriber!')
  }

  function respond (str) {
    res.writeHead(200)
    if (str) { res.write(str) }
    res.end()
  }
})

server.listen(5701)
console.log('listening on 5701')
console.log('subscribing!')

const options = {
  url: SUBSURL,
  method: 'GET',
  qs: {
    endpoint: ENDPOINT,
    url: MYURL
  }
}

console.log('options', options)
request(options, function (error, response, body) {
  const status = response.statusCode
  if (!error && status === 200) {
    console.log('subscribe was ok!')
    console.log(body)
  } else {
    console.log('subscribe failed! :(', status, body)
  }
})
