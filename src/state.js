import { clearCanvas, applyUndo } from "./ui.js";

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
  bgIcon,
  modeTools,
  fgColorPicker,
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
    bgIcon,
    modeTools,
    fgColorPicker,
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
      this.fgColor = lastState.fgColor;
      this.bgColor = lastState.bgColor;
      applyUndo(state, lastState);
    }
    return null;
  }.bind(state);

  state.clearCanvas = function () {
    clearCanvas(state);
    this.undoStack.length = 0;
  }.bind(state);

  return state;
};
