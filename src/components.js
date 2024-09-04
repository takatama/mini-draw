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

export function createComponents(container) {
  const fgCanvas = container.querySelector(FG_CANVAS);
  fgCanvas.style.willReadFrequently = true;
  const bgCanvas = container.querySelector(BG_CANVAS);

  const components = {
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

    clearCanvas: (bgColor) => {
      components.fgCtx.clearRect(
        0,
        0,
        components.fgCanvas.width,
        components.fgCanvas.height
      );
      components.bgCtx.clearRect(
        0,
        0,
        components.bgCanvas.width,
        components.bgCanvas.height
      );
      components.bgCtx.fillStyle = bgColor;
      components.bgCtx.fillRect(
        0,
        0,
        components.bgCanvas.width,
        components.bgCanvas.height
      );
    },

    applyUndo: (state, lastState) => {
      if (lastState) {
        updateCanvas(
          components.bgCanvas,
          components.bgCtx,
          lastState.background
        );
        updateCanvas(components.fgCanvas, components.fgCtx, lastState.drawing);
        components.pencilColorPicker.value = state.pencilColor;
        components.updateBackgroundColor(state.bgColor);
      }
    },

    setToolMode: (mode) => {
      components.modeTools.className = `mode-${mode}`;
    },

    startDrawing: (pencilColor, thickness, event) => {
      startDrawing(
        components.fgCanvas,
        components.fgCtx,
        pencilColor,
        thickness,
        event
      );
    },

    drawLine: (event) => {
      drawLine(components.fgCanvas, components.fgCtx, event);
    },

    bucketFill: (event) => {
      bucketFill(
        components.fgCanvas,
        components.fgCtx,
        components.pencilColorPicker.value,
        event
      );
    },

    erase: (eraserSize, event) => {
      erase(components.fgCanvas, components.fgCtx, eraserSize, event);
    },

    setEraserIndicatorSize: (eraserSize) => {
      components.eraserIndicator.style.width = `${eraserSize}px`;
      components.eraserIndicator.style.height = `${eraserSize}px`;
    },

    hideEraserIndicator: () => {
      components.eraserIndicator.style.display = "none";
    },

    updateEraserIndicator: (eraserSize, event) => {
      const canvas = components.fgCanvas;
      const { x, y } = getPosition(components.fgCanvas, event);
      const withinCanvasBounds =
        x - eraserSize / 2 > 0 &&
        x + eraserSize / 2 < canvas.width &&
        y - eraserSize / 2 > 0 &&
        y + eraserSize / 2 < canvas.height;
      components.eraserIndicator.style.display = withinCanvasBounds
        ? "block"
        : "none";
      setEraserIndicatorPosition(components.eraserIndicator, eraserSize, event);
      return { x, y, withinCanvasBounds };
    },

    updateBackgroundColor: (color) => {
      const ctx = components.bgCtx;
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      components.bgIcon.setAttribute("fill", color);
    },
  };

  return components;
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
