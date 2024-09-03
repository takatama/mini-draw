import template from "./template.html?raw";
import style from "./style.css?raw";
import {
  handleStart,
  handleMove,
  handleEnd,
  pencilMode,
  bucketMode,
  eraserMode,
  backgroundMode,
} from "./modes.js";
import { createState } from "./state.js";

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
    const fgCanvas = container.querySelector("#md-fg-canvas");
    const bgCanvas = container.querySelector("#md-bg-canvas");
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
      eraserIndicator: container.querySelector("#md-eraser-indicator"),
    });
    state.mode = pencilMode(state);

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
    handleStart(state)
  );
  addCanvasEventListener_(
    state.fgCanvas,
    ["touchmove", "mousemove"],
    handleMove(state)
  );
  addCanvasEventListener_(
    state.fgCanvas,
    ["touchend", "mouseup", "mouseout"],
    handleEnd(state)
  );

  state.container.querySelectorAll("[name=mode]").forEach((radio) => {
    radio.addEventListener("change", (event) => {
      state.eraserIndicator.style.display = "none";
      state.container.querySelector(
        "#md-mode-tools"
      ).className = `mode-${event.target.value}`;
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
    .querySelector("#md-fg-color-picker")
    .addEventListener("input", (event) => {
      state.fgColor = event.target.value;
    });

  state.container
    .querySelector("#md-thickness-slider")
    .addEventListener("input", (event) => {
      state.thickness = event.target.value;
    });

  state.container
    .querySelector("#md-eraser-size-slider")
    .addEventListener("input", (event) => {
      state.eraserSize = event.target.value;
      state.eraserIndicator.style.width = state.eraserSize + "px";
      state.eraserIndicator.style.height = state.eraserSize + "px";
    });

  state.container
    .querySelector("#md-bg-color-picker")
    .addEventListener("input", (event) => {
      state.save();
      state.bgColor = event.target.value;
      state.bgCtx.fillStyle = event.target.value;
      state.bgCtx.fillRect(0, 0, state.bgCanvas.width, state.bgCanvas.height);
      state.container
        .querySelector("#bg-icon")
        .setAttribute("fill", event.target.value);
    });

  state.container
    .querySelector("#md-clear-canvas")
    .addEventListener("click", state.clearCanvas);
  state.container
    .querySelector("#md-undo")
    .addEventListener("click", state.undo);
}

export default MiniDraw;
