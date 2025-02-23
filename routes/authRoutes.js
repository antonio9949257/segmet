import express from 'express';
import { oauthCallback, oauthGoogle } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/callback', oauthCallback);
router.get('/google', oauthGoogle);

// Ejemplo de una ruta protegida
router.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: 'Esta es una ruta protegida', user: req.user });
});

export default router;
