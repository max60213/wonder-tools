"use client";

import { useMemo, useState } from "react";

type Preference = "1" | "2" | "4" | "8" | "10-preferred" | "16";
type Language = "en" | "zh-Hant";

type Result = {
  width: number;
  height: number;
  ratioWidth: number;
  ratioHeight: number;
  preference: string;
  widthDifference: number;
  heightDifference: number;
  areaChange: number;
};

const copy = {
  en: {
    source: "SOURCE PIXELS", physical: "PHYSICAL RATIO", preference: "PIXEL PREFERENCE",
    width: "Width", height: "Height", units: "Any matching unit", calculate: "Match ratio",
    reset: "Reset example", result: "RECOMMENDED OUTPUT", exact: "EXACT RATIO", preferenceResult: "PREFERENCE RESULT",
    difference: "TOTAL PIXEL DIFFERENCE", widthChange: "WIDTH CHANGE", heightChange: "HEIGHT CHANGE", area: "AREA CHANGE",
    sourceNote: "Your original image dimensions.", physicalNote: "Use any one unit consistently: mm, cm, inches, etc.",
    any: "Any integer — closest to the source", even: "Even — both sides divisible by 2", four: "Multiple of 4 — both sides", eight: "Multiple of 8 — both sides", ten: "Prefer 10 — at least one side", sixteen: "Multiple of 16 — both sides",
    errorPositive: "Enter positive values for every field.", errorInteger: "Source pixels must be whole numbers.", errorPrecision: "The physical ratio has too many decimal places. Try rounding it first.",
    noResult: "No suitable resolution was found.", noChange: "No change", bothTen: "Both sides are multiples of 10", widthTen: "Width is a multiple of 10", heightTen: "Height is a multiple of 10",
    multiple: "Both sides are multiples of {value}", closest: "Closest whole-pixel size",
  },
  "zh-Hant": {
    source: "原始像素", physical: "實際比例", preference: "像素尺寸偏好",
    width: "寬度", height: "高度", units: "使用任一相同單位", calculate: "Match Ratio",
    reset: "重設範例", result: "建議輸出尺寸", exact: "精確比例", preferenceResult: "偏好結果",
    difference: "總像素差異", widthChange: "寬度調整", heightChange: "高度調整", area: "面積變化",
    sourceNote: "輸入原始圖片的像素尺寸。", physicalNote: "可使用 mm、cm、吋等任一單位，寬高須一致。",
    any: "任意整數：最接近原圖", even: "偶數：寬高皆為 2 的倍數", four: "4 的倍數：寬高皆符合", eight: "8 的倍數：寬高皆符合", ten: "偏好 10：至少一邊符合", sixteen: "16 的倍數：寬高皆符合",
    errorPositive: "請在每個欄位輸入大於 0 的數值。", errorInteger: "原始解析度必須是整數像素。", errorPrecision: "實際尺寸的小數位過多，請先適度四捨五入。",
    noResult: "找不到符合條件的解析度。", noChange: "不需調整", bothTen: "寬、高皆為 10 的倍數", widthTen: "寬度為 10 的倍數", heightTen: "高度為 10 的倍數",
    multiple: "寬、高皆為 {value} 的倍數", closest: "最接近原圖的整數尺寸",
  },
} as const;

