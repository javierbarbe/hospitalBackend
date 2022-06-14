// HOSPITAL
const { request, response } = require('express');
const Medico = require ('../models/medico');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const getMedicos = async (req,res,next)=>{
    const parametroDesde = Number(req.query.desde) || 0;
    const limite = Number ( req.query.limite) || 5;
    const [medicos, total] = await  Promise.all( [Medico.find()
                                .populate('hospital',' nombre img').skip(parametroDesde).limit(limite)
                                .populate('usuario','nombre img'),
                                Medico.countDocuments()]
                                )
    // const medicos = await  Medico.find()
    //                         .populate('hospital',' nombre img')//.skip(parametroDesde).limit(limite)
    //                         .populate('usuario','nombre img')
                        
                                      
    res.json({
        ok:true,
        medicos: medicos,
        // al haber añadido en la funcion middleware ( intermedia ) la propiedad uid a la request,
        // puedo devolverla en la siguiente funcion , es como si el coddigo estuviese a continuacion uno del otro
        uid:req.uid,
        total
    });
}

const  crearMedico = async  (req=request,res= response,next)=>{
        try {
            const uid = req.uid;
            // const listaHospitales = [
            //     '612cbe9c66de144f335969bc',
            //     '612cbe6766de144f335969b8',
            //     '612cbe7166de144f335969ba'
            // ];
            // function randomNum(min, max) {
            //     return Math.floor(Math.random() * (max - min + 1)) + min;
            //   }
            // const aleatorioHospital = randomNum(0, listaHospitales.length);
            
            const  medico = new Medico(
            {
                usuario:uid,
                ...req.body//.medico al no pasar un objeto mantengo la validacion de campos en el body del medicos.routes.js
                                                            // check('nombre','El nombre del medico es necesario').notEmpty(),
                                                            //check('hospital','El hospital id debe de ser valido').isMongoId(),
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
    try {
        const idMedico  = req.params.id;
        const uid       = req.uid;
        console.log('el uid del usuario editante',uid);
        console.log('el id del medico editado',idMedico);
        const medico    = await Medico.findById(idMedico);
        if(!medico){
            return res.status(404).json({
                ok:false,
                msg:'No existe un médico con id: '+idMedico
            });
        }
        const cambiosMedico = {
            ...req.body,
            usuario : uid
        }
        console.log("cambios en el medico:",req.body)
        const medicoPostActualizado = await Medico.findByIdAndUpdate(idMedico, cambiosMedico, {new:true});

        return  res.status(200).json({
            ok:true,
            msg:'Editado Medico',
            medico:medicoPostActualizado
        })
        
    } catch (error) {
        console.log(error);
          return  res.status(500).json({
                ok:false,
                error: `error al actualizar el médico `
            })
    }
  
}

const getMedicoById = async (req = request, res = response)=> {
    try {
        const idMedico = req.params.id;
        const uid      = req.uid;
        console.log('ID:', idMedico);
        console.log('uid del user logueado',uid)
        const medico   = await Medico.findById(idMedico)
                                        .populate('hospital','nombre img')
                                        .populate('usuario','nombre img');
        if(!medico){
            console.log('no hay medico')
            return res.status(400).json({
                ok:false,
                msg:"No existe un médico con id: "+idMedico
            })
        }
        console.log('el medico by id', medico)
        return res.status(200).json({
            ok:true,
            medico,
            usuario:uid
        })
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok:false,
            msg:"ha habido problemas buscando Medico por id "+error
        })
    }
}

const deleteMedico = async (req=request, res = response)=> {
    try {
       //eo
        const idMedico = req.params.id;
        const uid      = req.uid;
        const MedicoEliminar = await Medico.findByIdAndDelete(idMedico);
        if(MedicoEliminar){
            console.log('el Medico a eliminar ',MedicoEliminar);
            return  res.status(200).json({
                ok:true,
                usuario: uid,
                msg:'Eliminado correctamente '+ MedicoEliminar.nombre,
                medicoEliminado: MedicoEliminar
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
    deleteMedico,
    getMedicoById
}