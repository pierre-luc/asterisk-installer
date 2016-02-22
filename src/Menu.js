var inquirer = require( "inquirer" );
var cmdify = require("cmdify");
var spawn = require("child_process").spawn;

var Menu = function( data ){
  this.data = data;
  this.answers = {};
  return this;
};

Menu.choose = function(m){
  var r = [];
  for (var i in m){
    if (typeof i === "string"){
      r.push(i);
    }
  }
  return r;
};


Menu.makeLoader = function(label){
  var loader = [
    String.fromCharCode(9622) + " " + label,
    String.fromCharCode(9624) + " " + label,
    String.fromCharCode(9629) + " " + label,
    String.fromCharCode(9623) + " " + label,
    "- " + label
  ];
  var i = 4;
  var ui = new inquirer.ui.BottomBar({ bottomBar: loader[i % 4] });

  setInterval(function() {
    ui.updateBottomBar( loader[i++ % 4] );
  }, 300 );
  return {component: ui, end: function(){
    ui.updateBottomBar( label + " done!\n" );
  }};
};

Menu.stepProcess = function( processData ){
  console.log("\n");
  var ui = Menu.makeLoader( processData.label );
  var cmd = spawn(cmdify(
    processData.cmd.split(' ')[0]), processData.cmd.split(' ').splice(1),
    { stdio: "pipe" }
  );
  cmd.stdout.pipe( ui.component.log );
  cmd.on( "close", function() {
    ui.end();
    if ( typeof processData.next === "object" ){
      Menu.stepProcess( processData.next );
    } else {
      process.exit();
    }
  });
};

Menu.processList = function (data){
  var size = data.length;
  for (var i = size - 2; i >= 0; i--){
    data[i].next = data[i+1];
  }
  return data[0];
};  


Menu.prototype.process = function(){
  var list = [];

  list.push( {label: "Initialisation", cmd: "make prepare"} );
  list.push( {label: "Downloading & installing asterisk", cmd: "make asterisk-" + this.answers.os + "-" + this.answers.version} );
  list.push( {label: "Endind", cmd: "make prepare"} );
 
  Menu.stepProcess( Menu.processList( list ) );
};

Menu.prototype.run = function(){
  var self = this;
  inquirer.prompt([{
    type: "list",
    name: "os",
    message: "What is your OS ?",
    choices: Menu.choose(self.data.os),
    filter: function( val ) { return val.toLowerCase(); }
  }], function( answer ) {
    self.answers.os = answer.os;  

    inquirer.prompt([{
      type: "list",
      name: "version",
      message: "What is the version ?",
      choices: self.data.os[self.answers.os],
      filter: function( val ) { return val.toLowerCase(); }
    }, {
      type: "confirm",
      name: "dahdi",
      message: "Get and install DAHDI ?",
      default: true
    }], function( answer ) {
      self.answers.version = answer.version;
      self.answers.dahdi = answer.dahdi;
      
      console.log( JSON.stringify(self.answers, null, "  ") );
      self.process();
    });
  });
};

module.exports = Menu;