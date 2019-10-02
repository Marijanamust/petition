console.log("sanity");

const canvas = $(".js-paint");
const context = canvas[0].getContext("2d");
const hidden = $(".hidden");
const clear = $("#clear");
context.lineCap = "round";

clear.on("click", () => {
    context.clearRect(0, 0, 600, 200);
    dataURL = null;
    hidden.val(dataURL);
    console.log(dataURL);
});
let x = 0,
    y = 0;
let isMouseDown = false;
let dataURL;
const stopDrawing = () => {
    isMouseDown = false;
};

const startDrawing = event => {
    isMouseDown = true;
    [x, y] = [event.offsetX, event.offsetY];
};
const drawLine = event => {
    if (isMouseDown) {
        const newX = event.offsetX;
        const newY = event.offsetY;
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(newX, newY);
        context.stroke();
        [x, y] = [newX, newY];
        dataURL = canvas[0].toDataURL();
        hidden.val(dataURL);
        console.log(hidden.val());
    }
};

canvas.on("mousedown", startDrawing);
canvas.on("mousemove", drawLine);
canvas.on("mouseup", stopDrawing);
canvas.on("mouseout", stopDrawing);
