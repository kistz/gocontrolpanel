'use client'
import CompetitionBracket from "@/components/tournaments/competitions/bracket/competition-bracket";
import { Button } from "@/components/ui/button";
import { useSpacetimeProcedure } from "@/hooks/tournaments/use-spacetime-procedure";
import { procedures, tables } from "@/lib/server-manager";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useProcedure, useTable } from "spacetimedb/react";


export default function CompetitionPage({
    params,
}: {
    params: Promise<{ id: number }>;
}) {
    const { id } = React.use(params);
    const competition = useProcedure(procedures.unstableCompetition)

    const { data: comp, isLoading } = useSpacetimeProcedure(competition, { competitionId: id })

    if (isLoading) {
        return <div className="p-6 text-muted-foreground">Loading competition info...</div>;
    }

    if (comp === undefined || comp === null) {
        return <div>Competition not found</div>
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold">Competition Info</h1>
                <h4 className="text-muted-foreground">
                    Manage the competition graph as well as available servers and permissions.
                </h4>
            </div>

            <Button variant="outline" asChild className="max-w-44">
                <Link href={`/tournaments/${id}`}>
                    <IconArrowLeft />
                    Back to tournament
                </Link>
            </Button>

            <CompetitionBracket competition={comp} />
        </div>
    );
}
