import { pencilMode, bucketMode, eraserMode, backgroundMode } from "./modes";

export function setupInteractions(components, state) {
  function addCanvasEventListener_(canvas, eventTypes, func) {
    eventTypes.forEach((eventType) => canvas.addEventListener(eventType, func));
  }

  addCanvasEventListener_(
    components.fgCanvas,
    ["touchstart", "mousedown"],
    (event) => state.mode.handleStart(event)
  );
  addCanvasEventListener_(
    components.fgCanvas,
    ["touchmove", "mousemove"],
    (event) => state.mode.handleMove(event)
  );
  addCanvasEventListener_(
    components.fgCanvas,
    ["touchend", "mouseup", "mouseout"],
    (event) => state.mode.handleEnd(event)
  );

  setupModeSwitching(components, state);

  components.pencilColorPicker.addEventListener("input", (event) => {
    state.pencilColor = event.target.value;
  });

  components.thicknessSlider.addEventListener("input", (event) => {
    state.thickness = event.target.value;
  });

  components.eraserSizeSlider.addEventListener("input", (event) => {
    state.eraserSize = event.target.value;
    components.setEraserIndicatorSize(state.eraserSize);
  });

  components.bgColorPicker.addEventListener("input", (event) => {
    state.save();
    state.bgColor = event.target.value;
    components.updateBackgroundColor(state.bgColor);
  });

  components.clearCanvasButton.addEventListener("click", state.clearCanvas);
  components.undoButton.addEventListener("click", state.undo);
}

function setupModeSwitching(components, state) {
  components.container.querySelectorAll("[name=mode]").forEach((radio) => {
    radio.addEventListener("change", (event) => {
      components.hideEraserIndicator();
      components.setToolMode(event.target.value);
      state.mode = switchMode(event.target.value, components, state);
    });
  });
}

function switchMode(value, components, state) {
  const modes = {
    pencil: pencilMode,
    eraser: eraserMode,
    bucket: bucketMode,
    background: backgroundMode,
  };

  if (!modes[value]) {
    console.error(`Unknown mode: ${value}`);
    return state.mode;
  }

  return modes[value](components, state);
}
