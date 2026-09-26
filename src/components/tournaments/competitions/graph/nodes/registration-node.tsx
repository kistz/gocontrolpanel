"use client";

import { Card } from "@/components/ui/card";
import { Registration } from "@/lib/server-manager/types";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";

export type RegistrationV1NodeType = Node<Registration>;

export default function RegistrationV1Node(props: NodeProps<RegistrationV1NodeType>) {
  return (

    <Card>
      <div className="p-1.5 bg-blue-300">
        <strong>{props.data.name}</strong>
      </div>
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />

      <div>
        hafhhafahf
      </div>
    </Card>
  );
}