import template from "./template.html?raw";
import style from "./style.css?raw";
import { createComponents } from "./components.js";
import { createState } from "./state.js";
import { pencilMode, bucketMode, eraserMode, backgroundMode } from "./modes";

const DEFAULT_CANVAS_WIDTH = 340;
const DEFAULT_CANVAS_HEIGHT = 340;
const DEFAULT_PENCIL_COLOR = "#000000";
const DEFAULT_BG_COLOR = "#FFFFEF";
const DEFAULT_THICKNESS = 1;
const DEFAULT_ERASER_SIZE = 20;

const MiniDraw = (function () {
  function init(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with id ${containerId} not found`);
      return;
    }

    const validatedOptions = {
      canvasWidth: validateOrDefault(
        options.canvasWidth,
        DEFAULT_CANVAS_WIDTH,
        validatePositiveNumber,
        "canvasWidth"
      ),
      canvasHeight: validateOrDefault(
        options.canvasHeight,
        DEFAULT_CANVAS_HEIGHT,
        validatePositiveNumber,
        "canvasHeight"
      ),
      pencilColor: validateOrDefault(
        options.pencilColor,
        DEFAULT_PENCIL_COLOR,
        validateColor,
        "pencilColor"
      ),
      bgColor: validateOrDefault(
        options.bgColor,
        DEFAULT_BG_COLOR,
        validateColor,
        "bgColor"
      ),
      thickness: validateOrDefault(
        options.thickness,
        DEFAULT_THICKNESS,
        validatePositiveNumber,
        "thickness"
      ),
      eraserSize: validateOrDefault(
        options.eraserSize,
        DEFAULT_ERASER_SIZE,
        validatePositiveNumber,
        "eraserSize"
      ),
    };

    injectTemplate({
      container,
      ...validatedOptions,
    });

    const components = createComponents(container);
    const state = createState({
      components,
      ...validatedOptions,
    });
    state.mode = pencilMode(components, state);

    setupInteractions(components, state);
    state.clearCanvas();
  }

  function validateOrDefault(value, defaultValue, validator, name) {
    if (value === undefined) {
      return defaultValue;
    }
    return validator(value, name) ? value : defaultValue;
  }

  function validatePositiveNumber(value, name) {
    if (typeof value !== "number" || value <= 0) {
      console.warn(`Invalid ${name}: ${value}. Using default value.`);
      return false;
    }
    return true;
  }

  function validateColor(color, name) {
    const isValid = /^#[0-9A-F]{6}$/i.test(color);
    if (!isValid) {
      console.warn(`Invalid ${name}: ${color}. Using default value.`);
      return false;
    }
    return true;
  }

  function injectTemplate({
    container,
    canvasWidth,
    canvasHeight,
    pencilColor,
    bgColor,
    thickness,
    eraserSize,
  }) {
    const finalTemplate = template
      .replace(/{{canvasWidth}}/g, canvasWidth)
      .replace(/{{canvasHeight}}/g, canvasHeight)
      .replace(/{{pencilColor}}/g, pencilColor)
      .replace(/{{bgColor}}/g, bgColor)
      .replace(/{{thickness}}/g, thickness)
      .replace(/{{eraserSize}}/g, eraserSize);
    container.innerHTML = finalTemplate;

    const finalStyle = style
      .replace(/{{canvasWidth}}/g, canvasWidth)
      .replace(/{{canvasHeight}}/g, canvasHeight)
      .replace(/{{pencilColor}}/g, pencilColor)
      .replace(/{{bgColor}}/g, bgColor)
      .replace(/{{thickness}}/g, thickness)
      .replace(/{{eraserSize}}/g, eraserSize);
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

    components.pencilColorPicker.addEventListener("input", (event) => {
      state.pencilColor = event.target.value;
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
