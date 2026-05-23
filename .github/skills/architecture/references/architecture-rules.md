---
name: architecture
description: >
  Aplica las reglas de arquitectura del repositorio para proyectos TanStack.
  Usá esta skill cuando vayas a crear archivos nuevos, agregar features, 
  refactorizar código existente, o cuando necesites decidir dónde vive un 
  nuevo componente, hook, tipo o función. También aplica cuando haya dudas 
  sobre estructura de carpetas, naming, o imports.
tools:
  - readFile
  - search/codebase
  - runInTerminal
---

# Arquitectura del Repositorio

## Stack

- **Framework UI**: React con TanStack Router (file-based routing)
- **Data fetching**: TanStack Query
- **Estado global**: Zustand
- **Estilos**: Tailwind CSS — mobile first, targets: mobile y desktop (`lg:`)
- **Lenguaje**: TypeScript estricto
- **Prohibido**: JavaScript, el tipo `any`, imports circulares, `useState` para estado global

---

## Estructura de Carpetas

El proyecto usa **feature-based con routing separado** (Opción A).
Las rutas son thin wrappers. Toda la lógica vive en la feature correspondiente.

```
src/
├── features/                        # dominios de negocio
│   ├── plans/                       # ejemplo: feature "planes"
│   │   ├── components/
│   │   │   ├── plan-detail.tsx
│   │   │   └── plan-list.tsx
│   │   ├── hooks/
│   │   │   └── use-plan.ts
│   │   ├── api/
│   │   │   └── plans.api.ts
│   │   ├── stores/
│   │   │   └── plan-filters.store.ts
│   │   ├── types/
│   │   │   └── plan.types.ts
│   │   └── index.ts                 # barrel — único punto de salida
│   │
│   └── surveys/                     # otra feature
│       ├── components/
│       ├── hooks/
│       ├── api/
│       ├── stores/
│       ├── types/
│       └── index.ts
│
├── shared/                          # código genuinamente reutilizable
│   ├── components/                  # UI sin lógica de negocio
│   │   ├── button/
│   │   │   ├── button.tsx
│   │   │   └── button.test.tsx
│   │   └── data-table/
│   ├── hooks/
│   │   ├── use-debounce.ts
│   │   └── use-local-storage.ts
│   ├── types/
│   │   ├── api.types.ts             # respuestas HTTP base
│   │   └── pagination.types.ts
│   ├── stores/                         # stores globales (auth, sesión)
│   │   └── auth.store.ts
│   └── utils/
│       ├── format-date.ts
│       └── format-percentage.ts
│
├── lib/                             # configuración técnica pura
│   ├── query-client.ts
│   ├── axios.ts
│   └── router.tsx
│
├── routes/                          # SOLO definición de rutas
│   ├── __root.tsx                   # layout global + error boundary
│   ├── index.tsx                    # /
│   └── plans/
│       ├── index.tsx                # /plans
│       └── $planId/
│           └── index.tsx            # /plans/25
│
└── app/
    ├── providers.tsx
    └── main.tsx
```

---

## Regla de Rutas

Las rutas son **thin wrappers**: solo importan y renderizan desde la feature.
No contienen lógica, no definen tipos, no hacen fetching directo.

```tsx
// ✅ routes/plans/$planId/index.tsx — correcto
import { createFileRoute } from '@tanstack/react-router'
import { PlanDetail } from '@/features/plans'

export const Route = createFileRoute('/plans/$planId')({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(
    planQueryOptions(params.planId)
  ),
  component: PlanDetail,
})

// ❌ incorrecto — lógica de negocio en la ruta
export const Route = createFileRoute('/plans/$planId')({
  component: () => {
    const { planId } = Route.useParams()
    const { data } = useQuery({ queryKey: ['plan', planId], queryFn: ... })
    return <div>{data?.name}</div>   // esto va en la feature, no acá
  },
})
```

---

