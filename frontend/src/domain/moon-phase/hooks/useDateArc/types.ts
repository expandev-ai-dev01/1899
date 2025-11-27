import type { DateArcRequest, DateArcResponse } from '../../types';

export interface UseDateArcReturn {
  generateArc: (request: DateArcRequest) => Promise<DateArcResponse>;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}
