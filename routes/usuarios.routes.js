const { Router } = require ('express');
const { getUsuarios } = require('../controllers/usuarios.controller');
/*
Ruta: api/usuarios

*/

const router = Router();
const rutasUsuarios = require('../routes/usuarios.routes')
router.get('/', getUsuarios)

// .post()
module.exports =  router 