import {
  FG_CANVAS,
  FG_COLOR_PICKER,
  THICKNESS_SLIDER,
  BG_CANVAS,
  BG_COLOR_PICKER,
  ERASER_INDICATOR,
  ERASER_SIZE_SLIDER,
  CLEAR_CANVAS_BUTTON,
  UNDO_BUTTON,
  BG_ICON,
  MODE_TOOLS,
} from "./selectors.js";

export function createComponents(container) {
  const fgCanvas = container.querySelector(FG_CANVAS);
  const bgCanvas = container.querySelector(BG_CANVAS);

  return {
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
}
