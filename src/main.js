import template from "./template.html?raw";
import style from "./style.css?raw";
import { createComponents } from "./components.js";
import { createState } from "./state.js";
import { pencilMode, bucketMode, eraserMode, backgroundMode } from "./modes";

const DEFAULT_PENCIL_COLOR = "#000000";
const DEFAULT_BG_COLOR = "#FFFFEF";
const DEFAULT_THICKNESS = 1;
const DEFAULT_ERASER_SIZE = 20;
const DEFAULT_CANVAS_WIDTH = 340;
const DEFAULT_CANVAS_HEIGHT = 340;

const MiniDraw = (function () {
  function init(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with id ${containerId} not found`);
      return;
    }
    const {
      canvasWidth = DEFAULT_CANVAS_WIDTH,
      canvasHeight = DEFAULT_CANVAS_HEIGHT,
    } = options;

    injectTemplate(container, canvasWidth, canvasHeight);
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

  function injectTemplate(container, canvasWidth, canvasHeight) {
    const finalTemplate = template
      .replace(/{{canvasWidth}}/g, canvasWidth)
      .replace(/{{canvasHeight}}/g, canvasHeight);
    container.innerHTML = finalTemplate;

    const finalStyle = style
      .replace(/{{canvasWidth}}/g, canvasWidth)
      .replace(/{{canvasHeight}}/g, canvasHeight);
    const styleElement = document.createElement("style");
    styleElement.textContent = finalStyle;
    document.head.appendChild(styleElement);
  }

  function setupInteractions(components, state) {
    function addCanvasEventListener_(canvas, eventTypes, func) {
      eventTypes.forEach((eventType) =>
        canvas.addEventListener(eventType, func)
      );
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
      components.updateBackgroundColor(state.bgColor);
    });

    components.clearCanvasButton.addEventListener("click", state.clearCanvas);
    components.undoButton.addEventListener("click", state.undo);
  }

  function setupModeSwitching(components, state) {
    components.container.querySelectorAll("[name=mode]").forEach((radio) => {
      radio.addEventListener("change", (event) => {
        components.hideEraserIndicator();
        components.setModeTools(event.target.value);
        state.mode = switchMode(event.target.value, components, state);
      });
    });
  }

  function switchMode(value, components, state) {
    switch (value) {
      case "pencil":
        return pencilMode(components, state);
      case "eraser":
        return eraserMode(components, state);
      case "bucket":
        return bucketMode(components, state);
      case "background":
        return backgroundMode(components, state);
      default:
        console.error(`Unknown mode: ${value}`);
        return state.mode;
    }
  }

  return { init };
})();

export default MiniDraw;
