import type { MoonPhaseRotationRequest, MoonPhaseRotationResponse } from '../../types';

export interface UseMoonRotationReturn {
  calculateDate: (request: MoonPhaseRotationRequest) => Promise<MoonPhaseRotationResponse>;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}
