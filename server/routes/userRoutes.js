import express from 'express';
import { signup, login, createFirebaseUser} from '../controllers/userController.js';


const router = express.Router();
router.post('/firebase', createFirebaseUser);
router.post('/signup', signup);
router.post('/login', login);

export default router;
