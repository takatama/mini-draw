export function clearCanvas({ fgCanvas, fgCtx, bgCanvas, bgCtx, bgColor }) {
  fgCtx.clearRect(0, 0, fgCanvas.width, fgCanvas.height);
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  bgCtx.fillStyle = bgColor;
  bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
}

export function applyUndo(state, lastState) {
  if (lastState) {
    updateCanvas(state.bgCanvas, state.bgCtx, lastState.background);
    updateCanvas(state.fgCanvas, state.fgCtx, lastState.drawing);
    updateColorPicker(state.fgColorPicker, state.fgColor);
    updateBackgroundColor(state.bgCtx, state.bgIcon, state.bgColor);
  }
}

export function updateModeTools(modeTools, mode) {
  modeTools.className = `mode-${mode}`;
}

export function updateEraserIndicatorSize(eraserIndicator, eraserSize) {
  eraserIndicator.style.width = `${eraserSize}px`;
  eraserIndicator.style.height = `${eraserSize}px`;
}

export function updateBackgroundColor(ctx, bgIcon, color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  bgIcon.setAttribute("fill", color);
}

export function hideElement(element) {
  element.style.display = "none";
}

export function updateEraserIndicatorPosition(
  eraserIndicator,
  eraserSize,
  event
) {
  const x =
    (event.clientX || event.touches[0].clientX) -
    eraserSize / 2 +
    window.scrollX;
  const y =
    (event.clientY || event.touches[0].clientY) -
    eraserSize / 2 +
    window.scrollY;
  eraserIndicator.style.left = `${x}px`;
  eraserIndicator.style.top = `${y}px`;
}

export function updateEraserIndicatorVisibility(eraserIndicator, isVisible) {
  eraserIndicator.style.display = isVisible ? "block" : "none";
}

export function getColor(picker) {
  return picker.value;
}

function updateCanvas(canvas, ctx, imageDataUrl) {
  const image = new Image();
  image.src = imageDataUrl;
  image.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
  };
}

function updateColorPicker(picker, color) {
  if (picker) picker.value = color;
}
