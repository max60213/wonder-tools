"use client";

import JSZip from "jszip";
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

type Format = "png" | "jpeg";
type Ratio = "original" | "1:1" | "4:3" | "16:9" | "custom";
type Crop = { x: number; y: number; width: number; height: number };

function getCrop(image: HTMLImageElement, ratio: Ratio, customWidth: number, customHeight: number, position: number, flipped: boolean): Crop {
  if (ratio === "original") return { x: 0, y: 0, width: image.naturalWidth, height: image.naturalHeight };
  const [widthPart, heightPart] = ratio === "custom" ? [customWidth, customHeight] : ratio.split(":").map(Number);
  const target = (flipped ? heightPart / widthPart : widthPart / heightPart);
  const natural = image.naturalWidth / image.naturalHeight;
  if (target >= natural) {
    const height = image.naturalWidth / target;
    return { x: 0, y: (image.naturalHeight - height) * position / 100, width: image.naturalWidth, height };
  }
  const width = image.naturalHeight * target;
  return { x: (image.naturalWidth - width) * position / 100, y: 0, width, height: image.naturalHeight };
}

function canvasBlob(canvas: HTMLCanvasElement, format: Format): Promise<Blob> {
  return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("image-encode")), `image/${format}`, format === "jpeg" ? 0.92 : undefined));
}

function saveBlob(name: string, blob: Blob) {
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href; link.download = name; link.click();
  window.setTimeout(() => URL.revokeObjectURL(href), 0);
}

