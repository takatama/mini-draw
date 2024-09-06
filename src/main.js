import template from "./template.html?raw";
import style from "./style.css?raw";
import { createElements, createActions } from "./components.js";
import { createState } from "./state.js";
import { setupInteractions } from "./interactions.js";

const DEFAULTS = {
  CANVAS_WIDTH: 340,
  CANVAS_HEIGHT: 340,
  PENCIL_COLOR: "#000000",
  BG_COLOR: "#FFFFEF",
  THICKNESS: 1,
  ERASER_SIZE: 20,
};

const validators = {
  number: (v) => typeof v === "number" && v > 0,
  color: (v) => /^#[0-9A-F]{6}$/i.test(v),
};

const MiniDraw = (function () {
  function init(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with id ${containerId} not found`);
      return;
    }

    const defaults = {
      canvasWidth: DEFAULTS.CANVAS_WIDTH,
      canvasHeight: DEFAULTS.CANVAS_HEIGHT,
      pencilColor: DEFAULTS.PENCIL_COLOR,
      bgColor: DEFAULTS.BG_COLOR,
      thickness: DEFAULTS.THICKNESS,
      eraserSize: DEFAULTS.ERASER_SIZE,
    };

    const validatedOptions = Object.keys(defaults).reduce((acc, key) => {
      acc[key] = validateValue(
        options[key],
        defaults[key],
        typeof defaults[key],
        key
      );
      return acc;
    }, {});

    injectTemplate({
      container,
      ...validatedOptions,
    });

    const elements = createElements(container);
    const actions = createActions(elements);
    const state = createState({
      elements,
      actions,
      ...validatedOptions,
    });
    state.mode = "pencil";
    setupInteractions(elements, actions, state);
    state.clearCanvas();
  }

  function validateValue(value, defaultValue, type, name) {
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

    Object.entries(rest).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      finalTemplate = finalTemplate.replace(regex, value);
      finalStyle = finalStyle.replace(regex, value);
    });

    container.innerHTML = finalTemplate;

    const styleElement = document.createElement("style");
    styleElement.textContent = finalStyle;
    document.head.appendChild(styleElement);
  }

  return { init };
})();

export default MiniDraw;