## Regla de Barrel Exports

Cada feature expone solo lo necesario a través de `index.ts`.
Nada se importa directamente desde adentro de una feature si sos externo a ella.

```ts
// ✅ features/plans/index.ts
export { PlanDetail } from './components/plan-detail'
export { PlanList } from './components/plan-list'
export { usePlan } from './hooks/use-plan'
export { planQueryOptions } from './api/plans.api'
export type { Plan, PlanStatus } from './types/plan.types'
// solo exporta lo que otras partes del sistema necesitan

// ✅ importar desde otra feature o desde routes/
import { PlanDetail } from '@/features/plans'

// ❌ import interno directo — prohibido desde fuera de la feature
import { PlanDetail } from '@/features/plans/components/plan-detail'
```

---

## Regla de Dependencias entre Capas

```
routes/      → features/    ✅
routes/      → shared/      ✅
features/    → shared/      ✅
features/    → lib/         ✅
features/    → features/    ❌  nunca directo — si hace falta, subir a shared/
shared/      → features/    ❌  jamás
shared/      → shared/      ✅  solo entre subcarpetas del mismo nivel
lib/         → nada interno ✅  solo dependencias externas
```

---

## Regla de las 3 Instancias

Decide dónde vive el código según cuántas features lo usan:

```
1 feature usa algo     → vive dentro de esa feature
2 features usan algo   → duplicá (por ahora), no abstraer todavía
3+ features usan algo  → mover a shared/
```

La duplicación intencional en 2 features es preferible a una abstracción prematura.

---

## Naming Conventions

**camelCase es la convención base** para todo identificador en el código: variables, funciones, parámetros, props, y keys de objetos. Las únicas excepciones son componentes y tipos (PascalCase) y constantes globales (UPPER_SNAKE_CASE).

```ts
// ✅ camelCase — variables, funciones, props, parámetros
const planId = '123'
const isLoading = true
function fetchPlanById(planId: string) {}
<PlanDetail planId={planId} isLoading={isLoading} />

// ❌ prohibido
const plan_id = '123'        // snake_case
const IsLoading = true       // PascalCase para variables
const PLAN_ID = '123'        // UPPER_SNAKE_CASE para variables mutables
```

### Archivos

```
plan-detail.tsx              # componentes: kebab-case
use-plan.ts                  # hooks: kebab-case con prefijo "use-"
plans.api.ts                 # api: sufijo ".api"
plan.types.ts                # tipos: sufijo ".types"
format-date.ts               # utils: kebab-case, verbo primero
plan-detail.test.tsx         # tests: mismo nombre + ".test"
```

### Código

```ts
// Componentes: PascalCase
export function PlanDetail() {}

// Hooks: camelCase con prefijo "use"
export function usePlan(planId: string) {}

// Tipos e interfaces: PascalCase
export interface Plan {}
export type PlanStatus = 'active' | 'draft'

// Funciones: camelCase, verbo primero
export function fetchPlanById(id: string) {}
export function formatPlanDate(date: Date) {}

// Constantes: UPPER_SNAKE_CASE
export const MAX_PLANS_PER_PAGE = 20
export const PLAN_STATUS = { ACTIVE: 'active', DRAFT: 'draft' } as const
```

---

## TypeScript

- `any` está **prohibido** — usá `unknown` y narrowing explícito
- Siempre tipos explícitos en parámetros de función y retornos públicos
- Preferir `type` sobre `interface` salvo para contratos extensibles
- Los tipos de respuesta de API se definen en `feature/api/` y se exportan por `index.ts`
- Nunca `as Type` para castear — si hace falta, algo está mal en el diseño

```ts
// ✅ correcto
export type Plan = {
  id: string
  name: string
  status: PlanStatus
}

export async function fetchPlan(id: string): Promise<Plan> {
  const response = await api.get(`/plans/${id}`)
  return response.data
}

// ❌ prohibido
const plan = response.data as any
const plan = response.data as Plan   // casting sin validación
```

