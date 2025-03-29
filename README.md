# Workspace de Desarrollo Frontend

Este proyecto está basado en [Next.js](https://nextjs.org) e inicializado con [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Objetivo General

Desarrollar una aplicación web que permite a usuarios autenticarse, visualizar y filtrar productos, gestionar un carrito de compras y administrar favoritos mediante funcionalidad de arrastrar y soltar, utilizando tecnologías modernas de desarrollo web.

## Características Principales

- **Autenticación de usuarios**: Sistema de login completo
- **Catálogo de productos**: Visualización y filtrado por categoría o nombre
- **Carrito de compras**: Agregar productos y gestionar cantidades
- **Lista de favoritos**: Funcionalidad drag-and-drop para agregar/eliminar productos
- **Persistencia de datos**: Los favoritos se mantienen entre sesiones

## Stack Tecnológico

- **Next.js**: Framework React para renderizado del lado del servidor
- **TypeScript**: Tipado estático para mayor robustez del código
- **Redux**: Manejo de estado global de la aplicación
- **Styled Components**: Estilizado de componentes
- **ESLint**: Configuración personalizada para mantener calidad de código
- **Testing**: Pruebas unitarias y de integración (cobertura >50%)

## Decisiones de Diseño

- Arquitectura basada en componentes reutilizables
- Separación clara entre lógica de negocio y presentación
- Validaciones avanzadas en formularios (nombres únicos, confirmaciones para eliminación)
- Persistencia de favoritos específicos por usuario
- Experiencia de usuario fluida con transiciones y feedback visual

## Primeros Pasos

Para ejecutar el proyecto localmente:

```bash
# Clonar el repositorio
git clone https://github.com/saulfranco14/workspace.git
cd workspace

# Instalar dependencias
npm install
# o
yarn install

# Ejecutar en modo desarrollo
npm run dev
# o
yarn dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## Estructura del Proyecto

# Proyecto Next.js

## Estructura del Proyecto
```
workspace/
├── app/ # Directorio principal de Next.js
│ ├── api/ # Endpoints de API
│ ├── components/ # Componentes reutilizables
│ ├── features/ # Características principales (auth, productos, carrito, favoritos)
│ ├── hooks/ # Custom hooks
│ ├── store/ # Configuración de Redux
│ ├── styles/ # Estilos globales
│ ├── types/ # Definiciones de TypeScript
│ ├── utils/ # Utilidades y helpers
│ └── page.tsx # Página principal
├── public/ # Archivos estáticos
├── tests/ # Pruebas unitarias y de integración
├── .eslintrc.js # Configuración personalizada de ESLint
├── tsconfig.json # Configuración de TypeScript
└── README.md # Documentación del proyecto
```

## Más Información

Para más detalles sobre Next.js:

- [Documentación de Next.js](https://nextjs.org/docs)
- [Tutorial interactivo de Next.js](https://nextjs.org/learn)

## Despliegue

La aplicación está configurada para desplegarse fácilmente en [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Para más información sobre despliegue, consulta la [documentación de despliegue de Next.js](https://nextjs.org/docs/app/building-your-application/deploying).