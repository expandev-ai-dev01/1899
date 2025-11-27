/**
 * @summary
 * Internal API routes configuration for authenticated endpoints.
 * Handles all authenticated user operations and protected resources.
 *
 * @module routes/v1/internalRoutes
 */

import { Router } from 'express';
import * as moonPhaseController from '@/api/v1/internal/moon-phase/controller';

const router = Router();

/**
 * @rule {be-moon-phase-routes}
 * Moon phase endpoints for 3D visualization feature
 */
router.get('/moon-phase', moonPhaseController.getHandler);
router.get('/moon-phase/range', moonPhaseController.getRangeHandler);
router.post('/moon-phase/rotation', moonPhaseController.postRotationHandler);
router.post('/moon-phase/date-arc', moonPhaseController.postDateArcHandler);

export default router;
