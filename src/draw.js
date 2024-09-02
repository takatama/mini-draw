export function saveState(state) {
  const stateSnapshot = {
    background: state.bgCanvas.toDataURL(),
    drawing: state.fgCanvas.toDataURL(),
    fgColor: state.fgColor,
    bgColor: state.bgColor,
  };
  state.undoStack.push(stateSnapshot);
}

export function getPosition(state, event) {
  const rect = state.fgCanvas.getBoundingClientRect();
  const x = (event.clientX || event.touches[0].clientX) - rect.left;
  const y = (event.clientY || event.touches[0].clientY) - rect.top;
  return { x: Math.floor(x), y: Math.floor(y) };
}

export function setIndicatorPosition(state, event) {
  const x =
    (event.clientX || event.touches[0].clientX) -
    state.eraserSize / 2 +
    window.scrollX;
  const y =
    (event.clientY || event.touches[0].clientY) -
    state.eraserSize / 2 +
    window.scrollY;
  state.eraserIndicator.style.left = x + "px";
  state.eraserIndicator.style.top = y + "px";
}

export function startDrawing(state, x, y) {
  state.fgCtx.lineCap = "round";
  state.fgCtx.lineJoin = "round";
  state.fgCtx.strokeStyle = state.fgColor;
  state.fgCtx.lineWidth = state.thickness;
  state.fgCtx.beginPath();
  state.fgCtx.moveTo(x, y);
}

export function drawLine(state, x, y) {
  state.fgCtx.lineTo(x, y);
  state.fgCtx.stroke();
}

export function erase(state, x, y) {
  state.fgCtx.save();
  state.fgCtx.globalCompositeOperation = "destination-out";
  state.fgCtx.beginPath();
  state.fgCtx.arc(x, y, state.eraserSize / 2, 0, Math.PI * 2, false);
  state.fgCtx.fill();
  state.fgCtx.restore();
}
