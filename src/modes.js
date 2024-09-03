import { getPosition, startDrawing, drawLine, erase } from "./draw.js";
import { bucketFill, hexToRgbA } from "./fill.js";

const baseMode = {
  handleStart(event) {},
  handleMove(event) {},
  handleEnd() {},
};

export function pencilMode(components, state) {
  return {
    ...baseMode,
    isDrawing: false,
    handleStart(event) {
      const { x, y } = getPosition(components.fgCanvas, event);
      components.hideEraserIndicator();
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
    ...baseMode,
    handleStart(event) {
      const { x, y } = getPosition(components.fgCanvas, event);
      const fillColor = hexToRgbA(components.getFgColor());
      state.save();
      bucketFill(components.fgCanvas, components.fgCtx, x, y, fillColor);
    },
  };
}

export function eraserMode(components, state) {
  return {
    ...baseMode,
    handleStart(event) {
      state.save();
      components.updateEraserIndicator(state.eraserSize, event);
    },
    handleMove(event) {
      const { x, y, withinCanvasBounds } = components.updateEraserIndicator(
        state.eraserSize,
        event
      );
      if (withinCanvasBounds && (event.buttons === 1 || event.touches)) {
        erase(components.fgCtx, state.eraserSize, x, y);
      }
    },
  };
}

export function backgroundMode(components, state) {
  return {
    ...baseMode,
  };
}
