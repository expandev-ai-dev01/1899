/**
 * @summary
 * Moon phase API controller.
 * Handles HTTP requests for moon phase data retrieval and calculations.
 *
 * @module api/v1/internal/moon-phase/controller
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  getMoonPhaseData,
  getMoonPhaseRange,
  calculateDateFromRotation,
  generateDateArc,
} from '@/services/moonPhase';
import { successResponse, errorResponse } from '@/utils/response';

/**
 * @api {get} /api/v1/internal/moon-phase Get Moon Phase for Date
 * @apiName GetMoonPhase
 * @apiGroup MoonPhase
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves moon phase data for a specific date
 *
 * @apiParam {String} date Date in YYYY-MM-DD format (query parameter)
 *
 * @apiSuccess {String} date Date in YYYY-MM-DD format
 * @apiSuccess {String} phaseName Name of the moon phase
 * @apiSuccess {Number} illumination Illumination percentage (0-100)
 * @apiSuccess {Number} age Age of moon in current cycle (days)
 * @apiSuccess {Number} phaseValue Phase value (0.0 to 1.0)
 *
 * @apiError {String} ValidationError Invalid date format or out of range
 * @apiError {String} ServerError Internal server error
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const querySchema = z.object({
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
  });

  try {
    const validated = querySchema.parse(req.query);
    const targetDate = validated.date ? new Date(validated.date) : new Date();

    /**
     * @validation Validate date is valid
     * @throw {invalidDate}
     */
    if (isNaN(targetDate.getTime())) {
      res.status(400).json(errorResponse('invalidDate', 'VALIDATION_ERROR'));
      return;
    }

    const data = getMoonPhaseData(targetDate);
    res.json(successResponse(data));
  } catch (error: any) {
    if (error.message === 'dateOutOfRange') {
      res.status(400).json(errorResponse('dateOutOfRange', 'VALIDATION_ERROR'));
    } else {
      next(error);
    }
  }
}

/**
 * @api {get} /api/v1/internal/moon-phase/range Get Moon Phase Range
 * @apiName GetMoonPhaseRange
 * @apiGroup MoonPhase
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves moon phase data for a date range
 *
 * @apiParam {String} startDate Start date in YYYY-MM-DD format (query parameter)
 * @apiParam {String} endDate End date in YYYY-MM-DD format (query parameter)
 *
 * @apiSuccess {Array} data Array of moon phase data objects
 *
 * @apiError {String} ValidationError Invalid date format or range
 * @apiError {String} ServerError Internal server error
 */
export async function getRangeHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const querySchema = z.object({
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  });

  try {
    const validated = querySchema.parse(req.query);
    const startDate = new Date(validated.startDate);
    const endDate = new Date(validated.endDate);

    /**
     * @validation Validate dates are valid
     * @throw {invalidDate}
     */
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      res.status(400).json(errorResponse('invalidDate', 'VALIDATION_ERROR'));
      return;
    }

    const data = getMoonPhaseRange(startDate, endDate);
    res.json(successResponse(data));
  } catch (error: any) {
    if (error.message === 'invalidDateRange') {
      res.status(400).json(errorResponse('invalidDateRange', 'VALIDATION_ERROR'));
    } else if (error.message === 'dateRangeTooLarge') {
      res.status(400).json(errorResponse('dateRangeTooLarge', 'VALIDATION_ERROR'));
    } else if (error.message === 'dateOutOfRange') {
      res.status(400).json(errorResponse('dateOutOfRange', 'VALIDATION_ERROR'));
    } else {
      next(error);
    }
  }
}

/**
 * @api {post} /api/v1/internal/moon-phase/rotation Calculate Date from Rotation
 * @apiName CalculateDateFromRotation
 * @apiGroup MoonPhase
 * @apiVersion 1.0.0
 *
 * @apiDescription Calculates the date based on rotation angle and speed
 *
 * @apiParam {String} baseDate Base date in YYYY-MM-DD format
 * @apiParam {Number} angleDegrees Rotation angle in degrees (0-360)
 * @apiParam {String} speed Rotation speed ('slow' or 'fast')
 *
 * @apiSuccess {String} date Calculated date in YYYY-MM-DD format
 * @apiSuccess {Object} moonPhase Moon phase data for calculated date
 *
 * @apiError {String} ValidationError Invalid parameters
 * @apiError {String} ServerError Internal server error
 */
export async function postRotationHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const bodySchema = z.object({
    baseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    angleDegrees: z.number().min(0).max(360),
    speed: z.enum(['slow', 'fast']),
  });

  try {
    const validated = bodySchema.parse(req.body);
    const baseDate = new Date(validated.baseDate);

    /**
     * @validation Validate base date is valid
     * @throw {invalidDate}
     */
    if (isNaN(baseDate.getTime())) {
      res.status(400).json(errorResponse('invalidDate', 'VALIDATION_ERROR'));
      return;
    }

    const calculatedDate = calculateDateFromRotation(
      baseDate,
      validated.angleDegrees,
      validated.speed
    );

    const moonPhase = getMoonPhaseData(calculatedDate);

    res.json(
      successResponse({
        date: calculatedDate.toISOString().split('T')[0],
        moonPhase,
      })
    );
  } catch (error: any) {
    if (error.message === 'dateOutOfRange') {
      res.status(400).json(errorResponse('dateOutOfRange', 'VALIDATION_ERROR'));
    } else {
      next(error);
    }
  }
}

/**
 * @api {post} /api/v1/internal/moon-phase/date-arc Generate Date Arc
 * @apiName GenerateDateArc
 * @apiGroup MoonPhase
 * @apiVersion 1.0.0
 *
 * @apiDescription Generates date arc data for visualization
 *
 * @apiParam {String} centerDate Center date in YYYY-MM-DD format
 * @apiParam {Number} intervalDays Interval between dates (1, 3, 7, or 30)
 * @apiParam {Number} totalDates Total number of dates to generate
 *
 * @apiSuccess {Array} dates Array of formatted dates (DD/MM)
 *
 * @apiError {String} ValidationError Invalid parameters
 * @apiError {String} ServerError Internal server error
 */
export async function postDateArcHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const bodySchema = z.object({
    centerDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    intervalDays: z
      .number()
      .int()
      .refine((val) => [1, 3, 7, 30].includes(val)),
    totalDates: z.number().int().min(1).max(50),
  });

  try {
    const validated = bodySchema.parse(req.body);
    const centerDate = new Date(validated.centerDate);

    /**
     * @validation Validate center date is valid
     * @throw {invalidDate}
     */
    if (isNaN(centerDate.getTime())) {
      res.status(400).json(errorResponse('invalidDate', 'VALIDATION_ERROR'));
      return;
    }

    const dates = generateDateArc(centerDate, validated.intervalDays, validated.totalDates);

    res.json(successResponse({ dates }));
  } catch (error: any) {
    if (error.message === 'invalidInterval') {
      res.status(400).json(errorResponse('invalidInterval', 'VALIDATION_ERROR'));
    } else if (error.message === 'dateOutOfRange') {
      res.status(400).json(errorResponse('dateOutOfRange', 'VALIDATION_ERROR'));
    } else {
      next(error);
    }
  }
}
