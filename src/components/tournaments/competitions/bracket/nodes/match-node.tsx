"use client";

import { Card } from "@/components/ui/card";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";

export type MatchNodeType = Node<{
  label: string;
  defaultPosition: { x: number; y: number };
}>;

export default function MatchNode(props: NodeProps<MatchNodeType>) {
  return (

    <Card>
      <div className="p-1.5 bg-green-300">
        <strong>{props.data.label}</strong>
      </div>
      <Handle type="source" position={Position.Left} />
      <Handle type="target" position={Position.Right} />

      <div>
        hafhhafahf
      </div>
    </Card>
  );
}
