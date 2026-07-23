# MyN Indumentaria — E-commerce

Tienda online de indumentaria. Catálogo de productos con talles y stock, carrito de compras y checkout vía WhatsApp (sin pasarela de pago). Incluye panel de administración para gestionar productos, imágenes, stock y pedidos.

> ⚠️ Este repositorio contiene una versión de referencia del proyecto.
> El desarrollo completo y actualizado se encuentra en un repositorio privado.

## Stack

- **Backend**: Node.js + Express + MySQL (mysql2)
- **Frontend**: React + Vite + React Router v7
- **Auth**: JWT
- **Otros**: node-cron (vencimiento automático de pedidos), sweetalert2

## Estructura del proyecto

```
.
├── backend/          # API REST (Node/Express + MySQL)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── jobs/          # cron jobs (ej: vencimiento de pedidos)
│   ├── scripts/       # scripts manuales (ej: crear admin)
│   └── index.js
└── frontend/          # SPA (React + Vite)
    ├── src/
    │   ├── componentes/
    │   ├── pages/
    │   ├── hooks/
    │   ├── context/
    │   └── routes/
    └── public/
        └── productos/  # imágenes de productos servidas como estáticos
```

## Requisitos previos

- Node.js 18 o superior
- MySQL 8 (o compatible)
- npm

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Nahuel-Dalesio/mynEcommerce.git
cd mynEcommerce
```

### 2. Base de datos

Crear una base de datos en MySQL e importar el schema (ver `/backend/database` o el archivo `.sql` correspondiente, si existe en el repo).

### 3. Backend

```bash
cd backend
npm install
```

Crear un archivo `.env` dentro de `backend/` con las siguientes variables:

```dotenv
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=
JWT_SECRET=
```

Levantar el servidor en modo desarrollo:

```bash
npm run dev
```

El backend queda escuchando en `http://localhost:3001` (o el puerto definido, si se agrega `PORT` al `.env`).

### 4. Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

El frontend queda disponible en `http://localhost:5173` (puerto por defecto de Vite).

### 5. Crear usuario administrador

El registro público (`/register`) siempre crea usuarios con rol `user`. Para crear un admin, correr manualmente:

```bash
cd backend
node scripts/create-admin.js
```

## Uso

- **Tienda pública**: `http://localhost:5173`
- **Login admin**: `http://localhost:5173/login`
- **Panel de productos**: `http://localhost:5173/admin/productos`
- **Panel de pedidos**: `http://localhost:5173/admin/pedidos`

### Carga de imágenes de productos

Las imágenes de productos deben subirse manualmente a `frontend/public/productos/`. Una vez ahí, quedan disponibles para elegir desde un selector en el panel admin al crear o editar un producto (no hace falta escribir el path a mano).

### Checkout

El checkout no usa pasarela de pago: al confirmar la compra se genera el pedido en la base y se abre WhatsApp Web con un mensaje prearmado (productos, talles, cantidades, total y datos de contacto) para coordinar el pago y la entrega directamente con el cliente.

### Automatizaciones de pedidos

- Pedidos en estado "pendiente" por más de 7 días sin acción se cancelan automáticamente.
- Pedidos "cancelados" por más de 2 meses se eliminan automáticamente de la base.

Ambas corridas las ejecuta un cron job interno del backend (no requiere configuración externa).

## Scripts disponibles

### Backend (`/backend`)
| Script | Descripción |
|---|---|
| `npm run dev` | Levanta el servidor con recarga automática (nodemon) |
| `npm start` | Levanta el servidor en modo producción |

### Frontend (`/frontend`)
| Script | Descripción |
|---|---|
| `npm run dev` | Levanta el servidor de desarrollo (Vite) |
| `npm run build` | Genera el build de producción |
| `npm run preview` | Sirve el build de producción localmente |

## Licencia

Proyecto privado / de uso interno.