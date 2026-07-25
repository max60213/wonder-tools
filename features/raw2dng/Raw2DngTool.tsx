"use client";

import JSZip from "jszip";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  createQueueWindow,
  createTask,
  detectCapabilityProfile,
  gateFile,
  type CapabilityProfile,
  type ConversionTask,
} from "@raw-core";
import type { WorkerResponse } from "@worker-runtime";

type RuntimeStatus = "checking" | "ready" | "error";
interface PendingJob { file: File; taskId: string; }
const acceptedFormats = ".cr2,.cr3,.nef,.arw,.raf,.rw2,.orf,.dng";

export function Raw2DngTool() {
  const capability = useMemo<CapabilityProfile>(() => detectCapabilityProfile(), []);
  const [tasks, setTasks] = useState<ConversionTask[]>([]);
  const [runtimeStatus, setRuntimeStatus] = useState<RuntimeStatus>("checking");
  const [runtimeMessage, setRuntimeMessage] = useState("Loading the local conversion engine…");
  const [dragging, setDragging] = useState(false);
  const queueRef = useRef<PendingJob[]>([]);
  const activeIdsRef = useRef(new Set<string>());
  const workerRef = useRef<Worker | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const worker = new Worker(new URL("./conversion.worker.ts", import.meta.url), { type: "module" });
    workerRef.current = worker;
    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const message = event.data;
      if (message.type === "ready") { setRuntimeStatus("ready"); setRuntimeMessage("Conversion engine ready. Your files stay on this device."); return; }
      if (message.type === "runtime-error") { setRuntimeStatus("error"); setRuntimeMessage(message.error); return; }
      setTasks((current) => current.map((task) => {
        if (task.id !== message.jobId) return task;
        if (message.type === "progress") return { ...task, status: message.phase, progress: message.progress, message: message.message };
        if (message.type === "success") return { ...task, status: "complete", progress: 100, message: `Ready: ${message.outputName}`, outputBlob: message.blob, outputFileName: message.outputName };
        return { ...task, status: "error", progress: 100, message: message.error, error: message.error };
      }));
      if (message.type === "success" || message.type === "failure") activeIdsRef.current.delete(message.jobId);
      pumpQueue(worker, capability, queueRef.current, activeIdsRef.current, setTasks);
    };
    worker.postMessage({ type: "ping" });
    return () => worker.terminate();
  }, [capability]);

  function addFiles(files: File[]) {
    const nextTasks: ConversionTask[] = [];
    for (const file of files) {
      const task = createTask(file);
      const gate = gateFile(file, capability);
      if (!gate.accepted) { nextTasks.push({ ...task, status: "error", progress: 100, error: gate.reason, message: gate.reason ?? "This file cannot be converted." }); continue; }
      nextTasks.push({ ...task, status: "gated", progress: 5, warning: gate.warning, message: gate.warning ?? "Waiting to convert" });
      queueRef.current.push({ file, taskId: task.id });
    }
    setTasks((current) => [...current, ...nextTasks]);
    if (workerRef.current) pumpQueue(workerRef.current, capability, queueRef.current, activeIdsRef.current, setTasks);
  }

  function download(task: ConversionTask) { if (task.outputBlob && task.outputFileName) downloadBlob(task.outputBlob, task.outputFileName); }
  async function downloadAll() {
    const completed = tasks.filter((task) => task.outputBlob && task.outputFileName);
    if (!completed.length) return;
    const zip = new JSZip(); const names = new Set<string>();
    await Promise.all(completed.map(async (task) => zip.file(uniqueName(task.outputFileName!, names), await task.outputBlob!.arrayBuffer())));
    downloadBlob(await zip.generateAsync({ type: "blob" }), `raw2dng-${dateStamp()}.zip`);
  }

  const completed = tasks.filter((task) => task.outputBlob && task.outputFileName).length;
  return <section className="raw-workbench" aria-label="RAW to DNG converter">
    <div className="raw-status" data-status={runtimeStatus}><span className="status-dot" aria-hidden="true" /><div><p className="kicker">LOCAL CONVERSION ENGINE</p><strong>{runtimeStatus === "checking" ? "Preparing WebAssembly" : runtimeStatus === "ready" ? "Ready to convert" : "Engine unavailable"}</strong><p>{runtimeMessage}</p></div></div>
    <section className={`raw-dropzone ${dragging ? "is-dragging" : ""} ${runtimeStatus !== "ready" ? "is-disabled" : ""}`} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); if (runtimeStatus === "ready") addFiles(Array.from(event.dataTransfer.files)); }}>
      <p className="kicker">STEP 01 — SELECT RAW FILES</p><h2>Drop your camera originals here.</h2><p>CR2, CR3, NEF, ARW, RAF, RW2, ORF, and DNG. The conversion happens in your browser.</p><button type="button" disabled={runtimeStatus !== "ready"} onClick={() => inputRef.current?.click()}>Choose RAW files</button><input ref={inputRef} hidden type="file" accept={acceptedFormats} multiple onChange={(event) => addFiles(Array.from(event.target.files ?? []))} />
    </section>
    <section className="raw-queue" aria-live="polite"><div className="raw-queue-heading"><div><p className="kicker">STEP 02 — CONVERSION QUEUE</p><h2>{tasks.length ? `${tasks.length} file${tasks.length === 1 ? "" : "s"} in this session` : "Nothing in the queue yet."}</h2></div><button className="quiet-button" type="button" disabled={!completed} onClick={() => void downloadAll()}>Download all{completed ? ` (${completed})` : ""}</button></div>{tasks.length === 0 ? <p className="queue-empty">Choose a RAW file to see conversion progress and downloads here.</p> : <div className="raw-task-list">{tasks.map((task) => <article className="raw-task" key={task.id}><div className="raw-task-row"><strong>{task.fileName}</strong><span className={`task-state is-${task.status}`}>{task.status}</span></div><div className="raw-task-row task-meta"><span>{formatBytes(task.size)}</span><span>{task.warning ?? task.message}</span></div><div className="progress-track"><span style={{ width: `${task.progress}%` }} /></div>{task.error ? <p className="task-error">{task.error}</p> : null}{task.outputBlob ? <button className="quiet-button" type="button" onClick={() => download(task)}>Download {task.outputFileName}</button> : null}</article>)}</div>}</section>
    <aside className="raw-facts"><p className="kicker">WORKING LOCALLY</p><dl><div><dt>Privacy</dt><dd>Files never leave your browser.</dd></div><div><dt>Batch limit</dt><dd>{capability.maxBatchItems} files on this device.</dd></div><div><dt>File limit</dt><dd>{Math.round(capability.maxFileBytes / 1024 / 1024)} MB per source file.</dd></div></dl></aside>
  </section>;
}

