export const createState = ({
  components,
  fgColor,
  bgColor,
  thickness,
  eraserSize,
}) => {
  const state = {
    components,
    fgColor,
    bgColor,
    thickness,
    eraserSize,
    undoStack: [],
    mode: null,
  };

  state.save = function () {
    const stateSnapshot = {
      background: state.components.bgCanvas.toDataURL(),
      drawing: state.components.fgCanvas.toDataURL(),
      fgColor: state.fgColor,
      bgColor: state.bgColor,
    };
    state.undoStack.push(stateSnapshot);
  };

  state.undo = function () {
    if (state.undoStack.length > 0) {
      const lastState = state.undoStack.pop();
      state.fgColor = lastState.fgColor;
      state.bgColor = lastState.bgColor;
      components.applyUndo(state, lastState);
    }
  };

  state.clearCanvas = function () {
    components.clearCanvas(state.bgColor);
    state.undoStack.length = 0;
  };

  return state;
};
