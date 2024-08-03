import express from 'express';
import { createInfo, updateInfo, getInfoById, getAllInfo, deleteInfo } from '../controllers/infoController.js';
import { isAdminAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

// Route lấy tất cả thông tin
router.get('/getall', getAllInfo);

// Route tạo thông tin mới
router.post('/create', isAdminAuthenticated, createInfo);

// Route cập nhật thông tin
router.put('/update/:id', isAdminAuthenticated, updateInfo);

// Route lấy thông tin theo ID
router.get('/:id', getInfoById);

// Route để xóa thông tin dựa trên ID
router.delete('/delete/:id', isAdminAuthenticated, deleteInfo);

export default router;