function NumberStepper({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  const decrease = () => onChange(Math.max(1, value - 1));
  const increase = () => onChange(Math.min(50, value + 1));

  return <label className="stepper-field">
    <span>{label}</span>
    <span className="number-stepper">
      <button type="button" className="stepper-button" aria-label={`Decrease ${label.toLowerCase()}`} onClick={decrease} disabled={value <= 1}>−</button>
      <input type="number" min="1" max="50" value={value} aria-label={`${label} count`} onChange={(event) => onChange(Math.min(50, Math.max(1, Number(event.target.value) || 1)))} />
      <button type="button" className="stepper-button" aria-label={`Increase ${label.toLowerCase()}`} onClick={increase} disabled={value >= 50}>＋</button>
    </span>
  </label>;
}

export function ImageSplitterTool() {
  const t = useTranslations("split");
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [ratio, setRatio] = useState<Ratio>("original");
  const [flipped, setFlipped] = useState(false);
  const [customWidth, setCustomWidth] = useState(16);
  const [customHeight, setCustomHeight] = useState(9);
  const [position, setPosition] = useState(50);
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);
  const [format, setFormat] = useState<Format>("png");
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const safeCustomWidth = Math.max(1, customWidth);
  const safeCustomHeight = Math.max(1, customHeight);
  const crop = image ? getCrop(image, ratio, safeCustomWidth, safeCustomHeight, position, flipped) : null;
  const cropAtStart = image ? getCrop(image, ratio, safeCustomWidth, safeCustomHeight, 0, flipped) : null;
  const cropAtEnd = image ? getCrop(image, ratio, safeCustomWidth, safeCustomHeight, 100, flipped) : null;
  const canPosition = cropAtStart && cropAtEnd
    ? cropAtStart.x !== cropAtEnd.x || cropAtStart.y !== cropAtEnd.y
    : false;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image || !crop) return;
    const maxWidth = 860;
    const scale = Math.min(maxWidth / crop.width, 520 / crop.height, 1);
    canvas.width = Math.max(1, Math.round(crop.width * scale));
    canvas.height = Math.max(1, Math.round(crop.height * scale));
    const context = canvas.getContext("2d");
    if (!context) return;
    context.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, canvas.width, canvas.height);
    context.strokeStyle = "rgba(255, 86, 56, .95)";
    context.lineWidth = 1.5;
    for (let row = 1; row < rows; row += 1) { const y = canvas.height * row / rows; context.beginPath(); context.moveTo(0, y); context.lineTo(canvas.width, y); context.stroke(); }
    for (let column = 1; column < columns; column += 1) { const x = canvas.width * column / columns; context.beginPath(); context.moveTo(x, 0); context.lineTo(x, canvas.height); context.stroke(); }
  }, [image, crop, rows, columns]);

  useEffect(() => () => { if (image?.src.startsWith("blob:")) URL.revokeObjectURL(image.src); }, [image]);

  function load(nextFile?: File) {
    if (!nextFile) return;
    if (!nextFile.type.startsWith("image/")) { setError(t("imageError")); return; }
    const source = URL.createObjectURL(nextFile);
    const nextImage = new Image();
    nextImage.onload = () => { setFile(nextFile); setImage(nextImage); setRatio("original"); setFlipped(false); setPosition(50); setError(""); };
    nextImage.onerror = () => { URL.revokeObjectURL(source); setError(t("imageError")); };
    nextImage.src = source;
  }

  function onFile(event: ChangeEvent<HTMLInputElement>) { load(event.target.files?.[0]); event.target.value = ""; }
  function onDrop(event: DragEvent<HTMLLabelElement>) { event.preventDefault(); setDragging(false); load(event.dataTransfer.files[0]); }

  async function split() {
    if (!image || !crop || !file || working) return;
    setWorking(true); setError("");
    try {
      const zip = new JSZip();
      const folder = zip.folder("split-images")!;
      const tileWidth = crop.width / columns;
      const tileHeight = crop.height / rows;
      const extension = format === "jpeg" ? "jpg" : "png";
      for (let row = 0; row < rows; row += 1) for (let column = 0; column < columns; column += 1) {
        const tile = document.createElement("canvas");
        tile.width = Math.max(1, Math.round(tileWidth)); tile.height = Math.max(1, Math.round(tileHeight));
        const context = tile.getContext("2d");
        if (!context) throw new Error("canvas");
        if (format === "jpeg") { context.fillStyle = "white"; context.fillRect(0, 0, tile.width, tile.height); }
        context.drawImage(image, crop.x + column * tileWidth, crop.y + row * tileHeight, tileWidth, tileHeight, 0, 0, tile.width, tile.height);
        folder.file(`tile-${String(row + 1).padStart(2, "0")}-${String(column + 1).padStart(2, "0")}.${extension}`, await canvasBlob(tile, format));
      }
      const base = file.name.replace(/\.[^.]+$/, "") || "image";
      saveBlob(`${base}-${rows}x${columns}-split.zip`, await zip.generateAsync({ type: "blob" }));
    } catch { setError(t("imageError")); }
    finally { setWorking(false); }
  }

  return <section className="split-workbench">
    <div className="split-controls"><label className={`drop-target ${dragging ? "is-dragging" : ""}`} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop}><input type="file" accept="image/*" onChange={onFile} /><span className="drop-symbol">＋</span><strong>{file ? file.name : t("choose")}</strong><small>{file ? `${image?.naturalWidth} × ${image?.naturalHeight}px` : t("drop")}</small></label>
      {image ? <><div className="split-control-grid"><NumberStepper label={t("rows")} value={rows} onChange={setRows} /><NumberStepper label={t("columns")} value={columns} onChange={setColumns} /></div>
        <fieldset className="ratio-field"><div className="ratio-heading"><legend>{t("cropRatio")}</legend><button type="button" className="flip-button" onClick={() => { if (ratio === "custom") { setCustomWidth(safeCustomHeight); setCustomHeight(safeCustomWidth); } else { setFlipped((current) => !current); } setPosition(50); }} disabled={ratio === "original"} aria-label={t("flip")}><span aria-hidden="true">↔</span> {t("flip")}</button></div>{(["original", "1:1", "4:3", "16:9", "custom"] as Ratio[]).map((item) => <label key={item}><input type="radio" checked={ratio === item} onChange={() => { setRatio(item); setFlipped(false); setPosition(50); }} />{item === "original" ? t("original") : item === "custom" ? t("custom") : item}</label>)}</fieldset>
        {ratio === "custom" ? <div className="split-control-grid compact"><label><span>{t("width")}</span><input type="number" min="1" value={customWidth} onChange={(event) => setCustomWidth(Number(event.target.value))} /></label><label><span>{t("height")}</span><input type="number" min="1" value={customHeight} onChange={(event) => setCustomHeight(Number(event.target.value))} /></label></div> : null}
        {canPosition ? <label className="position-control"><span>{t("position")}</span><input type="range" min="0" max="100" value={position} onChange={(event) => setPosition(Number(event.target.value))} /><small>{crop && crop.x > 0 ? t("leftRight") : t("topBottom")}</small></label> : null}
        <fieldset className="format-field"><legend>{t("tiles")}</legend>{(["png", "jpeg"] as Format[]).map((item) => <label key={item}><input type="radio" checked={format === item} onChange={() => setFormat(item)} />{item === "jpeg" ? "JPG" : "PNG"}</label>)}</fieldset><button type="button" onClick={split} disabled={working}>{working ? t("building") : t("download", { rows, columns })}</button></> : null}
      {error ? <p className="form-error">{error}</p> : null}</div>
    <div className="split-preview"><div className="preview-label"><span>{t("gridPreview")}</span><span>{image ? `${rows} × ${columns}` : t("waiting")}</span></div>{image ? <canvas ref={canvasRef} aria-label={t("gridPreview")} /> : <p className="empty-preview">{t("gridHere")}</p>}<p className="split-note">{image ? t("tileNote") : t("noUpload")}</p></div>
  </section>;
}
