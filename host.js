var app = require("express")();
var server = require("http").createServer(app);
var io = require("socket.io")(server);

var five = require("johnny-five");


var board = new five.Board();


var xmax = 32768;
var SERVO_A = 10;
var SERVO_B = 9;
var SERVO_C = 8;
var SERVO_D = 7;


board.on("ready", function() {

    var waist = new five.Servo({
        pin:SERVO_A,
        start:90,
        type : "continuous",
        range:[30,150]
    });

    var arm = new five.Servo({
        pin: SERVO_B,
        start: 90,
        type : "continuous",
        range: [30,150]
    });

    var hand = new five.Servo({
        pin: SERVO_C,
        start: 90,
        type : "continuous",
        range: [0,150]
    });


    var finger = new five.Servo({
        pin: SERVO_D,
        start: 90,
        type : "continuous",
        range: [0,180]
    });


    io.on('connect',function(sk){
        sk.on('left:move', function(position){
            if(position.x != 0 || position.y != 0) {
                var x_p = Math.ceil(90 * (position.x/xmax)) + 90;
                var y_p =  Math.ceil(60 * (position.y/xmax)) + 90;
                arm.to(y_p);
            }
        });

        sk.on('right:move', function(position){
            if(position.x != 0 || position.y != 0) {
                var x_p = Math.ceil(90 * (position.x/xmax)) + 90;
                hand.to(x_p);
                var y_p = Math.ceil(90 * (position.y/xmax)) + 90;
            }
        });
        var wangle = 90;

        sk.on('a:press', function (key) {
            if(wangle < 150){
                wangle += 2;
            }
            waist.to(wangle);
        });
        sk.on('b:press', function(key) {
            if(wangle > 30){
                wangle -= 2;
            }
            waist.to(wangle);
        });
        sk.on('righttrigger', function(position){
            finger.to(0);
        });
        sk.on('lefttrigger', function(position){
            finger.to(90);
        });
        sk.on('start:press', function (key) {
            process.quit();
        });

    });

    server.listen(80,function(){
        console.log("hosting board listening");
    });

});
