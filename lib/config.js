'use strict'
const log = require('debug')('config')
const util = require('util')
const yargs = require('yargs')

const config = module.exports = yargs
  .env('WHF')
  .option('p', {
    alias: 'port',
    default: 5700,
    type: 'number',
    describe: 'The port used to listen for incoming webhooks and /subscribe requests'
  })
  .option('s', {
    alias: 'strikes',
    default: 10,
    type: 'number',
    describe: 'The amount of times a subscriber is allowed to be unresponsive at a hook forward. When no strikes left, the subscriber is removed, when responsive, strikes are reset.'
  })
  .help('h')
  .alias('h', 'help')
  .usage(
    'Environment variables:\n' +
    '- DEBUG=[str]\n' +
    '- WHF_PORT=[int]\n' +
    '- WHF_STRIKES=[int]\n' +
    'Usage:\n' +
    '- npm start -- -p [int] -s [int]\n' +
    '- webhook-forwarder -p [int] -s [int]'
  )
  .argv

log(':', util.inspect(config, {colors: true}))
