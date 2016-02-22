var XboxController = require('xbox-controller');
var xbox = new XboxController();

const io = require('socket.io-client');




const socket = io.connect('http://10.0.0.26',{
    port: 80
});

socket.on('connect',()=>{
    console.log("Connected to host!");

    xbox.on('left:move', function(position){
        socket.emit("left:move",position);
    });


    xbox.on('right:move', function(position){
        socket.emit("right:move",position);
    });

    var wangle = 90;

    xbox.on('a:press', function (key) {
        socket.emit("a:press",key);
    });
    xbox.on('b:press', function(key) {
        socket.emit("b:press",key);
    });
    xbox.on('righttrigger', function(position){
        socket.emit("righttrigger",position);
    });
    xbox.on('lefttrigger', function(position){
        socket.emit("lefttrigger",position);
    });
    xbox.on('start:press', function (key) {
        process.quit();
    });


})

socket.on('disconnect',()=>{
    console.log("Disconnected to host");
})
