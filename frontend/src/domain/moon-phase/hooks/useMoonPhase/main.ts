import { useQuery } from '@tanstack/react-query';
import { moonPhaseService } from '../../services';
import type { UseMoonPhaseOptions, UseMoonPhaseReturn } from './types';

export const useMoonPhase = (options: UseMoonPhaseOptions = {}): UseMoonPhaseReturn => {
  const queryKey = ['moon-phase', options.date];

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey,
    queryFn: () => moonPhaseService.getPhaseData(options.date),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
  };
};
