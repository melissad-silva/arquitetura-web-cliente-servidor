const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { autenticar, autorizar } = require('../middlewares/authMiddleware');
const { uploadImagem } = require('../middlewares/uploadMiddleware');


/** 
* @openapi
* /usuarios/{id}:
*    get:
*        summary: Busca um usuário pelo ID
*        tags: [Usuários]
*        security: [{ bearerAuth: [] }]
*        parameters:
*           - in: path
*             name: id
*             required: true
*             schema: { type: integer }
*        responses:
*            200: { description: Usuário encontrado }
*            404: { description: Usuário não encontrado } 
*
*/


router.post('/', autenticar, autorizar('admin'), usuarioController.criarUsuario);
router.get('/', autenticar, autorizar('admin'), usuarioController.buscarUsuario);
router.get('/:id', autenticar, autorizar('admin'), usuarioController.buscarUsuarios);
router.put('/:id', autenticar, autorizar('admin'), usuarioController.atualizarUsuario);
router.delete('/:id', autenticar, autorizar('admin'),usuarioController.deletarUsuario);

router.put('/:id/foto', autenticar, uploadImagem('foto'), usuarioController.atualizarFotoUsuario);
router.delete('/:id/foto', autenticar, usuarioController.deletarFotoUsuario);

router.get('/:id', autenticar, usuarioController.buscarUsuarios);

module.exports = router;