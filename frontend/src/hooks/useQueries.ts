import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Paper, Review, UserProfile } from '../backend';
import { ExternalBlob } from '../backend';

export function useGetCallerUserProfile() {
  const { actor } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor,
    retry: false,
  });

  return {
    ...query,
    isLoading: query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetAllPapers() {
  const { actor } = useActor();

  return useQuery<Paper[]>({
    queryKey: ['papers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPapers();
    },
    enabled: !!actor,
  });
}

export function useGetPaper(paperId: string | null) {
  const { actor } = useActor();

  return useQuery<Paper | null>({
    queryKey: ['paper', paperId],
    queryFn: async () => {
      if (!actor || !paperId) return null;
      return actor.getPaper(paperId);
    },
    enabled: !!actor && !!paperId,
  });
}

export function useSubmitPaper() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      abstract,
      fileReference,
      externalLink,
      citations,
    }: {
      id: string;
      title: string;
      abstract: string;
      fileReference: ExternalBlob | null;
      externalLink: string | null;
      citations: string[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitPaper(id, title, abstract, fileReference, externalLink, citations);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['papers'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetReviewsForPaper(paperId: string | null) {
  const { actor } = useActor();

  return useQuery<Review[]>({
    queryKey: ['reviews', paperId],
    queryFn: async () => {
      if (!actor || !paperId) return [];
      return actor.getReviewsForPaper(paperId);
    },
    enabled: !!actor && !!paperId,
  });
}

export function useSubmitReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      paperId,
      rating,
      feedback,
    }: {
      id: string;
      paperId: string;
      rating: bigint;
      feedback: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitReview(id, paperId, rating, feedback);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.paperId] });
      queryClient.invalidateQueries({ queryKey: ['paper', variables.paperId] });
      queryClient.invalidateQueries({ queryKey: ['papers'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetUserTokenBalance() {
  const { actor } = useActor();

  return useQuery<bigint>({
    queryKey: ['tokenBalance'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getUserTokenBalance();
    },
    enabled: !!actor,
  });
}
