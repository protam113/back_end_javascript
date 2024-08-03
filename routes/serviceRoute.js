import express from 'express';
import {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService
} from '../controllers/serviceController.js';
import { isAdminAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', isAdminAuthenticated, createService);
router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.put('/update/:id', isAdminAuthenticated, updateService);
router.delete('/delete/:id', isAdminAuthenticated, deleteService);

export default router;
