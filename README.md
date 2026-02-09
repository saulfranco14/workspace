# Workspace de Desarrollo Frontend

Este proyecto está basado en [Next.js](https://nextjs.org) 

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

# Tests

Se trabajo en las pruebas unitarias del proyecto. Los tests están organizados de manera similar a la estructura del proyecto.

## Estructura

```
src/__tests__/
├── __mocks__/              # Mocks para dependencias externas
│   └── supabaseMock.ts     # Mock para Supabase
├── services/               # Tests para los servicios
│   ├── cart/               # Tests para servicios relacionados con el carrito
│   │   ├── cartService.test.ts
│   │   ├── cartDatabaseService.test.ts
│   │   └── cartItemsService.test.ts
│   ├── authService.test.ts
│   ├── loginService.test.ts
│   ├── deviceService.test.ts
│   ├── favoritesService.test.ts
│   └── productService.test.ts
└── README.md               # Esta documentación
```

## Servicios Probados

Se han implementado pruebas unitarias para los siguientes servicios:

- **Servicios de Autenticación**: `authService` y `loginService` para manejo de sesiones y operaciones de autenticación.
- **Servicios de Carrito**: `cartService`, `cartDatabaseService` y `cartItemsService` que manejan la lógica del carrito de compras.
- **Servicios de Productos**: `productService` para búsqueda y obtención de productos.
- **Servicios de Identificación**: `deviceService` para obtener fingerprints de dispositivos no autenticados.
- **Servicios de Favoritos**: `favoritesService` para gestionar colecciones de productos favoritos.

## Comandos para ejecutar tests

- Ejecutar todos los tests: `npm test`
- Ejecutar tests con cobertura: `npm run test:coverage`
- Ejecutar tests específicos: `npm test -- <patrón>` (ej: `npm test -- productService`)
- Modo watch (desarrollo): `npm run test:watch`

## Configuración

La configuración de Jest se encuentra en los archivos:
- `jest.config.js`: Configuración principal
- `jest.setup.js`: Configuración de ambiente para los tests

## Mocks

### Supabase Mock

Se ha creado un mock para Supabase que permite simular las respuestas de la base de datos. 
El mock se encuentra en `src/__tests__/__mocks__/supabaseMock.ts` y exporta varias funciones útiles como:

- `mockSupabase`: Objeto principal que reemplaza al cliente de Supabase
- `resetMocks`: Función para reiniciar todos los mocks entre tests
- `mockFrom`, `mockSelect`, etc.: Funciones individuales para controlar el comportamiento del mock


## Ejemplo de Test

```typescript
import { mockSupabase } from '../__mocks__/supabaseMock';

jest.mock('@/config/supabaseClient', () => ({
  supabase: mockSupabase
}));

import { miFunction } from '@/path/to/service';

describe('Mi Servicio', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe hacer algo específico', async () => {
    // Arrange (preparar)
    const mockData = {...};
    
    // Act (actuar)
    const result = await miFunction();
    
    // Assert (verificar)
    expect(result).toEqual(mockData);
  });
});
``` 

## Más Información

Para más detalles sobre Next.js:

- [Documentación de Next.js](https://nextjs.org/docs)
- [Tutorial interactivo de Next.js](https://nextjs.org/learn)

## Despliegue

La aplicación está configurada para desplegarse fácilmente en [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Para más información sobre despliegue, consulta la [documentación de despliegue de Next.js](https://nextjs.org/docs/app/building-your-application/deploying).
