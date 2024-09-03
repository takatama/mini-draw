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
