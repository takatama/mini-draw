export function updateColorPicker(container, selector, color) {
  const picker = container.querySelector(selector);
  if (picker) picker.value = color;
}

export function updateCanvas(canvas, ctx, imageDataUrl) {
  const image = new Image();
  image.src = imageDataUrl;
  image.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
  };
}

export function updateBackgroundColor(container, ctx, color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  container.querySelector("#bg-icon").setAttribute("fill", color);
}

export function clearCanvas({ fgCanvas, fgCtx, bgCanvas, bgCtx, bgColor }) {
  fgCtx.clearRect(0, 0, fgCanvas.width, fgCanvas.height);
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  bgCtx.fillStyle = bgColor;
  bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
}

export function updateModeTools(container, mode) {
  container.querySelector("#md-mode-tools").className = `mode-${mode}`;
}

export function updateEraserIndicatorSize(eraserIndicator, eraserSize) {
  eraserIndicator.style.width = `${eraserSize}px`;
  eraserIndicator.style.height = `${eraserSize}px`;
}

export function applyUndo(state, lastState) {
  if (lastState) {
    updateCanvas(state.bgCanvas, state.bgCtx, lastState.background);
    updateCanvas(state.fgCanvas, state.fgCtx, lastState.drawing);
    updateColorPicker(state.container, "#md-fg-color-picker", state.fgColor);
    updateBackgroundColor(state.container, state.bgCtx, state.bgColor);
  }
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
