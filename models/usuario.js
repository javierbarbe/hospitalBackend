
// esto son modelos de mongoose 

const { Schema, model} = require('mongoose');

 const usuarioSchema = Schema({
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
        default:true
    }
 });

 module.exports = model('Usuario', usuarioSchema);


