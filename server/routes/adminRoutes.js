import express from 'express';
import { adminSignup, adminLogin , getAllBookings, getAdminRevenue} from '../controllers/adminController.js';

const router = express.Router();

router.post('/signup', adminSignup);
router.post('/login', adminLogin);
router.get('/bookings', getAllBookings);
router.get('/revenue', getAdminRevenue);
export default router;
