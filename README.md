# Prueba Infile

Aplicación móvil desarrollada con **Ionic React** como parte de una prueba técnica, enfocada en implementar distintos métodos de autenticación utilizando una arquitectura desacoplada entre frontend y backend.

## Características

- Inicio de sesión con correo y contraseña.
- Registro de usuarios.
- Activación de cuenta mediante código enviado por correo electrónico.
- Recuperación de contraseña.
- Inicio de sesión con Google.
- Inicio de sesión mediante autenticación biométrica.
- Persistencia de sesión.
- Consumo de API mediante JWT.
- Listado de noticias.
- Adición de noticias a favoritos.
- Noticias relacionadas.

---

## Tecnologías

### Frontend

- Ionic React
- React
- TypeScript
- Capacitor
- Ky para las peticiones a backend
- Zustand para persistencia de datos
- Motion para animaciones
- @capgo/capacitor-social-login para autenticación con google
- @aparajita/capacitor-biometric-auth para el login biométrico

### Backend

- Fastify
- PostgreSQL
- JWT

---

## Arquitectura

```
Ionic App
    │
    ├── Ky
    │
    ▼
Fastify API
    │
    ├── JWT
    ├── PostgreSQL
    └── Google Auth
```

---

## Métodos de autenticación

### Correo y contraseña

- Registro de usuario.
- Activación mediante código enviado por correo.
- Inicio de sesión utilizando JWT.

### Google

El usuario inicia sesión utilizando su cuenta de Google.

El frontend obtiene los datos del usuario, los cuales son enviados al backend para su validación. Posteriormente se genera un JWT propio de la aplicación.

### Biometría

Una vez iniciada la sesión, el usuario puede habilitar el acceso mediante autenticación biométrica del dispositivo.

---

## Instalación

### Instalar dependencias

```bash
npm install
```
---

## Ejecutar la aplicación

### Web

```bash
ionic serve
```

### Android

```bash
ionic build
npx cap sync android
npx cap run android
```

---

## Backend

Ejecutar el servidor Fastify.

```bash
npm run dev
```

---

## Estructura del proyecto

```
src/
│
├── _utils/
├── api/
├── components/
├── pages/
├── services/
├── store/
└── theme/
```

---

## Flujo de autenticación

```
Usuario
    │
    ▼
Login
    │
    ▼
Fastify
    │
    ▼
JWT
    │
    ▼
Aplicación
```

---

## Decisiones técnicas
- PostgreSQL se ejecuta por medio de docker por temas de facilidad en mi máquina personal (se adjunta el docker-compose), pero se puede solo crear la base de datos sin necesidad de docker.
- Se utilizó JWT para desacoplar el proceso de autenticación del frontend.
- Se implementó Zustand para el manejo del estado global y persistencia de la sesión.
- Se utilizó Ky como cliente HTTP por su simplicidad y soporte para interceptores.
- Se integró autenticación biométrica mediante el plugin `@aparajita/capacitor-biometric-auth`.
- El inicio de sesión con Google fue recortado por temas de tiempo, ya que no se integró la validación del id_token en backend.

---

## Autor

Luis Girón