"use client";
/// Needed for the integration with tm-tourney-manager.
/// Establishes a Global client-side spacetime connection that can be used by components.

import { StrictMode } from "react";
import { DbConnection, ErrorContext, STDB, STDBR } from "tm-tourney-manager-api-ts";

const onConnect = (conn: DbConnection, identity: STDB.Identity, token: string) => {
    console.log(
        "Connected to SpacetimeDB and initialized client-cache."
    );
};

const onDisconnect = () => {
    console.log('Disconnected from SpacetimeDB');
};

const onConnectError = (_ctx: ErrorContext, err: Error) => {
    console.log('Error connecting to SpacetimeDB:', err);
};

const connectionBuilder = DbConnection.builder()
    .withUri('http://localhost:5678')
    .withModuleName('tourney-manager')
    .onConnect(onConnect)
    .onDisconnect(onDisconnect)
    .onConnectError(onConnectError);


export const SpacetimeProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {

    return <StrictMode>
        <STDBR.SpacetimeDBProvider connectionBuilder={connectionBuilder}>
            {children}
        </STDBR.SpacetimeDBProvider>
    </StrictMode>;
}


