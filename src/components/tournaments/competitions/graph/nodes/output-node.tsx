"use client";

import { Card } from "@/components/ui/card";
import { OutputV1 } from "@/lib/server-manager/types";
import { IconChevronDown, IconSettings } from "@tabler/icons-react";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";

export type OutputV1NodeType = Node<OutputV1>;

export default function OutputV1Node(props: NodeProps<OutputV1NodeType>) {
  return (

    <Card>
      <div className=" bg-pink-300 rounded-t-lg flex">
        <IconChevronDown className="h-[1em] items-center text-inherit leading-none self-center align-middle bg-none p-0 m-0 " />
        <strong>
          {props.data.name}
        </strong>
        <IconSettings className="pl-2 h-[1em] items-center text-inherit leading-none self-center align-middle bg-none p-0 m-0 " />
      </div>
      {/* <Handle type="source" position={Position.Right} /> */}
      <Handle type="target" position={Position.Left} className="h-5! rounded-sm!"/>

      <div>
        hafhhafahf
      </div>
    </Card>
  );
}
