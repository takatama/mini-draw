export function getPosition(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = (event.clientX || event.touches[0].clientX) - rect.left;
  const y = (event.clientY || event.touches[0].clientY) - rect.top;
  return { x: Math.floor(x), y: Math.floor(y) };
}

export function setIndicatorPosition(indicator, eraserSize, event) {
  const x =
    (event.clientX || event.touches[0].clientX) -
    eraserSize / 2 +
    window.scrollX;
  const y =
    (event.clientY || event.touches[0].clientY) -
    eraserSize / 2 +
    window.scrollY;
  indicator.style.left = x + "px";
  indicator.style.top = y + "px";
}

export function startDrawing(ctx, color, thickness, x, y) {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = color;
  ctx.lineWidth = thickness;
  ctx.beginPath();
  ctx.moveTo(x, y);
}

export function drawLine(ctx, x, y) {
  ctx.lineTo(x, y);
  ctx.stroke();
}

export function erase(ctx, eraserSize, x, y) {
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(x, y, eraserSize / 2, 0, Math.PI * 2, false);
  ctx.fill();
  ctx.restore();
}
