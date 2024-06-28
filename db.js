const {Database, SQLiteCloudError} = require("@sqlitecloud/drivers");
const {usr,pwd} = require("./config");

const database = new Database(
    "sqlitecloud://" + usr + ":" + pwd+"@cxnoe7meik.sqlite.cloud:8860"
)

/*
  En caso de querer usar más de una base de datos, sólo hay que llamar la función y pasar el nombre
  por parametro.
*/
async function useDB(name){
    await database.sql(`USE DATABASE ${name}`);
}

//obtener todos los juegos de la base de datos.
async function getJuegos(){   
    useDB("jugra");
    return await database.sql("SELECT * from Juegos");
};

async function getUnJuego(juegoID){
    useDB("jugra");
    const juegos =  await database.sql(`SELECT * FROM Juegos WHERE juegoID = ${juegoID}`);
    return juegos[0];
}

//obtiene todos los juegos favoritos en la base de datos.
async function getFavoritos(usuarioID){
    useDB("jugra");
    return await database.sql(`SELECT DISTINCT J.juegoID,E.estadoID, titulo,tipoEstado, valoracion, comentario 
FROM "Juegos"as J,"Favoritos"as F,"Estados"as E 
WHERE J.juegoID = F.juegoID AND F.estadoID = E.estadoID AND usuarioID = ${usuarioID}`);
}

async function getUnFavorito(usuarioID,juegoID){
    useDB("jugra");
    const favorito = await database.sql(`SELECT * from Favoritos WHERE usuarioID = ${usuarioID} 
                                                                 AND juegoID = ${juegoID}`);
    return favorito[0];
}

//obtiene todos los generos en la base de datos.
async function getGeneros(){
    useDB("jugra");
    return await database.sql("SELECT * from Generos");
}

//obtiene todos los usuarios en la base de datos.
async function getUsuarios(){
    useDB("jugra");
    return await database.sql("SELECT * FROM Usuarios");
}
//obtine un usuario según su email.
async function getUsuario(email){
    useDB("jugra");
    let usuario = await database.sql(`SELECT * FROM Usuarios WHERE email = '${email}'`);
    return usuario[0];
}

//obtine la información de cada juego en la base de datos.
async function getInfo(){
    useDB("jugra");
    return await database.sql("SELECT * FROM Informacion");
}

async function getInfoPorID(id){
    useDB("jugra");
    const info = await database.sql(`SELECT * FROM Informacion WHERE juegoID = ${id}`);
    return info[0];
}

async function getEstado(estadoID){
    useDB("jugra");
    const estado = await database.sql(`SELECT * FROM Estados WHERE estadoID = ${estadoID}`);
    return estado[0];
}


async function insertGeneros(genero){
    useDB("jugra");
    const errorOriginal = console.error;
    console.error = function(){}

        try{
            return await database.sql(`INSERT INTO Generos(nombre) VALUES('${genero}')`);
        }catch(error){
            if (error.message.includes('UNIQUE constraint failed')) {
                throw new SQLiteCloudError("El genero ya existe");
            }else{
                console.error("Error inesperado");
            }
        }finally{
            console.error = errorOriginal;
            console.log(`intentando insertar el genero: ${genero}`);
        }
};

//Inserta los juegos en la base de datos
async function insertJuegos(juego,generoID){
    useDB("jugra");
    const errorOriginal = console.error;
    console.error = function(){}

        try{
            return await database.sql(`INSERT INTO Juegos(titulo,generoID) VALUES('${juego}',${generoID})`);
        }catch(error){
            if (error.message.includes('UNIQUE constraint failed')) {
                throw new SQLiteCloudError("El juego ya existe");
            }else{
                console.error("Error inesperado");
            }
        }finally{
            console.error = errorOriginal;
            console.log(`intentando insertar el juego: ${juego}`);
        }
}

//Registra un usuario en la base de datos
async function insertUsuario(nombre,apellido,email,password){
    useDB("jugra");
    const errorOriginal = console.error;
    console.error = function(){}
    try{
        return await database.sql(`INSERT INTO Usuarios(nombre,apellido,email,password) VALUES('${nombre}','${apellido}','${email}','${password}')`);
    }catch(error){
        if (error.message.includes('UNIQUE constraint failed')) {
            console.log("El usuario ya existe");
        }else{
            console.error("Error inesperado");
        }
    }finally{
        console.error = errorOriginal;
        
    }
}

async function insertFavorito(usuarioID,juegoID,estadoID,valoracion,comentario){
    useDB("jugra");
    const errorOriginal = console.error;
    console.error = function(){}
    try{
    return await database.sql(`INSERT INTO Favoritos(usuarioID,juegoID,estadoID,valoracion,comentario)
                                VALUES(${usuarioID},${juegoID},${estadoID},${valoracion},'${comentario}')`);
    }catch(error){
        if (error.message.includes('UNIQUE constraint failed')) {
            console.log("Ya existe en favoritos");
            return false;
        }else{
            console.error("Error inesperado:",error);
        }
    }finally{
        console.error = errorOriginal;
    }
}

//guarda información de los juegos en la base de datos
async function insertInfo(juegoID,generoID,imagen,descripcion,enlace,plataforma,distribuidor,desarrollador,fecha){
    useDB("jugra");
    const errorOriginal = console.error;
    console.error = function(){}
    try{
    return await database.sql(`INSERT INTO Informacion(juegoID,generoID,imagen,descripcion,enlace,plataforma,distribuidor,desarrollador,fecha)
                         VALUES(${juegoID},${generoID},'${imagen}','${descripcion}','${enlace}','${plataforma}','${distribuidor}','${desarrollador}','${fecha}')`);
    }catch(error){
        if (error.message.includes('UNIQUE constraint failed')) {
            console.log("la información ya existe");
        }else{
            console.error("Error inesperado");
        }
    }finally{
        console.error = errorOriginal;
        console.log(`intentando insertar info: ${juegoID},${generoID}`);
    }
    
}

//Ordena los juegos en la base de datos según el orden recibido
async function ordenarJuegos(orden){
    useDB("jugra");
    return database.sql(`SELECT * FROM juegos ORDER BY ${orden}`);
}

async function actualizarFavoritos(usuarioID,juegoID,estadoID,valoracion,comentario){
    useDB("jugra");
    return database.sql(`UPDATE Favoritos
                        SET estadoID = ${estadoID},
                        valoracion = ${valoracion},
                        comentario = '${comentario}'
                        WHERE usuarioID = ${usuarioID} AND juegoID = ${juegoID}`);
}

async function borrarFavorito(usuarioID,juegoID){
    useDB("jugra");
    return database.sql(`DELETE FROM Favoritos
    WHERE usuarioID = ${usuarioID} and juegoID = ${juegoID}`);
}

module.exports = {getJuegos,getUnJuego,getFavoritos,getUnFavorito, getGeneros,getUsuarios,getUsuario,getInfo,getInfoPorID,getEstado,insertGeneros,insertJuegos,ordenarJuegos,insertUsuario,insertInfo,insertFavorito,actualizarFavoritos,borrarFavorito};
