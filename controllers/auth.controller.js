const { response, request } = require("express")
const Usuario = require ('../models/usuario')
const bcrypt = require('bcryptjs');
const { generarJWT } = require("../helpers/jwt");


const login = async ( req=request, res=response, next )=> {
    try {
        const {email , password } = req.body;
        const usuarioDB = await Usuario.findOne({email:email});
        if (!usuarioDB){
            return res.status(400).json({
                ok:false,
                msg: 'El correo no pertenece a ningún usuario'
            });
        }

        console.log(usuarioDB.password);
        // Verificacion contraseña

        const validPassword = bcrypt.compareSync( password, usuarioDB.password);
        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg: 'Contraseña no válida'
            });
        }
        // TODO GENERAR TOKEN JWT
        const token =await generarJWT(usuarioDB._id)
        res.json({
            ok:true,
            token
        })

    } catch (error) {
        console.log('hay error al logearse',error);
        return res.status(500).json({
            ok:false,
            msg: 'Hable con el admim'
        })
    }
}


module.exports = {
    login
}