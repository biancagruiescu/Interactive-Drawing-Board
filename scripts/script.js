const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const toolButtons = document.querySelectorAll(".tool");
const sizeSlider = document.querySelector("#size-slider");
const colorButtons = document.querySelectorAll(".colors .option");
const colorPicker = document.querySelector("#color-picker");
const fillColorCheckbox = document.querySelector("#fill-color");
const clearCanvasBtn = document.querySelector(".clear-canvas");
const saveImgBtn = document.querySelector(".save-img");

let isDrawing = false,
    brushSize = 5,
    selectedTool = "brush",
    selectedColor = "#000";

let startX, startY, snapshot;

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
}

function setCanvasBackground() {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
}

window.addEventListener("load", resizeCanvas);
window.addEventListener("resize", resizeCanvas);

function startDraw(e) {
    isDrawing = true;
    startX = e.offsetX;
    startY = e.offsetY;

    ctx.beginPath();
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;

    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function drawing(e) {
    if (!isDrawing) return;

    ctx.putImageData(snapshot, 0, 0);

    let currentX = e.offsetX;
    let currentY = e.offsetY;

    if (selectedTool === "brush" || selectedTool === "eraser") {
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
    }

    else if (selectedTool === "rectangle") {
        let width = currentX - startX;
        let height = currentY - startY;

        if (fillColorCheckbox.checked) {
            ctx.fillRect(startX, startY, width, height);
        } else {
            ctx.strokeRect(startX, startY, width, height);
        }
    }

    else if (selectedTool === "circle") {
        let radius = Math.sqrt(Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2));

        ctx.beginPath();
        ctx.arc(startX, startY, radius, 0, Math.PI * 2);
        fillColorCheckbox.checked ? ctx.fill() : ctx.stroke();
    }

    else if (selectedTool === "triangle") {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(currentX, currentY);
        ctx.lineTo(startX * 2 - currentX, currentY);
        ctx.closePath();
        fillColorCheckbox.checked ? ctx.fill() : ctx.stroke();
    }
}

function stopDraw() {
    isDrawing = false;
}

toolButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".tool.active")?.classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    });
});

sizeSlider.addEventListener("input", () => {
    brushSize = sizeSlider.value;
});

colorButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".colors .selected")?.classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = window.getComputedStyle(btn).backgroundColor;
    });
});

colorPicker.addEventListener("input", () => {
    selectedColor = colorPicker.value;
    colorPicker.parentElement.classList.add("selected");
});

clearCanvasBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBackground();
});

saveImgBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `drawing-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", stopDraw);
canvas.addEventListener("mouseleave", stopDraw);

const pickerParent = colorPicker.parentElement;

colorPicker.addEventListener("input", () => {
    pickerParent.style.backgroundColor = colorPicker.value;
});
