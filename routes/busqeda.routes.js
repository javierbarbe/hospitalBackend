/*
    Ruta: api/todo/
*/
const { Router } = require('express');
const {  check }  = require('express-validator');
const { getTodo, getDocumentosColeccion } = require('../controllers/busqueda.controller');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.route('/:palabrasBusqueda').get(  validarJWT, getTodo);
router.route('/coleccion/:tabla/:palabrasBusqueda').get( validarJWT, getDocumentosColeccion);

    



module.exports =  router 