var firmata = require('firmata');

var board = new firmata.Board('/dev/cu.usbmodem1d111',function(){

  setInterval(function(){
    var sensor = board.analogRead(0);
    console.log(sensor);
  }, 300);

});
