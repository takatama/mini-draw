import {
  updateColorPicker,
  updateCanvas,
  updateBackgroundColor,
  clearCanvas,
} from "./ui.js";

export const createState = ({
  container,
  fgColor,
  bgColor,
  thickness,
  eraserSize,
  fgCanvas,
  fgCtx,
  bgCanvas,
  bgCtx,
  eraserIndicator,
}) => {
  const state = {
    container,
    fgColor,
    bgColor,
    thickness,
    eraserSize,
    fgCanvas,
    fgCtx,
    bgCanvas,
    bgCtx,
    eraserIndicator,
    undoStack: [],
    mode: null,
  };

  state.fgCanvas.style.willReadFrequently = true;

  state.setMode = function (mode) {
    this.mode = mode(this);
  };

  state.save = function () {
    const stateSnapshot = {
      background: this.bgCanvas.toDataURL(),
      drawing: this.fgCanvas.toDataURL(),
      fgColor: this.fgColor,
      bgColor: this.bgColor,
    };
    this.undoStack.push(stateSnapshot);
  }.bind(state);

  state.undo = function () {
    if (this.undoStack.length > 0) {
      const lastState = this.undoStack.pop();
      updateCanvas(this.bgCanvas, this.bgCtx, lastState.background);
      updateCanvas(this.fgCanvas, this.fgCtx, lastState.drawing);
      this.fgColor = lastState.fgColor;
      updateColorPicker(this.container, "#md-fg-color-picker", this.fgColor);
      this.bgColor = lastState.bgColor;
      updateBackgroundColor(this.container, this.bgCtx, this.bgColor);
    }
  }.bind(state);

  state.clearCanvas = function () {
    clearCanvas(state);
    this.undoStack.length = 0;
  }.bind(state);

  return state;
};
