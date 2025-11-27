/**
 * @summary
 * Moon phase service exports.
 * Provides centralized access to moon phase calculation and data management.
 *
 * @module services/moonPhase
 */

export {
  calculateMoonPhase,
  getMoonPhaseData,
  getMoonPhaseRange,
  calculateDateFromRotation,
  generateDateArc,
} from './moonPhaseLogic';

export type {
  MoonPhaseCalculation,
  MoonPhaseData,
  RotationRequest,
  DateArcRequest,
  RotationSpeed,
  MoonPhaseName,
} from './moonPhaseTypes';
