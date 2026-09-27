"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LeaderboardV2 } from "@/lib/server-manager/types";
import { IconArrowAutofitContent, IconChevronDown, IconSettings } from "@tabler/icons-react";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";

export type LeaderboardV2NodeType = Node<LeaderboardV2>;

export default function LeaderboardV2Node(props: NodeProps<LeaderboardV2NodeType>) {
  return (

    <Card>
      <div className=" bg-yellow-300 rounded-t-lg flex">
        <IconChevronDown className="h-[1em] items-center text-inherit leading-none self-center align-middle bg-none p-0 m-0 " />
        <strong>
          {props.data.name}
        </strong>
        <IconSettings className="pl-2 h-[1em] items-center text-inherit leading-none self-center align-middle bg-none p-0 m-0 " />
      </div>
      <Handle type="source" position={Position.Right} className="h-5! rounded-sm!" />
      <Handle type="target" position={Position.Left} className="h-5! rounded-sm!" />

      <div className="m-2">
        {props.data.settings.map((setting, idx) => {
          switch (setting.tag) {
            case "Filter":
              return <div className="flex" key={idx}>{idx + 1}. Filter {setting.value.kind.tag}</div>
            case "Merge":
              return <div className="flex" key={idx}>{idx + 1}. Merge <span className="underline">{setting.value.kind.tag} </span> and <span className="underline">{setting.value.action.tag}</span> the <span className="underline">{setting.value.param.tag}</span></div>
            case "Remap":
              return <div className="flex" key={idx}>{idx + 1}. Remap
                <span className="underline">  {setting.value.origin.tag} </span>
                to <span className="underline">{setting.value.target.tag}</span>
                and do <span className="underline">
                  {(() => {
                    switch (setting.value.manipulation.tag) {
                      case "Add": return <div> {setting.value.origin.tag} + {setting.value.manipulationValue}  </div>
                      case "DivideLhs": return <div> {setting.value.origin.tag} / {setting.value.manipulationValue} </div>
                      case "DivideRhs": return <div>{setting.value.manipulationValue} / {setting.value.origin.tag}</div>
                      case "Multiply": return <div> {setting.value.origin.tag} * {setting.value.manipulationValue} </div>
                      case "SubtractLhs": return <div>{setting.value.origin.tag} - {setting.value.manipulationValue} </div>
                      case "SubtractRhs": return <div> {setting.value.manipulationValue} - {setting.value.origin.tag}</div>
                    }
                  })()}</span>
              </div>
            case "Finalize":
              return <div key={idx}>{idx + 1}. Finalize Leaderboard</div>
          }
        })}
      </div>
    </Card>
  );
}
