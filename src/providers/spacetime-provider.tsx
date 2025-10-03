/// Needed for the integration with tm-tourney-manager.
/// Establishes a Global client-side spacetime connection that can be used by components.

"use client";

import { StrictMode } from "react";
import { Identity } from "spacetimedb";
import { SpacetimeDBProvider } from "spacetimedb/react"
import { DbConnection, ErrorContext } from "tm-tourney-manager-api-ts";

const onConnect = (conn: DbConnection, identity: Identity, token: string) => {
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
    //.withToken(localStorage.getItem('auth_token') || undefined)
    .onConnect(onConnect)
    .onDisconnect(onDisconnect)
    .onConnectError(onConnectError);


export const SpacetimeProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {

    return <StrictMode>
        <SpacetimeDBProvider connectionBuilder={connectionBuilder}>
            {children}
        </SpacetimeDBProvider>
    </StrictMode>;
}


