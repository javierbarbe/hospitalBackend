// HOSPITAL
const { request, response } = require('express');
const Medico = require ('../models/medico');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const getMedicos = async (req,res,next)=>{
    const medico = await  Medico.find()
                                .populate('hospital',' nombre img')
                                .populate('usuario','nombre img');
                                
    res.json({
        ok:true,
        medico: medico,
        // al haber añadido en la funcion middleware ( intermedia ) la propiedad uid a la request,
        // puedo devolverla en la siguiente funcion , es como si el coddigo estuviese a continuacion uno del otro
        uid:req.uid
    });
}

const  crearMedico = async  (req=request,res= response,next)=>{
        try {
            const uid = req.uid;
            const listaHospitales = [
                '612cbe9c66de144f335969bc',
                '612cbe6766de144f335969b8',
                '612cbe7166de144f335969ba'
            ];
            function randomNum(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
              }
            const aleatorioHospital = randomNum(0, listaHospitales.length);
            const  medico = new Medico(
            {
                usuario:uid,
                hospital:listaHospitales[aleatorioHospital],
                ...req.body
            } );

            // Grabar Medico bbdd
            // await medico.save();
            await Medico.create(medico);
           

            res.json({
                ok:true,
                msg: 'creado Medico ',
                medico,
                
            });
        } catch (error) {
            res.status(500).json({
                ok: false,
                msg:'error inesperado, revisar logs'
            })
            console.log('error al crear Medico :>> ', error);
        }
}

const editaMedico = async (req=request,res=response)=>{
    const idMedico  = req.params.id;
    console.log(idMedico);
    res.json({
        ok:true,
        msg:'Editando Medico'
    })
    // try {
    //     const { password, google, email, ...campos } = req.body ;
    //     const usuarioBBDD = await Medico.findById(idUsuario);
    //     // si el usuario no existe
    //     if(!usuarioBBDD){
    //        return res.status(400).json({
    //             ok:false,
    //             msg:'El usuario con id'+ idUsuario+' no existe'
    //         })
    //     }
    //     // si los mails son distintos, compruebo que no haya nadie en la bbdd con ese email
    //     if(usuarioBBDD.email != email){
    //         const existeMail= await Medico.findOne({email});
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
    //     const usuarioActualizado= await Medico.findByIdAndUpdate(idUsuario, campos,{new:true});
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

const deleteMedico = async (req=request, res = response)=> {
    try {
        return  res.status(200).json({
            ok:true,
            msg:'Eliminando Medico'
        })
        const idMedico = req.params.id;
        const MedicoEliminar = await Medico.findByIdAndDelete(idMedico);
        if(MedicoEliminar){
            console.log('el Medico a eliminar ',MedicoEliminar);
            return  res.status(200).json({
                ok:true,
                usuarioElimnar: MedicoEliminar,
                msg:'Eliminado correctamente '+ MedicoEliminar.nombre
            })
        }
        return res.status(400).json({
            ok:false,
            msg:'No existe un Medico con ese id'
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
    getMedicos,
    crearMedico,
    editaMedico,
    deleteMedico
}