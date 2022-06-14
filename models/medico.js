
// esto son modelos de mongoose 
const { Schema, model} = require('mongoose');

 const medicoSchema =new Schema({
            nombre:{
                type:String,
                require:true
            },
            img:{ 
                type:String,
            },
            hospital:{
                required:true,
                type:Schema.Types.ObjectId,
                ref:'Hospital' // la ref tiene que ser igual que el parametro del model Exportado en el otro modelo
            }, 
             usuario:{
                 required:true,
                type:Schema.Types.ObjectId,
                ref:'Usuario' // la ref tiene que ser igual que el parametro del model Exportado en el otro modelo
            }
        },
        // { 
        //     collection:'hospitales ' // esto establece el nombre de la collección a crear en mongodb, sino, usaría por defecto
        //                         // hospitals, que es la parte del nombre del objeto new Schema , que va antes de Schema
        // }
    );
    medicoSchema.method('toJSON', function(){
        const {__v, _id,...object}=this.toObject();
        object.uid = _id;
        
        return object;
    }
)

const user = model('Medico',medicoSchema);



 module.exports = user;


