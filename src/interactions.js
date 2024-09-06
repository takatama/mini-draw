export function setupInteractions(elements, actions, state) {
  function addCanvasEventListener_(canvas, eventTypes, func) {
    eventTypes.forEach((eventType) => canvas.addEventListener(eventType, func));
  }

  const handleCanvasEvent = (event, type) => {
    const mode = state.mode;
    switch (type) {
      case "start":
        if (mode === "pencil") {
          state.isDrawing = true;
          state.hasMoved = false;
          actions.startDrawing(state.pencilColor, state.thickness, event);
        } else if (mode === "bucket") {
          state.save();
          actions.bucketFill(event);
        } else if (mode === "eraser") {
          state.save();
          actions.updateEraserIndicator(state.eraserSize, event);
        }
        break;
      case "move":
        if (mode === "pencil" && state.isDrawing) {
          if (!state.hasMoved) {
            state.save();
            state.hasMoved = true;
          }
          actions.drawLine(event);
        } else if (mode === "eraser") {
          actions.updateEraserIndicator(state.eraserSize, event);
          const withinCanvasBounds = actions.withinCanvasBounds(
            state.eraserSize,
            event
          );
          if (withinCanvasBounds && (event.buttons === 1 || event.touches)) {
            actions.erase(state.eraserSize, event);
          }
        }
        break;
      case "end":
        if (mode === "pencil") {
          state.isDrawing = false;
          state.hasMoved = false;
        }
        break;
    }
  };

  addCanvasEventListener_(
    elements.fgCanvas,
    ["touchstart", "mousedown"],
    (event) => handleCanvasEvent(event, "start")
  );
  addCanvasEventListener_(
    elements.fgCanvas,
    ["touchmove", "mousemove"],
    (event) => handleCanvasEvent(event, "move")
  );
  addCanvasEventListener_(
    elements.fgCanvas,
    ["touchend", "mouseup", "mouseout"],
    (event) => handleCanvasEvent(event, "end")
  );

  setupModeSwitching(elements, actions, state);

  elements.pencilColorPicker.addEventListener("input", (event) => {
    state.pencilColor = event.target.value;
  });

  elements.thicknessSlider.addEventListener("input", (event) => {
    state.thickness = event.target.value;
  });

  elements.eraserSizeSlider.addEventListener("input", (event) => {
    state.eraserSize = event.target.value;
    actions.setEraserIndicatorSize(state.eraserSize);
  });

  elements.bgColorPicker.addEventListener("input", (event) => {
    state.save();
    state.bgColor = event.target.value;
    actions.updateBackgroundColor(state.bgColor);
  });

  elements.clearCanvasButton.addEventListener("click", state.clearCanvas);
  elements.undoButton.addEventListener("click", state.undo);
}

function setupModeSwitching(elements, actions, state) {
  const modeRadios = elements.container.querySelectorAll("[name=mode]");
  modeRadios.forEach((radio) =>
    radio.addEventListener("change", (event) => {
      actions.hideEraserIndicator();
      actions.setToolMode(event.target.value);
      state.mode = event.target.value;
    })
  );
}
