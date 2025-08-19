import express from 'express';
import { checkClash ,getUnavailableTimes,getUserBookings,cancelBooking } from '../controllers/bookingController.js';

const router = express.Router();

router.post('/check', checkClash);

router.post('/unavailable', getUnavailableTimes);

// backend/routes/bookingRoutes.js
router.get('/user/:uid', getUserBookings);

// … your existing GET and PUT …
router.delete('/:id', cancelBooking);



export default router;
