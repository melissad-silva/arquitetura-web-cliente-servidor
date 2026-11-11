const express = require('express');
const climaController = require('../controllers/climaController');
const { autenticar } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', autenticar, climaController.consultar);
router.get('/historico', autenticar, climaController.historico);

module.exports = router;
