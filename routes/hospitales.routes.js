/*
    Ruta: api/hospitales
*/
const { Router } = require('express');
const {  check }  = require('express-validator');
const { getHospitales, crearHospital, deleteHospital, editaHospital } = require('../controllers/hospitales.controller');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.route('/')
            .get( 
                // validarJWT, 
                getHospitales);
            // aqui vamos a ejecutar funciones middleware (fiunciones intermedias)
            // para validar que se reciben todo lo requerido para la funcion de crear usuario
            // utilizamos la libreria express-validator (npm i express-validator)
      router.post('/',
            [
                validarJWT,
                check('nombre','El nombre del Hospital es necesario').notEmpty(),
                validarCampos
            ],
            crearHospital);

router.route('/:id')
                .put(
                            [  
                                validarJWT,
                                check('nombre','El nombre del Hospital es necesario').notEmpty(),
                                validarCampos
                            ],
                            editaHospital
                    )
                .delete( 
                    // validarJWT,
                     deleteHospital );


module.exports =  router 