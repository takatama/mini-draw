import template from "./template.html?raw";
import style from "./style.css?raw";
import { createComponents } from "./components.js";
import { createState } from "./state.js";
import { pencilMode, bucketMode, eraserMode, backgroundMode } from "./modes";

const DEFAULTS = {
  CANVAS_WIDTH: 340,
  CANVAS_HEIGHT: 340,
  PENCIL_COLOR: "#000000",
  BG_COLOR: "#FFFFEF",
  THICKNESS: 1,
  ERASER_SIZE: 20,
};

const MiniDraw = (function () {
  function init(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with id ${containerId} not found`);
      return;
    }

    const validatedOptions = {
      canvasWidth: validateValue(
        options.canvasWidth,
        DEFAULTS.CANVAS_WIDTH,
        validatePositiveNumber,
        "canvasWidth"
      ),
      canvasHeight: validateValue(
        options.canvasHeight,
        DEFAULTS.CANVAS_HEIGHT,
        validatePositiveNumber,
        "canvasHeight"
      ),
      pencilColor: validateValue(
        options.pencilColor,
        DEFAULTS.PENCIL_COLOR,
        validateColor,
        "pencilColor"
      ),
      bgColor: validateValue(
        options.bgColor,
        DEFAULTS.BG_COLOR,
        validateColor,
        "bgColor"
      ),
      thickness: validateValue(
        options.thickness,
        DEFAULTS.THICKNESS,
        validatePositiveNumber,
        "thickness"
      ),
      eraserSize: validateValue(
        options.eraserSize,
        DEFAULTS.ERASER_SIZE,
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

  function validateValue(value, defaultValue, validator, name) {
    if (value === undefined) {
      return defaultValue;
    }
    if (!validator(value)) {
      console.warn(`Invalid ${name}: ${value}. Using default value.`);
      return defaultValue;
    }
    return value;
  }

  function validatePositiveNumber(value) {
    return typeof value === "number" && value > 0;
  }

  function validateColor(color) {
    return /^#[0-9A-F]{6}$/i.test(color);
  }

  function injectTemplate(options) {
    const { container, ...rest } = options;

    let finalTemplate = template;
    let finalStyle = style;

    Object.keys(rest).forEach((key) => {
      finalTemplate = finalTemplate.replace(
        new RegExp(`{{${key}}}`, "g"),
        rest[key]
      );
      finalStyle = finalStyle.replace(new RegExp(`{{${key}}}`, "g"), rest[key]);
    });

    container.innerHTML = finalTemplate;

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

  return { init };
})();

export default MiniDraw;
