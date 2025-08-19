import express from 'express';
import { createSession,  finalizeBooking} from '../controllers/paymentController.js';

const router = express.Router();
router.post('/create-session', createSession);
router.post('/finalize', finalizeBooking);
export default router;
