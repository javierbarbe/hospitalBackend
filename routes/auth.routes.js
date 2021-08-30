
/*
    Ruta: api/login
*/

const { Router } = require('express');
const { login } = require('../controllers/auth.controller');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();


router.post('/',[
                    check('email','El email es obligatorio').isEmail(),
                    check('password', 'La password es requerida').notEmpty(),
                    validarCampos
                ],
                 login);


module.exports = router;