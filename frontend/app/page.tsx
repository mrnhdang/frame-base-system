"use client";
import { useEffect, useMemo, useState } from "react";
import FrameTree from "@/components/FrameTree";
import ResultsTable from "@/components/ResultsTable";
import { diagnose, fetchGraph, fetchSymptoms, Graph } from "@/lib/api";

export default function Page() {
  const [graph, setGraph] = useState<Graph | null>(null);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [ranked, setRanked] = useState<
    { disease: string; score: number }[] | null
  >(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGraph().then(setGraph);
    fetchSymptoms().then(setSymptoms);
  }, []);

  const filtered = useMemo(() => {
    const set = new Set(selected);
    return symptoms.filter((s) => !set.has(s));
  }, [symptoms, selected]);

  async function run() {
    setLoading(true);
    try {
      const res = await diagnose(selected);
      setRanked(res.ranked);
    } finally {
      setLoading(false);
    }
  }

  function addSymptom(s: string) {
    if (!selected.includes(s)) setSelected([...selected, s]);
  }
  function removeSymptom(s: string) {
    setSelected(selected.filter((x) => x !== s));
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        {graph && <FrameTree graph={graph} />}

        <div className="card p-4">
          <h2 className="text-lg font-semibold mb-3">Add Symptoms</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {selected.map((s) => (
              <span
                key={s}
                className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm cursor-pointer"
                onClick={() => removeSymptom(s)}
                title="Remove"
              >
                {s} ×
              </span>
            ))}
          </div>
          <input
            list="symptom-list"
            placeholder="Type to search symptoms…"
            className="w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const v = (e.target as HTMLInputElement).value
                  .trim()
                  .toLowerCase();
                if (v) {
                  addSymptom(v);
                  (e.target as HTMLInputElement).value = "";
                }
              }
            }}
          />
          <datalist id="symptom-list">
            {filtered.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>

          <div className="mt-3 flex gap-2 flex-wrap">
            {filtered.slice(0, 20).map((s) => (
              <button
                key={s}
                onClick={() => addSymptom(s)}
                className="px-3 py-1 rounded-full border hover:bg-gray-50 text-sm"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <button
              onClick={run}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-black text-white hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Diagnosing…" : "Run Diagnosis"}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <ResultsTable ranked={ranked || []} />

        <div className="card p-4">
          <h2 className="text-lg font-semibold mb-2">How it works</h2>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>
              Frames (diseases) have <b>findings</b> with weights.
            </li>
            <li>
              Rules: <code>must_have</code> (all must be present) and{" "}
              <code>must_not_have</code> (any present disqualifies).
            </li>
            <li>Score = sum(weights of matched findings).</li>
            <li>Results ranked by score (prototype matching).</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
