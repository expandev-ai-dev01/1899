import { useMutation } from '@tanstack/react-query';
import { moonPhaseService } from '../../services';
import type { UseMoonRotationReturn } from './types';

export const useMoonRotation = (): UseMoonRotationReturn => {
  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: moonPhaseService.calculateDateFromRotation,
  });

  return {
    calculateDate: mutateAsync,
    isLoading: isPending,
    isError,
    error,
  };
};
