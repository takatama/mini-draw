import {
  updateColorPicker,
  updateCanvas,
  updateBackgroundColor,
  clearCanvas,
} from "./ui.js";

export const createState = ({
  container,
  bgCanvas,
  bgCtx,
  fgCanvas,
  fgCtx,
  eraserIndicator,
}) => {
  const state = {
    fgColor: "#000000",
    bgColor: "#FFFFEF",
    thickness: 1,
    eraserSize: 20,
    undoStack: [],
    container,
    bgCanvas,
    bgCtx,
    fgCanvas,
    fgCtx,
    eraserIndicator,
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
