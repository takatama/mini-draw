import { getPosition, startDrawing, drawLine, erase } from "./draw";
import { bucketFill } from "./fill";

const FG_CANVAS = "#md-fg-canvas";
const PENCIL_COLOR_PICKER = "#md-fg-color-picker";
const THICKNESS_SLIDER = "#md-thickness-slider";
const ERASER_INDICATOR = "#md-eraser-indicator";
const ERASER_SIZE_SLIDER = "#md-eraser-size-slider";
const BG_CANVAS = "#md-bg-canvas";
const BG_COLOR_PICKER = "#md-bg-color-picker";
const BG_ICON = "#bg-icon";
const CLEAR_CANVAS_BUTTON = "#md-clear-canvas";
const UNDO_BUTTON = "#md-undo";
const MODE_TOOLS = "#md-mode-tools";

export function createElements(container) {
  const fgCanvas = container.querySelector(FG_CANVAS);
  fgCanvas.style.willReadFrequently = true;
  const bgCanvas = container.querySelector(BG_CANVAS);

  return {
    container,
    fgCanvas,
    fgCtx: fgCanvas.getContext("2d"),
    pencilColorPicker: container.querySelector(PENCIL_COLOR_PICKER),
    thicknessSlider: container.querySelector(THICKNESS_SLIDER),
    bgCanvas,
    bgCtx: bgCanvas.getContext("2d"),
    bgColorPicker: container.querySelector(BG_COLOR_PICKER),
    bgIcon: container.querySelector(BG_ICON),
    eraserIndicator: container.querySelector(ERASER_INDICATOR),
    eraserSizeSlider: container.querySelector(ERASER_SIZE_SLIDER),
    clearCanvasButton: container.querySelector(CLEAR_CANVAS_BUTTON),
    undoButton: container.querySelector(UNDO_BUTTON),
    modeTools: container.querySelector(MODE_TOOLS),
  };
}

export function createActions(elements) {
  const { fgCanvas, fgCtx, bgCanvas, bgCtx, eraserIndicator } = elements;

  const actions = {
    clearCanvas: (bgColor) => {
      fgCtx.clearRect(0, 0, fgCanvas.width, fgCanvas.height);
      bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
      bgCtx.fillStyle = bgColor;
      bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
    },

    applyUndo: (state, lastState) => {
      if (lastState) {
        updateCanvas(bgCanvas, bgCtx, lastState.background);
        updateCanvas(fgCanvas, fgCtx, lastState.drawing);
        elements.pencilColorPicker.value = state.pencilColor;
        actions.updateBackgroundColor(state.bgColor);
      }
    },

    setToolMode: (mode) => {
      elements.modeTools.className = `mode-${mode}`;
    },

    startDrawing: (pencilColor, thickness, event) => {
      startDrawing(fgCanvas, fgCtx, pencilColor, thickness, event);
    },

    drawLine: (event) => {
      drawLine(fgCanvas, fgCtx, event);
    },

    bucketFill: (event) => {
      bucketFill(fgCanvas, fgCtx, elements.pencilColorPicker.value, event);
    },

    erase: (eraserSize, event) => {
      erase(fgCanvas, fgCtx, eraserSize, event);
    },

    setEraserIndicatorSize: (eraserSize) => {
      eraserIndicator.style.width = `${eraserSize}px`;
      eraserIndicator.style.height = `${eraserSize}px`;
    },

    hideEraserIndicator: () => {
      eraserIndicator.style.display = "none";
    },

    updateEraserIndicator: (eraserSize, event) => {
      const withinCanvasBounds = actions.withinCanvasBounds(eraserSize, event);
      eraserIndicator.style.display = withinCanvasBounds ? "block" : "none";
      setEraserIndicatorPosition(eraserIndicator, eraserSize, event);
    },

    withinCanvasBounds: (eraserSize, event) => {
      const { x, y } = getPosition(fgCanvas, event);
      return (
        x - eraserSize / 2 > 0 &&
        x + eraserSize / 2 < fgCanvas.width &&
        y - eraserSize / 2 > 0 &&
        y + eraserSize / 2 < fgCanvas.height
      );
    },

    updateBackgroundColor: (color) => {
      const ctx = bgCtx;
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      elements.bgIcon.setAttribute("fill", color);
    },
  };

  return actions;
}

function setEraserIndicatorPosition(indicator, eraserSize, event) {
  const x =
    (event.clientX || event.touches[0].clientX) -
    eraserSize / 2 +
    window.scrollX;
  const y =
    (event.clientY || event.touches[0].clientY) -
    eraserSize / 2 +
    window.scrollY;
  indicator.style.left = `${x}px`;
  indicator.style.top = `${y}px`;
}

function updateCanvas(canvas, ctx, imageDataUrl) {
  const image = new Image();
  image.src = imageDataUrl;
  image.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
  };
}
