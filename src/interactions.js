import { pencilMode, bucketMode, eraserMode, backgroundMode } from "./modes";

export function setupInteractions(elements, actions, state) {
  function addCanvasEventListener_(canvas, eventTypes, func) {
    eventTypes.forEach((eventType) => canvas.addEventListener(eventType, func));
  }

  addCanvasEventListener_(
    elements.fgCanvas,
    ["touchstart", "mousedown"],
    (event) => state.mode.handleStart(event)
  );
  addCanvasEventListener_(
    elements.fgCanvas,
    ["touchmove", "mousemove"],
    (event) => state.mode.handleMove(event)
  );
  addCanvasEventListener_(
    elements.fgCanvas,
    ["touchend", "mouseup", "mouseout"],
    (event) => state.mode.handleEnd(event)
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
      state.mode = switchMode(event.target.value, actions, state);
    })
  );
}

const modeMapping = {
  pencil: pencilMode,
  eraser: eraserMode,
  bucket: bucketMode,
  background: backgroundMode,
};

function switchMode(value, actions, state) {
  const modeFunction = modeMapping[value];
  if (!modeFunction) {
    console.error(`Unknown mode: ${value}`);
    return state.mode;
  }

  return modeFunction(actions, state);
}
