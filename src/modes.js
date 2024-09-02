import {
  getPosition,
  startDrawing,
  saveState,
  drawLine,
  setIndicatorPosition,
  erase,
} from "./draw.js";
import { bucketFill, hexToRgbA } from "./fill.js";

const CANVAS_SIZE = 340;

export function pencilMode(state) {
  return {
    isDrawing: false,
    handleStart(event) {
      const { x, y } = getPosition(state, event);
      state.eraserIndicator.style.display = "none";
      startDrawing(state, x, y);
      this.isDrawing = true;
      saveState(state);
    },
    handleMove(event) {
      if (!this.isDrawing) return;
      const { x, y } = getPosition(state, event);
      drawLine(state, x, y);
    },
    handleEnd() {
      this.isDrawing = false;
    },
  };
}

export function bucketMode(state) {
  return {
    handleStart(event) {
      const { x, y } = getPosition(state, event);
      const fillColor = hexToRgbA(
        state.container.querySelector("#md-fg-color-picker").value
      );
      saveState(state);
      bucketFill(state, x, y, fillColor);
    },
    handleMove(event) {},
    handleEnd() {},
  };
}

export function eraserMode(state) {
  return {
    handleStart(event) {
      saveState(state);
      setIndicatorPosition(state, event);
    },
    handleMove(event) {
      const { x, y } = getPosition(state, event);
      const withinCanvasBounds =
        x - state.eraserSize / 2 > 0 &&
        x + state.eraserSize / 2 < CANVAS_SIZE &&
        y - state.eraserSize / 2 > 0 &&
        y + state.eraserSize / 2 < CANVAS_SIZE;
      state.eraserIndicator.style.display = withinCanvasBounds
        ? "block"
        : "none";
      setIndicatorPosition(state, event);
      if (event.buttons === 1 || event.touches) {
        erase(state, x, y);
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
