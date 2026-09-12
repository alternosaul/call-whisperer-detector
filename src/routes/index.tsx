import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Upload, Play, FileJson } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfidenceGauge } from "@/components/confidence-gauge";
import { ResultBadge } from "@/components/result-badge";
import { EXAMPLE_PAYLOAD, type DetectionResult, type ModelInfo } from "@/lib/detection";
import { addDetection } from "@/lib/tigerdata";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Detector — VoxGuard" },
      {
        name: "description",
        content:
          "Envía los datos de una llamada y descubre al instante si la voz es de una IA o de una persona.",
      },
      { property: "og:title", content: "Detector — VoxGuard" },
      {
        property: "og:description",
        content: "Detección de voz sintética con velocímetro de confianza en tiempo real.",
      },
    ],
  }),
  component: DetectorPage,
});

function DetectorPage() {
  const [model, setModel] = useState("voxguard-v2");
  const [json, setJson] = useState(EXAMPLE_PAYLOAD);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);

  const { data: models } = useQuery({
    queryKey: ["models"],
    queryFn: async (): Promise<ModelInfo[]> => {
      const res = await fetch("/api/public/models");
      const body = (await res.json()) as { models: ModelInfo[] };
      return body.models;
    },
  });

  async function handleResponse(res: Response) {
    const body = await res.json();
    if (!res.ok) {
      toast.error(body.error ?? "No se pudo analizar la llamada");
      return;
    }
    setResult(body as DetectionResult);
    addDetection(body as DetectionResult);
    toast.success("Análisis completado");
  }

  async function analyzeJson() {
    let parsed: unknown;
    try {
      parsed = JSON.parse(json);
    } catch {
      toast.error("El JSON no es válido");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/public/detect?model=${encodeURIComponent(model)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      await handleResponse(res);
    } catch {
      toast.error("Error de red al contactar el modelo");
    } finally {
      setLoading(false);
    }
  }

  async function analyzeAudio() {
    if (!file) {
      toast.error("Selecciona un archivo de audio");
      return;
    }
    const form = new FormData();
    form.append("file", file);
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/public/detect/audio?model=${encodeURIComponent(model)}`, {
        method: "POST",
        body: form,
      });
      await handleResponse(res);
    } catch {
      toast.error("Error de red al contactar el modelo");
    } finally {
      setLoading(false);
    }
  }

  const state = loading ? "loading" : result ? (result.is_synthetic ? "ai" : "human") : "idle";

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Detector</h1>
          <p className="text-sm text-muted-foreground">
            Analiza una llamada y determina si la voz es sintética o humana.
          </p>
        </div>
        <div className="w-full sm:w-64">
          <Label className="mb-1.5 block text-xs uppercase tracking-wide text-muted-foreground">
            Modelo
          </Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un modelo" />
            </SelectTrigger>
            <SelectContent>
              {(models ?? []).map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name} v{m.version}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">Entrada</CardTitle>
            <CardDescription>Pega el JSON de la llamada o sube el audio.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="json">
              <TabsList className="mb-4">
                <TabsTrigger value="json">
                  <FileJson className="mr-2 h-4 w-4" /> JSON
                </TabsTrigger>
                <TabsTrigger value="audio">
                  <Upload className="mr-2 h-4 w-4" /> Audio
                </TabsTrigger>
              </TabsList>

              <TabsContent value="json" className="space-y-3">
                <Textarea
                  value={json}
                  onChange={(e) => setJson(e.target.value)}
                  rows={12}
                  spellCheck={false}
                  className="font-mono text-xs"
                />
                <Button onClick={analyzeJson} disabled={loading} className="w-full sm:w-auto">
                  <Play className="mr-2 h-4 w-4" />
                  Analizar llamada
                </Button>
              </TabsContent>

              <TabsContent value="audio" className="space-y-3">
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-secondary/40 px-6 py-12 text-center transition-colors hover:border-primary">
                  <Upload className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium">
                    {file ? file.name : "Selecciona o arrastra un archivo de audio"}
                  </span>
                  <span className="text-xs text-muted-foreground">WAV, MP3, M4A · máx. 25 MB</span>
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </label>
                <Button onClick={analyzeAudio} disabled={loading} className="w-full sm:w-auto">
                  <Play className="mr-2 h-4 w-4" />
                  Analizar audio
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Resultado</CardTitle>
            <CardDescription>is_synthetic y confianza del modelo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ResultBadge state={state} />
            <ConfidenceGauge value={result?.confidence ?? 0} loading={!result || loading} />

            <dl className="space-y-2 border-t border-border pt-4 text-sm">
              <Row label="Call ID" value={result?.call_id ?? "—"} />
              <Row label="Modelo" value={result?.model ?? model} />
              <Row
                label="Duración"
                value={result?.duration_sec ? `${result.duration_sec}s` : "—"}
              />
              <Row label="Origen" value={result?.source ?? "—"} />
              <Row
                label="Latencia"
                value={result ? `${result.latency_ms} ms` : "—"}
              />
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">is_synthetic</dt>
                <dd>
                  {result ? (
                    <Badge variant={result.is_synthetic ? "destructive" : "secondary"}>
                      {String(result.is_synthetic)}
                    </Badge>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="truncate font-medium">{value}</dd>
    </div>
  );
}
