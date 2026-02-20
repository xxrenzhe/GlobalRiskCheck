import { CreepResult } from "@/lib/types";

const canvasFingerprint = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 240;
  canvas.height = 60;
  const context = canvas.getContext("2d");
  if (!context) {
    return "";
  }
  context.textBaseline = "top";
  context.font = "14px 'Arial'";
  context.fillStyle = "#f60";
  context.fillRect(0, 0, 240, 60);
  context.fillStyle = "#069";
  context.fillText("GlobalRiskCheck::Canvas", 2, 2);
  context.strokeStyle = "#0f0";
  context.strokeRect(1, 1, 238, 58);
  return canvas.toDataURL();
};

const detectCanvasNoise = () => {
  const first = canvasFingerprint();
  const second = canvasFingerprint();
  return first !== "" && second !== "" && first !== second;
};

const detectMathLie = () => {
  const sinSource = Math.sin.toString();
  const cosSource = Math.cos.toString();
  const nativeLike = sinSource.includes("[native code]") && cosSource.includes("[native code]");
  return !nativeLike;
};

export const detectCreep = (): CreepResult => {
  const webdriver = navigator.webdriver === true;
  const canvasNoise = detectCanvasNoise();
  const mathLie = detectMathLie();

  const notes: string[] = [];
  if (webdriver) {
    notes.push("navigator.webdriver 暴露");
  }
  if (canvasNoise) {
    notes.push("Canvas 渲染结果出现噪点差异");
  }
  if (mathLie) {
    notes.push("Math 引擎特征非原生" );
  }

  return {
    webdriver,
    canvasNoise,
    mathLie,
    notes
  };
};
