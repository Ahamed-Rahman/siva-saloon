import express from 'express';
import { checkClash ,getUnavailableTimes} from '../controllers/bookingController.js';

const router = express.Router();

router.post('/check', checkClash);

router.post('/unavailable', getUnavailableTimes);


export default router;
