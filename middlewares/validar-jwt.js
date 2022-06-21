const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require('../models/usuario')

const validarJWT = (req = request, res = response, next) => {
  try {
    const token = req.header("x-token");
    if (!token) {
      return res.status(401).json({
        ok: false,
        msg: "No hay token en la petición",
      });
    }
    const { uid, ...resto } = jwt.verify(token, process.env.JWT_SECURE);
    console.log('el resto',resto, 'la uid del usuario que esta logueado', uid);
    req.uid = uid;
    console.log('la request al pasar por la primera validacion',req.uid)
    next();// hace que se llame a la siguiente función (se encadena)
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Token no válido",
    });
  }
};

const validarADMIN_ROLE = async (req=request,res=response,next) => {
  const idUserLogueado = req.uid;
  const usuarioEditante = await Usuario.findById(idUserLogueado);
  if (!usuarioEditante) {
    return res.status(404).json({
      ok:false,
      msg:'Usuario no encontrado'
    })
  }
  if (usuarioEditante.role !== 'ADMIN_ROLE'){
    return res.status(500).json({
      ok:false,
      msg:"No tiene permisos para realizar esta acción",
      usuario:usuarioEditante
    })
  }
  next();
}

const validarADMIN_ROLE_o_MismoUsuario = async (req=request,res=response,next) => {
  const idUserLogueado = req.uid;
  const idUsuarioAModificar = req.params.id;
 console.log(idUserLogueado)
 console.log(idUsuarioAModificar)
  const usuarioEditante = await Usuario.findById(idUserLogueado);
  if (!usuarioEditante) {
    return res.status(404).json({
      ok:false,
      msg:'Usuario no encontrado'
    })
  }
  if (usuarioEditante.role === 'ADMIN_ROLE' ||  idUserLogueado === idUsuarioAModificar){
      next();
  }else {
    return res.status(500).json({
      ok:false,
      msg:"No tiene permisos para realizar esta acción",
      usuario:usuarioEditante
    })
  }
}

module.exports = {
  validarJWT,
  validarADMIN_ROLE,
  validarADMIN_ROLE_o_MismoUsuario
};
