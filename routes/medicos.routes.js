/*
    Ruta: api/medicos
*/
const { Router } = require('express');
const {  check }  = require('express-validator');
const { getMedicos, crearMedico, editaMedico, deleteMedico, getMedicoById } = require('../controllers/medicos.controller');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

   router.get('/:id', [ validarJWT ] , getMedicoById)

    router.route('/')
            .get( 
                validarJWT, 
                getMedicos);
            // aqui vamos a ejecutar funciones middleware (fiunciones intermedias)
            // para validar que se reciben todo lo requerido para la funcion de crear usuario
            // utilizamos la libreria express-validator (npm i express-validator)
      router.post('/',
            [
                validarJWT,
                check('nombre','El nombre del medico es necesario').notEmpty(),
                check('hospital','El hospital id debe de ser valido').isMongoId(),
                validarCampos
            ],
            crearMedico);

    router.route('/:id')
              
                .put(
                       validarJWT,
                       editaMedico
                    )
                .delete( 
                    validarJWT,
                     deleteMedico );


module.exports =  router 