import template from "./template.html?raw";
import style from "./style.css?raw";
import { pencilMode, bucketMode, eraserMode, backgroundMode } from "./modes.js";
import { createState } from "./state.js";
import { createComponents } from "./components.js";
import { setupInteractions } from "./interactions.js";

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
      fgColor: DEFAULT_PENCIL_COLOR,
      bgColor: DEFAULT_BG_COLOR,
      thickness: DEFAULT_THICKNESS,
      eraserSize: DEFAULT_ERASER_SIZE,
      ...components,
    });
    state.setMode(pencilMode);

    setupInteractions(state, components);
    state.clearCanvas();
  }

  return { init };
})();

export default MiniDraw;
