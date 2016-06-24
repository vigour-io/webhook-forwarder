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
    describe: 'The amount of times a subscriber is allowed to be unresponsive at a hook forward. When no strikes are left, the subscriber is removed, when responsive, strikes are reset.'
  })
  .option('d', {
    alias: 'database.url',
    default: null,
    describe: 'Redis database server to connect to for storing subscription info (true defaults to 127.0.0.1:6379)'
  })
  .option('w', {
    alias: 'database.password',
    default: null,
    describe: 'Password to your Redis database server'
  })
  .option('l', {
    alias: 'database.label',
    default: 'whf',
    describe: 'Identifier used to grab a namespace within the database'
  })
  .help('h')
  .alias('h', 'help')
  .usage(
    'Environment variables:\n' +
    '- DEBUG=[str]\n' +
    '- WHF_PORT=[int]\n' +
    '- WHF_STRIKES=[int]\n' +
    '- WHF_DATABASE__URL=[str]\n' +
    '- WHF_DATABASE__PASSWORD=[str]\n' +
    '- WHF_DATABASE__LABEL=[str]\n' +
    '\nUsage:\n' +
    '- npm start -- [OPTIONS]\n' +
    '- webhook-forwarder [OPTIONS]'
  )
  .argv

log(':', util.inspect(config, {colors: true}))
