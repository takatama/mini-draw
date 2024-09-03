import template from "./template.html?raw";
import style from "./style.css?raw";
import { createComponents } from "./components.js";
import { createState } from "./state.js";
import { pencilMode, bucketMode, eraserMode, backgroundMode } from "./modes";

const DEFAULT_PENCIL_COLOR = "#000000";
const DEFAULT_BG_COLOR = "#FFFFEF";
const DEFAULT_THICKNESS = 1;
const DEFAULT_ERASER_SIZE = 20;

const MiniDraw = (function () {
  function init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with id ${containerId} not found`);
      return;
    }
    container.innerHTML = template;

    const styleElement = document.createElement("style");
    styleElement.textContent = style;
    document.head.appendChild(styleElement);

    const components = createComponents(container);
    const state = createState({
      components,
      fgColor: DEFAULT_PENCIL_COLOR,
      bgColor: DEFAULT_BG_COLOR,
      thickness: DEFAULT_THICKNESS,
      eraserSize: DEFAULT_ERASER_SIZE,
    });
    state.mode = pencilMode(components, state);

    setupInteractions(components, state);
    state.clearCanvas();
  }

  return { init };
})();

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

  components.container.querySelectorAll("[name=mode]").forEach((radio) => {
    radio.addEventListener("change", (event) => {
      components.hideElement(components.eraserIndicator);
      components.updateModeTools(event.target.value);
      switch (event.target.value) {
        case "pencil":
          state.mode = pencilMode(components, state);
          break;
        case "eraser":
          state.mode = eraserMode(components, state);
          break;
        case "bucket":
          state.mode = bucketMode(components, state);
          break;
        case "background":
          state.mode = backgroundMode(components, state);
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
    components.updateEraserIndicatorSize(state.eraserSize);
  });

  components.bgColorPicker.addEventListener("input", (event) => {
    state.save();
    state.bgColor = event.target.value;
    components.updateBackgroundColor(
      components.bgCtx,
      components.bgIcon,
      state.bgColor
    );
  });

  components.clearCanvasButton.addEventListener("click", state.clearCanvas);
  components.undoButton.addEventListener("click", state.undo);
}

export default MiniDraw;
