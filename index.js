require('dotenv').config();
const express = require ('express');
const cors = require('cors')
const rutasUsuarios  = require('./routes/usuarios.routes')
const rutasLogin     = require('./routes/auth.routes')
// Crea el servidor de node
const servidorExpress  = express();


//#region CONFIGURAR CORS
        servidorExpress.use( cors() )
//#endregion

// Lectura y parseo del body
        servidorExpress.use( express.json() );

//#region  CONEXION BBDD 
    const  dbConnection  = require('./database/config');
    // Base de datos
    dbConnection.dbConnection();
//#endregion


// lista de variables de entorno   console.log(process.env);

//#region  USUARIO ESTANDAR
    // mean_user
    // wTrWmkcFzaxn0Xvw
//#endregion

//#region Rutas
    servidorExpress.use('/api/usuarios',rutasUsuarios);
    servidorExpress.use('/api/login',rutasLogin);
//#endregion


// Poner el servidor a la escucha del puerto
servidorExpress.listen(process.env.PORT, () => {
    console.log('servidor corriendo en puerto ', process.env.PORT);
})

//#region 
// this._router
//                       .events
//                       .pipe(
//                         filter( (events) => events instanceof NavigationStart)
//                       )
//                       .subscribe(
//                                 (events: RouterEvent) => {
//                                     events.url.search('Cliente/Panel/') != -1 ? this.muestraPanelCliente = true : this.muestraPanelCliente = false;
//                                     events.url.search('Cliente/(Login|Registro)') != -1 ? this.toLoginRegistro = true : this.toLoginRegistro = false;
//                                 }
//                 );
//#endregion