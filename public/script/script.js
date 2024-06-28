document.addEventListener("DOMContentLoaded", ()=> {
    const etiqueta = document.getElementById("etiqueta");
    const orden = document.getElementById("ordenar");

    // Función para establecer la opción seleccionada y el texto del label según la URL actual
    function establecerEstadoInicial() {
        if(etiqueta !== null){
            if (window.location.href.includes('/juegos/?orden=juegoID')) {
                etiqueta.textContent = "Ordenado";
                orden.value = "id";
            } else if (window.location.href.includes('/juegos?orden=titulo')) {
                etiqueta.textContent = "Ordenado";
                orden.value = "nombre";
            } else {
                etiqueta.textContent = "Ordenar";
                orden.value = "id";
            }
        }
    }

    // Establecer el estado inicial al cargar la página
    establecerEstadoInicial();

    // Escuchar cambios en el select y actualizar el texto del label y redirigir
    if(orden !== null)  
    orden.addEventListener("change", ()=> {
 
        pasarDatos("/juegos",'PUT',JSON.stringify({orden : orden.value}),()=>{
            if(orden.value === "id"){
                console.log("orden por id");
                window.location.href="/juegos?orden=juegoID";
                orden.value = "juegoID";
            }else{
                console.log("orden por nombre");
                window.location.href="/juegos?orden=titulo";
                orden.value = "titulo";
                
            }
            etiqueta.textContent="ordenado";
            fetch(`/juegos?orden=${orden.value}`);
        },()=>{});
    });

    fetch(`/juegos?orden=juegoID`);

});
/*Controlando el comportamiento de cada boton "info" en la página para que redireccione a la pagina "/info"
  y asegurar que sea el juego correcto, obteniendo el ID*/
const juegos = document.getElementById("bloque-juegos");
if(juegos){
    const botonInfo = document.querySelectorAll("#btn-informacion");
    for(i=0; i<botonInfo.length;i++){
        botonInfo[i].addEventListener('click',e=>{
            console.log("mostrando información del juego");
            const juegoID = e.target.getAttribute("data-id");
            fetch(`/info/${juegoID}`);
            document.location.href = `/info/${juegoID}`;
        })
    }
}
const botonRegristro = document.getElementById("btn-registro");
const botonLogin = document.getElementById("btn-login");
const botonPerfil = document.getElementById("btn-perfil");

fetch("/sesion-abierta")
.then(response => response.json())
.then(data =>{
    if(data.loginConfirmado){
       botonRegristro.classList.add('btn-registro-oculto');
       botonLogin.classList.add('btn-login-oculto');
       if(botonPerfil.classList.contains('btn-perfil-oculto')){
         botonPerfil.classList.remove('btn-perfil-oculto');    
       }

    }else{
        if(botonRegristro.classList.contains('btn-registro-oculto')){
            botonRegristro.classList.remove('btn-registro-oculto');
        }
        if(botonLogin.classList.contains('btn-login-oculto')){
            botonLogin.classList.remove('btn-login-oculto');
        }
        botonPerfil.classList.add('btn-perfil-oculto');        
    }
})   
     
const botonFav = document.querySelectorAll("#btn-favorito");
const formularioFavorito = document.querySelectorAll(".formulario__favorito");
const botonCancelarFavorito = document.querySelectorAll(".btn-cancelar-favorito");

