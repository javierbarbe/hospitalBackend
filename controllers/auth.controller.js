const { response, request } = require("express")
const Usuario = require ('../models/usuario')
const bcrypt = require('bcryptjs');
const { generarJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-verify");


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

        // Verificacion contraseña
        const validPassword = bcrypt.compareSync( password, usuarioDB.password);
        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg: 'Contraseña no válida'
            });
        }
        // TODO GENERAR TOKEN JWT
        const token = await generarJWT(usuarioDB._id)
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

const loginGoogle = async (req=request,res=response) => {
    try {
        const tokenGoogle = req.body.token;
        const {name,email, picture}=await  googleVerify(tokenGoogle);
        console.log('====================================',{name,email,picture});
        const regex            = new RegExp(email, 'i');
       const usuarioDB = await Usuario.findOne({email});
       console.log('el usuarioDb es ',usuarioDB);
       console.log('********************************');
       let usuario;
       if(!usuarioDB){
           // no existe, me lo registro
            usuario = new Usuario({
                email:email,
                nombre:name,
                img:picture,
                password:"@@@",
                google:true
            });
       }else{
           //existe usuario
           usuario = usuarioDB;
           usuario.google=true;
       }
       // guardar en DB 
       await (usuario.save());
       const token =await generarJWT(usuario._id);
        res.status(200).json({
            ok:true,
            msg:'verificando token goole',
            token,
            usuario
        });
    } catch (error) {
        res.status(400).json({
            ok:false,
            msg:'Token no es correcto'
        });
        console.log('han habido errores al loguear con google',error);
    }
        
    }
const renewToken =async (req,res=response) => {
    // con el middleware validarJWT añadimos a la req el uid del usuario
    const uid = req.uid;
    const token = await generarJWT(uid);
    res.json({
        ok:true,
        msg:'Renovando token',
        token
    })
}
module.exports = {
    login,
    loginGoogle,
    renewToken
}