"use client";
import { Tree } from "antd";
import type { Graph, Node, Edge } from "@/lib/api";
import type { ReactNode } from "react";

type TreeNode = {
  title: ReactNode;
  key: string;
  children?: TreeNode[];
};

function buildTree(graph: Graph): TreeNode[] {
  const nodeMap = new Map<string, Node>();
  graph.nodes.forEach((n) => nodeMap.set(n.id, n));

  // group children
  const childrenMap = new Map<string, string[]>();
  graph.edges.forEach((e) => {
    if (!childrenMap.has(e.from)) childrenMap.set(e.from, []);
    childrenMap.get(e.from)!.push(e.to);
  });

  function makeNode(id: string): TreeNode {
    const n = nodeMap.get(id)!;
    const findings = Object.entries(n.findings)
      .map(([k, v]) => `${k}(${v})`)
      .join(", ");
    const rules = Object.entries(n.rules)
      .map(([rule, vals]) => `${rule}: [${vals.join(", ")}]`)
      .join("; ");

    const extra = [];
    if (findings) extra.push(`Findings: ${findings}`);
    if (rules) extra.push(`Rules: ${rules}`);

    const title = extra.length > 0 ? (
      <div>
        <div className="font-medium">{n.label}</div>
        <div className="text-xs text-gray-600">{extra.join(" | ")}</div>
      </div>
    ) : (
      n.label
    );

    return {
      title,
      key: id,
      children: (childrenMap.get(id) || []).map((cid) => makeNode(cid))
    };
  }

  return [makeNode("Disease")];
}

export default function FrameTree({ graph }: { graph: Graph }) {
  const treeData = buildTree(graph);
  return (
    <div className="card p-4">
      <h2 className="text-lg font-semibold mb-3">Frame Hierarchy</h2>
      <Tree treeData={treeData} defaultExpandAll />
    </div>
  );
}
