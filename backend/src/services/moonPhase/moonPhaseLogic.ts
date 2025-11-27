/**
 * @summary
 * Moon phase calculation and data management logic.
 * Provides business logic for calculating lunar phases, illumination percentages,
 * and date-based moon phase information using astronomical algorithms via SunCalc.
 *
 * @module services/moonPhase/moonPhaseLogic
 */

import SunCalc from 'suncalc';
import { MoonPhaseData, MoonPhaseCalculation, MoonPhaseName } from './moonPhaseTypes';

/**
 * @summary
 * Calculates the moon phase for a given date using SunCalc library.
 *
 * @function calculateMoonPhase
 * @module services/moonPhase/moonPhaseLogic
 *
 * @param {Date} date - Date to calculate moon phase for
 *
 * @returns {MoonPhaseCalculation} Moon phase calculation results
 */
export function calculateMoonPhase(date: Date): MoonPhaseCalculation {
  /**
   * @rule {fn-moon-phase-calculation}
   * Use SunCalc to get precise moon illumination data:
   * - fraction: illuminated fraction of the moon; varies from 0.0 (new moon) to 1.0 (full moon)
   * - phase: moon phase; varies from 0.0 to 1.0
   * - angle: midpoint angle in radians of the illuminated limb of the moon
   */
  const moonData = SunCalc.getMoonIllumination(date);
  const phase = moonData.phase;
  const illumination = moonData.fraction;

  /**
   * @rule {fn-phase-name-determination}
   * Determine phase name based on position in lunar cycle (0.0 to 1.0):
   * - New Moon: 0.0 - 0.033 (0-3.3%) or > 0.967
   * - Waxing Crescent: 0.033 - 0.216
   * - First Quarter: 0.216 - 0.283
   * - Waxing Gibbous: 0.283 - 0.466
   * - Full Moon: 0.466 - 0.533
   * - Waning Gibbous: 0.533 - 0.716
   * - Last Quarter: 0.716 - 0.783
   * - Waning Crescent: 0.783 - 0.967
   */
  let phaseName: string;
  if (phase < 0.033 || phase > 0.967) {
    phaseName = 'New Moon';
  } else if (phase < 0.216) {
    phaseName = 'Waxing Crescent';
  } else if (phase < 0.283) {
    phaseName = 'First Quarter';
  } else if (phase < 0.466) {
    phaseName = 'Waxing Gibbous';
  } else if (phase < 0.533) {
    phaseName = 'Full Moon';
  } else if (phase < 0.716) {
    phaseName = 'Waning Gibbous';
  } else if (phase < 0.783) {
    phaseName = 'Last Quarter';
  } else {
    phaseName = 'Waning Crescent';
  }

  /**
   * @rule {fn-age-calculation}
   * Calculate approximate moon age in days (0 to ~29.53)
   */
  const lunarCycle = 29.53058867;
  const age = phase * lunarCycle;

  /**
   * @rule {fn-distance-calculation}
   * Approximate distance calculation based on anomalistic month (27.55 days)
   * Perigee: ~362,600 km, Apogee: ~405,400 km
   * Note: SunCalc does not provide distance directly, using approximation formula.
   */
  const knownNewMoon = new Date('2000-01-06T18:14:00Z');
  const timeDiff = date.getTime() - knownNewMoon.getTime();
  const daysSinceNewMoon = timeDiff / (1000 * 60 * 60 * 24);
  const anomalisticMonth = 27.55455;
  const ageAnomalistic =
    ((daysSinceNewMoon % anomalisticMonth) + anomalisticMonth) % anomalisticMonth;
  const distance = 384400 - 21400 * Math.cos((2 * Math.PI * ageAnomalistic) / anomalisticMonth);

  return {
    phase,
    illumination,
    phaseName,
    age,
    distance: Math.round(distance),
  };
}

/**
 * @summary
 * Calculates moonrise and moonset times for a specific location.
 *
 * @param {Date} date - Date for calculation
 * @param {object} [location] - Latitude and longitude
 * @returns {{ rise: string, set: string }} Formatted times (HH:MM) or placeholder
 */
