
const { request, response } = require('express');
const Usuario = require ('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { getMenuFrontEnd } = require('../helpers/menu-frontend');
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
                                            Usuario.find({},`nombre role google email img`).skip(parametroDesde).limit(limite),
                                            Usuario.countDocuments()
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
                    msg:'El correo ya existe'
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
    const idUsuario = req.params.id;
    console.log('lo que recibimos al editar usuario');
    console.log(req.body)
    console.log(idUsuario);
    console.log('=============0')
    try {
        const { password, google, email, ...campos } = req.body ;
        console.log('qué son los campos??',campos);
        if (!campos.role) {
          return res.status(401).json({
            ok: false,
            msg: "No hay rol de usuario",
          });
        }
       // const usuarioEDITOR = await Usuario.findById(idUsuario);
        const usuarioEditado= await Usuario.findById(idUsuario);
        // si el usuario no existe
        if (!usuarioEditado){
           return res.status(400).json({
                ok:false,
                msg:'El usuario con id'+ idUsuario+' no existe',
                usuario: undefined
            });
        }
        console.log('el usuario que quiero editar',usuarioEditado)
        // si el email es de google no cambio de email
        if (!usuarioEditado.google ){
            // añado a los campos el mail    
            campos.email = email;
        } 
        else  { 
            // si es un email de google y son distintos
            if(email !== usuarioEditado.email){
                return  res.status(400).json({
                    ok:false,
                    msg: `Los usuarios de google no pueden cambiar su email`,
                    usuario: usuarioEditado,
                    email : usuarioEditado.email
                })
            }
        }

        // si los mails son distintos, compruebo que no haya nadie en la bbdd con ese email
        if (usuarioEditado.email != email ){
            const otroUserMismoMail = await Usuario.findOne({email});
            // si ya hay un usuario con ese email, error
            if (otroUserMismoMail){
                return res.status(400).json({
                    ok:false,
                    msg: 'Ya existe un usuario con ese email',
                    usuario: undefined
                })
            }
        }
    
        const usuarioActualizado = await Usuario.findByIdAndUpdate(idUsuario, campos,{new:true});
        console.log("el usuariotras actualizar",usuarioActualizado);
            // esta opcion de new true,
            // await Usuario.findByIdAndUpdate(idUsuario, campos,{new:true}); 
            // devuelve ya el nuevo objeto modificado
        return  res.status(200).json({
            ok:true,
            usuario:usuarioActualizado,
            msg:"Todo ok JoseLuis",
            menu : getMenuFrontEnd(usuarioActualizado.role)
        })
        
    } catch (error) {
        console.log(error);
      return  res.status(500).json({
            ok:false,
            msg: `error al actualizar el usuario `,
            usuario: undefined
        });
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