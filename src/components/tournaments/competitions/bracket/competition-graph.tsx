"use client";
import Modal from "@/components/modals/modal";
import CreateConnectionModal from "@/components/modals/tournaments/competition/create-connection";
import { Card } from "@/components/ui/card";
import { useCompetitionBracket as useCompetitionGraph } from "@/hooks/tournaments/competitions/use-competition-graph";
import { CompetitionV1, NodeHandle } from "@/lib/server-manager/types";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  ColorMode,
  ConnectionLineType,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  Panel,
  ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState, type MouseEvent } from "react";
import "./bracket.css";
import MatchEdge, { MatchEdgeType } from "./edges/match-edge";
import MatchNode, { type MatchV1NodeType } from "./nodes/match-node";
import AddMatchButton from "./panel/add-match";
import CalculatePositionsButton from "./panel/calculate-positions";
import SaveLayoutButton from "./panel/save-layout";
import SelectedMatchPanel from "./panel/selected-match";
import ToggleWaitingEdgesButton from "./panel/toggle-waiting-edges";
import CompetitionV1Node, { CompetitionV1NodeType } from "./nodes/competition-node";

const nodeTypes = {
  MatchV1: MatchNode,
  CompetitionV1: CompetitionV1Node
};

type MasterNodeEnumType = (MatchV1NodeType | CompetitionV1NodeType);

const edgeTypes = {
  Data: MatchEdge,
  Wait: MatchEdge,
  Action: MatchEdge,
};

interface CompetitionBracketProps {
  competition: CompetitionV1;
}

export default function CompetitionGraph({
  competition,
}: CompetitionBracketProps) {
  const { theme } = useTheme();

  const graph = useCompetitionGraph(competition);

  const [nodes, setNodes] = useState<MasterNodeEnumType[]>([]);
  const [edges, setEdges] = useState<MatchEdgeType[]>([]);

  const [selectedNode, setSelectedNode] = useState<MasterNodeEnumType | null>(null);

  const [createdEdge, setCreatedEdge] = useState<{
    from: number;
    to: number;
  } | null>(null);
  console.log(graph.nodePositions)
  useEffect(() => {
    const transformedNodes = [
      ...graph.nMatchV1.map((n) => {
        const handle = NodeHandle.MatchV1(n.id);
        // The setNodes error can be fixed with position! but that breaks other stuff idk.
        const position = graph.nodePositions.find((row) => row.node.tag == handle.tag && row.node.value == handle.value)?.position;
        return {
          id: `MatchV1-${n.id}`,
          type: "MatchV1",
          data: n,
          position,
        }
      }),

      /* ...graph.nCompetitionV1.map((n) => {
        const handle = NodeHandle.CompetitionV1(n.id);
        // The setNodes error can be fixed with position! but that breaks other stuff idk.
        const position = graph.nodePositions.find((row) => row.node.tag == handle.tag && row.node.value == handle.value)?.position;
        return {
          id: `CompetitionV1-${n.id}`,
          type: "CompetitionV1",
          data: n,
          position,
        }
      }) */
    ]

    setNodes(transformedNodes);
  }, [graph.nMatchV1, graph.nCompetitionV1, graph.nodePositions]);

  useEffect(() => {
    const transformedEdges = [
      ...graph.connections.map((e) => ({
        id: `edge-${e.origin.tag}-${e.origin.value}-${e.target.tag}-${e.target.value}`,
        source: `${e.origin.tag}-${e.origin.value}`,
        target: `${e.target.tag}-${e.target.value}`,
        type: e.kind.tag,
        className: `${e.kind.tag.toLowerCase()}-edge`,
        data: e,
      }))
    ]

    setEdges(transformedEdges);
  }, [graph.connections]);

  /* const onNodesChange: OnNodesChange<MatchNodeType> = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [setNodes],
  );
   
  const onEdgesChange: OnEdgesChange<MatchEdgeType> = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [setEdges],
  ); */

  /* const onConnect: OnConnect = useCallback(
    (params) => {
      setCreatedEdge({
        from: parseInt(params.target),
        to: parseInt(params.source),
      });
   
      setEdges((edgesSnapshot) =>
        addEdge(
          {
            ...params,
            type: "matchEdge",
          },
          edgesSnapshot,
        ),
      );
    },
    [setEdges],
  ); */

  const onNodeClick = useCallback((_: MouseEvent, node: MasterNodeEnumType) => {
    setSelectedNode((prev) => (prev?.id === node.id ? null : node));
  }, []);

  const onEdgeClick = useCallback((_: MouseEvent, edge: MatchEdgeType) => {
    if (edge.selected) return;
    console.log("edge clicked", edge);
  }, []);

  // const onCreateConnectionCallback = useCallback(() => {
  //   setCreatedEdge(null);
  // }, []);

  return (
    <>
      <Card className="w-full h-[500]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          //onNodesChange={onNodesChange}
          //onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          //onConnect={onConnect}
          snapGrid={[10, 10]}
          snapToGrid={true}
          minZoom={0.25}
          fitView
          colorMode={theme as ColorMode}
          connectionLineType={ConnectionLineType.SmoothStep}
          style={{
            borderRadius: "calc(var(--radius) + 4px)",
          }}
        >
          <Background />
          <Panel position="top-left">
            {selectedNode && <SelectedMatchPanel match={selectedNode} />}
          </Panel>
          <Panel position="bottom-left">
            <ToggleWaitingEdgesButton />
          </Panel>
          <Panel position="top-right" className="flex flex-col gap-2">
            <SaveLayoutButton />
            <CalculatePositionsButton />
            <AddMatchButton competitionId={competition.id} />
          </Panel>
        </ReactFlow>
      </Card>

      <Modal
        isOpen={createdEdge !== null}
        setIsOpen={() => setCreatedEdge(null)}
      >
        <CreateConnectionModal
          data={{
            originId: createdEdge?.from || 0,
            targetId: createdEdge?.to || 0,
          }}
          closeModal={() => setCreatedEdge(null)}
        />
      </Modal>
    </>
  );
}
