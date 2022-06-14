const { v4: uuidv4 } = require('uuid');
const { response, request } = require("express");
const { buscadorDentroArrayObjetos } = require("../helpers/buscadorArray");
const { actualizarImagen, borrarImagen } = require('../helpers/actualizar-imagen');
const path = require('path');
const fs  = require ('fs');



const upload = async(req= request,res=response,next) =>{
    //#region EXPLICACION COMPARAR OBJETOS CON ELEMENTO ARRAY
//     const hombre = {
//         edad:22,
//         nombre:'javier',
//     }
//     const hombres = [{nombre:'javier',edad:22},{nombre:'Juana', edad:29}];
//     const seEncuentraEnArray = buscadorDentroArrayObjetos(hombres,hombre,'nombre');
    
//     console.log('se encuentra en el array??',seEncuentraEnArray);
//    // COMPARA OBJETOS IGUALES, Pero no un array contra un objeto
//     console.log( Object.entries(hombres[0]).sort().toString() === Object.entries(hombre).sort().toString());
    //#endregion
    const {tipo, id} = req.params;
    const tiposValidos = ['medicos','hospitales','usuarios'];
    const resultado = tiposValidos.includes(tipo);

    // Validar la coleccion desde la url
    if (!resultado){
      return  res.status(400).json({
            ok:false,
            msg:'No es un médico, usuario ni hospital'
        });
    }
    // Validar que exista un archivo en la peticion
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok:false,
            msg:'No hay ningún archivo'
        });
      }
    // tratar la imagen
    const file = req.files.imagen;
    const nombreCortado = file.name.split('.');
    const extension     = nombreCortado[nombreCortado.length - 1];

    // Validar extension
    const extensionesValidas = ['jpg','png','jpeg'];
    if(!extensionesValidas.includes(extension)){
        return  res.status(400).json({
            ok:false,
            msg:'No es una extensión válida'
        });
    }

    // Generar el nombre de archivo // UNICO AUNQUE SEA LA MISMA IMAGEN PARA DISTINTAS PERSONAS
    const nombreArchivo = `${uuidv4()}.${extension}`;

    // Path para guardar la imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;
    
    // Actualizar la bbdd
    const resultadoActualizacion = await actualizarImagen(nombreArchivo, tipo, id);

    if(!resultadoActualizacion){
       return res.status(400).json({
            ok:false,
            msg:'No se ha podido actualizar el registro'
        });
    }
    // Mover la imagen
    file.mv(path, function(err) {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok:false,
                msg:'Error al mover la imagen'
            });
        }
        // LO QUE DEVOLVEMOS AL FRONT COMO JSON
        res.status(200).json({
            ok:true,
            msg:'FileUploaded',
            nombreArchivo
        });
      });

}

const verImagenUploaded = (req, res=response) => {
    // renombro el segmento id, para que aqui tenga sentido y no crear dos router.put y router.get
    const {tipo, id:foto} = req.params;
    const pathImg = path.join(__dirname,`../uploads/${ tipo }/${ foto }`);
    // Comprobar que existe el archivo
    if(!fs.existsSync(pathImg)){
        const nuevoPathImg = path.join(__dirname,'../uploads/no-img.png');
        return res.sendFile( nuevoPathImg );
    }
    return res.sendFile( pathImg );
}

const deleteImagen = (req = request, res = response) => {
    console.log("Hemos llegado a delete imagen");
    const { caminoViejo } = req.body;
    console.log('el camino viejo', caminoViejo);
    borrarImagen(caminoViejo);
    res.status(200).json({
        ok:true,
        msg:'FileDeleted',
    });
}

module.exports={ upload,verImagenUploaded, deleteImagen }