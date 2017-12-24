'use strict';

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

function buildSand() {
    var tileHeight = 50;
    var tileWidth = 50;
    var i;
    for (i = 0; i < canvas.height; i = i + tileHeight) {
        buildTile(canvas.width - 150, i, tileWidth, tileHeight, gravel);
    }
}

function buildWater() {
    var tileHeight = 100;
    var tileWidth = 100;
    var i;
    for (i = 0; i < canvas.height; i = i + tileHeight) {
        buildSolidObject('water', canvas.width - tileWidth, i, tileWidth, tileHeight, water1, water1);
    }
}

function buildPark() {
    var tileHeight = 10;
    var tileWidth = 10;
    var j;
    for (j = 0; j < 200 - tileHeight; j = j + tileHeight) {
        var i;
        for (i = 0; i < 550; i = i + tileWidth) {
            buildTile(i, j, tileWidth, tileHeight, grass1);
        }
    }
}
