const  fs      = require('fs');
const Medico   = require('../models/medico');
const Hospital = require( '../models/hospital');
const Usuario  = require( '../models/usuario');
const { response } = require('express');
 
const borrarImagen = (pathViejo) => {
 //#region  EXPLICACION
        // Con fs "aka fileSystem" evaluo si en mi servidor hay algun archivo que tenga ese nombre,
        // O sea que ese medico,hospital o usuario tengan ya foto
        // si lo hay... con unlinkSyn la elimino (sea cual sea)
//#endregion
    try{
        if(fs.existsSync(pathViejo)){
            fs.unlinkSync(pathViejo);
            return true;
        }
    }catch (error){
        return false;
    }
}

 const actualizarImagen = async(nombreArchivo,coleccion, id) =>{
     try {
         let data ;
         console.log('la coleccion',coleccion);
         switch (coleccion) {
             case 'usuarios':
                 data = await Usuario.findById(id);
                 data.noImage = false;
             break;       
             case 'medicos':
                 console.log('entro en medicos');
                 data = await Medico.findById(id);
                 console.log(data);
             break;
             case 'hospitales':
                 data = await Hospital.findById(id);
             break;
       
         }
        const pathViejo = `uploads/${coleccion}/${data.img}`;
        borrarImagen(pathViejo);
        // reajusto la propiedad imagen en la bbdd
        data.img = nombreArchivo;
        //#region EXPLICACION
        // uso esto "data.save()" en lugar del Medico.create(medico), ya que necesitaría repetir codigo en cada switch
        //#endregion
        const resultadoGrabar = await data.save();
        console.log('el resultado de cambiar img',resultadoGrabar);
        return true;
    } catch (error) {
        console.log('el error',error);
        console.log(`No es un id correcto de la coleccion ${coleccion} `);
        return false;
     }

}


module.exports={actualizarImagen, borrarImagen}