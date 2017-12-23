'use strict';

var canvas = document.getElementById("gameCanvas")
var ctx = canvas.getContext("2d");

var dogRight1 = document.getElementById('dogRight1')
var dogRight2 = document.getElementById('dogRight2')
var dogLeft1 = document.getElementById('dogLeft1')
var dogLeft2 = document.getElementById('dogLeft2')
var dogDown1 = document.getElementById('dogDown1')
var dogDown2 = document.getElementById('dogDown2')
var dogUp1 = document.getElementById('dogUp1')
var dogUp2 = document.getElementById('dogUp2')

var player = {
    x: 10,
    y: 10,
    dx: 0,
    dy: 0,
    width: 50,
    height: 50,
    currentImages: [dogRight1, dogRight2]
}

var tickCounter = 0;
var solidObjects = []
function buildSolidObject(type, x, y, width, height) {
   var obj = {
       type: type,
       x: x,
       y: y,
       width: width,
       height: height
   }
   solidObjects.push(obj)
}

buildSolidObject('tree', 100, 100, 20, 20);
function drawWorld() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // since tickCounter is always between 0 and 100, `tickCounter > 50` will be false for 50 frames then true for 50 frames
    // +true and +false gives 0 or 1, which lets us select alternating frames from currentImages every 50 ticks
    ctx.drawImage(player.currentImages[+(tickCounter > 50)], player.x, player.y, player.width, player.height)

    ctx.fillStyle = "#0a250e";
    solidObjects.forEach(drawObject)
    window.requestAnimationFrame(drawWorld)
}

function drawObject(solidObject) {
    ctx.fillRect(solidObject.x, solidObject.y, solidObject.width, solidObject.height);
}

function tick() {
    tickCounter++
    if (tickCounter > 100) { tickCounter = 0 }

    movePlayerHorizontally()
    movePlayerVertically()
}

function movePlayerVertically() {
    if (playerAvoidsVerticalBoundary() && playerAvoidsObjects()) {
        player.y += player.dy;
    }
}

function movePlayerHorizontally() {
    if (playerAvoidsHorizontalBoundary() && playerAvoidsObjects()) {
        player.x += player.dx;
    }
}

function playerAvoidsObjects() {
    var avoids = true
    solidObjects.forEach(function(obj) {
        if (overlap(obj)) { avoids = false }
    })
    return avoids
}

function overlap(solidObject) {
    return (verticalOverlap(solidObject) && horizontalOverlap(solidObject))
}


function horizontalOverlap(solidObject) {
    var right = (player.x + player.dx + player.width) <= (solidObject.x + solidObject.width + player.width)
    var left = (solidObject.x - player.width) <= (player.x + player.dx)
    return right && left
}

function verticalOverlap(solidObject) {
    var bottom = (player.y + player.dy + player.height) <= (solidObject.y + solidObject.height + player.height)
    var top = (solidObject.y - player.height) <= (player.y + player.dy)
    return bottom && top
}

function playerAvoidsVerticalBoundary() {
    return (0 < player.y +player.dy) && (player.y + player.dy < canvas.height - player.height)
}

function playerAvoidsHorizontalBoundary() {
    return (0 < player.x + player.dx) && (player.x + player.dx < canvas.width - player.width)
}

function setPlayerAnimation() {
  if (player.dx == 0 && player.dy == 0) {
    player.currentImages = [player.currentImages[0], player.currentImages[0]]
  } else if (player.dx > 0) {
    player.currentImages = [dogRight1, dogRight2]
  } else if (player.dx < 0) {
    player.currentImages = [dogLeft1, dogLeft2]
  } else if (player.dy < 0) {
    player.currentImages = [dogUp1, dogUp2]
  } else if (player.dy > 0) {
    player.currentImages = [dogDown1, dogDown2]
  }
}

document.addEventListener("keydown", function(e) {
    if (e.keyCode === 38) {
        //up arrow
        player.dy = -1
    }
    if (e.keyCode === 40) {
        //down arrow
        player.dy = 1
    }
    if (e.keyCode === 37) {
        //left arrow
        player.dx = -1
    }
    if (e.keyCode === 39) {
        //right arrow
        player.dx = 1
    }
    setPlayerAnimation()
});

document.addEventListener("keyup", function(e) {

    if ([38, 40, 37, 39].indexOf(e.keyCode) !== -1) {
        player.dx = 0;
        player.dy = 0;
    }
    setPlayerAnimation()
});
setInterval(tick, 5);
drawWorld()
