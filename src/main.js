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
        "number",
        "canvasWidth"
      ),
      canvasHeight: validateValue(
        options.canvasHeight,
        DEFAULTS.CANVAS_HEIGHT,
        "number",
        "canvasHeight"
      ),
      pencilColor: validateValue(
        options.pencilColor,
        DEFAULTS.PENCIL_COLOR,
        "color",
        "pencilColor"
      ),
      bgColor: validateValue(
        options.bgColor,
        DEFAULTS.BG_COLOR,
        "color",
        "bgColor"
      ),
      thickness: validateValue(
        options.thickness,
        DEFAULTS.THICKNESS,
        "number",
        "thickness"
      ),
      eraserSize: validateValue(
        options.eraserSize,
        DEFAULTS.ERASER_SIZE,
        "number",
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

    components.init(state);
    state.clearCanvas();
  }

  function validateValue(value, defaultValue, type, name) {
    const validators = {
      number: (v) => typeof v === "number" && v > 0,
      color: (v) => /^#[0-9A-F]{6}$/i.test(v),
    };

    if (value === undefined) {
      return defaultValue;
    }
    if (!validators[type](value)) {
      console.warn(`Invalid ${name}: ${value}. Using default value.`);
      return defaultValue;
    }
    return value;
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

  return { init };
})();

export default MiniDraw;
