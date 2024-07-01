# Proyecto Challenge 1

Este repositorio contiene el código desarrollado para una aplicación web de listado y detalle de personajes utilizando Angular y la API de Marvel.

## Ejecutar la Aplicación

Para ejecutar la aplicación en tu entorno local, sigue estos pasos:

1. **Clona el Repositorio:**
   ```
   git clone <URL-del-repositorio>
   ```

2. **Instala las Dependencias:**
   ```
   npm install
   ```

3. **Configura la API de Marvel:**
   - Obtén tus claves de API de Marvel desde [Marvel Developer Portal](https://developer.marvel.com).
   - Crea un archivo `src/environments/environment.ts` y añade tus claves:
     ```typescript
     export const environment = {
       production: false,
       marvelApiKey: 'your_public_key',
       marvelApiSecret: 'hash'
     };
     ```

4. **Inicia la Aplicación:**
   ```
   ng serve -o
   ```

La aplicación estará disponible en `http://localhost:4200`.

## Arquitectura y Estructura

La aplicación está desarrollada en Angular y sigue una estructura modular y componentizada.

```
src/
│
├── app/
│   ├── components/       # Componentes reutilizables
│   │   ├── card/
│   │   ├── heart/
│   │   └── search/
│   │
│   ├── pages/            # Páginas principales de la aplicación
│   │   ├── hero/
│   │   ├── favorites/
│   │   └── hero-details/
│   │
│   ├── services/         # Servicios para interactuar con la API de Marvel
│   │   ├── marvel.service.ts
│   │   └── favorite.service.ts
│   │
│   ├── heroes-routing.module.ts           #rutas 
│   ├── heroes.module.ts            
│        
│   
│
└── environments/
    ├── environment.ts    # Configuración de entorno (desarrollo)
    └── environment.prod.ts   # Configuración de entorno (producción)
```

## Información del Proyecto

Este proyecto consiste en una interfaz web responsive desarrollada con Angular que permite listar y ver detalles de personajes del universo Marvel. Incluye las siguientes características:

- **Vista Principal:**
  - Listado de hasta 50 personajes o resultados de búsqueda.
  - Búsqueda por nombre de personaje.
  - Funcionalidad para agregar personajes a favoritos y visualizar favoritos.
  - Persistencia de favoritos entre sesiones.

- **Detalle de Personaje:**
  - Información detallada del personaje incluyendo cómics en los que aparece.
  - Visualización de hasta 20 cómics por personaje.
