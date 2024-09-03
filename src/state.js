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
    this.mode = mode;
  };

  state.save = function () {
    const stateSnapshot = {
      background: this.bgCanvas.toDataURL(),
      drawing: this.fgCanvas.toDataURL(),
      fgColor: this.fgColor,
      bgColor: this.bgColor,
    };
    this.undoStack.push(stateSnapshot);
  };

  state.undo = function () {
    if (this.undoStack.length > 0) {
      const lastState = this.undoStack.pop();

      const lastBackground = new Image();
      lastBackground.src = lastState.background;
      lastBackground.onload = () => {
        this.bgCtx.clearRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
        this.bgCtx.drawImage(lastBackground, 0, 0);
      };

      const lastDrawing = new Image();
      lastDrawing.src = lastState.drawing;
      lastDrawing.onload = () => {
        this.fgCtx.clearRect(0, 0, this.fgCanvas.width, this.fgCanvas.height);
        this.fgCtx.drawImage(lastDrawing, 0, 0);
      };

      this.fgColor = lastState.fgColor;
      this.container.querySelector("#md-fg-color-picker").value =
        lastState.fgColor;

      this.bgColor = lastState.bgColor;
      this.bgCtx.fillStyle = lastState.bgColor;
      this.bgCtx.fillRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
      this.container.querySelector("#md-bg-color-picker").value =
        lastState.bgColor;
      this.container
        .querySelector("#bg-icon")
        .setAttribute("fill", lastState.bgColor);
    }
  }.bind(state);

  state.clearCanvas = function (event) {
    this.fgCtx.clearRect(0, 0, this.fgCanvas.width, this.fgCanvas.height);
    this.bgCtx.clearRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
    this.bgCtx.fillStyle = this.container.querySelector(
      "#md-bg-color-picker"
    ).value;
    this.bgCtx.fillRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
    this.undoStack.length = 0;
  }.bind(state);

  return state;
};
