const { v4: uuidv4 } = require('uuid');
const { response, request } = require("express");
const { buscadorDentroArrayObjetos } = require("../helpers/buscadorArray");
const upload =(req= request,res=response,next) =>{
    const hombre = {
        edad:22,
        nombre:'javier',
    }
    const hombres = [{nombre:'javier',edad:22},{nombre:'Juana', edad:29}];
    const seEncuentraEnArray = buscadorDentroArrayObjetos(hombres,hombre,'nombre');
    
    console.log('se encuentra en el array??',seEncuentraEnArray);
    // console.log('el array hech string',JSON.stringify(hombres));
    // const encontrado = hombres.find(persona=> persona.nombre==hombre.nombre);
    // console.log( Object.entries(encontrado).sort().toString() === Object.entries(hombre).sort().toString());

   // COMPARA OBJETOS IGUALES, Pero no un array contra un objeto
    console.log( Object.entries(hombres[0]).sort().toString() === Object.entries(hombre).sort().toString());
    const {tipo, id} = req.params;
    const tiposValidos = ['medicos','hospitales','usuarios'];
    const resultado = tiposValidos.includes(tipo);

    // Validar la coleccion desde la url
    if(!resultado){
      return  res.status(400).json({
            ok:false,
            msg:'No es un médico, usuario ni hospital'
        });
    }
    // Validar que exista un archivo
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

    // Generar el nombre de archivo
    const nombreArchivo = `${uuidv4()}.${extension}`;

    // Path para guardar la imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    // Mover la imagen
    file.mv(path, function(err) {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok:false,
                msg:'Error al mover la imagen'
            });}
        res.status(200).json({
            ok:true,
            msg:'FileUploaded',
            nombreArchivo
        });
      });


}

module.exports={upload}