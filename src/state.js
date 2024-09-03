export function saveState(state) {
  const stateSnapshot = {
    background: state.bgCanvas.toDataURL(),
    drawing: state.fgCanvas.toDataURL(),
    fgColor: state.fgColor,
    bgColor: state.bgColor,
  };
  state.undoStack.push(stateSnapshot);
}

export function undo(state) {
  return function (event) {
    if (state.undoStack.length > 0) {
      const lastState = state.undoStack.pop();

      const lastBackground = new Image();
      lastBackground.src = lastState.background;
      lastBackground.onload = () => {
        state.bgCtx.clearRect(
          0,
          0,
          state.bgCanvas.width,
          state.bgCanvas.height
        );
        state.bgCtx.drawImage(lastBackground, 0, 0);
      };

      const lastDrawing = new Image();
      lastDrawing.src = lastState.drawing;
      lastDrawing.onload = () => {
        state.fgCtx.clearRect(
          0,
          0,
          state.fgCanvas.width,
          state.fgCanvas.height
        );
        state.fgCtx.drawImage(lastDrawing, 0, 0);
      };

      state.fgColor = lastState.fgColor;
      state.container.querySelector("#md-fg-color-picker").value =
        lastState.fgColor;

      state.bgColor = lastState.bgColor;
      state.bgCtx.fillStyle = lastState.bgColor;
      state.bgCtx.fillRect(0, 0, state.bgCanvas.width, state.bgCanvas.height);
      state.container.querySelector("#md-bg-color-picker").value =
        lastState.bgColor;
      state.container
        .querySelector("#bg-icon")
        .setAttribute("fill", lastState.bgColor);
    }
  };
}
