import express from 'express';
import { createUser, getUser, updateUser, deleteUser } from '../controllers/user.controller.js';
import validation from '../middlewares/validationMiddleware.js';
import { register as registerSchema, login as loginSchema } from '../validations/auth.validation.js';
const router = express.Router();

router.post('/', validation(registerSchema), createUser); // Tạo người dùng mới
router.get('/:userId', getUser); // Lấy thông tin người dùng theo ID
router.put('/:userId', updateUser); // Cập nhật thông tin người dùng theo ID
router.delete('/:userId', deleteUser); // Xóa người dùng theo ID
router.put('/:userId', deleteUser); // Xóa người dùng theo ID
router.post('/login', validation(loginSchema), login);// Đăng nhập  

export default router;
