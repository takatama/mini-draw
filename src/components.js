const FG_CANVAS = "#md-fg-canvas";
const FG_COLOR_PICKER = "#md-fg-color-picker";
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
    fgColorPicker: container.querySelector(FG_COLOR_PICKER),
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

  components.clearCanvas = function (bgColor) {
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
  };

  components.applyUndo = function (state, lastState) {
    if (lastState) {
      components.updateCanvas(
        components.bgCanvas,
        components.bgCtx,
        lastState.background
      );
      components.updateCanvas(
        components.fgCanvas,
        components.fgCtx,
        lastState.drawing
      );
      components.updateColorPicker(components.fgColorPicker, state.fgColor);
      components.updateBackgroundColor(
        components.bgCtx,
        components.bgIcon,
        state.bgColor
      );
    }
  };

  components.updateModeTools = function (mode) {
    components.modeTools.className = `mode-${mode}`;
  };

  components.updateEraserIndicatorSize = function (eraserSize) {
    components.eraserIndicator.style.width = `${eraserSize}px`;
    components.eraserIndicator.style.height = `${eraserSize}px`;
  };

  components.updateBackgroundColor = function (ctx, bgIcon, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    bgIcon.setAttribute("fill", color);
  };

  components.hideElement = function (element) {
    element.style.display = "none";
  };

  components.updateEraserIndicatorPosition = function (eraserSize, event) {
    const x =
      (event.clientX || event.touches[0].clientX) -
      eraserSize / 2 +
      window.scrollX;
    const y =
      (event.clientY || event.touches[0].clientY) -
      eraserSize / 2 +
      window.scrollY;
    components.eraserIndicator.style.left = `${x}px`;
    components.eraserIndicator.style.top = `${y}px`;
  };

  components.updateEraserIndicatorVisibility = function (isVisible) {
    components.eraserIndicator.style.display = isVisible ? "block" : "none";
  };

  components.getFgColor = function () {
    return components.fgColorPicker.value;
  };

  components.updateCanvas = function (canvas, ctx, imageDataUrl) {
    const image = new Image();
    image.src = imageDataUrl;
    image.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);
    };
  };

  components.updateColorPicker = function (picker, color) {
    if (picker) picker.value = color;
  };

  return components;
}
