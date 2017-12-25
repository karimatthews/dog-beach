'use strict';

function playerMeetsPerson() {
    // Assuming we're only meeting one person at a time
    var interactionPerson = false;
    people.forEach(function(person) {
        if (overlapsPlayer(person)) {
            interactionPerson = person;
        }
    });
    return interactionPerson;
}

function playerAvoidsObjects() {
    var avoids = true;
    solidObjects.forEach(function(obj) {
        if (overlapsPlayer(obj)) {
            avoids = false;
        }
    });
    return avoids;
}

function overlapsPlayer(object) {
    return (verticalOverlap(object) && horizontalOverlap(object))
}

function horizontalOverlap(solidObject) {
    var right = (player.x + player.dx + player.width) <= (solidObject.x + solidObject.width + player.width)
    var left = (solidObject.x - player.width) <= (player.x + player.dx);
    return right && left;
}

function verticalOverlap(solidObject) {
    var bottom = (player.y + player.dy + player.height) <= (solidObject.y + solidObject.height + player.height)
    var top = (solidObject.y - player.height) <= (player.y + player.dy);
    return bottom && top;
}

function playerAvoidsVerticalBoundary() {
    return (0 < player.y +player.dy) && (player.y + player.dy < canvas.height - player.height)
}

function playerAvoidsHorizontalBoundary() {
    return (0 < player.x + player.dx) && (player.x + player.dx < canvas.width - player.width)
}