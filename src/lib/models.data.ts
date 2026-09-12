import type { ModelInfo } from "./detection";

/**
 * Catálogo de modelos con métricas SIMULADAS.
 *
 * CUANDO EL BACKEND REAL ESTÉ LISTO:
 * borrar este archivo y hacer que `GET /api/public/models`
 * (src/routes/api/public/models.ts) consulte
 * `${process.env["MODEL_API_URL"]}/models` y devuelva la misma forma.
 */
export const MODELS: ModelInfo[] = [
  {
    id: "voxguard-v2",
    name: "VoxGuard",
    version: "2.4.1",
    description:
      "Modelo principal de detección de voz sintética. Combina características espectrales con un clasificador transformer sobre embeddings de hablante.",
    status: "active",
    trained_on: "412k llamadas etiquetadas (ES/EN)",
    metrics: {
      accuracy: 0.962,
      precision: 0.951,
      recall: 0.944,
      f1: 0.947,
      auc: 0.984,
      avg_latency_ms: 312,
      confusion: { true_ai: 4720, false_ai: 243, true_human: 5180, false_human: 280 },
      history: [
        { date: "Mar", accuracy: 0.918, f1: 0.902, auc: 0.951 },
        { date: "Abr", accuracy: 0.929, f1: 0.915, auc: 0.958 },
        { date: "May", accuracy: 0.937, f1: 0.924, auc: 0.965 },
        { date: "Jun", accuracy: 0.944, f1: 0.933, auc: 0.971 },
        { date: "Jul", accuracy: 0.955, f1: 0.941, auc: 0.978 },
        { date: "Ago", accuracy: 0.962, f1: 0.947, auc: 0.984 },
      ],
    },
  },
  {
    id: "voxguard-lite",
    name: "VoxGuard Lite",
    version: "1.8.0",
    description:
      "Versión ligera optimizada para latencia baja en tiempo real. Menor exactitud, respuesta por debajo de 100 ms.",
    status: "active",
    trained_on: "180k llamadas etiquetadas (ES)",
    metrics: {
      accuracy: 0.911,
      precision: 0.898,
      recall: 0.882,
      f1: 0.89,
      auc: 0.943,
      avg_latency_ms: 84,
      confusion: { true_ai: 4310, false_ai: 489, true_human: 4980, false_human: 576 },
      history: [
        { date: "Mar", accuracy: 0.862, f1: 0.844, auc: 0.901 },
        { date: "Abr", accuracy: 0.874, f1: 0.856, auc: 0.911 },
        { date: "May", accuracy: 0.885, f1: 0.865, auc: 0.92 },
        { date: "Jun", accuracy: 0.896, f1: 0.874, auc: 0.929 },
        { date: "Jul", accuracy: 0.904, f1: 0.883, auc: 0.937 },
        { date: "Ago", accuracy: 0.911, f1: 0.89, auc: 0.943 },
      ],
    },
  },
  {
    id: "prosody-x",
    name: "Prosody-X",
    version: "0.9.3",
    description:
      "Modelo experimental basado en ritmo, entonación y micro-pausas. En evaluación para llamadas con ruido alto.",
    status: "beta",
    trained_on: "96k llamadas etiquetadas (multi-idioma)",
    metrics: {
      accuracy: 0.873,
      precision: 0.861,
      recall: 0.903,
      f1: 0.881,
      auc: 0.921,
      avg_latency_ms: 528,
      confusion: { true_ai: 4402, false_ai: 712, true_human: 4690, false_human: 474 },
      history: [
        { date: "Mar", accuracy: 0.79, f1: 0.781, auc: 0.842 },
        { date: "Abr", accuracy: 0.812, f1: 0.805, auc: 0.863 },
        { date: "May", accuracy: 0.834, f1: 0.831, auc: 0.881 },
        { date: "Jun", accuracy: 0.851, f1: 0.856, auc: 0.897 },
        { date: "Jul", accuracy: 0.864, f1: 0.872, auc: 0.911 },
        { date: "Ago", accuracy: 0.873, f1: 0.881, auc: 0.921 },
      ],
    },
  },
];
