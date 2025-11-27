import { useQuery } from '@tanstack/react-query';
import { moonPhaseService } from '../../services';
import type { UseMoonPhaseRangeOptions, UseMoonPhaseRangeReturn } from './types';

export const useMoonPhaseRange = ({
  startDate,
  endDate,
  enabled = true,
}: UseMoonPhaseRangeOptions): UseMoonPhaseRangeReturn => {
  const queryKey = ['moon-phase-range', startDate, endDate];

  const { data, isLoading, isError, error } = useQuery({
    queryKey,
    queryFn: () => moonPhaseService.getPhaseRange(startDate, endDate),
    enabled: enabled && !!startDate && !!endDate,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  return { data, isLoading, isError, error };
};
