const mongoose = require('mongoose');
const linkBBDD = process.env.DB_CNN;
const dbConnection =async () => {
    try {
     await mongoose.connect(linkBBDD, 
                        {
                            useNewUrlParser: true, 
                            useUnifiedTopology: true,
                         });
        console.log('base de datos online');
    } catch (error) {
        console.log('====================================\n==========================\n',error);
        throw new Error('error a la hora de iniciar la bbdd',error);
    }


}

module.exports= {
    dbConnection
}