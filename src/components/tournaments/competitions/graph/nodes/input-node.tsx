"use client";

import { Card } from "@/components/ui/card";
import { InputV1 } from "@/lib/server-manager/types";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";

export type InputV1NodeType = Node<InputV1>;

export default function InputV1Node(props: NodeProps<InputV1NodeType>) {
  return (

    <Card>
      <div className="p-1.5 bg-purple-300">
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
