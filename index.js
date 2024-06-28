//Nombre del proyecto: JuGra(Jugar Gratis)

/*
Objetivo: Poder acceder a una lista de los juegos gratis que existen y que es posible jugarlos,
 de manera legal. Pensado para personas que no tienen dinero para comprar juegos, o bien, no quieren gastar
 dinero en eso.
 
 La idea es que puedan conocer que juegos hay disponibles, crear una lista de juegos favoritos, ordenarlos
 como deseen y además obtener información sobre cada juego, por ejemplo saber de que genero es o en que 
 plataforma se puede jugar.

 En resumen, Jugra permite:
 ·Obtener información de cada juego. 
 .Agregar o borrar juegos en una lista personalizada. 
 .Ordenar los juegos por: nombre o id.
 .Calificar los juegos con una valoración del 1 al 10  
 .Marcar los juegos como jugado, no jugado, terminado, etc. 
 .Agregar un comentario (opinion) sobre cada juego. 
*/
const express = require("express");
const morgan = require("morgan");
const ejs = require("ejs");
const path = require("path");
const expressLayout = require("express-ejs-layouts");
const bcryptjs = require("bcryptjs");

const {getJuegos,getUnJuego, getFavoritos,getUnFavorito, getInfo,getEstado,ordenarJuegos,insertUsuario,insertFavorito, getUsuarios,getUsuario, getInfoPorID,actualizarFavoritos,borrarFavorito} = require("./db");
const { resourceLimits } = require("worker_threads");


const app = express();


app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(expressLayout);

app.use(express.text());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(morgan("dev"));



