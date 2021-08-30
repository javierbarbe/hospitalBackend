
// esto son modelos de mongoose 
const { Schema, model} = require('mongoose');

 const usuarioSchema =new Schema({
    nombre:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    img:{ 
        type:String,
    },
    role:{
        type:String,
        require:true,
        default:'USER_ROLE'

    },
    google:{
        type:Boolean,
        default:false
    }
 });
usuarioSchema.method('toJSON', function(){
    const {__v,_id, ...object}=this.toObject();

    object.uid = _id;
    return object;
})

const user = model('Usuario',usuarioSchema);



 module.exports = user;


