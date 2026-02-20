export const createWatermark = (text: string) => {
  const canvas = document.createElement("canvas");
  canvas.width = 420;
  canvas.height = 240;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return "";
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = "#ffffff";
  ctx.font = "16px 'JetBrains Mono', monospace";
  ctx.rotate((-20 * Math.PI) / 180);
  ctx.fillText(text, -20, 120);
  ctx.fillText(text, -10, 180);
  return canvas.toDataURL("image/png");
};
