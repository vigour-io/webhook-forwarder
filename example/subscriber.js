'use strict'

const Debug = require('debug')
const log = Debug('example')
log.error = Debug('error')

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

const BADPOINT = 'wrong'
const BADURL = 'http://' + MYIP + ':' + MYPORT + '/' + BADPOINT

log('info', 'I am an example subscriber to the webhook-forwarder')
log('info', 'I will subscribe using', SUBSURL)
log('info', 'giving endpoint', ENDPOINT)
log('info', 'and forward url', MYURL)
log('info', 'Webhooks posted to', HOOKURL, 'will be forwarded to ', MYURL)

log('info', 'for error simulation, I will subscribe to', BADPOINT, 'requests to', BADURL, 'will result in 503 response')

const server = http.createServer()

server.on('request', function (req, res) {
  const request = urlUtil.parse(req.url)
  const endpoint = request.pathname

  log(':', 'got request on', endpoint)

  if (req.method === 'POST') { /* hook request */
    log(':', 'its a POST request!')
    var payload = ''
    req.on('data', function onData (chunk) {
      payload += chunk.toString()
    })
    req.on('end', function onEnd () {
      log(':', 'got the data!')
      try {
        log(':', JSON.parse(payload))
      } catch (err) {
        log(':', 'error parsing payload:', err)
      }
      const request = urlUtil.parse(req.url)
      const endpoint = request.pathname.slice(1)

      if (endpoint === BADPOINT) {
        respond(503, 'ueueueueueuhhh')
      } else {
        respond(200, 'thanks!')
      }
    })
  } else {
    respond(200, 'i am example subscriber!')
  }

  function respond (code, str) {
    res.writeHead(code)
    if (str) { res.write(str) }
    res.end()
  }
})

server.listen(5701)
log(':', 'listening on 5701')
log(':', 'subscribing!')

subscribe(SUBSURL, ENDPOINT, MYURL)
subscribe(SUBSURL, BADPOINT, BADURL)

function subscribe (subsurl, endpoint, myurl) {
  const options = {
    url: subsurl,
    method: 'GET',
    qs: {
      endpoint: endpoint,
      url: myurl
    }
  }

  log(':', 'options:\n', options)
  request(options, function (error, response, body) {
    const status = !error && response.statusCode
    if (status === 200) {
      log(':', 'subscribe was ok!')
      log(':', 'response:', body)
    } else {
      log.error('subscribe failed! :(')
      if (error) {
        log.error('request error:', error)
      } else {
        log.error('response:', status, body)
      }
    }
  })
}
