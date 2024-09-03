import {
  getPosition,
  startDrawing,
  drawLine,
  setIndicatorPosition,
  erase,
} from "./draw.js";
import { saveState } from "./state.js";

import { bucketFill, hexToRgbA } from "./fill.js";

const CANVAS_SIZE = 340;

export function handleStart(state) {
  return function (event) {
    state.mode.handleStart(event);
  };
}

export function handleMove(state) {
  return function (event) {
    state.mode.handleMove(event);
  };
}

export function handleEnd(state) {
  return function (event) {
    state.mode.handleEnd(event);
  };
}

export function pencilMode(state) {
  return {
    isDrawing: false,
    handleStart(event) {
      const { x, y } = getPosition(state.fgCanvas, event);
      state.eraserIndicator.style.display = "none";
      startDrawing(state.fgCtx, state.fgColor, state.thickness, x, y);
      this.isDrawing = true;
      saveState(state);
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
        state.container.querySelector("#md-fg-color-picker").value
      );
      saveState(state);
      bucketFill(state.fgCanvas, state.fgCtx, x, y, fillColor);
    },
    handleMove(event) {},
    handleEnd() {},
  };
}

export function eraserMode(state) {
  return {
    handleStart(event) {
      saveState(state);
      setIndicatorPosition(state.eraserIndicator, state.eraserSize, event);
    },
    handleMove(event) {
      const { x, y } = getPosition(state.fgCanvas, event);
      const withinCanvasBounds =
        x - state.eraserSize / 2 > 0 &&
        x + state.eraserSize / 2 < CANVAS_SIZE &&
        y - state.eraserSize / 2 > 0 &&
        y + state.eraserSize / 2 < CANVAS_SIZE;
      state.eraserIndicator.style.display = withinCanvasBounds
        ? "block"
        : "none";
      setIndicatorPosition(state.eraserIndicator, state.eraserSize, event);
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
