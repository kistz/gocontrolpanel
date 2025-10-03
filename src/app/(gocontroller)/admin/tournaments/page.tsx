import { hasPermission } from "@/lib/auth";
import { routePermissions, routes } from "@/routes";
import { redirect } from "next/navigation";
import { useTable } from "spacetimedb/react";
import { DbConnection, Tournament } from "tm-tourney-manager-api-ts";

export default async function AdminTounrmantsPage() {
    const canView = await hasPermission(routePermissions.admin.users.view);
    if (!canView) {
        redirect(routes.dashboard);
    }

    const tournaments = useTable<DbConnection, Tournament>("tournament");
    console.log(tournaments)

    return (
        <div className="flex flex-col gap-6">
            <div className="flex gap-2 justify-between items-end">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold">Manage Tournaments</h1>
                    <h4 className="text-muted-foreground">
                        Here you can create and manage tournaments.
                    </h4>
                </div>
            </div>


        </div>
    );
}