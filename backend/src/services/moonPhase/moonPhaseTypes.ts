/**
 * @summary
 * Type definitions for moon phase service.
 * Defines interfaces and types for moon phase calculations and data structures.
 *
 * @module services/moonPhase/moonPhaseTypes
 */

/**
 * @interface MoonPhaseCalculation
 * @description Raw moon phase calculation results
 *
 * @property {number} phase - Phase value (0.0 to 1.0)
 * @property {number} illumination - Illumination percentage (0.0 to 1.0)
 * @property {string} phaseName - Name of the moon phase
 * @property {number} age - Age of moon in current cycle (days)
 * @property {number} distance - Approximate distance in km
 */
export interface MoonPhaseCalculation {
  phase: number;
  illumination: number;
  phaseName: string;
  age: number;
  distance: number;
}

/**
 * @interface MoonPhaseData
 * @description Complete moon phase data for a specific date
 *
 * @property {string} date - Date in YYYY-MM-DD format
 * @property {string} phaseName - Name of the moon phase
 * @property {number} illumination - Illumination percentage (0-100)
 * @property {number} age - Age of moon in current cycle (days)
 * @property {number} phaseValue - Phase value (0.0 to 1.0)
 * @property {string} [moonRise] - Moonrise time (HH:MM)
 * @property {string} [moonSet] - Moonset time (HH:MM)
 * @property {string} [nextPhaseDate] - Date of next phase change
 * @property {string} [nextPhaseName] - Name of next phase
 * @property {string} [phaseDuration] - Approximate duration of current phase
 * @property {number} [distance] - Distance from Earth in km
 * @property {string} [connectionStatus] - Status of data source (online/offline)
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
  connectionStatus?: 'online' | 'offline' | 'fallback';
}

/**
 * @interface RotationRequest
 * @description Request parameters for rotation-based date calculation
 *
 * @property {string} baseDate - Base date in YYYY-MM-DD format
 * @property {number} angleDegrees - Rotation angle in degrees (0-360)
 * @property {'slow' | 'fast'} speed - Rotation speed mode
 */
export interface RotationRequest {
  baseDate: string;
  angleDegrees: number;
  speed: 'slow' | 'fast';
}

/**
 * @interface DateArcRequest
 * @description Request parameters for date arc generation
 *
 * @property {string} centerDate - Center date in YYYY-MM-DD format
 * @property {number} intervalDays - Interval between dates (1, 3, 7, or 30)
 * @property {number} totalDates - Total number of dates to generate
 */
export interface DateArcRequest {
  centerDate: string;
  intervalDays: number;
  totalDates: number;
}

/**
 * @type RotationSpeed
 * @description Valid rotation speed values
 */
export type RotationSpeed = 'slow' | 'fast';

/**
 * @type MoonPhaseName
 * @description Valid moon phase names
 */
export type MoonPhaseName =
  | 'New Moon'
  | 'Waxing Crescent'
  | 'First Quarter'
  | 'Waxing Gibbous'
  | 'Full Moon'
  | 'Waning Gibbous'
  | 'Last Quarter'
  | 'Waning Crescent';
