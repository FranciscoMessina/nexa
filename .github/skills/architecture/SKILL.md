---
name: architecture
description: 'Aplica reglas de arquitectura para repositorios React + TanStack (Router/Query) con TypeScript estricto. Usar al crear archivos, agregar features, refactorizar, decidir ubicacion de componentes/hooks/tipos/funciones, resolver dudas de estructura, naming, imports, TDD y boundaries entre capas.'
argument-hint: 'Describe el cambio y la feature afectada (ej: "agregar detalle de plan con route /plans/$planId")'
user-invocable: true
---

# Architecture

Skill para ejecutar cambios de forma consistente con la arquitectura del repositorio TanStack, manteniendo rutas finas, boundaries por capa, TDD y TypeScript estricto.

## Cuando Usar
- Crear una feature nueva.
- Agregar rutas en TanStack Router.
- Decidir donde ubicar componentes, hooks, tipos o funciones.
- Refactorizar sin romper boundaries.
- Revisar naming, imports y estructura de carpetas.

## Alcance
- Esta skill aplica al frontend de `apps/web/src`.
- Para `packages/ui`, reutilizar las mismas reglas de naming, TypeScript y Tailwind, evitando dependencias de negocio.

## Herramientas Sugeridas
- `readFile`: inspeccionar estructura actual antes de crear o mover codigo.
- `search/codebase`: detectar imports directos, violaciones de boundaries, `any`, o estilos no permitidos.
- `runInTerminal`: validar con typecheck, tests y lint.

## Flujo De Trabajo
1. Definir alcance del cambio y feature objetivo.
2. Ubicar codigo por regla de capas y regla de 3 instancias.
3. Crear o ajustar tipos, API y hooks dentro de la feature.
4. Escribir test primero (red), implementar minimo (green), refactorizar (refactor).
5. Mantener rutas como thin wrappers (sin logica de negocio en `routes/`).
6. Exponer solo contratos publicos via `features/<feature>/index.ts`.
7. Validar arquitectura y calidad con checklist final.

## Decisiones Clave

### 1) Donde vive el codigo
- 1 feature lo usa: vive en esa feature.
- 2 features lo usan: duplicar intencionalmente.
- 3 o mas features lo usan: mover a `shared/`.

### 2) Si toca rutas
- Ruta solo define `createFileRoute`, loader liviano y `component` de feature.
- Cualquier fetch, estado o logica de negocio va en hook/componente de feature.

### 3) Si aparece reutilizacion
- No importar internals de otra feature.
- Si una feature depende de otra, extraer a `shared/`.

### 4) Si hay estado/logica en JSX
- Extraer a hook (`useXxx`) en `features/<name>/hooks/` o `shared/hooks/`.

## Procedimiento Estandar
1. Revisar estructura existente y elegir carpeta destino.
2. Crear archivos con naming correcto (kebab-case, sufijos `.api`, `.types`, `.test`).
3. Agregar/actualizar exports en barrel `index.ts` de la feature.
4. Implementar UI solo con Tailwind; clases condicionales con `clsx` o `cn`.
5. Prohibir `any` y casts inseguros; tipar APIs y retornos publicos.
6. Agregar `data-testid` en elementos relevantes para pruebas.
7. Ejecutar validaciones (`typecheck`, `test`, `lint`) y corregir.

## Checklist De Calidad (Done Criteria)
- No hay logica de negocio en `routes/`.
- No hay imports directos a internals de features desde fuera.
- No hay dependencias `features -> features` ni `shared -> features`.
- No existe `any` ni casting `as Type` sin validacion.
- Naming y estructura siguen convenciones.
- Tests redactados en formato given/when/then y pasan.
- UI usa Tailwind (sin inline styles ni CSS modules).

## Comandos De Verificacion
- `bun run typecheck` (root, via turbo)
- `bun run lint` (root, via turbo)
- `bun run --filter web typecheck` (validacion puntual de `apps/web`)
- Si existe test script en el paquete afectado: `bun run --filter <paquete> test`

## Referencia Completa
- [Reglas de arquitectura detalladas](./references/architecture-rules.md)