---

## TDD — Test Driven Development

Todo cambio que introduce funcionalidad nueva sigue este orden sin excepción:

```
1. Escribir el test que falla (red)
2. Escribir el mínimo código para que pase (green)
3. Refactorizar sin romper el test (refactor)
```

- Los tests viven junto al código que testean: `plan-detail.test.tsx` al lado de `plan-detail.tsx`
- Formato de descripción: `given [contexto] when [acción] then [resultado esperado]`
- Un cambio = una feature mínima = un conjunto de tests cohesivo

### data-testid

Los elementos del DOM relevantes para los tests deben tener `data-testid`.
Nunca seleccionar por clase, tag HTML, o texto visible — son frágiles y cambian con estilos e i18n.

```tsx
// ✅ correcto — elementos relevantes con data-testid
export function PlanList() {
  return (
    <ul data-testid="plan-list">
      {plans.map(plan => (
        <li key={plan.id} data-testid={`plan-item-${plan.id}`}>
          <button data-testid={`plan-select-${plan.id}`}>
            {plan.name}
          </button>
        </li>
      ))}
    </ul>
  )
}

// ✅ en el test — seleccionar por testid
expect(screen.getByTestId('plan-list')).toBeInTheDocument()
expect(screen.getByTestId('plan-item-123')).toBeVisible()
userEvent.click(screen.getByTestId('plan-select-123'))

// ❌ prohibido — selección frágil
screen.getByText('Ver plan')          // cambia con i18n
screen.getByClassName('plan-item')    // cambia con refactor de estilos
document.querySelector('.plan-list')  // imperativo, fuera de testing-library
```

**Qué elementos llevan `data-testid`:**

- Listas y contenedores de datos
- Botones de acción (submit, delete, confirm)
- Formularios y sus campos relevantes
- Estados de UI (loading, error, empty state)
- Elementos que el test necesita verificar o interactuar

```ts
// ✅ ejemplo de test bien escrito
describe('usePlan', () => {
  it('given a valid planId when fetching then returns plan data', async () => {
    const { result } = renderHook(() => usePlan('plan-123'))
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual({ id: 'plan-123', name: 'Plan ejemplo' })
  })

  it('given an invalid planId when fetching then returns error state', async () => {
    const { result } = renderHook(() => usePlan('inexistente'))
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
```

---

## Gestión de Estado

**Zustand es el único sistema de estado global permitido.** No usar Context API ni Redux para estado global. `useState` solo para estado local del componente (UI state: toggles, inputs no controlados, animaciones).

**Cuándo usar cada uno:**

```
useState    → estado local de UI (modal abierto, tab activa, valor de input)
Zustand     → estado global de negocio (usuario autenticado, carrito, filtros globales)
TanStack Query → estado del servidor (datos fetcheados, cache, sincronización)
```

**Estructura de un store:**

Cada store vive en la feature que lo posee, o en `shared/` si es global:

```
features/
└── surveys/
    └── stores/
        └── survey-filters.store.ts   # estado de filtros de surveys

shared/
└── stores/
    └── auth.store.ts                 # estado de autenticación global
```

**Cómo definir un store:**

```ts
// ✅ correcto — features/surveys/stores/survey-filters.store.ts
import { create } from 'zustand'

type SurveyFiltersState = {
  status: 'all' | 'active' | 'draft'
  search: string
}

type SurveyFiltersActions = {
  setStatus: (status: SurveyFiltersState['status']) => void
  setSearch: (search: string) => void
  reset: () => void
}

const initialState: SurveyFiltersState = {
  status: 'all',
  search: '',
}

export const useSurveyFiltersStore = create<SurveyFiltersState & SurveyFiltersActions>()(
  (set) => ({
    ...initialState,
    setStatus: (status) => set({ status }),
    setSearch: (search) => set({ search }),
    reset: () => set(initialState),
  })
)
```

