import express from 'express';
import { createReview, getAllReviews } from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', createReview);
// new GET /api/reviews
router.get('/', getAllReviews);
export default router;
