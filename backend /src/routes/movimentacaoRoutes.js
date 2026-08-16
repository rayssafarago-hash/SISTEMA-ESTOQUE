const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/movimentacaoController');
const autenticar = require('../middlewares/auth');
 
router.use(autenticar);
 
router.get('/dashboard', ctrl.dashboard); 
router.get('/', ctrl.listar);
router.post('/', ctrl.criar);
router.delete('/:id', ctrl.excluir);
 
module.exports = router;
