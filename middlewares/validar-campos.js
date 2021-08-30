const { response } = require("express");
const { validationResult } = require('express-validator');

/* 
    Esto es una funcion intermedia personalizada, 
    cuando la llamemos para validar en las rutas, solamente se nombra, no se ejecuta 
    o sea se escribe validarCampos, en lugar de validarCampos()
*/

const validarCampos = (req,res=response ,next) =>{

    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        res.status(400).json({
                ok: false,
                statusCode: 400,
                message: 'Hay errores de validación',
                errores: errores.mapped()//errores.array()
            });
        return;
    }
   
    next();
}

module.exports = {
    validarCampos
}



