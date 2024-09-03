import { getPosition, erase } from "./draw.js";
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
      components.startDrawing(state.pencilColor, state.thickness, event);
      this.isDrawing = true;
      state.save();
    },
    handleMove(event) {
      if (!this.isDrawing) return;
      components.drawLine(event);
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
      const fillColor = hexToRgbA(components.getpencilColor());
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
