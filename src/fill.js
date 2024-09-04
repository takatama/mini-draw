import { getPosition } from "./draw";

export function bucketFill(canvas, ctx, fillColor, event) {
  const { x, y } = getPosition(canvas, event);
  let initialY = y;
  fillColor = hexToRgbA(fillColor);

  console.log(`Starting fill at (${x}, ${initialY}) with color:`, fillColor);

  let pixelStack = [[x, initialY]];
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  const context = ctx;
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