function gcd(a: number, b: number) { let x = Math.abs(Math.round(a)); let y = Math.abs(Math.round(b)); while (y) [x, y] = [y, x % y]; return x; }
function lcm(a: number, b: number) { return Math.abs(a * b) / gcd(a, b); }
function decimalPlaces(value: number) { const [coefficient, exponent] = String(value).toLowerCase().split("e-"); return exponent ? Number(exponent) + (coefficient.split(".")[1]?.length ?? 0) : (coefficient.split(".")[1]?.length ?? 0); }
function ratioFrom(width: number, height: number) { const scale = 10 ** Math.max(decimalPlaces(width), decimalPlaces(height)); const w = Math.round(width * scale); const h = Math.round(height * scale); const divisor = gcd(w, h); return { width: w / divisor, height: h / divisor }; }
function idealScale(imageWidth: number, imageHeight: number, ratioWidth: number, ratioHeight: number) { return (imageWidth * ratioWidth + imageHeight * ratioHeight) / (ratioWidth ** 2 + ratioHeight ** 2); }
function error(width: number, height: number, sourceWidth: number, sourceHeight: number) { return ((width - sourceWidth) / sourceWidth) ** 2 + ((height - sourceHeight) / sourceHeight) ** 2; }
function candidateScales(ideal: number, multiple: number, range = 8) { const values = new Set<number>(); for (const center of [Math.floor(ideal / multiple), Math.round(ideal / multiple), Math.ceil(ideal / multiple)]) for (let offset = -range; offset <= range; offset += 1) if (center + offset >= 1) values.add((center + offset) * multiple); return [...values]; }

function calculate(sourceWidth: number, sourceHeight: number, physicalWidth: number, physicalHeight: number, preference: Preference, language: Language): { result?: Result; error?: string } {
  const t = copy[language];
  if ([sourceWidth, sourceHeight, physicalWidth, physicalHeight].some((value) => !Number.isFinite(value) || value <= 0)) return { error: t.errorPositive };
  if (!Number.isInteger(sourceWidth) || !Number.isInteger(sourceHeight)) return { error: t.errorInteger };
  const ratio = ratioFrom(physicalWidth, physicalHeight);
  if (ratio.width > 100000 || ratio.height > 100000) return { error: t.errorPrecision };
  const ideal = idealScale(sourceWidth, sourceHeight, ratio.width, ratio.height);
  const getCandidate = (scale: number) => ({ width: ratio.width * scale, height: ratio.height * scale, scale, error: error(ratio.width * scale, ratio.height * scale, sourceWidth, sourceHeight) });
  let best: ReturnType<typeof getCandidate> | undefined;
  let preferenceLabel = "";
  if (preference === "10-preferred") {
    const candidates = [...candidateScales(ideal, 10 / gcd(ratio.width, 10)), ...candidateScales(ideal, 10 / gcd(ratio.height, 10))].map(getCandidate).filter((item, index, all) => all.findIndex((other) => other.scale === item.scale) === index).sort((a, b) => a.error - b.error);
    const closest = candidates[0];
    const both = candidates.filter((item) => item.width % 10 === 0 && item.height % 10 === 0)[0];
    best = both && both.error <= closest.error * 1.1 ? both : closest;
    preferenceLabel = best.width % 10 === 0 && best.height % 10 === 0 ? t.bothTen : best.width % 10 === 0 ? t.widthTen : t.heightTen;
  } else {
    const multiplier = Number(preference);
    const required = lcm(multiplier / gcd(ratio.width, multiplier), multiplier / gcd(ratio.height, multiplier));
    best = candidateScales(ideal, required, 5).map(getCandidate).sort((a, b) => a.error - b.error)[0];
    preferenceLabel = multiplier === 1 ? t.closest : t.multiple.replace("{value}", String(multiplier));
  }
  if (!best) return { error: t.noResult };
  return { result: { width: best.width, height: best.height, ratioWidth: ratio.width, ratioHeight: ratio.height, preference: preferenceLabel, widthDifference: best.width - sourceWidth, heightDifference: best.height - sourceHeight, areaChange: ((best.width * best.height - sourceWidth * sourceHeight) / (sourceWidth * sourceHeight)) * 100 } };
}

function formatChange(value: number, language: Language) { if (value === 0) return copy[language].noChange; return `${value > 0 ? "+" : ""}${value.toLocaleString()} px`; }

