'use strict';

function playerAvoidsObjects() {
    var avoids = true;
    solidObjects.forEach(function(obj) {
        if (overlap(obj)) { avoids = false }
    });
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