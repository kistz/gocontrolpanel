"use client";

import MatchStatusBadge from "@/components/tournaments/match/match-status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { MatchV1 } from "@/lib/server-manager/types";
import { IconExternalLink, IconFileSymlink } from "@tabler/icons-react";
import { Handle, Node, NodeProps, NodeToolbar, Position } from "@xyflow/react";
import Link from "next/link";

export type MatchV1NodeType = Node<MatchV1>;

export default function MatchV1Node(props: NodeProps<MatchV1NodeType>) {
  return (

    <Card>
      <div className="p-1.5 bg-green-300">
        <strong>{props.data.name}</strong>
        <Button variant="outline" asChild className="max-w-44 ml-1" size="sm">
          <Link href={`/competitions/${props.data.id}`}>
            <IconExternalLink />
          </Link>
        </Button>
      </div>
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />

      <div className="m-2 flex flex-col">
        <div className="flex">Status: <MatchStatusBadge status={props.data.status} /></div>
        <div className="flex">AutoProvision: <Checkbox checked={props.data.autoProvisionServer} /></div>
        <div className="flex">Open: <Checkbox checked={props.data.open} /></div>
        <div className="flex"><p>PreConfig</p><p>Config</p></div>
      </div>
    </Card>
  );
}
