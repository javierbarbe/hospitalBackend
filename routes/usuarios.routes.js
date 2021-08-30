/*
    Ruta: api/usuarios
*/
const { Router } = require('express');
const {  check }  = require('express-validator')

const { getUsuarios, crearUsuario, editaUsuario, deleteUsuario } = require('../controllers/usuarios.controller');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.route('/')
            .get( validarJWT, getUsuarios);
            // aqui vamos a ejecutar funciones middleware (fiunciones intermedias)
            // para validar que se reciben todo lo requerido para la funcion de crear usuario
            // utilizamos la libreria express-validator (npm i express-validator)
      router.post('/',
            [
               validarJWT,
               check('email','El formato del mail no es válido').isEmail(),
               check('nombre','El nombre es requerido').notEmpty(),
               check('password','La password es requerida').notEmpty(),
               validarCampos
            ],
            crearUsuario);

router.route('/:id')
                .put(
                            [
                                check('email','El formato del mail no es válido').isEmail(),
                                check('nombre','El nombre es requerido').notEmpty(),
                                validarCampos
                            ],
                            editaUsuario
                    )
                .delete( validarJWT, deleteUsuario );


module.exports =  router 