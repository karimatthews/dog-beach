'use strict';

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

buildSolidObject('house', 420, 210, 60, 60, house1, house1);
buildSolidObject('house', 200, 210, 60, 60, house2, house2);
buildSolidObject('house', 310, 210, 60, 60, house3, house3);