**Reglas de stores:**

- Separar tipos de estado (`State`) y acciones (`Actions`) siempre
- Siempre tipar el store completamente — nunca inferir el tipo del `create`
- El estado inicial en una constante separada para poder hacer `reset` limpio
- Un store por dominio — no un store global con todo
- Nunca mutar el estado directamente — siempre usar `set`
- Los stores se consumen desde hooks, no directamente desde componentes

```ts
// ✅ correcto — consumir desde un hook
// features/surveys/hooks/use-survey-filters.ts
export function useSurveyFilters() {
  const { status, search, setStatus, setSearch, reset } = useSurveyFiltersStore()
  return { status, search, setStatus, setSearch, reset }
}

// ✅ en el componente — solo el hook
const { status, setStatus } = useSurveyFilters()

// ❌ prohibido — store directo en el componente
const { status } = useSurveyFiltersStore()
```

---

## Estilos

**Tailwind CSS es el único sistema de estilos permitido.**
Los estilos inline y CSS modules están prohibidos.

### Mobile First

La aplicación es **mobile first**. Los estilos base aplican a pantallas pequeñas,
y se escala hacia arriba usando breakpoints. Los únicos breakpoints válidos son
`sm` (móvil pequeño) y `lg` (desktop) — no usar `md`, `xl`, `2xl`.

```tsx
// ✅ correcto — base mobile, escala a desktop con lg:
<div className="flex flex-col gap-4 p-4 lg:flex-row lg:gap-8 lg:p-8">
  <aside className="w-full lg:w-64">
  <main className="w-full lg:flex-1">

// ❌ prohibido — desktop first (invertido)
<div className="flex-row gap-8 p-8 sm:flex-col sm:gap-4">

// ❌ prohibido — breakpoints intermedios no contemplados
<div className="md:flex-row xl:gap-12">
```

**Breakpoints permitidos:**

| Breakpoint    | Tailwind    | Uso                             |
| ------------- | ----------- | ------------------------------- |
| Mobile (base) | sin prefijo | pantallas pequeñas, diseño base |
| Desktop       | `lg:`       | pantallas de escritorio         |

Tablet (`md:`) no es un target — el diseño mobile se estira hasta desktop.

```tsx
// ✅ correcto — Tailwind classes
<div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm">
  <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
    Guardar
  </button>
</div>

// ❌ prohibido — estilos inline
<div style={{ display: 'flex', padding: '16px', borderRadius: '8px' }}>

// ❌ prohibido — CSS modules
import styles from './plan-detail.module.css'
<div className={styles.container}>

// ❌ prohibido — clases arbitrarias innecesarias cuando existe utilidad de Tailwind
<div className="[padding:16px]">   // usá p-4
```

**Clases condicionales** — usá `clsx` o `cn`, nunca concatenación de strings:

```tsx
// ✅ correcto
import { cn } from '@/shared/utils/cn'

<div className={cn(
  'rounded-lg p-4',
  isActive && 'bg-blue-50 ring-2 ring-blue-500',
  isDisabled && 'cursor-not-allowed opacity-50'
)}>

// ❌ prohibido
<div className={'rounded-lg p-4' + (isActive ? ' bg-blue-50' : '')}>
```

---

## Hooks

**Toda lógica reutilizable o con estado vive en un hook**, nunca directamente en el componente.

**Cuándo extraer un hook:**

```
lógica que combina useState + useEffect          → hook
lógica compartida entre 2+ componentes           → hook
llamada a TanStack Query (useQuery/useMutation)  → hook
lógica de formulario (validación, submit)        → hook
lógica de negocio compleja dentro de un JSX      → hook
```

**Dónde vive el hook:**

```
lógica exclusiva de una feature   → features/<nombre>/hooks/
lógica compartida entre features  → shared/hooks/
```

