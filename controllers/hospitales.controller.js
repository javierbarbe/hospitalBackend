// HOSPITAL
const { request, response } = require('express');
const Hospital = require ('../models/hospital');
const Usuario  = require ('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const getHospitales = async (req,res,next)=>{
    const parametroDesde = Number(req.query.desde) || 0;
    const limite = Number ( req.query.limite) || 5;
    const [hospitales, total] = await Promise.all([Hospital.find().skip(parametroDesde).limit(limite)
                                                .populate('usuario','nombre email img'),
                                            Hospital.countDocuments()])  ;
    /*
    // populate busca de entre las propiedades del objeto , en el resto de colecciones
    // en este caso busca el valor de la propiedad usuario y en la bbdd busca aquel
    // que tiene ese valor, en nuestro caso hemos grabado en la prop usuario el id del usuario que creo el hospital
    .populate('usuario')
    // si paso un segundo parametro con los nombres de las props que quiero, la consulta
    // devolvera esos campos, si no, devuelve TOOOODO el objeto
    */
                                       
    ;
    res.json({
        ok:true,
        hospitales: hospitales,
        // al haber añadido en la funcion middleware ( intermedia ) la propiedad uid a la request,
        // puedo devolverla en la siguiente funcion , es como si el coddigo estuviese a continuacion uno del otro
        uid:req.uid,
        total
    });
}

const  crearHospital = async  (req=request,res= response,next)=>{
        try {
            console.log("que va en el cuerpo al crear el hospital",req.body)
            // la uid está en la req gracias al middleware "validarJWT"
            const uid = req.uid;
            const hospitalRecibido = req.body.hospital;
            //#region  VALIDACION HOSPITALES MISMO NOMBRE
            const existeHospitalNombre =await Hospital.findOne({nombre:hospitalRecibido.nombre});
            if (existeHospitalNombre){
                return res.status(400).json({
                    ok:false,
                    msg:'el nombre de ese hospital ya existe'
                })
            }
            //#endregion
           
            const  hospital = new Hospital( {
                usuario:uid,
                //* importante si paso un objeto en el body en lugar de una propiedad *//
                ...req.body.hospital
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
    try {
        const idHospital      = req.params.id;
        const uid             = req.uid; // añadido al loguearte a la req
        console.log('la id y la uid',{uid, idHospital})
        const hospitalAntiguo = await  Hospital.findById(idHospital)
                                                .populate('usuario', 'nombre direccion');
        if(!hospitalAntiguo){
        return res.status(404).json({
                ok:false,
                msg:'el Hospital con id: '+idHospital+' no existe'
            });
        }
        console.log('el hopsital antiguo',hospitalAntiguo);
        const cambiosHospital = {
            ...req.body.hospital,
            usuario:uid
        }                                                                                   // EXPLICACION NEW:TRUE DEVUELVE EL ÚLTIMO CAMBIO
        console.log('cambios hospital',cambiosHospital)                                                                               //TRAS ACOMETERLO
        const hospitalActualizado = await Hospital.findByIdAndUpdate(idHospital, cambiosHospital, {new:true});
        
        return res.json({
            ok:true,
            msg:'Editando hospital',
            hospital: hospitalActualizado
        });
    
        
    } catch (error) {
        console.log(error);
          return  res.status(500).json({
                ok:false,
                error: `error al actualizar el Hospital `
            })
    }

}

const deleteHospital = async (req=request, res = response)=> {
    try {
        const idHospital = req.params.id;
        const hospitalEliminar = await Hospital.findByIdAndDelete(idHospital);
        if(hospitalEliminar){
            return  res.status(200).json({
                ok:true,
                hospital: hospitalEliminar,
                msg:'Eliminado correctamente '+ hospitalEliminar.nombre
            })
        }
      
        return res.status(404).json({
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