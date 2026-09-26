"use client";

import { Card } from "@/components/ui/card";
import { CompetitionV1 } from "@/lib/server-manager/types";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";

export type CompetitionV1NodeType = Node<CompetitionV1>;

export default function CompetitionV1Node(props: NodeProps<CompetitionV1NodeType>) {
  return (

    <Card>
      <div className="p-1.5 bg-red-300">
        <strong>{props.data.name}</strong>
      </div>
      <Handle type="source" position={Position.Left} />
      <Handle type="target" position={Position.Right} />

      <div>
        hafhhafahf
      </div>
    </Card>
  );
}
