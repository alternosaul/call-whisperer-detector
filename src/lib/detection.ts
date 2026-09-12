import { z } from "zod";

/**
 * Tipos compartidos entre el frontend y los endpoints de la app.
 * Cuando se conecte el modelo real, esta forma debe coincidir con la
 * respuesta del backend (ver src/routes/api/public/detect.ts).
 */

export const callPayloadSchema = z.object({
  call_id: z.string().min(1),
  duration_sec: z.number().nonnegative().optional(),
  source: z.string().optional(),
  language: z.string().optional(),
  transcript: z.string().optional(),
  audio_url: z.string().url().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type CallPayload = z.infer<typeof callPayloadSchema>;

export const detectionResultSchema = z.object({
  call_id: z.string(),
  is_synthetic: z.boolean(),
  confidence: z.number().min(0).max(1),
  model: z.string(),
  latency_ms: z.number(),
  received_at: z.string(),
  source: z.string().optional(),
  duration_sec: z.number().optional(),
});

export type DetectionResult = z.infer<typeof detectionResultSchema>;

export type ModelMetrics = {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  auc: number;
  avg_latency_ms: number;
  confusion: { true_ai: number; false_ai: number; true_human: number; false_human: number };
  history: { date: string; accuracy: number; f1: number; auc: number }[];
};

export type ModelInfo = {
  id: string;
  name: string;
  version: string;
  description: string;
  status: "active" | "beta" | "deprecated";
  trained_on: string;
  metrics: ModelMetrics;
};

export const EXAMPLE_PAYLOAD = `{
  "call_id": "call_10293",
  "duration_sec": 74.5,
  "source": "inbound-pstn",
  "language": "es-MX",
  "transcript": "Buenas tardes, le llamo para confirmar su cita..."
}`;
