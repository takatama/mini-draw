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
      state.save();
      components.bucketFill(event);
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
      const { withinCanvasBounds } = components.updateEraserIndicator(
        state.eraserSize,
        event
      );
      if (withinCanvasBounds && (event.buttons === 1 || event.touches)) {
        components.erase(state.eraserSize, event);
      }
    },
  };
}

export function backgroundMode(components, state) {
  return {
    ...baseMode,
  };
}
