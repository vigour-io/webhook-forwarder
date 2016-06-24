# Webhook-forwarder
simple webhook forwarder with subscribe and auto cleanup.

## Install

### npm
```
npm i -g webhook-forwarder
```
```
webhook-forwarder [OPTIONS]
```
### github

```
git clone git@github.com:vigour-io/webhook-forwarder.git &&\
cd webhook-forwarder &&\
npm i &&\
npm start -- [OPTIONS]
```

## Usage


### Options

| option | alias | description |
| --- | --- | --- |
| -p | --port | The port used to listen for incoming webhooks and `/subscribe` requests |
| -s | --strikes | The amount of times a subscriber is allowed to be unresponsive at a hook forward. <br> When no strikes are left, the subscriber is removed, when responsive, strikes are reset. |
| -d | --database.url | Redis database server to connect to for storing subscription info (true defaults to `127.0.0.1:6379`) |
| -w | --database.password | Password to your Redis server |
| -l | --database.label | Identifier used to grab a namespace within the database |
| -h | --help | Show help |


### Environment variables
Each option can be set using environment variables in all caps and prefixed with `WHF_`, with `__` for dots.
- DEBUG=[str]
- WHF_PORT=[int]
- WHF_STRIKES=[int]
- WHF_DATABASE__URL=[str]
- WHF_DATABASE__PASSWORD=[str]
- WHF_DATABASE__LABEL=[str]

## API

### Subscribe
Used to subscribe to a webhook endpoint, meaning all webhooks landing on this endpoint will be forwarded to the subscriber.

#### endpoint: `/subscribe`

#### Method: GET

#### Parameters:

| parameter | description | example |
| --- | --- | --- |
| endpoint | All webhooks landing on this endpoint should be forwarded to the subscriber | `travis` |
| url | The url that the webhooks should be forwarded to | `http://forward-to.me/travis` <br> URI encoded <br> `http%3A%2F%2Fforward-to.me%2Ftravis` |

#### Example
```
http://my-webhook-forwarder.com/subscribe?endpoint=travis&url=http%3A%2F%2Fforward-to.me%2Ftravis
```
Easy way to get these query strings URI encoded:
```JavaScript
const querystring = require('querystring')

const exampleString = querystring.stringify({
  endpoint: 'travis',
  url: 'http://forward-to.me/travis'
})

// exampleString is now
// "endpoint=travis&url=http%3A%2F%2Fforward-to.me%2Ftravis"
```

### Webhooks
Any `POST` requests landing on the forwarder will be accepted, and if there is a subscriber for the endpoint the hookshot was fired on, it will be forwarded.

#### endpoint: `/*`

#### Method: POST

## Database

The databse is used to keep a persistant and possibly shared record of subscribers.

### Label

`options.database.label` is used to create a namespace and enable the forwarder to find it's subscribers on load.

A forwarder with label `myLabel` will find it's subscribers as follows:

```
redis> SMEMBERS myLabel
1) "myLabel/travis"
2) "myLabel/endpoint2"

redis> SMEMBERS myLabel/travis
1) "http://forward-to.me/travis"
2) "http://also-to.me/travis"

redis> SMEMBERS myLabel/endpoint2
1) "http://forward-to.me/stuff"
2) "http://random.me-too/webhooks"
```
