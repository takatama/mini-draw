import template from "./template.html?raw";
import style from "./style.css?raw";
import {
  FG_CANVAS,
  FG_COLOR_PICKER,
  THICKNESS_SLIDER,
  BG_CANVAS,
  BG_COLOR_PICKER,
  ERASER_INDICATOR,
  ERASER_SIZE_SLIDER,
  CLEAR_CANVAS_BUTTON,
  UNDO_BUTTON,
} from "./selectors.js";
import { pencilMode, bucketMode, eraserMode, backgroundMode } from "./modes.js";
import { createState } from "./state.js";
import {
  updateModeTools,
  updateEraserIndicatorSize,
  updateBackgroundColor,
} from "./ui.js";

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

    initialize(container);
  }

  function initialize(container) {
    const fgCanvas = container.querySelector(FG_CANVAS);
    const bgCanvas = container.querySelector(BG_CANVAS);
    const state = createState({
      container,
      fgColor: DEFAULT_PENCIL_COLOR,
      bgColor: DEFAULT_BG_COLOR,
      thickness: DEFAULT_THICKNESS,
      eraserSize: DEFAULT_ERASER_SIZE,
      fgCanvas,
      fgCtx: fgCanvas.getContext("2d"),
      bgCanvas,
      bgCtx: bgCanvas.getContext("2d"),
      eraserIndicator: container.querySelector(ERASER_INDICATOR),
    });
    state.setMode(pencilMode);

    setupEventListeners(state);
    state.clearCanvas();
  }

  return { init };
})();

function setupEventListeners(state) {
  function addCanvasEventListener_(canvas, eventTypes, func) {
    eventTypes.forEach((eventType) => canvas.addEventListener(eventType, func));
  }

  addCanvasEventListener_(
    state.fgCanvas,
    ["touchstart", "mousedown"],
    (event) => state.mode.handleStart(event)
  );
  addCanvasEventListener_(state.fgCanvas, ["touchmove", "mousemove"], (event) =>
    state.mode.handleMove(event)
  );
  addCanvasEventListener_(
    state.fgCanvas,
    ["touchend", "mouseup", "mouseout"],
    (event) => state.mode.handleEnd(event)
  );

  state.container.querySelectorAll("[name=mode]").forEach((radio) => {
    radio.addEventListener("change", (event) => {
      state.eraserIndicator.style.display = "none";
      updateModeTools(state.container, event.target.value);
      switch (event.target.value) {
        case "pencil":
          state.mode = pencilMode(state);
          break;
        case "eraser":
          state.mode = eraserMode(state);
          break;
        case "bucket":
          state.mode = bucketMode(state);
          break;
        case "background":
          state.mode = backgroundMode(state);
          break;
      }
    });
  });

  state.container
    .querySelector(FG_COLOR_PICKER)
    .addEventListener("input", (event) => {
      state.fgColor = event.target.value;
    });

  state.container
    .querySelector(THICKNESS_SLIDER)
    .addEventListener("input", (event) => {
      state.thickness = event.target.value;
    });

  state.container
    .querySelector(ERASER_SIZE_SLIDER)
    .addEventListener("input", (event) => {
      state.eraserSize = event.target.value;
      updateEraserIndicatorSize(state.eraserIndicator, state.eraserSize);
    });

  state.container
    .querySelector(BG_COLOR_PICKER)
    .addEventListener("input", (event) => {
      state.save();
      state.bgColor = event.target.value;
      updateBackgroundColor(state.container, state.bgCtx, state.bgColor);
    });

  state.container
    .querySelector(CLEAR_CANVAS_BUTTON)
    .addEventListener("click", state.clearCanvas);
  state.container
    .querySelector(UNDO_BUTTON)
    .addEventListener("click", state.undo);
}

export default MiniDraw;
