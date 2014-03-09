var sys = require('sys')
var exec = require('child_process').exec;

function Plugin(messenger, options){
  this.messenger = messenger;
  this.options = options;
  return this;
}

var optionsSchema = {
  type: 'object',
    properties: {
      shellCommand: {
        type: 'string',
        required: true
    }
  }
};

//any args to the shell
var messageSchema = {
  type: 'array',
  properties: {
    text: {
      type: 'string',
      required: true
    }
  }
};

function cleanArg(arg){
  return '\"' + arg.replace(/\"\'/g,'') +'\"';
}

Plugin.prototype.onMessage = function(data){

  // http://nodejs.org/api.html#_child_processes

  var child;

  var command = this.options.shellCommand;
  if(data.payload){
    command+= ' ';
    if(Array.isArray(data.payload)){
      data.payload.forEach(function(arg){
        command+= ' ' + cleanArg(arg);
      });
    }else if(typeof data.payload == 'string'){
      command+= ' ' + cleanArg(data.payload);
    }
  }

  child = exec(command, function (error, stdout, stderr) {
    sys.print('stdout: ' + stdout);
    sys.print('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });

};

Plugin.prototype.destroy = function(){
  //clean up
  console.log('destroying.', this.options);
};


module.exports = {
  Plugin: Plugin,
  optionsSchema: optionsSchema,
  messageSchema: messageSchema
};
