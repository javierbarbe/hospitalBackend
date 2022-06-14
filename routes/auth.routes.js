
/*
    Ruta: api/login
*/
const { validarJWT } = require ('../middlewares/validar-jwt');
const { Router } = require('express');
const { login, loginGoogle, renewToken } = require('../controllers/auth.controller');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();


router.post('/',[
                    check('email','El email es obligatorio').isEmail(),
                    check('password', 'La password es requerida').notEmpty(),
                    validarCampos
                ],
                 login);
router.post('/google',[
                check('token', 'El token de google es obligatorio').notEmpty(),
                validarCampos
            ],
            loginGoogle);
            // validamos que ya haya token... no tiene sentido renovar algo que no tengo 
router.get('/renew',validarJWT, renewToken);

module.exports = router;