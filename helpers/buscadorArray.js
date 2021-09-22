
const buscadorDentroArrayObjetos = (array, objetoBuscado, propiedadIgualatoria) => {
    const encontrado = array.find(objetoArray=> objetoBuscado[propiedadIgualatoria]==objetoArray[propiedadIgualatoria]);
    return( Object.entries(encontrado).sort().toString() === Object.entries(objetoBuscado).sort().toString());
}

module.exports={
    buscadorDentroArrayObjetos
}