async function loadData() {
  try {
    let loginOk = false;
    let email;

    //Se muestran los juegos ordenados por número(por defecto) o en orden alfabético, según la opción elegida.
       app.get("/",async(req,res)=>{
        res.redirect("/juegos");
      }) 
     app.get("/juegos", async(req,res) =>{
        let orden = req.query.orden;
                
        if(orden){
          res.render("index",{juego : await ordenarJuegos(orden)});
        }else{
          res.render("index",{juego : await getJuegos()});
        }
      });

      app.get("/info/:juegoID",async(req,res)=>{
        const id = req.params.juegoID;
        const juegos = await getJuegos();
        let titulo;
        for(i=0; i<juegos.length; i++){
          if(juegos[i].juegoID === parseInt(id)){
              titulo = juegos[i].titulo;
          }
        }
        
        info = await getInfoPorID(id);
        const imagen = info.imagen;
        const descripcion = info.descripcion;
        const enlace = info.enlace;
        const plataforma = info.plataforma;
        const distribuidor = info.distribuidor;
        const desarrollador = info.desarrollador;
        const fecha = info.fecha;
        res.render("info",
          {
            titulo : titulo,
            imagen : imagen,
            descripcion : descripcion,
            enlace : enlace,
            plataforma : plataforma,
            distribuidor : distribuidor,
            desarrollador : desarrollador,
            fecha : fecha
          });
      })

     
  
 
      //renderiza la pagina de registro de usuario
      app.get("/registro",async(req,res) =>{
        res.render("registro");
      });
      //renderiza la pagina de login
      app.get("/login",async(req,res) =>{

        res.render("login");
      });
      /*renderiza el perfil del usuario, sólo si hay un usuario logueado, de lo contrario muestra un mensaje
        y espera una confirmación para ser redireccionado nuevamente a la pagina de login*/ 
      app.get("/perfil",async(req,res)=>{
        try {
        if(loginOk){
          const usuario = await getUsuario(email);
         
          const juegosFavoritos = await getFavoritos(usuario.usuarioID);
          
          if(usuario){
            res.render("perfil",{usuarioID: usuario.usuarioID, usuario: usuario.nombre,juego : juegosFavoritos});
          }else{
            console.log('Usuario no encontrado');
            // Renderiza una página de error o un mensaje indicando que el usuario no fue encontrado
            res.status(404).send('Usuario no encontrado');
          }

        }else{
           console.log("Hay que ingresar primero");
           res.status(404).send("<h1>Error: Hay que ingresar primero en la página de login</h1><button onclick=window.location.href='http://localhost:3000/login'>Aceptar</button>");
        }
      
      }catch(error){
        console.error('Error al obtener usuario:', error);
        // Envia una respuesta de error interno del servidor en caso de error
        res.status(500).send('Error interno del servidor');
      }
    });
    app.get("/sesion-abierta",(req,res)=>{
      res.json({loginConfirmado : loginOk});
  })  

      app.post("/verificar-email",async(req,res)=>{
        email = req.body.email;
        const usuarios = await getUsuarios();
        const emailObtenido= [];
        for(let i=0;i<usuarios.length;i++){
          emailObtenido[i] = usuarios[i].email;
        }

        let existe = false;
        for(let i=0; i<emailObtenido.length; i++){
          if(emailObtenido[i] === email){
             existe = true;
          }
        }
        res.json({existe: existe});
        
      });

      app.post("/verificar-login",async(req,res) =>{
        const datos = req.body;
        const email = datos.email;
        const contrasena = datos.contrasena;

        const usuario = await getUsuario(email);
        
        const resultado = await bcryptjs.compare(contrasena,usuario.password);
        res.json({correcto : resultado}); 
        if(resultado){
          loginOk = true;
        }else{
          loginOk = false;
        }

      })

 

      app.post("/cierre",async(req,res)=>{
        console.log(req.body.mensaje);
        loginOk=false;
        email = "";
        res.json({cierre: true});
      })

      app.post("/favoritos",async(req,res)=>{
        const juegoID = req.body.juegoID;
        const estadoID = req.body.estadoID;
        const valoracion = req.body.valoracion;
        const comentario = req.body.comentario;

        const usuario = await getUsuario(email);

        if(loginOk){
          
          if(await insertFavorito(usuario.usuarioID,juegoID,estadoID,valoracion,comentario)){
              res.status(200).json({correcto: true});
          }else{
            res.status(406).json({correcto: false, mensaje: "No se pudo agregar"});
          }
      
        }else{
          res.status(404).json({correcto: false, mensaje: "No hay usuario logueado"});
        }
    })

      app.post("/registro",async(req,res)=>{
        try {
          const datos = req.body;
          const nombre = datos['campo-nombre'];
          const apellido = datos['campo-apellido'];
          const email = datos['campo-email'];
          let password = datos['campo-contrasena'];
          
          const emailregistrado = await getUsuarios();
          
          let existe = false;

          for(i=0;i<emailregistrado.length;i++){
            if(emailregistrado[i].email === email){
                existe = true;
                break;
            }else{
              existe = false;
            }
          }
          if(!existe){
            password = await bcryptjs.hash(password, 8);
            insertUsuario(nombre, apellido, email, password);
            setTimeout(() => {
              res.render("login",{existe:false}); // pasar datos a la plantilla  
            }, 3000);            
          }else{
            console.error("El usuario ya existe");
              res.render("registro",{existe:true});
          }     
        }catch (error) {
          console.error(error);
          res.render("registro", { message: "Hubo un error en el registro" });
        }
      })

      app.post("/login",async(req,res)=>{
       res.render("login");
      })
   
      //verifica que existe un orden y lo cambia en el cliente según la opción elegida por el usuario.
   app.put("/juegos",async(req,res)=>{
    const orden = req.body.orden;
    let existe;

    if(orden){
     existe = true;
    }else{
     existe = false;
    }
     res.json({existe: existe})
   });
   app.put("/perfil", async (req, res) => {
    try {
        const usuario = await getUsuario(email);

        if (!usuario) {
            return res.status(404).json({ correcto: false, mensaje: "Usuario no encontrado" });
        }

        const { juegoID, estadoID, valoracion, comentario } = req.body;
     
        const resultado = await actualizarFavoritos(usuario.usuarioID, juegoID, estadoID, valoracion, comentario);

        if (resultado) {
            res.status(200).json({ correcto: true });
        } else {
            res.status(500).json({ correcto: false, mensaje: "Error al actualizar favoritos" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ correcto: false, mensaje: "Error del servidor" });
    }
   });

  app.delete("/perfil",async(req,res)=>{
      const juegoID = req.body.juegoID;
      const usuario = await getUsuario(email);
      
      if(usuario && juegoID){
        await borrarFavorito(usuario.usuarioID,juegoID);
        res.status(200).json({correcto:true, mensaje: "Borrado con exito"});
      }else{
        res.status(404).json({correcto:false, mensaje: "No se encontró usuario o juego"});
      }
   })

}catch(error){
  console.log(error);
}
finally{
   app.listen(3000);
   console.log("Escuchando en puerto 3000");
};
  
}

loadData();
