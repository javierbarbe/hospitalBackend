const { response, request } = require("express");
const jwt = require("jsonwebtoken");

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

module.exports = {
  validarJWT,
};
