import {
  updateModeTools,
  updateEraserIndicatorSize,
  updateBackgroundColor,
  updateEraserIndicatorVisibility,
} from "./ui.js";
import { pencilMode, bucketMode, eraserMode, backgroundMode } from "./modes.js";

export function setupInteractions(state, components) {
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

  components.container.querySelectorAll("[name=mode]").forEach((radio) => {
    radio.addEventListener("change", (event) => {
      updateEraserIndicatorVisibility(components.eraserIndicator, false);
      updateModeTools(components.modeTools, event.target.value);
      switch (event.target.value) {
        case "pencil":
          state.setMode(pencilMode);
          break;
        case "eraser":
          state.setMode(eraserMode);
          break;
        case "bucket":
          state.setMode(bucketMode);
          break;
        case "background":
          state.setMode(backgroundMode);
          break;
      }
    });
  });

  components.fgColorPicker.addEventListener("input", (event) => {
    state.fgColor = event.target.value;
  });

  components.thicknessSlider.addEventListener("input", (event) => {
    state.thickness = event.target.value;
  });

  components.eraserSizeSlider.addEventListener("input", (event) => {
    state.eraserSize = event.target.value;
    updateEraserIndicatorSize(components.eraserIndicator, state.eraserSize);
  });

  components.bgColorPicker.addEventListener("input", (event) => {
    state.save();
    state.bgColor = event.target.value;
    updateBackgroundColor(state.bgCtx, components.bgIcon, state.bgColor);
  });

  components.clearCanvasButton.addEventListener("click", state.clearCanvas);
  components.undoButton.addEventListener("click", state.undo);
}
