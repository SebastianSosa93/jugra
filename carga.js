const express = require("express");

const app = express();

const {insertGeneros,insertJuegos,insertInfo,getGeneros,getJuegos,getInfo} = require("./db");

//función booleana para verificar si todos los generos fueron insertados en la base de datos
async function generosCargados(datos){
    let cargado = true;
    let nombre="-";                                                  
    nombre += datos[0].genre +"-";
    for(let i=0; i<datos.length;i++){
        if(!nombre.split("-").includes(datos[i].genre.trim()))
            nombre += datos[i].genre.trim() +"-";
    
    }
    
    const generoDeTabla = await getGeneros();
    nombre = nombre.split("-");
    console.log(nombre[1]);

    for(let i=1; i<nombre.length-1;i++){
        for(let j=0; j<generoDeTabla.length; j++){
            if(generoDeTabla[j].nombre !== nombre[i]){
                cargado = false;
              
            }else{
          
                cargado = true;
                break;
            }
        }
    }
    if(generoDeTabla.length === 0){
        cargado = false;
    }
    
    return cargado;
}

//función booleana para verificar si todos los juegos fueron insertados en la base de datos.
async function juegosCargados(datos){
    let nombre="";
    let cargado = false;
    
    nombre += datos[0].title +"-";
    for(let i=0; i<datos.length;i++){
        
        if(!nombre.split("-").includes(datos[i].title.trim()))
            nombre += datos[i].title.trim() +"-";
    }
    
    const juegosDeTabla = await getJuegos();
    nombre = nombre.split("-");
    
    for(let i=1; i<nombre.length-1;i++){
        for(let j=0; j<juegosDeTabla.length;j++){
            
            if(juegosDeTabla[j].titulo !== nombre[i]){
                
                cargado = false;                
            }else{
                cargado = true;
                break;
            }
        }
    }
    
    if(juegosDeTabla.length === 0){
        cargado = false;
    }
    return cargado;
}

//función booleana para verificar si toda la información fue insertada en la base de datos.
async function infoCargada(datos){
    let enlace="";
    let cargado = false;
    
    enlace += datos[0].game_url +"-";
    for(let i=0; i<datos.length;i++){
        
        if(!enlace.split("-").includes(datos[i].game_url.trim()))
            enlace += datos[i].game_url.trim() +"-";
    }
    
    const infoDeTabla = await getInfo();
    enlace = enlace.split("-");
    
    for(let i=1; i<enlace.length-1;i++){
        for(let j=0; j<infoDeTabla.length;j++){
            
            if(infoDeTabla[j].enlace !== enlace[i]){
                cargado = false;                
            }else{
                cargado = true;
                break;
            }
        }
    }
    
    if(infoDeTabla.length === 0){
        cargado = false;
    }
    return cargado;
}

//inserta todo en la base de datos, siempre que no se haya insertado previamente-
async function insertDB(datos){
    let titulo;
    let genero;
    let generoID;
    let juegoID;
    if(!await generosCargados(datos)){
       
        for(let i= 0; i < datos.length; i++){
             genero = datos[i].genre.trim();
            try{
                await insertGeneros(genero);
                console.log("Genero insertado correctamente");
            }catch(error){
                console.error(error.message);
            }
        }
        console.log("datos cargados");
    }else{
        console.log("Los generos ya existen en la base de datos");
    }

    if(!await juegosCargados(datos)){
   
        for(let i= 0; i < datos.length; i++){
            titulo = datos[i].title.trim();
            genero = datos[i].genre.trim();
            
             generoID = await asignarID(genero,"genero");
           
            try{
                await insertJuegos(titulo,generoID);
                console.log("Juego insertado correctamente")
            }catch(error){
                console.error(error.message);
            }
        }
        console.log("datos cargados");
    }else{
        console.log("Los juegos ya existen en la base de datos");
    }

    if(!await infoCargada(datos)){
   
        for(let i= 0; i < datos.length; i++){
            titulo = datos[i].title.trim();
            genero = datos[i].genre.trim();
              
            generoID = await asignarID(genero,"genero");
            juegoID = await asignarID(titulo,"juego")

            let imagen = datos[i].thumbnail.trim();
            let descripcion = datos[i].short_description.trim();
            let enlace = datos[i].game_url.trim();
            let plataforma = datos[i].platform.trim();
            let distribuidor = datos[i].publisher.trim();
            let desarrollador = datos[i].developer.trim();
            let fecha = datos[i].release_date.trim();
        
            try{
                await insertInfo(juegoID,generoID,imagen,descripcion,enlace,plataforma,distribuidor,desarrollador,fecha);
                console.log("información insertada correctamente",(Math.round((i+1)*100 / datos.length))+"%");
            }catch(error){
                console.error(error.message);
            }
        }
        console.log("datos cargados");
    }else{
        console.log("Los datos ya existen en la base de datos");
    }
}

async function asignarID(dato,tipo){
    switch(tipo){
    case "genero":const generos = await getGeneros();
                  for(i =0; i < generos.length; i++){
                    if(dato === generos[i].nombre){
                        return generos[i].generoID;
                    }
                  }
                  break;
    case "juego": const juego = await getJuegos();
                        for(i=0; i< juego.length; i++){
                            if(dato === juego[i].titulo){
                                return juego[i].juegoID;
                            }
                        }
    }
}
  
async function cargarApi(){
    try{
        app.use(express.json)

        const ftg = await fetch("https://www.freetogame.com/api/games");
        const data = await ftg.json();
        insertDB(data);

    }catch(error){
       console.error(error.message);
    }
}

cargarApi();
app.listen(3000);
console.log("escuchando puerto 3000");