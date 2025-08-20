"use client";
import { Table } from "antd";
import type { RankedResult } from "@/lib/api";

export default function ResultsTable({ ranked }: { ranked: RankedResult[] }) {
  return (
    <div className="card">
      <div className="px-4 py-3 border-b bg-gray-50">
        <h2 className="text-lg font-semibold">Diagnosis Ranking</h2>
      </div>
      <Table<RankedResult>
        rowKey="disease"
        dataSource={ranked}
        columns={[
          { title: "#", render: (_: unknown, __: RankedResult, i: number) => i + 1 },
          { title: "Disease", dataIndex: "disease" },
          {
            title: "Score",
            dataIndex: "score",
            render: (s: number) => s.toFixed(2)
          }
        ]}
        pagination={false}
      />
    </div>
  );
}
