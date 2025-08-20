export const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5050";

export type Node = {
  id: string;
  label: string;
  findings: Record<string, number>;
  rules: Record<string, string[]>;
};

export type Edge = {
  from: string;
  to: string;
};

export type Graph = {
  nodes: Node[];
  edges: Edge[];
};

export type RankedResult = {
  disease: string;
  score: number;
};

export type DiagnosisDetails = {
  matched_findings: Record<string, number>;
  unmet_must: string[];
  forbidden_present: string[];
  total: number;
};

export type DiagnoseResponse = {
  ranked: RankedResult[];
  details: Record<string, DiagnosisDetails>;
};

export async function fetchGraph(): Promise<Graph> {
  const r = await fetch(`${BACKEND}/api/frames`, { cache: "no-store" });
  return r.json();
}

export async function fetchSymptoms(): Promise<string[]> {
  const r = await fetch(`${BACKEND}/api/symptoms`, { cache: "no-store" });
  return r.json();
}

export async function diagnose(symptoms: string[]): Promise<DiagnoseResponse> {
  const r = await fetch(`${BACKEND}/api/diagnose`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ symptoms }),
  });
  return r.json();
}
