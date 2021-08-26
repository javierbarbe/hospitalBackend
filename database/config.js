const mongoose = require('mongoose');
const linkBBDD = process.env.DB_CNN;
const dbConnection =  () => {
    try {
        mongoose.connect(linkBBDD, 
                        {
                            useNewUrlParser: true, 
                            useUnifiedTopology: true,
                         });
        console.log('base de datos online');
    } catch (error) {
        console.log(error);
        throw new Error('error a la hora de iniciar la bbdd',error);
    }


}

module.exports= {
    dbConnection
}