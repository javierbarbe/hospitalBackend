
const { request, response } = require('express');
const Usuario = require ('../models/usuario');
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const getTodo = async (req = request,res=response,next)=>{
  try{  
        const palabrasBusqueda = req.params.palabrasBusqueda;
        const regex = new RegExp(palabrasBusqueda, 'i');
        const [ usuarios, hospitales, medicos ] = await Promise.all([
             Usuario.find({nombre:regex}),
             Hospital.find({nombre:regex}),
             Medico.find({nombre:regex}),
        ]);
        return res.json({
            ok:true,
            msg:'buscando...',
            palabrasBusqueda,
            usuarios,
            hospitales,
            medicos
        });
        //--------------------------------
    }catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Error al recuperar info de medicos,hospitales y usuarios'
        });
    }
}

const getDocumentosColeccion = async (req = request,res=response,next)=>{
    try{  
        const palabrasBusqueda = req.params.palabrasBusqueda;
        const tabla            = req.params.tabla;
        const regex            = new RegExp(palabrasBusqueda, 'i');
        let data;
        switch (tabla) {
            case 'usuarios':
                data = await Usuario.find({nombre:regex})
                       
            break;
            case 'hospitales':
                data = await Hospital.find({nombre:regex})
                                .populate('usuario','nombre img');
            break;
            case 'medicos':
                data = await Medico.find({nombre:regex })
                                .populate('usuario','nombre img')
                                .populate('hospital','nombre img');
                break;
            default:
               return res.status(400).json({
                    ok:false,
                    msg:'La tabla tiene que ser medicos o hospitales o usuarios'
                })
        }
        return res.json({
            ok:true,
            resultado: data
        });

         
          //--------------------------------
      }catch(error){
          console.log(error);
          res.status(500).json({
              ok:false,
              msg:'Error al recuperar info de medicos,hospitales y usuarios'
          });
      }
  }
  

module.exports = {
    getTodo,
    getDocumentosColeccion
  
}