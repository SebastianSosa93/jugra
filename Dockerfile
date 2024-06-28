# Un archivo docker (dockerfile) comienza siempre importanto la imagen base. 
# Utilizamos la palabra clave 'FROM' para hacerlo.
# En nuestro ejemplo, queremos importar la imagen de NODE
# Así que escribimos 'node' para el nombre de la imagen y 'latest' para la versión.
FROM node

# Para lanzar nuestro código node, debemos importarlo a nuestra imagen.
# Utilizamos la palabra clave WORKDIR para crear el directorio "app".
# Dentro de esta carpeta irán los artefactos de la aplicación
WORKDIR /app

# Utilizamos la palabra clave 'COPY' para importar el codigo.
# El primer parámetro '.' indica TODO el contenido de la carpeta donde estamos parados
# El segundo parámetro '.' es la ruta donde poner los archivos en la imagen.(app) 
COPY . .

# Utilizamos el comando RUN para Instalar las dependencias de nuestro proyecto
# Esto se ejecuta al construir la imagen 
RUN npm install


# Utilizamos el comando EXPOSE  para exponer el puerto 3000  del contenedor que es donde se estaria levantando nuestra aplicacion
# Levanta en el puerto 3000
EXPOSE 3000

# Utilizaremos el comando CMD para ejecutar dentro del contendor y fijar la app a levantar (Facilmente sobreescribible)
CMD ["node", "index.js"]

# Opcionalmente existe el comando  ENTRYPOINT para ejecutar dentro del contendor el servidor NODE
# ENTRYPOINT ["node"]