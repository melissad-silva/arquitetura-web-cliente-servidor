const express = require('express');
const usuarioRoutes = require('./usuarioRoutes.js');
const authController = require('../controllers/authController');
const climaRoutes = require('./climaRoutes');

const router = express.Router();

router.post('/login', authController.login);
router.post('/auth/google', authController.loginGoogle);
router.use('/usuarios', usuarioRoutes); 
router.use('/clima', climaRoutes);

module.exports = router;