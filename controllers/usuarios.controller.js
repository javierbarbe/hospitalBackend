
const { request, response } = require('express');
const Usuario = require ('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const getUsuarios = async (req = request,res,next)=>{
  try{  
      // Recogo de la query los parametros (desde y hasta o límite )
        const parametroDesde = Number(req.query.desde) || 0;
        const limite = Number ( req.query.limite) || 5;

        // const usuarios = await  Usuario.find({},`nombre role google email`)
        //                                 // paginacion
        //                                 .skip(parametroDesde)
        //                                 .limit(limite);
        // const total = await Usuario.count();
        const [ usuarios, total ]= await  Promise.all([
                                            Usuario.find({},`nombre role google email`).skip(parametroDesde).limit(limite),
                                            Usuario.count()
                                            ]
                                            );

        res.json({
            ok:true,
            usuarios,
            total,
            // al haber añadido en la funcion middleware ( intermedia ) la propiedad uid a la request,
            // puedo devolverla en la siguiente funcion , es como si el coddigo estuviese a continuacion uno del otro
            uid:req.uid
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Error al coger usuarios'
        })
    }
}

const  crearUsuario = async  (req=request,res= response,next)=>{
        try {
            const { nombre, email, password } = req.body;
            const existeEmail =await Usuario.findOne({email});
        
            if (existeEmail){
                return res.status(400).json({
                    ok:false,
                    msg:'el correo ya existe'
                })
            }
            
            const  usuario = new Usuario( req.body );

            // Encriptacion contraseña
            const salt = bcrypt.genSaltSync();
            usuario.password = bcrypt.hashSync(password, salt);

            // Grabar usuario bbdd
            await usuario.save();
            // await Usuario.create(usuario);
            
            // Generar JWT 
            const token = await generarJWT(usuario.id);

            res.json({
                ok:true,
                msg: 'creandoUsuario ',
                usuario,
                token
            });
        } catch (error) {
            res.status(500).json({
                ok: false,
                msg:'error inesperado, revisar logs'
            })
            console.log('error al crear usuario :>> ', error);
        }
}

const editaUsuario = async (req=request,res=response)=>{
    const idUsuario  = req.params.id;
    console.log(idUsuario);
    try {
        const { password, google, email, ...campos } = req.body ;
        const usuarioBBDD = await Usuario.findById(idUsuario);
        // si el usuario no existe
        if(!usuarioBBDD){
           return res.status(400).json({
                ok:false,
                msg:'El usuario con id'+ idUsuario+' no existe'
            })
        }
        // si los mails son distintos, compruebo que no haya nadie en la bbdd con ese email
        if(usuarioBBDD.email != email){
            const existeMail= await Usuario.findOne({email});
            // si ya hay un usuario con ese email, error
            if(existeMail){
                return res.status(400).json({
                    ok:false,
                    msg: 'Ya existe un usuario con ese email'
                })
            }
        }
        // añado a los campos el mail    
        campos.email= email;
        const usuarioActualizado= await Usuario.findByIdAndUpdate(idUsuario, campos,{new:true});
        // esta opcion de new true, devuelve ya el nuevo objeto modificado
        res.status(200).json({
            ok:true,
            usuario:usuarioActualizado
        })
        
        
    } catch (error) {
        console.log(error);
      return  res.status(500).json({
            ok:false,
            error: `error al actualizar el usuario `
        })
    }
}

const deleteUsuario = async (req=request, res = response)=> {
    try {
        const idUsuario = req.params.id;
        const usuarioElimnar = await Usuario.findByIdAndDelete(idUsuario);
        if(usuarioElimnar){
            console.log('el usuario a eliminar ',usuarioElimnar);
            return  res.status(200).json({
                ok:true,
                usuarioElimnar,
                msg:'Eliminado correctamente '+ usuarioElimnar.email
            })
        }
        return res.status(400).json({
            ok:false,
            msg:'No existe un usuario con ese id'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Han ocurrido errores al eliminar, mirar log'
        })
    }
}

module.exports = {
    getUsuarios,
    crearUsuario,
    editaUsuario,
    deleteUsuario
}