"use client";

import { Card } from "@/components/ui/card";
import { LeaderboardV2 } from "@/lib/server-manager/types";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";

export type LeaderboardV2NodeType = Node<LeaderboardV2>;

export default function LeaderboardV2Node(props: NodeProps<LeaderboardV2NodeType>) {
  return (

    <Card>
      <div className="p-1.5 bg-yellow-300">
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
