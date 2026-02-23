import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Show, Schedule, UserProfile, ShowId, ScheduleId } from '../backend';
import { ExternalBlob } from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
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

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// Show Queries
export function useGetAllShows() {
  const { actor, isFetching } = useActor();

  return useQuery<Show[]>({
    queryKey: ['shows'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllShows();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddShow() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title, description, image }: { id: ShowId; title: string; description: string; image: ExternalBlob }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addShow(id, title, description, image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shows'] });
    },
  });
}

export function useEditShow() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title, description, image }: { id: ShowId; title: string; description: string; image: ExternalBlob }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editShow(id, title, description, image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shows'] });
    },
  });
}

export function useDeleteShow() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: ShowId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteShow(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shows'] });
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
  });
}

// Schedule Queries
export function useGetAllSchedules() {
  const { actor, isFetching } = useActor();

  return useQuery<Schedule[]>({
    queryKey: ['schedules'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSchedules();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddSchedule() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ showId, startTime, endTime, dayOfWeek }: { showId: ShowId; startTime: bigint; endTime: bigint; dayOfWeek: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addSchedule(showId, startTime, endTime, dayOfWeek);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
  });
}

export function useEditSchedule() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, showId, startTime, endTime, dayOfWeek }: { id: ScheduleId; showId: ShowId; startTime: bigint; endTime: bigint; dayOfWeek: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editSchedule(id, showId, startTime, endTime, dayOfWeek);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
  });
}

export function useDeleteSchedule() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: ScheduleId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteSchedule(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
  });
}
