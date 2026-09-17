import { procedures, tables } from "@/lib/server-manager";
import {
  CompetitionConnection,
  CompetitionNodePosition,
  CompetitionV1,
  MatchV1,
} from "@/lib/server-manager/types";
import { useMemo } from "react";
import { Infer } from "spacetimedb";
import { useProcedure, useTable } from "spacetimedb/react";
import { useSpacetimeProcedure } from "../use-spacetime-procedure";



export type Graph = {
  nMatchV1: readonly MatchV1[],
  nCompetitionV1: readonly CompetitionV1[],
  connections: readonly CompetitionConnection[],
  nodePositions: readonly CompetitionNodePosition[]
};

export function useCompetitionBracket(competition: CompetitionV1) {
  const [nMatchV1, nMatchV1Ready] = useTable(
    tables.tabMatch.where((row) => row.parentId.eq(competition.id)),
  );

  const competition_competitions_procedure = useProcedure(procedures.unstableCompetition)
  const procedureResult = useSpacetimeProcedure(competition_competitions_procedure, {
    competitionId: competition.id
  }).data;

  const nCompetitionV1 = useMemo(() => {
    return procedureResult ? [procedureResult] : [];
  }, [procedureResult]);



  const [connections, connectionsReady] = useTable(
    tables.unstableCompetitionConnection.where((row) =>
      row.competitionId.eq(competition.id),
    ),
  );

  const [nodePositions, positionsReady] = useTable(
    tables.myNodePositions.where((row) =>
      row.competitionId.eq(competition.id),
    ),
  );

  const graph = useMemo<Graph>(() => {
    const allReady = nMatchV1Ready && connectionsReady && positionsReady;

    if (!allReady) {
      return {
        nMatchV1: [],
        nCompetitionV1: [],
        connections: [],
        nodePositions: [],
        isReady: false,
      };
    }

    return { nMatchV1, connections, nodePositions, nCompetitionV1 };
  }, [nMatchV1, connections, nodePositions, nCompetitionV1, nMatchV1Ready, connectionsReady, positionsReady]);

  return graph;
}
