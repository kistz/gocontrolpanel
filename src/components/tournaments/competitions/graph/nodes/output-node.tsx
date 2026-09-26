"use client";

import { Card } from "@/components/ui/card";
import { OutputV1 } from "@/lib/server-manager/types";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";

export type OutputV1NodeType = Node<OutputV1>;

export default function OutputV1Node(props: NodeProps<OutputV1NodeType>) {
  return (

    <Card>
      <div className="p-1.5 bg-pink-300">
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
