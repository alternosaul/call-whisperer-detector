import { useSyncExternalStore } from "react";
import type { DetectionResult } from "./detection";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * CAPA DE HISTORIAL (TigerData)
 * ─────────────────────────────────────────────────────────────────────────────
 * Hoy el historial vive solo en memoria del navegador (se pierde al recargar).
 *
 * CÓMO CONECTAR TIGERDATA CUANDO LA BASE DE DATOS ESTÉ LISTA:
 *
 * 1. Guardar la cadena de conexión como secreto del proyecto:
 *      TIGERDATA_URL  (ej. postgres://user:pass@host:5432/db?sslmode=require)
 *
 * 2. Crear `src/lib/history.functions.ts` con dos server functions
 *    (TanStack `createServerFn`) que hablen con TigerData desde el servidor.
 *    NUNCA conectes a la base de datos desde el navegador.
 *
 *      export const saveDetection = createServerFn({ method: "POST" })
 *        .inputValidator((d: DetectionResult) => detectionResultSchema.parse(d))
 *        .handler(async ({ data }) => {
 *          const url = process.env["TIGERDATA_URL"]!; // leer dentro del handler
 *          // INSERT INTO detections (call_id, is_synthetic, confidence, model,
 *          //   latency_ms, received_at, source, duration_sec) VALUES (...)
 *        });
 *
 *      export const listDetections = createServerFn({ method: "GET" })
 *        .handler(async () => {
 *          // SELECT * FROM detections ORDER BY received_at DESC LIMIT 200
 *        });
 *
 * 3. Sustituir el cuerpo de `addDetection` por una llamada a `saveDetection`
 *    y alimentar `useDetectionHistory` con `listDetections` vía TanStack Query.
 *    La interfaz pública de este archivo no necesita cambiar.
 * ─────────────────────────────────────────────────────────────────────────────
 */

let history: DetectionResult[] = [];
const listeners = new Set<() => void>();

function emit() {
  listeners.add;
  for (const l of listeners) l();
}

export function addDetection(result: DetectionResult) {
  // TODO(TigerData): reemplazar por `await saveDetection({ data: result })`
  history = [result, ...history].slice(0, 200);
  emit();
}

export function clearHistory() {
  // TODO(TigerData): reemplazar por un DELETE server-side si se requiere
  history = [];
  emit();
}

export function getHistory() {
  return history;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const emptySnapshot: DetectionResult[] = [];

export function useDetectionHistory() {
  // TODO(TigerData): cambiar por useQuery({ queryKey: ["detections"], queryFn: listDetections })
  return useSyncExternalStore(
    subscribe,
    getHistory,
    () => emptySnapshot,
  );
}
