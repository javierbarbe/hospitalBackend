const  jsonWebToken  = require ('jsonwebtoken')


const generarJWT = (uid) => {

    return new Promise((resolve,reject)=>{
        const payload = {
            uid,
        }
        jsonWebToken.sign(payload, process.env.JWT_SECURE,{
                            expiresIn:'12h'
                            },(err, token)=> {
                                if(err){
                                    console.log(err);
                                    reject('Error al generar token');
                                }else{
                                    resolve(token);
                                }
        
                        })


    })


}


module.exports = {
    generarJWT,
}

