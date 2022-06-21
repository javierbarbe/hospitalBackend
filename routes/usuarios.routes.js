/*
    Ruta: api/usuarios
*/
const { Router } = require('express');
const {  check }  = require('express-validator')

const { getUsuarios, crearUsuario, editaUsuario, deleteUsuario } = require('../controllers/usuarios.controller');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, validarADMIN_ROLE,validarADMIN_ROLE_o_MismoUsuario } = require('../middlewares/validar-jwt');

const router = Router();

router.route('/')
            .get( [validarJWT, validarADMIN_ROLE], getUsuarios);
            // aqui vamos a ejecutar funciones middleware (fiunciones intermedias)
            // para validar que se reciben todo lo requerido para la funcion de crear usuario
            // utilizamos la libreria express-validator (npm i express-validator)
      router.post('/',
            [
               validarJWT,
               validarADMIN_ROLE,
               check('email','El formato del mail no es válido').isEmail(),
               check('nombre','El nombre es requerido').notEmpty(),
               check('password','La password es requerida').notEmpty(),
               validarCampos
            ],
            crearUsuario);

router.route('/:id')
                .put(
                            [
                                validarJWT,
                                validarADMIN_ROLE_o_MismoUsuario,
                                check('email','El formato del mail no es válido').isEmail(),
                                check('nombre','El nombre es requerido').notEmpty(),
                                validarCampos,
                            ],
                            editaUsuario
                    )
                .delete( [validarJWT,validarADMIN_ROLE], deleteUsuario );


module.exports =  router 