# Usa la imagen de Node.js como base
FROM node:18-alpine

# Instala dependencias necesarias para Next.js y sharp
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev nano

# Define el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencias
COPY package.json package-lock.json ./

# Instala las dependencias
RUN npm install --legacy-peer-deps

# Copia el código de la aplicación
COPY . .

# Construye la aplicación Next.js en modo producción
RUN npm run build

# Expone el puerto de Next.js
EXPOSE 3006

# Comando para iniciar la aplicación
CMD ["npm", "run", "start"]