
// esto son modelos de mongoose 
const { Schema, model} = require('mongoose');

 const hospitalSchema =new Schema({
    nombre:{
        type:String,
        required:true
    },
  
    img:{ 
        type:String,
    },
    usuario:{
        required:true,
        type:Schema.Types.ObjectId,
        ref:'Usuario' // la ref tiene que ser igual que el parametro del model Exportado en el otro modelo
    },
    direccion:{
        type:String,
        //required:true
    }
 },{ 
     collection:'hospitales ' // esto establece el nombre de la collección a crear en mongodb, sino, usaría por defecto
                             // hospitals, que es la parte del nombre del objeto new Schema , que va antes de Schema
    });
hospitalSchema.method('toJSON', function(){
    const {__v,_id, ...object}=this.toObject();
     object.uid = _id;
    return object;
})

const user = model('Hospital',hospitalSchema);



 module.exports = user;