for(let i=0; i<botonFav.length;i++){
    
    botonFav[i].addEventListener('click',e=>{
        function OcultarFormularioFavorito(){
    
            if(formularioFavorito[i].classList.contains('formulario__favorito-activo')){
             
                formularioFavorito[i].classList.remove('formulario__favorito-activo');
                botonCancelarFavorito[i].classList.remove('btn-cancelar-favorito-activo');
            }
        }
        function mostrarFormularioFavorito(){
            formularioFavorito[i].classList.add('formulario__favorito-activo');
            botonCancelarFavorito[i].classList.add('btn-cancelar-favorito-activo');
        }
        fetch("/sesion-abierta")
        .then(response => response.json())
        .then(data =>{
            if(data.loginConfirmado){
                mostrarFormularioFavorito();
            }else{
                alert("Primero hay que ingresar en login");
            }
        })   
             
        botonCancelarFavorito[i].addEventListener('click',()=>{
            formularioFavorito[i].reset();
            OcultarFormularioFavorito();
        })
     
        const juegoID = e.target.getAttribute("data-id");

       
        formularioFavorito[i].addEventListener('submit',(e)=>{
            e.preventDefault();
            
            const estadoID = document.querySelectorAll(".estado-favorito");
            const valoracion = document.querySelectorAll(".valoracion-favorito");
            const comentario = document.querySelectorAll(".comentario-favorito");
            fetch("/favoritos",{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    juegoID: juegoID,
                    estadoID: estadoID[i].value,
                    valoracion: valoracion[i].value,
                    comentario: comentario[i].value
                })
            })
            .then(response => response.json())
            .then(data =>{
                if(data.correcto){
                    console.log("Agregado a favoritos");
                    alert("El juego fue agregado a favoritos");
                }else{
                    console.log(data.mensaje);
                    alert("El juego ya existe en favoritos");
                }
            })
            .finally(()=>{
                formularioFavorito[i].reset();                                
                OcultarFormularioFavorito();
            })
        })
        
        
    });
}


//redirección a la pagina de inicio.
function inicio(){
    window.location.href = "/juegos";
}
//redirección a la pagina de registro.
function registro(){
    window.location.href = "/registro";
}
//redirección a la pagina de login.
async function login(){
    window.location.href = "/login";
}
//redirección a la pagina de perfil.
function perfil(){
    window.location.href = "/perfil";
}

//controlando el comportamiento del boton cancelar en la página de registro.
const cancelar = document.getElementById("btn-cancelar");
if(cancelar !== null){
    cancelar.addEventListener("click",()=>{
    inicio();
    });
}
//////////////////////////////////////////////////////////////////////////////
//trabajando con el formulario, verificar y validar.

//Se obtiene el formulario y los input que contiene.
const formulario = document.getElementById("formulario");

