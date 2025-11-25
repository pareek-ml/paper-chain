// frontend/src/hooks/useActor.ts
import { useInternetIdentity } from "./useInternetIdentity";

export type UseActorResult = {
  actor: any | null;
  isAuthenticated: boolean;
  isReady: boolean;
  error: Error | null;
};

/**
 * Small helper hook that exposes the backend actor
 * created in useInternetIdentity, plus some status flags.
 */
export function useActor(): UseActorResult {
  const { backendActor, isAuthenticated } = useInternetIdentity() as any;

  const isReady = Boolean(backendActor && isAuthenticated);

  return {
    actor: backendActor ?? null,
    isAuthenticated,
    isReady,
    error: null,
  };
}

export default useActor;