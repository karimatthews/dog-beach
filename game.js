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

// Build people
var personOneImages = {
    up: [personUp1, personUp2],
    down: [personDown1, personDown2],
    right: [personRight1, personRight2],
    left: [personLeft1, personLeft2]
};
var personOneWaypoints = [
        {target: true, x: 0, y: 400},
        {x: 100, y: 400, waitTime: 200, waitedFor: 0},
        {x: 100, y: 200},
        {x: 150, y: 200},
        {x: 150, y: 350, waitTime: 200, waitedFor: 0},
        {x: 0, y: 350}
    ];
buildPerson(0,400, 11, 32, personOneImages, personOneWaypoints);

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
    if (tickCounter > 100) {
        tickCounter = 0;
    }

    if (tickCounter % 5 === 0) {
        people.forEach(movePerson);
    }
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
    currentImages: [dogRight1, dogRight1],
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
function buildPerson(x, y, width, height, images, waypoints) {
    var person = {
        x: x,
        y: y,
        dx: 0,
        dy: 0,
        width: width,
        height: height,
        currentImages: [images.right[0], images.right[0]],
        images: images,
        waypoints: waypoints
    };
    people.push(person)
}

function findCurrentTarget(person) {
    return person.waypoints.find(function(waypoint) {
        return waypoint.target;
    });
}

// Make person move between waypoints
function updateTargetWaypoint(person) {
    var target = findCurrentTarget(person);
    // If person has reached current target, update current target to the next waypoint in the list
    if (target.x === person.x && target.y === person.y) {
        target.target = false;
        var nextIndex = person.waypoints.indexOf(target) + 1;
        if (nextIndex === person.waypoints.length) {
            // If we've reached the last waypoint in list, start cycle again
            person.waypoints[0].target = true;
        } else {
            person.waypoints[nextIndex].target = true;
        }
    }
}

function setPersonDirection(person) {
    var target = findCurrentTarget(person);
    // If person to right of target point left
    if (person.x > target.x) {
        person.dx = -1;
    }
    // If person to left of target point right
    if (person.x < target.x) {
        person.dx =1;
    }
    // If person above target point down
    if (person.y < target.y) {
        person.dy = 1;
    }
    // If person below target point up
    if (person.y > target.y) {
        person.dy = -1;
    }
    // if person on target set to zero
    if (person.y === target.y) {
        person.dy = 0;
    }
    if (person.x === target.x) {
        person.dx = 0;
    }
}

function isPersonWaiting(person, target) {
    // Check if person has waited for the set time, and if so continue moving
    if (target.waitTime >= target.waitedFor) {
        target.waitedFor = 0;
        return false;
    } else {
        // Increment waited for time
        target.waitedFor += 5;
        person.currentImages = [person.currentImages[0], person.currentImages[0]];
        return true;
    }
}

// Move person
function movePerson(person) {
    var target = findCurrentTarget(person);
    if (person.x === target.x && person.y === target.y && target.waitTime) {
        var waiting = isPersonWaiting(person, target)
    }
    if (waiting) {
        return;
    }
    updateTargetWaypoint(person);
    setPersonDirection(person);
    person.x += person.dx;
    person.y += person.dy;
    setAnimation(person)
}

// Animate person
// TODO

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




