export function getPosition(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = (event.clientX || event.touches[0].clientX) - rect.left;
  const y = (event.clientY || event.touches[0].clientY) - rect.top;
  return { x: Math.floor(x), y: Math.floor(y) };
}

export function startDrawing(canvas, ctx, color, thickness, event) {
  const { x, y } = getPosition(canvas, event);
  if (ctx && typeof ctx.beginPath === "function") {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.beginPath();
    ctx.moveTo(x, y);
  }
}

export function drawLine(canvas, ctx, event) {
  const { x, y } = getPosition(canvas, event);
  if (ctx && typeof ctx.lineTo === "function") {
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

export function erase(canvas, ctx, eraserSize, event) {
  const { x, y } = getPosition(canvas, event);
  if (ctx && typeof ctx.arc === "function") {
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, eraserSize / 2, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.restore();
  }
}
