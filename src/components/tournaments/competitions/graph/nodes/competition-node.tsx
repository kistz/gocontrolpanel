"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CompetitionV1 } from "@/lib/server-manager/types";
import { IconFileSymlink } from "@tabler/icons-react";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import Link from "next/link";

export type CompetitionV1NodeType = Node<CompetitionV1>;

export default function CompetitionV1Node(props: NodeProps<CompetitionV1NodeType>) {
  return (

    <Card>
      <div className="p-1.5 bg-red-300">
        <strong>{props.data.name}</strong>
        <Button variant="outline" asChild className="max-w-44 ml-1" size="sm">
          <Link href={`/competitions/${props.data.id}`}>
            <IconFileSymlink />
          </Link>
        </Button>
      </div>
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />

      <div>
        hafhhafahf
      </div>
    </Card>
  );
}