export function ResolutionCalculator({ locale }: { locale: Language }) {
  const t = copy[locale];
  const [sourceWidth, setSourceWidth] = useState("4032"); const [sourceHeight, setSourceHeight] = useState("3024");
  const [physicalWidth, setPhysicalWidth] = useState("59.4"); const [physicalHeight, setPhysicalHeight] = useState("42"); const [preference, setPreference] = useState<Preference>("2");
  const outcome = useMemo(() => calculate(Number(sourceWidth), Number(sourceHeight), Number(physicalWidth), Number(physicalHeight), preference, locale), [sourceWidth, sourceHeight, physicalWidth, physicalHeight, preference, locale]);
  const numberField = (label: string, value: string, onChange: (value: string) => void, integer = false) => <label><span>{label}</span><input type="number" min={integer ? "1" : "0.000001"} step={integer ? "1" : "any"} value={value} onChange={(event) => onChange(event.target.value)} /></label>;
  const reset = () => { setSourceWidth("4032"); setSourceHeight("3024"); setPhysicalWidth("59.4"); setPhysicalHeight("42"); setPreference("2"); };
  const result = outcome.result;
  return <section className="resolution-workbench">
    <div className="resolution-controls">
      <div className="resolution-section"><div className="resolution-section-heading"><p className="kicker">01 / {t.source}</p><p>{t.sourceNote}</p></div><div className="resolution-size-inputs">{numberField(`${t.width} / px`, sourceWidth, setSourceWidth, true)}<b aria-hidden="true">×</b>{numberField(`${t.height} / px`, sourceHeight, setSourceHeight, true)}</div></div>
      <div className="resolution-section"><div className="resolution-section-heading"><p className="kicker">02 / {t.physical}</p><p>{t.physicalNote}</p></div><div className="resolution-size-inputs">{numberField(t.width, physicalWidth, setPhysicalWidth)}<b aria-hidden="true">×</b>{numberField(t.height, physicalHeight, setPhysicalHeight)}</div><p className="resolution-units">{t.units}</p></div>
      <div className="resolution-section resolution-preference"><label><span>03 / {t.preference}</span><select value={preference} onChange={(event) => setPreference(event.target.value as Preference)}><option value="1">{t.any}</option><option value="2">{t.even}</option><option value="4">{t.four}</option><option value="8">{t.eight}</option><option value="10-preferred">{t.ten}</option><option value="16">{t.sixteen}</option></select></label></div>
      <div className="resolution-actions"><button type="button" onClick={() => document.getElementById("resolution-output")?.scrollIntoView({ behavior: "smooth", block: "nearest" })}>{t.calculate}</button><button type="button" className="resolution-reset" onClick={reset}>{t.reset}</button></div>
      {outcome.error ? <p className="resolution-warning" role="alert">{outcome.error}</p> : null}
    </div>
    <aside id="resolution-output" className="resolution-result" aria-live="polite">
      <div className="preview-label"><span>{t.result}</span><span>{result ? "READY" : "CHECK INPUTS"}</span></div>
      {result ? <><div className="resolution-size"><strong>{result.width.toLocaleString()}</strong><span>×</span><strong>{result.height.toLocaleString()}</strong><small>px</small></div><div className="resolution-ratio"><span>{t.exact}</span><strong>{result.ratioWidth.toLocaleString()} : {result.ratioHeight.toLocaleString()}</strong></div><dl className="resolution-details"><div><dt>{t.preferenceResult}</dt><dd>{result.preference}</dd></div><div><dt>{t.difference}</dt><dd>{(Math.abs(result.widthDifference) + Math.abs(result.heightDifference)).toLocaleString()} px</dd></div><div><dt>{t.widthChange}</dt><dd>{formatChange(result.widthDifference, locale)}</dd></div><div><dt>{t.heightChange}</dt><dd>{formatChange(result.heightDifference, locale)}</dd></div><div><dt>{t.area}</dt><dd>{result.areaChange > 0 ? "+" : ""}{result.areaChange.toFixed(2)}%</dd></div></dl></> : <p className="resolution-empty">{outcome.error}</p>}
    </aside>
  </section>;
}
