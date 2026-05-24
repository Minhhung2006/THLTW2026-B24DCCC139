import express from 'express';
import * as matchController from '../controllers/match.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = express.Router();

router.get('/:tournamentId', matchController.getMatchesByTournament);

// Admin routes
router.post('/', authMiddleware, roleMiddleware("ADMIN"), matchController.createMatch);
router.put('/:id/score', authMiddleware, roleMiddleware("ADMIN"), matchController.updateMatchScore);

export default router;
