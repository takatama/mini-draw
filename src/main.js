import template from "./template.html?raw";
import style from "./style.css?raw";

const CANVAS_SIZE = 340;
const DEFAULT_PENCIL_COLOR = "#000000";
const DEFAULT_BG_COLOR = "#FFFFEF";
const DEFAULT_THICKNESS = 1;
const DEFAULT_ERASER_SIZE = 20;

const MiniDraw = (function () {
  function init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with id ${containerId} not found`);
      return;
    }
    container.innerHTML = template;

    const styleElement = document.createElement("style");
    styleElement.textContent = style;
    document.head.appendChild(styleElement);

    initialize(container);
  }

  function initialize(container) {
    const bgCanvas = container.querySelector("#md-bg-canvas");
    const bgCtx = bgCanvas.getContext("2d");
    const fgCanvas = container.querySelector("#md-fg-canvas");
    fgCanvas.style.willReadFrequently = true;
    const fgCtx = fgCanvas.getContext("2d");
    const eraserIndicator = container.querySelector("#md-eraser-indicator");

    const state = {
      fgColor: DEFAULT_PENCIL_COLOR,
      bgColor: DEFAULT_BG_COLOR,
      thickness: DEFAULT_THICKNESS,
      eraserSize: DEFAULT_ERASER_SIZE,
      undoStack: [],
      container,
      bgCanvas,
      bgCtx,
      fgCanvas,
      fgCtx,
      eraserIndicator,
    };
    state.mode = pencilMode(state);

    setupEventListeners(state);
    clearCanvas(state)();
  }

  return { init };
})();

function setupEventListeners(state) {
  function addCanvasEventListener_(canvas, eventTypes, func) {
    eventTypes.forEach((eventType) => canvas.addEventListener(eventType, func));
  }

  addCanvasEventListener_(
    state.fgCanvas,
    ["touchstart", "mousedown"],
    handleStart(state)
  );
  addCanvasEventListener_(
    state.fgCanvas,
    ["touchmove", "mousemove"],
    handleMove(state)
  );
  addCanvasEventListener_(
    state.fgCanvas,
    ["touchend", "mouseup", "mouseout"],
    handleEnd(state)
  );

  state.container.querySelectorAll("[name=mode]").forEach((radio) => {
    radio.addEventListener("change", (event) => {
      state.eraserIndicator.style.display = "none";
      state.container.querySelector(
        "#md-mode-tools"
      ).className = `mode-${event.target.value}`;
      switch (event.target.value) {
        case "pencil":
          state.mode = pencilMode(state);
          break;
        case "eraser":
          state.mode = eraserMode(state);
          break;
        case "bucket":
          state.mode = bucketMode(state);
          break;
        case "background":
          state.mode = backgroundMode(state);
          break;
      }
    });
  });

  state.container
    .querySelector("#md-fg-color-picker")
    .addEventListener("input", (event) => {
      state.fgColor = event.target.value;
    });

  state.container
    .querySelector("#md-thickness-slider")
    .addEventListener("input", (event) => {
      state.thickness = event.target.value;
    });

  state.container
    .querySelector("#md-eraser-size-slider")
    .addEventListener("input", (event) => {
      state.eraserSize = event.target.value;
      state.eraserIndicator.style.width = state.eraserSize + "px";
      state.eraserIndicator.style.height = state.eraserSize + "px";
    });

  state.container
    .querySelector("#md-bg-color-picker")
    .addEventListener("input", (event) => {
      saveState(state);
      state.bgColor = event.target.value;
      state.bgCtx.fillStyle = event.target.value;
      state.bgCtx.fillRect(0, 0, state.bgCanvas.width, state.bgCanvas.height);
      state.container
        .querySelector("#bg-icon")
        .setAttribute("fill", event.target.value);
    });

  state.container
    .querySelector("#md-clear-canvas")
    .addEventListener("click", clearCanvas(state));
  state.container
    .querySelector("#md-undo")
    .addEventListener("click", undo(state));
}

function handleStart(state) {
  return function (event) {
    state.mode.handleStart(event);
  };
}

function handleMove(state) {
  return function (event) {
    state.mode.handleMove(event);
  };
}

function handleEnd(state) {
  return function (event) {
    state.mode.handleEnd(event);
  };
}

function clearCanvas(state) {
  return function (event) {
    state.fgCtx.clearRect(0, 0, state.fgCanvas.width, state.fgCanvas.height);
    state.bgCtx.clearRect(0, 0, state.bgCanvas.width, state.bgCanvas.height);
    state.bgCtx.fillStyle = state.container.querySelector(
      "#md-bg-color-picker"
    ).value;
    state.bgCtx.fillRect(0, 0, state.bgCanvas.width, state.bgCanvas.height);
    state.undoStack.length = 0;
  };
}

function undo(state) {
  return function (event) {
    if (state.undoStack.length > 0) {
      const lastState = state.undoStack.pop();

      const lastBackground = new Image();
      lastBackground.src = lastState.background;
      lastBackground.onload = () => {
        state.bgCtx.clearRect(
          0,
          0,
          state.bgCanvas.width,
          state.bgCanvas.height
        );
        state.bgCtx.drawImage(lastBackground, 0, 0);
      };

      const lastDrawing = new Image();
      lastDrawing.src = lastState.drawing;
      lastDrawing.onload = () => {
        state.fgCtx.clearRect(
          0,
          0,
          state.fgCanvas.width,
          state.fgCanvas.height
        );
        state.fgCtx.drawImage(lastDrawing, 0, 0);
      };

      state.fgColor = lastState.fgColor;
      state.container.querySelector("#md-fg-color-picker").value =
        lastState.fgColor;

      state.bgColor = lastState.bgColor;
      state.bgCtx.fillStyle = lastState.bgColor;
      state.bgCtx.fillRect(0, 0, state.bgCanvas.width, state.bgCanvas.height);
      state.container.querySelector("#md-bg-color-picker").value =
        lastState.bgColor;
      state.container
        .querySelector("#bg-icon")
        .setAttribute("fill", lastState.bgColor);
    }
  };
}

function pencilMode(state) {
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

function bucketMode(state) {
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

function eraserMode(state) {
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

function backgroundMode(state) {
  return {
    handleStart(event) {},
    handleMove(event) {},
    handleEnd() {},
  };
}

function saveState(state) {
  const stateSnapshot = {
    background: state.bgCanvas.toDataURL(),
    drawing: state.fgCanvas.toDataURL(),
    fgColor: state.fgColor,
    bgColor: state.bgColor,
  };
  state.undoStack.push(stateSnapshot);
}

function getPosition(state, event) {
  const rect = state.fgCanvas.getBoundingClientRect();
  const x = (event.clientX || event.touches[0].clientX) - rect.left;
  const y = (event.clientY || event.touches[0].clientY) - rect.top;
  return { x: Math.floor(x), y: Math.floor(y) };
}

function setIndicatorPosition(state, event) {
  const x =
    (event.clientX || event.touches[0].clientX) -
    state.eraserSize / 2 +
    window.scrollX;
  const y =
    (event.clientY || event.touches[0].clientY) -
    state.eraserSize / 2 +
    window.scrollY;
  state.eraserIndicator.style.left = x + "px";
  state.eraserIndicator.style.top = y + "px";
}

function startDrawing(state, x, y) {
  state.fgCtx.lineCap = "round";
  state.fgCtx.lineJoin = "round";
  state.fgCtx.strokeStyle = state.fgColor;
  state.fgCtx.lineWidth = state.thickness;
  state.fgCtx.beginPath();
  state.fgCtx.moveTo(x, y);
}

function drawLine(state, x, y) {
  state.fgCtx.lineTo(x, y);
  state.fgCtx.stroke();
}

function erase(state, x, y) {
  state.fgCtx.save();
  state.fgCtx.globalCompositeOperation = "destination-out";
  state.fgCtx.beginPath();
  state.fgCtx.arc(x, y, state.eraserSize / 2, 0, Math.PI * 2, false);
  state.fgCtx.fill();
  state.fgCtx.restore();
}

function bucketFill(state, x, initialY, fillColor) {
  console.log(`Starting fill at (${x}, ${initialY}) with color:`, fillColor);

  let pixelStack = [[x, initialY]];
  const canvasWidth = state.fgCanvas.width;
  const canvasHeight = state.fgCanvas.height;

  const context = state.fgCtx;
  const imageData = context.getImageData(0, 0, canvasWidth, canvasHeight);
  const data = imageData.data;

  let startPos = (initialY * canvasWidth + x) * 4;
  const startColor = [
    data[startPos],
    data[startPos + 1],
    data[startPos + 2],
    data[startPos + 3],
  ];
  console.log("Start color:", startColor);

  if (!colorMatch(startColor, fillColor)) {
    while (pixelStack.length) {
      const newPos = pixelStack.pop();
      let [x, y] = newPos;
      let currentPos = (y * canvasWidth + x) * 4;

      while (y >= 0 && colorMatch(getColorAt(data, currentPos), startColor)) {
        y--;
        currentPos -= canvasWidth * 4;
      }

      currentPos += canvasWidth * 4;
      let reachLeft = false;
      let reachRight = false;

      while (
        y < canvasHeight &&
        colorMatch(getColorAt(data, currentPos), startColor)
      ) {
        setColorAt(data, currentPos, fillColor);

        if (x > 0) {
          if (colorMatch(getColorAt(data, currentPos - 4), startColor)) {
            if (!reachLeft) {
              pixelStack.push([x - 1, y]);
              reachLeft = true;
            }
          } else if (reachLeft) {
            reachLeft = false;
          }
        }

        if (x < canvasWidth - 1) {
          if (colorMatch(getColorAt(data, currentPos + 4), startColor)) {
            if (!reachRight) {
              pixelStack.push([x + 1, y]);
              reachRight = true;
            }
          } else if (reachRight) {
            reachRight = false;
          }
        }

        y++;
        currentPos += canvasWidth * 4;
      }
    }

    context.putImageData(imageData, 0, 0);
    console.log("Fill complete.");
  } else {
    console.log("Start color and fill color are the same. No fill needed.");
  }
}

function getColorAt(data, pos) {
  return [data[pos], data[pos + 1], data[pos + 2], data[pos + 3]];
}

function setColorAt(data, pos, color) {
  data[pos] = color[0];
  data[pos + 1] = color[1];
  data[pos + 2] = color[2];
  data[pos + 3] = color[3];
}

function colorMatch(a, b, tolerance = 32) {
  return (
    Math.abs(a[0] - b[0]) < tolerance &&
    Math.abs(a[1] - b[1]) < tolerance &&
    Math.abs(a[2] - b[2]) < tolerance &&
    Math.abs(a[3] - b[3]) < tolerance
  );
}

function hexToRgbA(hex) {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = "0x" + c.join("");
    return [(c >> 16) & 255, (c >> 8) & 255, c & 255, 255];
  }
  throw new Error("Bad Hex");
}

export default MiniDraw;
