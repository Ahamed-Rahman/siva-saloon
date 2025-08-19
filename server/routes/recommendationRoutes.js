// routes/userRoutes.js
import express from 'express';
import { getSmartTimeSlots } from '../controllers/recommendationController.js'; // ✅ or your actual controller file

const router = express.Router();

// GET smart time recommendations for a user
router.get('/users/:userId/smart-time-slots', getSmartTimeSlots);

export default router;
