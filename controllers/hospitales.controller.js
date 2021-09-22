// HOSPITAL
const { request, response } = require('express');
const Hospital = require ('../models/hospital');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const getHospitales = async (req,res,next)=>{
    const hospitales = await  Hospital.find()
    /*
    // populate busca de entre las propiedades del objeto , en el resto de colecciones
    // en este caso busca el valor de la propiedad usuario y en la bbdd busca aquel
    // que tiene ese valor, en nuestro caso hemos grabado en la prop usuario el id del usuario que creo el hospital
    .populate('usuario')
    // si paso un segundo parametro con los nombres de las props que quiero, la consulta
    // devolvera esos campos, si no, devuelve TOOOODO el objeto
    */
                                        .populate('usuario','nombre email img')
    ;
    res.json({
        ok:true,
        hospitales: hospitales,
        // al haber añadido en la funcion middleware ( intermedia ) la propiedad uid a la request,
        // puedo devolverla en la siguiente funcion , es como si el coddigo estuviese a continuacion uno del otro
        uid:req.uid
    });
}

const  crearHospital = async  (req=request,res= response,next)=>{
        try {
            // la uid está en la req gracias al middleware "validarJWT"
            const uid = req.uid;
            //#region  VALIDACION HOSPITALES MISMO NOMBRE
                    // const existeHospitalNombre =await Hospital.findOne({nombre});
                    // if (existeHospitalNombre){
                    //     return res.status(400).json({
                    //         ok:false,
                    //         msg:'el nombre de ese hospital ya existe'
                    //     })
                    // }
            //#endregion
            const  hospital = new Hospital( {
                usuario:uid,
                ...req.body
            } );

            // Grabar hospital bbdd
           const hospitalGrabado =  await hospital.save();
            // await hospital.create(hospital);
           

            res.json({
                ok:true,
                msg: 'creado hospital ',
                hospital:hospitalGrabado,
                
            });
        } catch (error) {
            res.status(500).json({
                ok: false,
                msg:'error inesperado, revisar logs'
            })
            console.log('error al crear hospital :>> ', error);
        }
}

const editaHospital = async (req=request,res=response)=>{
    const idHospital  = req.params.id;
    console.log(idHospital);
    res.json({
        ok:true,
        msg:'Editando hospital'
    })
    // try {
    //     const { password, google, email, ...campos } = req.body ;
    //     const usuarioBBDD = await Hospital.findById(idUsuario);
    //     // si el usuario no existe
    //     if(!usuarioBBDD){
    //        return res.status(400).json({
    //             ok:false,
    //             msg:'El usuario con id'+ idUsuario+' no existe'
    //         })
    //     }
    //     // si los mails son distintos, compruebo que no haya nadie en la bbdd con ese email
    //     if(usuarioBBDD.email != email){
    //         const existeMail= await Hospital.findOne({email});
    //         // si ya hay un usuario con ese email, error
    //         if(existeMail){
    //             return res.status(400).json({
    //                 ok:false,
    //                 msg: 'Ya existe un usuario con ese email'
    //             })
    //         }
    //     }
    //     // añado a los campos el mail    
    //     campos.email= email;
    //     const usuarioActualizado= await Hospital.findByIdAndUpdate(idUsuario, campos,{new:true});
    //     // esta opcion de new true, devuelve ya el nuevo objeto modificado
    //     res.status(200).json({
    //         ok:true,
    //         usuario:usuarioActualizado
    //     })
        
        
    // } catch (error) {
    //     console.log(error);
    //   return  res.status(500).json({
    //         ok:false,
    //         error: `error al actualizar el usuario `
    //     })
    // }
}

const deleteHospital = async (req=request, res = response)=> {
    try {
        return  res.status(200).json({
            ok:true,
            msg:'Eliminando hospital'
        })
        const idHospital = req.params.id;
        const hospitalEliminar = await Hospital.findByIdAndDelete(idHospital);
        if(hospitalEliminar){
            console.log('el hospital a eliminar ',hospitalEliminar);
            return  res.status(200).json({
                ok:true,
                usuarioElimnar: hospitalEliminar,
                msg:'Eliminado correctamente '+ hospitalEliminar.nombre
            })
        }
        return res.status(400).json({
            ok:false,
            msg:'No existe un hospital con ese id'
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
    getHospitales,
    crearHospital,
    editaHospital,
    deleteHospital
}