```ts
// ✅ correcto — lógica extraída a hook
// features/plans/hooks/use-plan-detail.ts
export function usePlanDetail(planId: string) {
  const query = useQuery({
    queryKey: ['plans', planId],
    queryFn: () => fetchPlanById(planId),
    staleTime: 5 * 60 * 1000,
  })

  const isOwner = query.data?.ownerId === useCurrentUser().id

  return { ...query, isOwner }
}

// features/plans/components/plan-detail.tsx
export function PlanDetail({ planId }: { planId: string }) {
  const { data, isLoading, isOwner } = usePlanDetail(planId)

  if (isLoading) return <Spinner data-testid="plan-detail-loading" />
  return <div data-testid="plan-detail">{data?.name}</div>
}

// ❌ prohibido — lógica de negocio dentro del componente
export function PlanDetail({ planId }: { planId: string }) {
  const [plan, setPlan] = useState(null)
  useEffect(() => {
    fetch(`/api/plans/${planId}`).then(r => r.json()).then(setPlan)
  }, [planId])
  const isOwner = plan?.ownerId === currentUser.id
  // ...
}
```

**Reglas de hooks:**

- Nombre siempre con prefijo `use` en camelCase: `usePlanDetail`, `useLocalStorage`
- Un hook hace una sola cosa — si hace dos, son dos hooks
- Los hooks no retornan JSX — eso es un componente
- Siempre tipar el retorno explícitamente en hooks públicos (exportados)

---

## Cambios Mínimos

Cada PR introduce **la cantidad mínima necesaria** para una feature:

- Si la feature nueva no necesita un componente shared → no lo crees
- Si un tipo ya existe en otro lugar → reutilizalo, no dupliques el tipo
- Si necesitás modificar más de 3 features para agregar algo → revisá el diseño
- Refactorizaciones van en commits separados, nunca mezcladas con features

---

## Legibilidad

- Máximo 1 nivel de ternario anidado — si necesitás más, usá early return o extraé función
- Máximo 3 parámetros por función — si necesitás más, usá un objeto de opciones
- Nombres que explican el "qué" y el "por qué", no el "cómo"
- Sin comentarios que repiten lo que el código ya dice

```ts
// ❌ comentario inútil
// incrementa el contador
counter++

// ✅ comentario útil — explica el por qué no el qué
// TanStack Query re-fetches en background, el staleTime evita requests innecesarios
staleTime: 5 * 60 * 1000
```

---

## Navegación

**Nunca usar el tag `<a>` ni `window.location` para navegación interna. Siempre usar el componente `<Link>` de TanStack Router.**

El tag `<a>` hace un full page reload y rompe el modelo de SPA. `<Link>` maneja la navegación del lado del cliente, preserva el estado de TanStack Query, y soporta prefetching automático.

```tsx
// ✅ correcto — Link de TanStack Router
import { Link } from '@tanstack/react-router'

<Link to="/plans/$planId" params={{ planId: plan.id }}>
  Ver plan
</Link>

<Link to="/plans" search={{ status: 'active' }}>
  Planes activos
</Link>

// ✅ correcto — navegación programática
import { useNavigate } from '@tanstack/react-router'

export function usePlanNavigation() {
  const navigate = useNavigate()
  return {
    goToPlan: (planId: string) => navigate({ to: '/plans/$planId', params: { planId } })
  }
}

// ❌ prohibido — tag <a> para rutas internas
<a href="/plans/123">Ver plan</a>

// ❌ prohibido — navegación imperativa
window.location.href = '/plans/123'
location.assign('/plans/123')
```

**Cuándo sí usar `<a>`:** solo para URLs externas o recursos fuera de la app. En ese caso, siempre con `target="_blank"` y `rel="noopener noreferrer"`.

```tsx
// ✅ único caso válido para <a>
<a href="https://externo.com" target="_blank" rel="noopener noreferrer">
  Documentación externa
</a>
```
