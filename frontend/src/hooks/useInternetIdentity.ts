// frontend/src/hooks/useInternetIdentity.ts
import React, { useState, useEffect, useCallback } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
import {
  idlFactory as backend_idl,
  canisterId as backend_canister_id,
} from "../../../declarations/backend";

export const useInternetIdentity = () => {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState<string | null>(null);
  const [backendActor, setBackendActor] = useState<any>(null);

  useEffect(() => {
    AuthClient.create().then(async (client) => {
      setAuthClient(client);
      const authenticated = await client.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        const identity = client.getIdentity();
        const principalId = identity.getPrincipal().toText();
        setPrincipal(principalId);

        const agent = new HttpAgent({ identity });
        const actor = Actor.createActor(backend_idl as any, {
          agent,
          canisterId: backend_canister_id as any,
        });

        setBackendActor(actor);
      }
    });
  }, []);

  const login = useCallback(async () => {
    if (!authClient) return;
    await authClient.login({
      identityProvider: "https://identity.ic0.app/#authorize",
      onSuccess: async () => {
        const identity = authClient.getIdentity();
        const principalId = identity.getPrincipal().toText();
        setPrincipal(principalId);
        setIsAuthenticated(true);

        const agent = new HttpAgent({ identity });
        const actor = Actor.createActor(backend_idl as any, {
          agent,
          canisterId: backend_canister_id as any,
        });
        setBackendActor(actor);
      },
      onError: console.error,
    });
  }, [authClient]);

  const logout = useCallback(async () => {
    if (authClient) {
      await authClient.logout();
      setIsAuthenticated(false);
      setPrincipal(null);
      setBackendActor(null);
    }
  }, [authClient]);

  return {
    isAuthenticated,
    principal,
    backendActor,
    login,
    logout,
  };
};

// NEW: provider expected by main.tsx
export const InternetIdentityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useInternetIdentity();
  // Avoid JSX in .ts file
  return React.createElement(React.Fragment, null, children);
};