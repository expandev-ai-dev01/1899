import type { MoonPhaseData } from '../../types';

export interface UseMoonPhaseOptions {
  date?: string;
  lat?: number;
  lng?: number;
}

export interface UseMoonPhaseReturn {
  data?: MoonPhaseData;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}
