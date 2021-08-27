const getUsuarios = (req,res,next)=>{
    res.json({
        ok:true,
        usuarios:[{
            id:123,
            nombre:'Javi'
        },
        {
            id:1223,
            nombre:'Javi2'
        }]
    });
}

module.exports = {
    getUsuarios
}