function pumpQueue(worker: Worker, capability: CapabilityProfile, queue: PendingJob[], activeIds: Set<string>, setTasks: React.Dispatch<React.SetStateAction<ConversionTask[]>>) {
  const slots = createQueueWindow(capability, queue.length + activeIds.size);
  while (activeIds.size < slots && queue.length) { const next = queue.shift(); if (!next) return; activeIds.add(next.taskId); setTasks((current) => current.map((task) => task.id === next.taskId ? { ...task, status: "queued", progress: 10, message: "Queued in local worker" } : task)); void next.file.arrayBuffer().then((bytes) => worker.postMessage({ type: "convert", jobId: next.taskId, fileName: next.file.name, bytes }, [bytes])); }
}
function downloadBlob(blob: Blob, name: string) { const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = name; anchor.click(); URL.revokeObjectURL(url); }
function uniqueName(name: string, names: Set<string>) { if (!names.has(name)) { names.add(name); return name; } const point = name.lastIndexOf("."); const base = point > 0 ? name.slice(0, point) : name; const extension = point > 0 ? name.slice(point) : ""; let index = 2; while (names.has(`${base}-${index}${extension}`)) index += 1; const result = `${base}-${index}${extension}`; names.add(result); return result; }
function dateStamp() { return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, ""); }
function formatBytes(bytes: number) { return `${(bytes / 1024 / 1024).toFixed(bytes > 10 * 1024 * 1024 ? 0 : 1)} MB`; }
