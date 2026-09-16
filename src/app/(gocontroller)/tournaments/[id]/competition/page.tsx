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
    /*const [comp, setComp] = useState<any>(null);
        const [isLoading, setIsLoading] = useState(true);

      // 4. Fetch the procedure inside useEffect to prevent render loops
     useEffect(() => {
         let isMounted = true;
         setIsLoading(true);
 
         async function fetchCompetition() {
             try {
                 // Await the procedure execution cleanly here
                 const result = await competition({ competitionId: id });
 
                 if (isMounted) {
                     setComp(result);
                 }
             } catch (error) {
                 console.error("Failed to fetch competition data:", error);
             } finally {
                 if (isMounted) {
                     setIsLoading(false);
                 }
             }
         }
 
         fetchCompetition();
 
         return () => {
             isMounted = false; // Prevents state updates on unmounted component
         };
     }, [id, competition]);
 
     if (isLoading) {
         return <div className="p-6 text-muted-foreground">Loading stage info...</div>;
     } */


    const { data: comp, isLoading } = useSpacetimeProcedure(competition, { competitionId: id })

    if (isLoading) {
        return <div className="p-6 text-muted-foreground">Loading competition info...</div>;
    }

    if (comp === undefined) {
        return <div>Competition not found</div>
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold">Stage Info</h1>
                <h4 className="text-muted-foreground">
                    Manage the stage info, matches and registrations.
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
