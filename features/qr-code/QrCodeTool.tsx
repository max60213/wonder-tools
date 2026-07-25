"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

const SIZE = 960;
const INITIAL_VALUE = "https://tools.wonderstudio.tw/qr-code/";

function download(filename: string, href: string) {
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = filename;
  anchor.click();
}

export function QrCodeTool() {
  const [value, setValue] = useState(INITIAL_VALUE);
  const [level, setLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const [format, setFormat] = useState<"svg" | "png">("svg");
  const [svg, setSvg] = useState("");
  const [png, setPng] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const content = value.trim();
    if (!content) { setSvg(""); setPng(""); return; }
    let live = true;
    Promise.all([
      QRCode.toString(content, { type: "svg", errorCorrectionLevel: level, margin: 2, color: { dark: "#14211d", light: "#edf2ee" } }),
      QRCode.toDataURL(content, { width: SIZE, errorCorrectionLevel: level, margin: 2, color: { dark: "#14211d", light: "#edf2ee" } }),
    ]).then(([nextSvg, nextPng]) => { if (live) { setSvg(nextSvg); setPng(nextPng); setError(""); } }).catch(() => { if (live) setError("This content cannot be encoded as a QR code."); });
    return () => { live = false; };
  }, [value, level]);

  const output = format === "svg" ? svg : png;
  return <section className="qr-workbench">
    <div className="qr-controls"><label><span>Content</span><textarea value={value} onChange={(event) => setValue(event.target.value)} rows={6} placeholder="A link, text, Wi‑Fi credentials, or contact details" /></label><div className="control-row"><label><span>Error correction</span><select value={level} onChange={(event) => setLevel(event.target.value as typeof level)}><option value="L">L — compact</option><option value="M">M — balanced</option><option value="Q">Q — robust</option><option value="H">H — resilient</option></select></label><fieldset><legend>Export</legend>{(["svg", "png"] as const).map((item) => <label key={item}><input type="radio" checked={format === item} onChange={() => setFormat(item)} />{item.toUpperCase()}</label>)}</fieldset></div>{error ? <p className="form-error">{error}</p> : null}<button type="button" disabled={!output} onClick={() => { if (format === "svg") { const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" })); download("wonder-qr-code.svg", url); URL.revokeObjectURL(url); } else download("wonder-qr-code.png", png); }}>Download {format.toUpperCase()}</button></div>
    <div className="qr-preview"><div className="preview-label"><span>LIVE PREVIEW</span><span>{format.toUpperCase()}</span></div>{output ? (format === "svg" ? <div className="qr-art" dangerouslySetInnerHTML={{ __html: svg }} /> : <img src={png} alt="Generated QR code" />) : <p>Enter content to generate a code.</p>}<dl><div><dt>Processing</dt><dd>On device</dd></div><div><dt>Output</dt><dd>{format.toUpperCase()}</dd></div><div><dt>Correction</dt><dd>{level}</dd></div></dl></div>
  </section>;
}
