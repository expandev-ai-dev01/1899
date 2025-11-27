import { useMutation } from '@tanstack/react-query';
import { moonPhaseService } from '../../services';
import type { UseDateArcReturn } from './types';

export const useDateArc = (): UseDateArcReturn => {
  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: moonPhaseService.generateDateArc,
  });

  return {
    generateArc: mutateAsync,
    isLoading: isPending,
    isError,
    error,
  };
};
