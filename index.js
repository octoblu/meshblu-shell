'use strict';
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var debug = require('debug')('meshblu-shell')
var exec = require('child_process').exec;

var MESSAGE_SCHEMA = {
  type: 'object',
  properties: {
    options: {
      type: 'array',
      items: {
        title: 'Argument',
        type: 'string'
      }
    },
    required: ['options']
  }
};

var OPTIONS_SCHEMA = {
  type: 'object',
  properties: {
    shellCommand: {
      type: 'string',
      required: true
    }
  }
};

function Plugin(){
  this.options = {};
  this.messageSchema = MESSAGE_SCHEMA;
  this.optionsSchema = OPTIONS_SCHEMA;
  return this;
}
util.inherits(Plugin, EventEmitter);

var cleanArg = function(arg){
  return '\"' + arg.replace(/\"\'/g,'') +'\"';
}

Plugin.prototype.onMessage = function(message){
  var payload = message.payload;
  this.executeShell(payload);
};

Plugin.prototype.onConfig = function(device){
  this.setOptions(device.options||{});
};

Plugin.prototype.setOptions = function(options){
  this.options = options;
};

Plugin.prototype.executeShell = function(data){
  var child;

  var command = this.options.shellCommand;
  debug('Executing: ' + command, data);
  if(data.options){
    command+= ' ';
    if(Array.isArray(data.options)){
      data.options.forEach(function(arg){
        command+= ' ' + cleanArg(arg);
      });
    }else if(typeof data.options == 'string'){
      command+= ' ' + cleanArg(data.options);
    }
  }

  child = exec(command, function (error, stdout, stderr) {
    debug('stdout: ' + stdout);
    debug('stderr: ' + stderr);
    if (error !== null) {
      console.error('exec error: ' + error);
    }
  });
}

module.exports = {
  messageSchema: MESSAGE_SCHEMA,
  optionsSchema: OPTIONS_SCHEMA,
  Plugin: Plugin
};
