'use strict';
_              = require 'lodash'
util           = require 'util'
{EventEmitter} = require 'events'
debug          = require('debug')('meshblu-shell')
spawn          = require 'cross-spawn'

MESSAGE_SCHEMA =
  type: 'object'
  properties:
    options:
      type: 'array'
      items:
        title: 'Argument'
        type: 'string'
    cwd:
      type: 'string'
      title: 'Working Directory'
    required: [ 'options' ]

OPTIONS_SCHEMA =
  type: 'object'
  properties:
    shellCommand:
      type: 'string'
      required: true

class Plugin extends EventEmitter
  constructor: ->
    @options = {}
    @messageSchema = MESSAGE_SCHEMA
    @optionsSchema = OPTIONS_SCHEMA

  onMessage: (message) =>
    payload = message.payload;
    debug "spawn: #{@options.shellCommand} #{payload.options.join(' ')}"
    proc = spawn @options.shellCommand, payload.options, cwd: @options.cwd, env: process.env
    proc.on 'error', (error) =>
      debug 'error', error
      @emit 'error', error

    proc.stdout.on 'data', (data) =>
      debug 'stdout', data.toString()
      message =
        devices: ['*']
        topic: 'stdout'
        payload:
          stdout: data.toString()
      @emit 'message', message

    proc.stderr.on 'data', (data) =>
      debug 'stderr', data.toString()
      message =
        devices: ['*']
        topic: 'stderr'
        payload:
          stderr: data.toString()
      @emit 'message', message

    proc.on 'close', (code) =>
      debug 'closed', code
      message =
        devices: ['*']
        topic: 'exit'
        payload:
          code: code
      @emit 'message', message

  onConfig: (device) =>
    @setOptions device.options

  setOptions: (options={}) =>
    @options = options

module.exports =
  messageSchema: MESSAGE_SCHEMA
  optionsSchema: OPTIONS_SCHEMA
  Plugin: Plugin
