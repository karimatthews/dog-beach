'use strict';

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

var dogRight1 = document.getElementById('dogRight1');
var dogRight2 = document.getElementById('dogRight2');
var dogLeft1 = document.getElementById('dogLeft1');
var dogLeft2 = document.getElementById('dogLeft2');
var dogDown1 = document.getElementById('dogDown1');
var dogDown2 = document.getElementById('dogDown2');
var dogUp1 = document.getElementById('dogUp1');
var dogUp2 = document.getElementById('dogUp2');

var tree3 = document.getElementById('tree3');

var house1 = document.getElementById('house1');
var house2 = document.getElementById('house2');
var house3 = document.getElementById('house3');

var gravel = document.getElementById('gravel');
var water1 = document.getElementById('water1');
var road1 = document.getElementById('road1');
var grass1 = document.getElementById('grass1');

var player = {
    x: 10,
    y: 300,
    dx: 0,
    dy: 0,
    width: 40,
    height: 40,
    currentImages: [dogRight1, dogRight2]
};

var tickCounter = 0;
var solidObjects = [];

function buildSolidObject(type, x, y, width, height, img1, img2) {
   var obj = {
       type: type,
       x: x,
       y: y,
       width: width,
       height: height,
       currentImages: [img1,img2]
   };
   solidObjects.push(obj)
}

buildSolidObject('tree', 70, 60, 40, 40, tree3, tree3);
buildSolidObject('tree', 10, 30, 40, 40, tree3, tree3);
buildSolidObject('tree', 100, 10, 40, 40, tree3, tree3);
buildSolidObject('tree', 30, 100, 40, 40, tree3, tree3);

buildSolidObject('house', 100, 400, 60, 60, house1, house1);
buildSolidObject('house', 200, 400, 60, 60, house2, house2);
buildSolidObject('house', 300, 400, 60, 60, house3, house3);


var tiles = [];

function buildTile(x, y, width, height, img) {
    var tile = {
        x: x,
        y: y,
        width: width,
        height: height,
        image: img
    };
    tiles.push(tile)
}

function buildRoad() {
    var tileWidth = 50;
    var i;
    for (i = 0; i < canvas.width - tileWidth * 2; i = i + tileWidth) {
        buildTile(i, 300, tileWidth, 50, road1);
    }
}
buildRoad();

function buildSand() {
    var tileHeight = 50;
    var tileWidth = 50;
    var i;
    for (i = 0; i < canvas.height; i = i + tileHeight) {
        buildTile(canvas.width - 150, i, tileWidth, tileHeight, gravel);
    }
}
buildSand();

function buildWater() {
    var tileHeight = 100;
    var tileWidth = 100;
    var i;
    for (i = 0; i < canvas.height; i = i + tileHeight) {
        buildSolidObject('water', canvas.width - tileWidth, i, tileWidth, tileHeight, water1, water1);
    }
}
buildWater();

function buildPark() {
    var tileHeight = 10;
    var tileWidth = 10;
    var j;
    for (j = 0; j < 200 - tileHeight; j = j + tileHeight) {
        var i;
        for (i = 0; i < 200 - tileWidth; i = i + tileWidth) {
            buildTile(i, j, tileWidth, tileHeight, grass1);
        }
    }
}
buildPark();

function drawWorld() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    tiles.forEach(drawTile)
    solidObjects.forEach(drawObject);

    // since tickCounter is always between 0 and 100, `tickCounter > 50` will be false for 50 frames then true for 50 frames
    // +true and +false gives 0 or 1, which lets us select alternating frames from currentImages every 50 ticks
    ctx.drawImage(player.currentImages[+(tickCounter > 50)], player.x, player.y, player.width, player.height)

    ctx.fillStyle = "#0a250e";
    window.requestAnimationFrame(drawWorld)
}

function drawTile(tile) {
    ctx.drawImage(tile.image, tile.x, tile.y, tile.width, tile.height)
}

function drawObject(solidObject) {
    // ctx.fillRect(solidObject.x, solidObject.y, solidObject.width, solidObject.height);
    ctx.drawImage(solidObject.currentImages[+(tickCounter > 50)], solidObject.x, solidObject.y, solidObject.width, solidObject.height)
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
    if (e.keyCode === 38 || e.keyCode === 87) {
        //up arrow
        player.dy = -1
    }
    if (e.keyCode === 40 || e.keyCode === 83) {
        //down arrow
        player.dy = 1
    }
    if (e.keyCode === 37 || e.keyCode === 65) {
        //left arrow
        player.dx = -1
    }
    if (e.keyCode === 39 || e.keyCode === 68) {
        //right arrow
        player.dx = 1
    }
    setPlayerAnimation()
});

document.addEventListener("keyup", function(e) {

    if ([38, 40, 37, 39, 87, 83, 65, 68].indexOf(e.keyCode) !== -1) {
        player.dx = 0;
        player.dy = 0;
    }
    setPlayerAnimation()
});
setInterval(tick, 5);
drawWorld()
