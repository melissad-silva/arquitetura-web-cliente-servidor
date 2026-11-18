const express = require('express');
const usuarioRoutes = require('./usuarioRoutes.js');
const authController = require('../controllers/authController');
const climaRoutes = require('./climaRoutes');

const router = express.Router();

/**
 * @openapi
 * /login:
 *   post:
 *      summary: Autentica um usuário e retorna um token JWT
 *      tags: [Autenticação]
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              format: email
 *                          senha:
 *                              type: string
 *                              format: password
 *                             
 *      responses:
 *          200: { description: Token JWT retornado com sucesso }
 *          401: { description: Credenciais inválidas }
 * 
 */
router.post('/login', authController.login);
router.post('/auth/google', authController.loginGoogle);
router.use('/usuarios', usuarioRoutes); 
router.use('/clima', climaRoutes);

module.exports = router;