if(formulario){
    const inputs = document.querySelectorAll('#formulario input'); 
    //expresiones para restringir los input.
    const expresiones = {
        usuario: /^[a-zA-Z0-9\_\-]{4,16}$/, // Letras, numeros, guion y guion_bajo
        nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
        apellido: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
        email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
        contrasena: /^.{4,12}$/, // 4 a 12 digitos.
    }

    const campos = {
        nombre: false,
        apellido:false,
        email: false,
        contrasena: false
    }


    const validarFormulario = (e) =>{
        
        switch(e.target.name){
            case 'campo-nombre':
                validarCampo(expresiones.nombre,e.target,'nombre');
            break;
            case 'campo-apellido':
                validarCampo(expresiones.apellido,e.target,'apellido');
            break;
            case 'campo-email':
                validarCampo(expresiones.email,e.target,'email');
                
            break;
            case 'campo-contrasena':
                validarCampo(expresiones.contrasena,e.target,'contrasena');
            break;
        }
    }

    /*Función para validar cada campo según las expresiones. Se cambian los iconos correspondientes 
    y estilo de input, según sea la expresión correcta o incorrecta, también se establecen los campos en 
    verdadero o falso según corresponda*/
    const validarCampo = (expresion,input,campo) =>{
        if(input.value!==""){
            if(expresion.test(input.value)){
                if(document.getElementById(`grupo__${campo}`).classList.contains('formulario__grupo-incorrecto')){
                    document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-incorrecto');
                }
                document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-correcto');
                if(document.getElementById(`grupo__${campo}`).classList.contains('fa-text-slash')){
                    document.querySelector(`#grupo__${campo} i`).classList.remove('fa-text-slash');
                }
                document.querySelector(`#grupo__${campo} i`).classList.add('fa-check');
                if(document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.contains('formulario__input-error-activo')){
                    document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.remove('formulario__input-error-activo');
                }
                campos[campo] = true;
            }else{
                document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-incorrecto');
                if(document.getElementById(`grupo__${campo}`).classList.contains('formulario__grupo-correcto')){
                    document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-correcto');
                }
                document.querySelector(`#grupo__${campo} i`).classList.add('fa-text-slash');
                if(document.querySelector(`#grupo__${campo} i`).classList.contains('fa-check')){
                    document.querySelector(`#grupo__${campo} i`).classList.remove('fa-check');
                }

                document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.add('formulario__input-error-activo')
                campos[campo] = false;
            }
        }else{
            if(document.getElementById(`grupo__${campo}`).classList.contains('formulario__grupo-incorrecto')){
                document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-incorrecto');
            }
            if(document.getElementById(`grupo__${campo}`).classList.contains('fa-text-slash')){
                document.querySelector(`#grupo__${campo} i`).classList.remove('fa-text-slash');
            }
            if(document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.contains('formulario__input-error-activo')){
                document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.remove('formulario__input-error-activo');
            }
            if(document.getElementById(`grupo__${campo}`).classList.contains('formulario__grupo-correcto')){
                document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-correcto');
            }
            if(document.querySelector(`#grupo__${campo} i`).classList.contains('fa-check')){
                document.querySelector(`#grupo__${campo} i`).classList.remove('fa-check');
            }
            
            campos[campo] = false;

        }

    }

    inputs.forEach((input)=>{
        input.addEventListener("keyup",validarFormulario); //se activa al soltar una tecla
        input.addEventListener("blur",validarFormulario); //se activa al salir del input
    })
    if(formulario !== null)
    formulario.addEventListener("submit",(e)=>{
        //Previene en caso de que se intenten enviar campos vacios.
        e.preventDefault();
        const valorEmail = document.getElementById('campo-email').value;
        fetch("/verificar-email",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email : valorEmail})
        })
        .then(response => response.json())
        .then(data => {
        if (!data.existe) {
            //Asegurarse de que los valores de todos los campos son válidos
            if(campos.nombre && campos.apellido && campos.email && campos.contrasena){    
        
             

                //Se elimina el mensaje de error y se agrega el mensaje de envio correcto.
                document.getElementById('formulario__mensaje').classList.remove('formulario__mensaje-activo');
                document.getElementById('formulario__mensaje-exito').classList.add('formulario__mensaje-exito-activo');
                
                //El tiempo que dura el mensaje de envío correcto, en pantalla.
                setTimeout(()=>{
                    document.getElementById('formulario__mensaje-exito').classList.remove('formulario__mensaje-exito-activo');
                },3000);

                //Se eliminan todos los iconos 
                document.querySelectorAll('.formulario__grupo-correcto').forEach((icono)=>{
                    icono.classList.remove('formulario__grupo-correcto');
                })             
               
                   setTimeout(()=>{
                    formulario.reset();
                },3000);


            
            }else{
                //en caso de no ser correctos todos los datos se agrega un mensaje de error.
                document.getElementById('formulario__mensaje').classList.add('formulario__mensaje-activo');
            }
        }else{
            alert("Ya existe un usuario registrado con ese E-mail");
        }
        });  
    });

}
//Controlando el login
const formularioLogin = document.getElementById("formulario__login");

if(formularioLogin){


    formularioLogin.addEventListener("submit",(e)=> {
        e.preventDefault();
        const email = document.getElementById("login-campo-email");
        const contrasena = document.getElementById("login-campo-contrasena");

        pasarDatos("/verificar-email",'POST',JSON.stringify({email: email.value}),()=>
            {
              console.log("El email existe")
              pasarDatos("/verificar-login",'POST',JSON.stringify({email: email.value, contrasena: contrasena.value}),
              ()=>
                {
                    console.log("Contraseña aceptada")                           
                    perfil();
                                    
                },()=>{
                   console.log("Contraseña inválida")
                  
                });
            },
            ()=>
            {
              console.log("el email no existe")
            });
    })
}   

