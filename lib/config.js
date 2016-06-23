'use strict'
const log = require('debug')('config')
const util = require('util')
const yargs = require('yargs')

const config = module.exports = yargs
  .env('WHF')
  .option('p', {
    alias: 'port',
    default: 5700
  })
  .option('s', {
    alias: 'strikes',
    default: 10,
    describe: 'The amount of times a subscriber is allowed to be unresponsive at a hook forward. When no strikes left, the subscriber is removed, when responsive, strikes are reset.'
  })
  .help('h')
  .alias('h', 'help')
  .argv

log(':', util.inspect(config, {colors: true}))
