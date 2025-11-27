import type { MoonPhaseData } from '../../types';

export interface UseMoonPhaseRangeOptions {
  startDate: string;
  endDate: string;
  enabled?: boolean;
}

export interface UseMoonPhaseRangeReturn {
  data?: MoonPhaseData[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}