function calculateMoonTimes(
  date: Date,
  location?: { lat: number; lng: number }
): { rise: string; set: string } {
  if (!location) {
    return { rise: '--:--', set: '--:--' };
  }

  const times = SunCalc.getMoonTimes(date, location.lat, location.lng);

  const formatTime = (d?: Date) => {
    if (!d || isNaN(d.getTime())) return '--:--';
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return {
    rise: formatTime(times.rise),
    set: formatTime(times.set),
  };
}

/**
 * @summary
 * Determines the next major moon phase and its date.
 *
 * @param {number} currentAge - Current age of moon in days
 * @param {Date} currentDate - Current date
 * @returns {{ date: string, name: string, duration: string }} Next phase info
 */
function getNextPhaseInfo(
  currentAge: number,
  currentDate: Date
): { date: string; name: string; duration: string } {
  const lunarCycle = 29.53058867;
  const majorPhases = [
    { name: 'First Quarter', age: lunarCycle * 0.25 },
    { name: 'Full Moon', age: lunarCycle * 0.5 },
    { name: 'Last Quarter', age: lunarCycle * 0.75 },
    { name: 'New Moon', age: lunarCycle }, // Cycle restart
  ];

  // Find next phase
  let nextPhase = majorPhases.find((p) => p.age > currentAge);
  if (!nextPhase) nextPhase = majorPhases[0]; // Wrap around

  let daysToNext = nextPhase.age - currentAge;
  if (daysToNext < 0) daysToNext += lunarCycle;

  const nextDate = new Date(currentDate);
  nextDate.setDate(nextDate.getDate() + Math.ceil(daysToNext));

  return {
    date: nextDate.toISOString().split('T')[0],
    name: nextPhase.name,
    duration: `${Math.floor(daysToNext)} days ${Math.round((daysToNext % 1) * 24)} hours`,
  };
}

/**
 * @summary
 * Gets moon phase data for a specific date with all relevant information.
 *
 * @function getMoonPhaseData
 * @module services/moonPhase/moonPhaseLogic
 *
 * @param {Date} date - Date to get moon phase data for
 * @param {object} [location] - Optional location for time calculations
 *
 * @returns {MoonPhaseData} Complete moon phase data
 *
 * @throws {Error} When date is outside allowed range (±50 years)
 */
export function getMoonPhaseData(
  date: Date,
  location?: { lat: number; lng: number }
): MoonPhaseData {
  /**
   * @validation Validate date is within allowed range (±50 years)
   * @throw {dateOutOfRange}
   */
  const now = new Date();
  const fiftyYearsAgo = new Date(now.getFullYear() - 50, now.getMonth(), now.getDate());
  const fiftyYearsAhead = new Date(now.getFullYear() + 50, now.getMonth(), now.getDate());

  if (date < fiftyYearsAgo || date > fiftyYearsAhead) {
    throw new Error('dateOutOfRange');
  }

  const calculation = calculateMoonPhase(date);
  const times = calculateMoonTimes(date, location);
  const nextPhase = getNextPhaseInfo(calculation.age, date);

  return {
    date: date.toISOString().split('T')[0],
    phaseName: calculation.phaseName,
    illumination: Math.round(calculation.illumination * 10000) / 100, // 2 decimal places
    age: Math.round(calculation.age * 10) / 10,
    phaseValue: Math.round(calculation.phase * 1000) / 1000,
    moonRise: times.rise,
    moonSet: times.set,
    nextPhaseDate: nextPhase.date,
    nextPhaseName: nextPhase.name,
    phaseDuration: nextPhase.duration,
    distance: calculation.distance,
    connectionStatus: 'online', // Using SunCalc library
  };
}

/**
 * @summary
 * Calculates moon phase data for a date range.
 * Useful for generating calendar views and date arcs.
 *
 * @function getMoonPhaseRange
 * @module services/moonPhase/moonPhaseLogic
 *
 * @param {Date} startDate - Start date of range
 * @param {Date} endDate - End date of range
 *
 * @returns {MoonPhaseData[]} Array of moon phase data for each day in range
 *
 * @throws {Error} When date range is invalid or exceeds limits
 */
export function getMoonPhaseRange(startDate: Date, endDate: Date): MoonPhaseData[] {
  /**
   * @validation Validate date range
   * @throw {invalidDateRange}
   */
  if (startDate > endDate) {
    throw new Error('invalidDateRange');
  }

  /**
   * @validation Limit range to maximum 365 days
   * @throw {dateRangeTooLarge}
   */
  const daysDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  if (daysDiff > 365) {
    throw new Error('dateRangeTooLarge');
  }

  const result: MoonPhaseData[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    // Note: Range calculation typically doesn't include location-specific times
    // to optimize performance for calendar views
    result.push(getMoonPhaseData(new Date(currentDate)));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
}

/**
 * @summary
 * Calculates the date offset based on rotation angle and speed.
 * Used for interactive moon rotation navigation.
 *
 * @function calculateDateFromRotation
 * @module services/moonPhase/moonPhaseLogic
 *
 * @param {Date} baseDate - Base date to calculate from
 * @param {number} angleDegrees - Rotation angle in degrees (0-360)
 * @param {'slow' | 'fast'} speed - Rotation speed mode
 *
 * @returns {Date} Calculated date based on rotation
 */
export function calculateDateFromRotation(
  baseDate: Date,
  angleDegrees: number,
  speed: 'slow' | 'fast'
): Date {
  /**
   * @rule {fn-rotation-to-date-mapping}
   * Map rotation angle to date offset:
   * - Slow mode: 30° = 1 day (360° = 12 days)
   * - Fast mode: 30° = 7 days (360° = 84 days)
   */
  const degreesPerUnit = 30;
  const daysPerUnit = speed === 'slow' ? 1 : 7;

  const units = angleDegrees / degreesPerUnit;
  const dayOffset = units * daysPerUnit;

  const resultDate = new Date(baseDate);
  resultDate.setDate(resultDate.getDate() + Math.round(dayOffset));

  return resultDate;
}

/**
 * @summary
 * Generates date arc data for visualization around the moon.
 * Returns dates at specified intervals for display.
 *
 * @function generateDateArc
 * @module services/moonPhase/moonPhaseLogic
 *
 * @param {Date} centerDate - Center date for the arc
 * @param {number} intervalDays - Interval between dates (1, 3, 7, or 30)
 * @param {number} totalDates - Total number of dates to generate
 *
 * @returns {string[]} Array of formatted dates (DD/MM)
 */
export function generateDateArc(
  centerDate: Date,
  intervalDays: number = 7,
  totalDates: number = 12
): string[] {
  /**
   * @validation Validate interval days
   * @throw {invalidInterval}
   */
  const validIntervals = [1, 3, 7, 30];
  if (!validIntervals.includes(intervalDays)) {
    throw new Error('invalidInterval');
  }

  const result: string[] = [];
  const halfDates = Math.floor(totalDates / 2);

  for (let i = -halfDates; i <= halfDates; i++) {
    const date = new Date(centerDate);
    date.setDate(date.getDate() + i * intervalDays);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    result.push(`${day}/${month}`);
  }

  return result;
}
