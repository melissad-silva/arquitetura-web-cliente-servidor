const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');


router.get('/', usuarioController.buscarUsuario);
router.get('/:id', usuarioController.buscarUsuarios);
router.post('/', usuarioController.criarUsuario);
router.put('/:id', usuarioController.atualizarUsuario);
router.delete('/:id', usuarioController.deletarUsuario);

/*rotas no postman:
1. router.get('/'): http://localhost:3000/usuarios
2. router.get('/:id'): http://localhost:3000/usuarios/1
3. router.post('/'): http://localhost:3000/usuarios
4. router.put('/:id'): http://localhost:3000/usuarios/1
5. router.delete('/:id'): http://localhost:3000/usuarios/1
*/


module.exports = router;