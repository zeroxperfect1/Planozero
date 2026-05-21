# Especificación Técnica: PlanoZero CMS (PlanoZero Edition)

Este documento detalla la arquitectura para transformar el dashboard actual en un Sistema de Gestión de Contenidos (CMS) modular, escalable y dinámico.

## 1. Arquitectura de Micro-módulos (Hybrid Headless)

Para emular la potencia de PlanoZero, implementaremos una separación clara entre las responsabilidades del sistema:

*   **Content Management (CMS Core):** Un backend (Firebase Cloud Functions + Firestore) encargado de la gobernanza, versionado, flujos de aprobación y autenticación RBAC.
*   **Content Delivery API:** Una capa de servicios optimizada para lectura que sirve contenido "puro" en formato JSON a través de una API REST o GraphQL.
*   **Frontend Modular (Vite + React):** Un cliente que actúa como "Head" (cabezal) pero con la capacidad de inyectar scripts de edición en tiempo real (Hybrid mode).

### Diagrama de Flujo
`Admin UI -> CMS API -> Firestore (Source of Truth) -> CDN Cache -> Client App`

---

## 2. Sistema de Widgets (Drag-and-Drop)

El motor de diseño se basa en una cuadrícula (grid) abstracta. Cada componente visual es un **Widget**.

### Lógica del Motor
1.  **El Registro de Componentes:** Un diccionario de React Components mapeados a identificadores únicos (e.g., `BANNER_HERO`, `CONTACT_FORM`).
2.  **El Canvas de Edición:** Un contenedor que implementa `dnd-kit` o `react-beautiful-dnd` para permitir el reordenamiento.
3.  **Persistencia:** La posición y las propiedades (props) de cada widget se guardan en un objeto JSON.

### Estructura del JSON (Page Definition)
```json
{
  "id": "dashboard-home",
  "metadata": {
    "title": "Home",
    "slug": "inicio"
  },
  "sections": [
    {
      "id": "section_1",
      "layout": "grid-12",
      "widgets": [
        {
          "id": "w_001",
          "type": "HeroWidget",
          "column": 12,
          "props": {
            "title": "Optimiza tu presencia digital",
            "cta": "Empezar ahora"
          }
        },
        {
          "id": "w_002",
          "type": "ChartWidget",
          "column": 6,
          "props": {
            "dataSource": "analytics_contacts",
            "type": "bar"
          }
        }
      ]
    }
  ]
}
```

---

## 3. Jerarquía de Contenido: Tipos de Contenido Dinámicos

La "magia" de PlanoZero reside en crear módulos sin escribir código. Esto se logra mediante el **Dynamic Content Mapper**.

### Implementación Firestore
En lugar de colecciones con esquemas fijos, usaremos una estructura de metadatos:

1.  **Colección `contentTypes`:** Define la estructura.
    *   `name`: "Inmuebles"
    *   `fields`: `[{name: 'Precio', type: 'number'}, {name: 'Fotos', type: 'array'}]`
2.  **Colección `dynamicContent`:** Almacena los datos reales referenciando al tipo.
    *   `typeId`: "inmuebles_ref"
    *   `data`: `{ "Precio": 50000, "Fotos": [...] }`

### Ventajas
*   **Zero-Deployment:** Puedes añadir campos de "Fecha" o "Referencia a otro post" desde el UI y el backend los validará automáticamente usando el blueprint dinámico.
*   **SEO Automático:** El slug se genera basándose en el campo marcado como "Title" en la configuración dinámica.

---

## 4. Arquitectura de Páginas: Motor Recursivo PlanoZero-Style

Para lograr una flexibilidad total, el CMS no trata la página como una lista plana, sino como un **árbol de componentes anidados**.

### 1. Esquema del Árbol JSON
La página se define por un objeto `root` que es una `Zone` (un contenedor de hilos).

```json
{
  "title": "Página de Inicio",
  "root": {
    "id": "root_zone",
    "children": [
      {
        "id": "grid_01",
        "type": "GridWidget",
        "props": {
          "columns": [ "md:grid-cols-8", "md:grid-cols-4" ],
          "gap": "gap-8"
        },
        "zones": [
          { "id": "col_1", "children": [ { "type": "TextWidget", "props": { "text": "Hola" } } ] },
          { "id": "col_2", "children": [ { "type": "ImageWidget", "props": { "src": "..." } } ] }
        ]
      }
    ]
  }
}
```

### 2. Motor de Renderizado (React Logic)

Implementamos un componente `<Zone />` que actúa como el despachador central.

```tsx
const Zone = ({ children }) => (
  <div className="cms-zone">
    {children.map(node => (
      <DynamicComponent key={node.id} node={node} />
    ))}
  </div>
);

const DynamicComponent = ({ node }) => {
  const Component = Registry[node.type];
  if (node.type === 'GridWidget') {
    return <GridComponent node={node} />;
  }
  return <Component {...node.props} />;
};
```

### 3. GridComponent (Recursividad)
El Grid toma sus `zones` definidas y vuelve a llamar al componente `Zone` para cada columna.

```tsx
const GridComponent = ({ node }) => {
  return (
    <div className={`grid ${node.props.columns.join(' ')} ${node.props.gap}`}>
      {node.zones.map(zone => (
        <Zone key={zone.id} children={zone.children} />
      ))}
    </div>
  );
};
```

---

## 5. Gestión de Estado: Inmutable Tree Walker

Para el panel de administración, recomendamos **Zustand** o un patrón de **Reducer Inmutable**. Las operaciones sobre el árbol (moverse, borrar, añadir) se realizan mediante un "Deep Walker":

1.  **Añadir:** `targetZoneId -> parent.children.push(newNode)`
2.  **Mover:** `swapIndexes(parent.children, i, j)`
3.  **Propiedades:** `findNodeById(tree, id).props = newProps`

---

## 6. UX: Panel de Configuración de Alto Contraste

El diseñador de Grid debe permitir al usuario elegir proporciones visuales (ej: 1/2 + 1/2, 1/3 + 2/3) que se mapean directamente a clases de Tailwind:
*   **Proporción 1/2:** `md:grid-cols-6`
*   **Proporción 2/3:** `md:grid-cols-8`

Este enfoque elimina la necesidad de que el editor sepa CSS, manteniendo la consistencia de diseño definida por el arquitecto.
