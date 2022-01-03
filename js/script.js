
window.onload = function () {
    var DEPTH = 10;
    //Grey Canvas


    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 500;

    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    var greyImage = generate(imagifyGrey(imageData, buildRandomExpr(DEPTH)), ctx, canvas);

    var greyButton = document.createElement("button");
    greyButton.textContent = "Download Grey Image"
    greyButton.style.cssText = "position: absolute; top: 520px; left: 180px"

    greyButton.onclick = function () {
        downloadImage(canvas);
    }
    document.body.appendChild(greyButton);

    //Colored Canvas
    var canvasColor = document.createElement("canvas");
    var ctxColor = canvasColor.getContext('2d');
    canvasColor.width = 500;
    canvasColor.height = 500;

    var colorImageData = ctxColor.getImageData(0, 0, canvasColor.width, canvasColor.height);

    var colorImage = generate(imagifyColor(colorImageData, buildRandomExpr(DEPTH), buildRandomExpr(DEPTH), buildRandomExpr(DEPTH)), ctxColor, canvasColor, true);

    var colorButton = document.createElement("button");
    colorButton.style.cssText = "position: absolute; top: 520px; left: 705px"
    colorButton.textContent = "Download Color Image"

    colorButton.onclick = function () {
        downloadImage(canvasColor);
    }

    document.body.appendChild(colorButton);

    var generateButton = document.createElement("button");
    generateButton.style.cssText = "position: absolute; left: 460px; top: 520px"
    generateButton.textContent = "Generate New Images";

    generateButton.onclick = function () {

        DEPTH = parseInt(depthField.value)

        if (isNaN(DEPTH) || DEPTH <= 0 || DEPTH >1000) {
            DEPTH = 10;
        }

        document.body.removeChild(greyImage);
        document.body.removeChild(colorImage);

        greyImage = generate(imagifyGrey(imageData, buildRandomExpr(DEPTH)), ctx, canvas);

        colorImage = generate(imagifyColor(colorImageData, buildRandomExpr(DEPTH), buildRandomExpr(DEPTH), buildRandomExpr(DEPTH)), ctxColor, canvasColor, true);

    }

    document.body.appendChild(generateButton);

    var depthField = document.createElement("input");

    depthField.style.cssText = "position : absolute; left : 460px; top : 550px; width: 140px"

    document.body.appendChild(depthField);

}

function generate(imageData, context, canvas, isColor) {
    context.putImageData(imageData, 0, 0);
    var image = convertCanvasToImage(canvas);
    if (isColor) image.style.left = "550px";
    document.body.appendChild(image);
    return image;

}

function downloadImage(canvas) {
    let download = document.createElement("a");
    download.href = canvas.toDataURL();
    download.download = "art.png";
    document.body.appendChild(download);
    download.click();
    document.body.removeChild(download);
}

function convertCanvasToImage(canvas) {

    let image = new Image();
    image.src = canvas.toDataURL();
    image.style.position = "absolute";
    return image;

}

function imagifyGrey(imageData, expression) {
    console.log("Grey expression:")
    console.log(stringify(expression));
    for (let i = 0; i < imageData.height; i++) {
        for (let j = 0; j < imageData.width; j++) {
            let color = 255 * evaluate(expression, 2 * (j / imageData.width) - 1, 2 * (i / imageData.height) - 1);
            imageData.data[4 * (i * imageData.width + j)] = color;
            imageData.data[4 * (i * imageData.width + j) + 1] = color;
            imageData.data[4 * (i * imageData.width + j) + 2] = color;
            imageData.data[4 * (i * imageData.width + j) + 3] = 255;
        }
    }

    return imageData;
}

function imagifyColor(imageData, expression1, expression2, expression3) {
    console.log("Color expressions:")
    console.log(stringify(expression1));
    console.log(stringify(expression2));
    console.log(stringify(expression3));
    for (let i = 0; i < imageData.height; i++) {
        for (let j = 0; j < imageData.width; j++) {
            let red = 255 * evaluate(expression1, 2 * (j / imageData.width) - 1, 2 * (i / imageData.height) - 1);
            let green = 255 * evaluate(expression2, 2 * (j / imageData.width) - 1, 2 * (i / imageData.height) - 1);
            let blue = 255 * evaluate(expression3, 2 * (j / imageData.width) - 1, 2 * (i / imageData.height) - 1);

            imageData.data[4 * (i * imageData.width + j)] = red;
            imageData.data[4 * (i * imageData.width + j) + 1] = green;
            imageData.data[4 * (i * imageData.width + j) + 2] = blue;
            imageData.data[4 * (i * imageData.width + j) + 3] = 255
        }
    }

    return imageData;

}

var NUM_TYPE_EXPR = 6;

function buildVarX() {
    return { name: "VarX" };
}
function buildVarY() {
    return { name: "VarY" };
}
function buildSine(e1) {
    return { name: "Sine", e1: e1 };
}
function buildCosine(e1) {
    return { name: "Cosine", e1: e1 };
}
function buildTimes(e1, e2) {
    return { name: "Times", e1: e1, e2: e2 };
}
function buildAverage(e1, e2) {
    return { name: "Average", e1: e1, e2: e2 };
}
function evaluate(e, x, y) {
    switch (e.name) {
        case ("VarX"):
            return x;
        case ("VarY"):
            return y;
        case ("Sine"):
            return Math.sin(Math.PI * evaluate(e.e1, x, y));
        case ("Cosine"):
            return Math.cos(Math.PI * evaluate(e.e1, x, y));
        case ("Times"):
            return evaluate(e.e1, x, y) * evaluate(e.e2, x, y);
        case ("Average"):
            return (evaluate(e.e1, x, y) + evaluate(e.e2, x, y)) / 2;
    }
}
function stringify(e) {
    switch (e.name) {
        case ("VarX"):
            return "x";
        case ("VarY"):
            return "y";
        case ("Sine"):
            return "sin(" + stringify(e.e1) + ")";
        case ("Cosine"):
            return "cos(" + stringify(e.e1) + ")";
        case ("Times"):
            return stringify(e.e1) + " * " + stringify(e.e2);
        case ("Average"):
            return "(" + stringify(e.e1) + " + " + stringify(e.e2) + ") / 2";
    }
}
function buildRandomExpr(depth) {
    if (depth <= 1) {
        var rando_1 = Math.random();
        if (rando_1 < 0.5)
            return buildVarX();
        else
            return buildVarY();
    }
    var rando = Math.floor(Math.random() * (NUM_TYPE_EXPR - 2));
    switch (rando) {
        case (0):
            return buildSine(buildRandomExpr(depth - 1));
        case (1):
            return buildCosine(buildRandomExpr(depth - 1));
        case (2):
            return buildTimes(buildRandomExpr(depth / 2 - 1), buildRandomExpr(depth / 2 - 1));
        case (3):
            return buildAverage(buildRandomExpr(depth / 2 - 1), buildRandomExpr(depth / 2 - 1));
    }
}
var expr1 = buildAverage(buildSine(buildVarY()), buildCosine(buildVarX()));
var expr2 = buildTimes(buildSine(buildVarX()), buildCosine(buildVarX()));

var expr3 = buildRandomExpr(6);
