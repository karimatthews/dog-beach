'use strict';

// Declare variables
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var tickCounter = 0;
var people = [];

setInterval(tick, 5);

// build the background
buildRoad();
buildSand();
buildWater();
buildPark();

// Method for drawing background tiles
function drawTile(tile) {
    ctx.drawImage(tile.image, tile.x, tile.y, tile.width, tile.height);
}

// Method for drawing objects
function drawObject(solidObject) {
    // ctx.fillRect(solidObject.x, solidObject.y, solidObject.width, solidObject.height);
    ctx.drawImage(solidObject.currentImages[+(tickCounter > 50)], solidObject.x, solidObject.y, solidObject.width, solidObject.height)
}

function tick() {
    tickCounter++;
    if (tickCounter > 100) { tickCounter = 0 }
    movePlayerHorizontally();
    movePlayerVertically();
}

// Define the doggo/player
var player = {
    x: 10,
    y: 300,
    dx: 0,
    dy: 0,
    width: 30,
    height: 30,
    currentImages: [dogRight1, dogRight2],
    images: {
        up: [dogUp1, dogUp2],
        down: [dogDown1, dogDown2],
        right: [dogRight1, dogRight2],
        left: [dogLeft1, dogLeft2]
    }
};

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

function setAnimation(creature) {
  if (creature.dx === 0 && creature.dy === 0) {
    creature.currentImages = [creature.currentImages[0], creature.currentImages[0]]
  } else if (creature.dx > 0) {
    creature.currentImages = creature.images.right
  } else if (creature.dx < 0) {
    creature.currentImages = creature.images.left
  } else if (creature.dy < 0) {
    creature.currentImages = creature.images.up
  } else if (creature.dy > 0) {
    creature.currentImages = creature.images.down
  }
}

// Listen to keyup and keydown events
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
    setAnimation(player)
});

document.addEventListener("keyup", function(e) {

    if ([38, 40, 37, 39, 87, 83, 65, 68].indexOf(e.keyCode) !== -1) {
        player.dx = 0;
        player.dy = 0;
    }
    setAnimation(player)
});

// Define other characters
function buildPerson(x, y, width, height, img1, img2) {
    var obj = {
        x: x,
        y: y,
        width: width,
        height: height,
        currentImages: [img1,img2],
        waypoints: [ {x: 0, y: 400}, {x: 0, y: 500}]
    };
    people.push(obj)
}
buildPerson(0,400, 11, 32, personRight1, personRight2);




function drawWorld() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    tiles.forEach(drawTile);
    solidObjects.forEach(drawObject);
    people.forEach(drawObject);

    // since tickCounter is always between 0 and 100, `tickCounter > 50` will be false for 50 frames then true for 50 frames
    // +true and +false gives 0 or 1, which lets us select alternating frames from currentImages every 50 ticks
    ctx.drawImage(player.currentImages[+(tickCounter > 50)], player.x, player.y, player.width, player.height)

    ctx.fillStyle = "#0a250e";
    window.requestAnimationFrame(drawWorld)
}
drawWorld();


