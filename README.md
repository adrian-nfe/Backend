# Proyecto 1 - Backend

## Descripción

API REST con **Node.js**, **Express**, **MongoDB Atlas** y **Cloudinary** para gestionar usuarios con roles y libros favoritos.

## Tecnologías

- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT + bcryptjs
- Cloudinary + Multer

## Instalación

```bash
git clone https://github.com/adrian-nfe/Backend.git
cd backend
pnpm install
```

Crea un `.env` en la raíz:

```env
PORT=3000
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/backend_project
JWT_SECRET=una_clave

CLOUDINARY_CLOUD_NAME=cloud_name
CLOUDINARY_API_KEY=api_key
CLOUDINARY_API_SECRET=api_secret
```

Inicia el servidor:

```bash
npm start
```

## Endpoints

### Users

| Método | Endpoint | Auth | Rol | Descripción |
|---|---|---|---|---|
| POST | `/users/register` | No | - | Crear usuario (multipart: name, email, password, image) |
| POST | `/users/login` | No | - | Iniciar sesión |
| GET | `/users` | Sí | - | Listar usuarios |
| GET | `/users/:id` | Sí | - | Obtener usuario |
| PUT | `/users/:id` | Sí | Propio/Admin | Actualizar usuario (multipart: name, email, image opcional) |
| DELETE | `/users/:id` | Sí | Propio/Admin | Eliminar usuario |
| PATCH | `/users/:id/role` | Sí | Admin | Cambiar rol |
| POST | `/users/me/favorites` | Sí | - | Añadir libro favorito |
| DELETE | `/users/me/favorites/:bookId` | Sí | - | Eliminar libro favorito |

### Books

| Método | Endpoint | Auth | Rol | Descripción |
|---|---|---|---|---|
| GET | `/books` | No | - | Listar libros |
| GET | `/books/:id` | No | - | Obtener libro |
| POST | `/books` | Sí | Admin | Crear libro |
| PUT | `/books/:id` | Sí | Admin | Actualizar libro |
| DELETE | `/books/:id` | Sí | Admin | Eliminar libro |

## Roles

- **user**: gestiona su cuenta y sus favoritos. No puede cambiar roles ni eliminar otras cuentas.
- **admin**: todo lo anterior + cambiar roles, actualizar o eliminar a cualquier usuario y gestionar libros.

El primer admin se crea manualmente en MongoDB Atlas y cambiando `role: "admin"`.

## Seeder

```bash
npm run seed
```

Carga la colección de libros iniciales de `books`.

## Cloudinary

Se usa **Cloudinary** para almacenar la imagen de cada usuario.

**Características:**
- Imagen obligatoria al registrar usuario.
- Se elimina automáticamente al borrar la cuenta.
- Al actualizar la imagen de un usuario se elimina la anterior.
- Si el registro o la actualización fallan, la imagen subida se elimina.

## Pruebas en Postman

Capturas de los tests realizados en Postman:

![postman image1](images/image.png)
![postman image2](images/image2.png)
![postman image3](images/image3.png)
![postman image4](images/image4.png)
![postman image5](images/image5.png)
![postman image6](images/image6.png)