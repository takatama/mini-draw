import { getPosition, startDrawing, drawLine, erase } from "./draw.js";

import { bucketFill, hexToRgbA } from "./fill.js";
import { FG_COLOR_PICKER } from "./selectors.js";
import {
  hideElement,
  updateEraserIndicatorPosition,
  updateEraserIndicatorVisibility,
} from "./ui.js";

const CANVAS_SIZE = 340;

export function pencilMode(state) {
  return {
    isDrawing: false,
    handleStart(event) {
      const { x, y } = getPosition(state.fgCanvas, event);
      hideElement(state.eraserIndicator);
      startDrawing(state.fgCtx, state.fgColor, state.thickness, x, y);
      this.isDrawing = true;
      state.save();
    },
    handleMove(event) {
      if (!this.isDrawing) return;
      const { x, y } = getPosition(state.fgCanvas, event);
      drawLine(state.fgCtx, x, y);
    },
    handleEnd() {
      this.isDrawing = false;
    },
  };
}

export function bucketMode(state) {
  return {
    handleStart(event) {
      const { x, y } = getPosition(state.fgCanvas, event);
      const fillColor = hexToRgbA(
        state.container.querySelector(FG_COLOR_PICKER).value
      );
      state.save();
      bucketFill(state.fgCanvas, state.fgCtx, x, y, fillColor);
    },
    handleMove(event) {},
    handleEnd() {},
  };
}

export function eraserMode(state) {
  return {
    handleStart(event) {
      state.save();
      updateEraserIndicatorPosition(
        state.eraserIndicator,
        state.eraserSize,
        event
      );
    },
    handleMove(event) {
      const { x, y } = getPosition(state.fgCanvas, event);
      const withinCanvasBounds =
        x - state.eraserSize / 2 > 0 &&
        x + state.eraserSize / 2 < CANVAS_SIZE &&
        y - state.eraserSize / 2 > 0 &&
        y + state.eraserSize / 2 < CANVAS_SIZE;
      updateEraserIndicatorVisibility(
        state.eraserIndicator,
        withinCanvasBounds
      );
      updateEraserIndicatorPosition(
        state.eraserIndicator,
        state.eraserSize,
        event
      );
      if (event.buttons === 1 || event.touches) {
        erase(state.fgCtx, state.eraserSize, x, y);
      }
    },
    handleEnd() {},
  };
}

export function backgroundMode(state) {
  return {
    handleStart(event) {},
    handleMove(event) {},
    handleEnd() {},
  };
}
