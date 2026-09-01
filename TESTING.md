# TESTING.md — Guía de pruebas manuales

Instrucciones para probar MovieAI localmente a medida que se implementan features.

---

## Setup inicial

```bash
cd C:\Users\jordi\movieai
git checkout main && git pull origin main
npm run dev
```

La app queda disponible en **http://localhost:3000**

---

## Proyecto de prueba

El proyecto `el-ultimo-tren` tiene datos realistas para probar todas las funciones.
Créalo (o recréalo) en cualquier momento con:

```bash
node scripts/seed-test-project.mjs
```

No necesitas reiniciar el servidor — Next.js lee los ficheros en cada request.

---

## Flujo de prueba completo (actualizado con cada PR)

### 1. Pantalla de inicio (`/`)
- Abre http://localhost:3000
- ✅ Debe aparecer la tarjeta "El último tren" con género Drama y Fase 1
- ✅ Botón "+ Nueva película" en el header
- ✅ Al pulsar la tarjeta o "Continuar" → va al editor

**Probar estado vacío:**
```bash
# Temporalmente renombra la carpeta de proyectos
# o usa una ruta diferente:
set MOVIEAI_PROJECTS_ROOT=C:\tmp\vacio
npm run dev
```
- ✅ Debe mostrar "No tienes proyectos todavía" con CTA

**Probar crear proyecto:**
- Pulsa "+ Nueva película"
- ✅ Se abre el modal
- Rellena título "Mi test" + género "Comedia"
- Pulsa "Crear proyecto"
- ✅ Redirige al editor de "mi-test"
- ✅ Carpeta `~/MovieAI/projects/mi-test/` creada con `project.md`, `sinopsis.md`, `estructura.md`

---

### 2. Editor (`/projects/el-ultimo-tren/editor`)
- Abre http://localhost:3000/projects/el-ultimo-tren/editor
- ✅ Header muestra "El último tren"
- ✅ Tab "Proyecto" activo por defecto
- ✅ Se ven los 4 bloques (Sinopsis, Acción, Diálogo, Nota)
- ✅ Panel lateral derecho con "Pulsa 🖼 en un bloque para generar una imagen"

**Probar bloques:**
- ✅ Editar texto en un bloque → el contenido cambia
- ✅ Pulsa botón "Añadir bloque Acción" → aparece nuevo bloque vacío
- ✅ Pulsa "×" en un bloque → desaparece
- ✅ Arrastra un bloque (handle ⠿) → reordena la lista

**Probar tabs:**
- ✅ Pulsa "🎬 Escenas" → cambia el contenido
- ✅ Panel lateral permanece visible
- ✅ Vuelve a "📋 Proyecto" → bloques siguen ahí

---

## API — pruebas rápidas

```powershell
# Listar proyectos
Invoke-RestMethod http://localhost:3000/api/projects

# Crear proyecto
Invoke-RestMethod -Method POST -Uri http://localhost:3000/api/projects `
  -ContentType "application/json" `
  -Body '{"title":"Prueba rápida","genre":"Drama"}'

# Ver proyecto completo con bloques
Invoke-RestMethod http://localhost:3000/api/projects/el-ultimo-tren

# Ver personajes
Invoke-RestMethod http://localhost:3000/api/projects/el-ultimo-tren/personajes
```

---

## Tests automáticos

```bash
# Todos los tests
npm run test:run

# Un fichero concreto
npm run test:run -- src/__tests__/app/home.test.tsx

# Watch mode (re-ejecuta al guardar)
npm run test
```

Estado actual: **124 tests passing**

---

## Próximas features a probar (pendientes)

| Issue | Feature | Cómo probar |
|-------|---------|-------------|
| #56 | Lista de escenas | Tab "Escenas" en el editor |
| #57 | Editor de escena | Click en una escena |
| #39 | ✅ Pantalla de inicio | `http://localhost:3000` |
| #60 | Progreso del proyecto | Badge en la tarjeta del proyecto |

---

_Este fichero se actualiza con cada PR mergeado._
