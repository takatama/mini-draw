const baseMode = {
  handleStart(event) {},
  handleMove(event) {},
  handleEnd() {},
};

export function pencilMode(actions, state) {
  return {
    ...baseMode,
    isDrawing: false,
    handleStart(event) {
      actions.startDrawing(state.pencilColor, state.thickness, event);
      this.isDrawing = true;
      state.save();
    },
    handleMove(event) {
      if (!this.isDrawing) return;
      actions.drawLine(event);
    },
    handleEnd() {
      this.isDrawing = false;
    },
  };
}

export function bucketMode(actions, state) {
  return {
    ...baseMode,
    handleStart(event) {
      state.save();
      actions.bucketFill(event);
    },
  };
}

export function eraserMode(actions, state) {
  return {
    ...baseMode,
    handleStart(event) {
      state.save();
      actions.updateEraserIndicator(state.eraserSize, event);
    },
    handleMove(event) {
      const { withinCanvasBounds } = actions.updateEraserIndicator(
        state.eraserSize,
        event
      );
      if (withinCanvasBounds && (event.buttons === 1 || event.touches)) {
        actions.erase(state.eraserSize, event);
      }
    },
  };
}

export function backgroundMode(components, state) {
  return {
    ...baseMode,
  };
}
