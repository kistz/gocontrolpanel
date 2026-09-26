"use client";

import { Card } from "@/components/ui/card";
import { MatchV1 } from "@/lib/server-manager/types";
import { Handle, Node, NodeProps, NodeToolbar, Position } from "@xyflow/react";

export type MatchV1NodeType = Node<MatchV1>;

export default function MatchV1Node(props: NodeProps<MatchV1NodeType>) {
  return (

    <Card>
      <div className="p-1.5 bg-green-300">
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