function pasarDatos(ruta,metodo,jsonStringify,funcionTrue,funcionFalse){
    fetch(ruta,{
        method: metodo,
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonStringify
    })
    .then(response => response.json())
    .then(data => {
        if(data){
            funcionTrue();
        }else{
            funcionFalse();
        }
    });
}

function pasarDatosSiExiste(ruta,metodo,jsonStringify,funcionTrue,funcionFalse){
    fetch(ruta,{
        method: metodo,
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonStringify
    })
    .then(response => response.json())
    .then(existe => {
        if(existe){
            funcionTrue();
        }else{
            funcionFalse();
        }
    });
}

///////////////////Perfil////////////////////////////////

const btnCerrar = document.getElementById("btn-cs");
if(btnCerrar){
    btnCerrar.addEventListener('click',()=>{
        fetch("/cierre",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({mensaje: "Cierre de sesión"})
        })
        .then(response => response.json())
        .then(data =>{
            if(data.cierre){
    
                login();
            }
        })
        
    });
}

const botonEditar = document.querySelectorAll(".btn-editar-perfil");
const formularioEditar = document.querySelectorAll(".formulario__editar-perfil");
if(formularioEditar){
    const botonCancelarEditar = document.querySelectorAll(".btn-cancelar-perfil");
    const botonConfirmarEditar = document.querySelectorAll(".btn-confirmar-perfil");
    const botonEliminarEditar = document.querySelectorAll(".btn-eliminar-perfil");
    const inputEstado =  document.querySelectorAll(".formulario__estado-perfil");
    const inputValoracion =  document.querySelectorAll(".formulario__valoracion-perfil");
    const inputComentario =  document.querySelectorAll(".formulario__comentario-perfil");
    const etiquetaEstado = document.querySelectorAll(".formulario__etiqueta-estado");
    const etiquetaValoracion = document.querySelectorAll(".formulario__etiqueta-valoracion");
    const etiquetaComentario = document.querySelectorAll(".formulario__etiqueta-comentario");
    const estadoPerfil = document.querySelectorAll(".estado-perfil");
    const valoracionPerfil = document.querySelectorAll(".valoracion-perfil");
    const comentarioPerfil = document.querySelectorAll(".comentario-perfil");
    for(let i=0; i<botonEditar.length;i++){

        botonEliminarEditar[i].addEventListener('click',e=>{
            const juegoID = e.target.getAttribute('data-id');
            fetch("/perfil",{
                method: 'DELETE',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({juegoID: juegoID})
            })
            .then(response => response.json())
            .then(data=>{
                console.log(data.mensaje);
                if(data.correcto){
                    perfil();
                }
            })
        })

        botonEditar[i].addEventListener('click',e=>{
            function OcultarFormularioEditar(){
        
                if(inputEstado[i].classList.contains('formulario__estado-perfil-activo')){
                    inputEstado[i].classList.remove('formulario__estado-perfil-activo');
                }
                if(inputValoracion[i].classList.contains('formulario__valoracion-perfil-activo')){
                    inputValoracion[i].classList.remove('formulario__valoracion-perfil-activo');
                }
                if(inputComentario[i].classList.contains('formulario__comentario-perfil-activo')){
                    inputComentario[i].classList.remove('formulario__comentario-perfil-activo');
                }
                if(botonCancelarEditar[i].classList.contains('btn-cancelar-perfil-activo')){
                    botonCancelarEditar[i].classList.remove('btn-cancelar-perfil-activo');
                }
                if(etiquetaEstado[i].classList.contains('formulario__etiqueta-estado-activo')){
                    etiquetaEstado[i].classList.remove('formulario__etiqueta-estado-activo');
                }
                if(etiquetaValoracion[i].classList.contains('formulario__etiqueta-valoracion-activo')){
                    etiquetaValoracion[i].classList.remove('formulario__etiqueta-valoracion-activo');
                }
                if(etiquetaComentario[i].classList.contains('formulario__etiqueta-comentario-activo')){
                    etiquetaComentario[i].classList.remove('formulario__etiqueta-comentario-activo');
                }
                
                if(botonEliminarEditar[i].classList.contains('btn-eliminar-perfil-oculto')){
                    botonEliminarEditar[i].classList.remove('btn-eliminar-perfil-oculto');
                }
                if(botonEditar[i].classList.contains('btn-editar-perfil-oculto')){
                    botonEditar[i].classList.remove('btn-editar-perfil-oculto');
                }

                if(botonConfirmarEditar[i].classList.contains('btn-confirmar-perfil-activo')){
                    botonConfirmarEditar[i].classList.remove('btn-confirmar-perfil-activo');
                }

                if(estadoPerfil[i].classList.contains('estado-perfil-oculto')){
                    estadoPerfil[i].classList.remove('estado-perfil-oculto');
                }

                if(valoracionPerfil[i].classList.contains('valoracion-perfil-oculto')){
                    valoracionPerfil[i].classList.remove('valoracion-perfil-oculto');
                }

                if(comentarioPerfil[i].classList.contains('comentario-perfil-oculto')){
                    comentarioPerfil[i].classList.remove('comentario-perfil-oculto');
                }
            }

            function mostrarFormularioEditar(){
                inputEstado[i].classList.add('formulario__estado-perfil-activo');
                inputValoracion[i].classList.add('formulario__valoracion-perfil-activo');
                inputComentario[i].classList.add('formulario__comentario-perfil-activo');
                botonCancelarEditar[i].classList.add('btn-cancelar-perfil-activo');
                etiquetaEstado[i].classList.add('formulario__etiqueta-estado-activo');
                etiquetaValoracion[i].classList.add('formulario__etiqueta-valoracion-activo');
                etiquetaComentario[i].classList.add('formulario__etiqueta-comentario-activo');
                
                botonEditar[i].classList.add('btn-editar-perfil-oculto');
                botonEliminarEditar[i].classList.add('btn-eliminar-perfil-oculto');
                estadoPerfil[i].classList.add('estado-perfil-oculto');
                valoracionPerfil[i].classList.add('valoracion-perfil-oculto');
                comentarioPerfil[i].classList.add('comentario-perfil-oculto');
                botonConfirmarEditar[i].classList.add('btn-confirmar-perfil-activo');
            }
            fetch("/sesion-abierta")
            .then(response => response.json())
            .then(data =>{
                if(data.loginConfirmado){
                    mostrarFormularioEditar();
                }else{
                    alert("Primero hay que ingresar en login");
                }
            })   
                
            botonCancelarEditar[i].addEventListener('click',()=>{
                formularioEditar[i].reset();
                OcultarFormularioEditar();
            })
        
            const juegoID = e.target.getAttribute("data-id");
    
            formularioEditar[i].addEventListener('submit',e=>{
                e.preventDefault();
                
                fetch("/perfil",{
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        juegoID: juegoID,
                        estadoID: inputEstado[i].value,
                        valoracion: inputValoracion[i].value,
                        comentario: inputComentario[i].value
                    })
                })
                .then(response => response.json())
                .then(data =>{
                    if(data.correcto){
                        console.log("Agregado a favoritos");
                        alert('Actualizado con exito');
                    }else{
                        console.log(data.mensaje);
                    }
                })
              
                    botonConfirmarEditar[i].addEventListener("click",()=>{
                        formularioEditar[i].submit();                        
                        OcultarFormularioEditar();                        
                    },{once:true});
                
            })

          })
            
    }
   
}