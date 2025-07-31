import express from 'express';
import { getAllServices, createService, deleteService, getServiceById } from '../controllers/serviceController.js';

const router = express.Router();

router.get('/', getAllServices);
router.post('/', createService); // Admin use only
router.delete('/:id', deleteService); // DELETE /api/services/:id
router.get('/:id', getServiceById);

export default router;
