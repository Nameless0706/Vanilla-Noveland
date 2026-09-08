import express from 'express'

const router = express.Router();

import userController from '../controllers/User.controller.js';
import verifyJWT from '../middlewares/VerifyJWT.middleware.js';
router.get('/all', verifyJWT, userController.getAllUsers); // /user/

export default router;