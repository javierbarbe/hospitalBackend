/*
    Ruta: api/upload/
*/
const { Router } = require('express');
const {  check }  = require('express-validator');
const { upload, verImagenUploaded } = require('../controllers/uploads.controller');
const fileUpload = require("express-fileupload");

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();
//EXPLICACION router me sirve igual que app a la hora de hacer un .use() y pasar algo como middleware de mi app
router.use(fileUpload());
router.route('/:tipo/:id').put(  validarJWT, upload)
                         .get(  verImagenUploaded);

    



module.exports =  router ;