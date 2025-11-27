/**
 * @service Moon Phase Service
 * @domain moon-phase
 * @type REST
 *
 * Service for fetching moon phase data from backend API
 */
import { authenticatedClient } from '@/core/lib/api';
import type {
  MoonPhaseData,
  MoonPhaseRotationRequest,
  MoonPhaseRotationResponse,
  DateArcRequest,
  DateArcResponse,
} from '../types';

export const moonPhaseService = {
  /**
   * Get moon phase data for a specific date
   */
  async getPhaseData(date?: string, lat?: number, lng?: number): Promise<MoonPhaseData> {
    const params: Record<string, any> = {};
    if (date) params.date = date;
    if (lat !== undefined) params.lat = lat;
    if (lng !== undefined) params.lng = lng;

    const { data } = await authenticatedClient.get('/moon-phase', { params });
    return data.data;
  },

  /**
   * Calculate date from rotation angle and speed
   */
  async calculateDateFromRotation(
    request: MoonPhaseRotationRequest
  ): Promise<MoonPhaseRotationResponse> {
    const { data } = await authenticatedClient.post('/moon-phase/rotation', request);
    return data.data;
  },

  /**
   * Generate date arc for visualization
   */
  async generateDateArc(request: DateArcRequest): Promise<DateArcResponse> {
    const { data } = await authenticatedClient.post('/moon-phase/date-arc', request);
    return data.data;
  },
};
