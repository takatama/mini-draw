import { getPosition, startDrawing, drawLine, erase } from "./draw.js";
import { bucketFill, hexToRgbA } from "./fill.js";

const CANVAS_SIZE = 340;

export function pencilMode(components, state) {
  return {
    isDrawing: false,
    handleStart(event) {
      const { x, y } = getPosition(components.fgCanvas, event);
      components.hideElement(components.eraserIndicator);
      startDrawing(components.fgCtx, state.fgColor, state.thickness, x, y);
      this.isDrawing = true;
      state.save();
    },
    handleMove(event) {
      if (!this.isDrawing) return;
      const { x, y } = getPosition(components.fgCanvas, event);
      drawLine(components.fgCtx, x, y);
    },
    handleEnd() {
      this.isDrawing = false;
    },
  };
}

export function bucketMode(components, state) {
  return {
    handleStart(event) {
      const { x, y } = getPosition(components.fgCanvas, event);
      const fillColor = hexToRgbA(components.getFgColor());
      state.save();
      bucketFill(components.fgCanvas, components.fgCtx, x, y, fillColor);
    },
    handleMove(event) {},
    handleEnd() {},
  };
}

export function eraserMode(components, state) {
  return {
    handleStart(event) {
      state.save();
      components.setEraserIndicatorPosition(state.eraserSize, event);
    },
    handleMove(event) {
      const { x, y } = getPosition(components.fgCanvas, event);
      const withinCanvasBounds =
        x - state.eraserSize / 2 > 0 &&
        x + state.eraserSize / 2 < CANVAS_SIZE &&
        y - state.eraserSize / 2 > 0 &&
        y + state.eraserSize / 2 < CANVAS_SIZE;
      components.setEraserIndicatorVisibility(withinCanvasBounds);
      components.setEraserIndicatorPosition(state.eraserSize, event);
      if (event.buttons === 1 || event.touches) {
        erase(components.fgCtx, state.eraserSize, x, y);
      }
    },
    handleEnd() {},
  };
}

export function backgroundMode(components, state) {
  return {
    handleStart(event) {},
    handleMove(event) {},
    handleEnd() {},
  };
}
