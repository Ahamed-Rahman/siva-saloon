import express from 'express';
import { stylistLogin, stylistSignup } from '../controllers/stylistAuthController.js';
import { getAllStylists, createStylist,deleteStylist } from '../controllers/stylistController.js';
import { getStylistBookings,markBookingCompleted } from '../controllers/stylistDashboardController.js';


const router = express.Router();

router.get('/', getAllStylists);
router.post('/', createStylist); // Admin use only
router.delete('/:id', deleteStylist);

router.post('/signup', stylistSignup);
router.post('/login', stylistLogin);

router.get('/bookings/:id', getStylistBookings);
router.put('/bookings/complete/:id', markBookingCompleted);

export default router;
