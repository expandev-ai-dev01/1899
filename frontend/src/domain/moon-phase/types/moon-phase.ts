/**
 * Moon phase data types
 */
export interface MoonPhaseData {
  date: string;
  phaseName: string;
  illumination: number;
  age: number;
  phaseValue: number;
  moonRise?: string;
  moonSet?: string;
  nextPhaseDate?: string;
  nextPhaseName?: string;
  phaseDuration?: string;
  distance?: number;
}

export interface MoonPhaseRotationRequest {
  baseDate: string;
  angleDegrees: number;
  speed: 'slow' | 'fast';
}

export interface MoonPhaseRotationResponse {
  date: string;
  moonPhase: MoonPhaseData;
}

export interface DateArcRequest {
  centerDate: string;
  intervalDays: 1 | 3 | 7 | 30;
  totalDates: number;
}

export interface DateArcResponse {
  dates: string[];
}
