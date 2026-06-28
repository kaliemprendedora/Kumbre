# KUMBRE — Documento de Diseño de Producto
### Fase 1 · Arquitectura y Estrategia
**Versión 1.0 · Junio 2026**

---

> *"La claridad es el verdadero producto. Las finanzas son el medio."*

---

## ÍNDICE

1. [Visión del Producto](#1-visión-del-producto)
2. [Propuesta de Valor](#2-propuesta-de-valor)
3. [Público Objetivo](#3-público-objetivo)
4. [Problemas que Resuelve](#4-problemas-que-resuelve)
5. [Funcionalidades Principales](#5-funcionalidades-principales)
6. [Funcionalidades Secundarias](#6-funcionalidades-secundarias)
7. [Arquitectura Modular](#7-arquitectura-modular)
8. [Modelo de Datos de Alto Nivel](#8-modelo-de-datos-de-alto-nivel)
9. [Flujo de Navegación](#9-flujo-de-navegación)
10. [Wireframes Conceptuales](#10-wireframes-conceptuales)
11. [Roadmap por Fases](#11-roadmap-por-fases)
12. [MVP Recomendado](#12-mvp-recomendado)
13. [Qué NO Construir Inicialmente](#13-qué-no-construir-inicialmente)
14. [Riesgos Técnicos](#14-riesgos-técnicos)
15. [Riesgos de Producto](#15-riesgos-de-producto)
16. [Recomendaciones de UX](#16-recomendaciones-de-ux)
17. [Recomendaciones de UI](#17-recomendaciones-de-ui)
18. [Recomendaciones Tecnológicas](#18-recomendaciones-tecnológicas)
19. [Stack Recomendado](#19-stack-recomendado)
20. [Organización de Carpetas](#20-organización-de-carpetas)
21. [Estrategia de Escalamiento — 5 Años](#21-estrategia-de-escalamiento--5-años)
22. [Ventajas Competitivas Difíciles de Copiar](#22-ventajas-competitivas-difíciles-de-copiar)
23. [Qué Cambiaría o Eliminaría](#23-qué-cambiaría-o-eliminaría)
24. [Qué Agregaría para Crear un Producto Extraordinario](#24-qué-agregaría-para-crear-un-producto-extraordinario)

---

## 1. Visión del Producto

### Declaración de Visión

**Kumbre es la primera herramienta de claridad financiera diseñada para personas que quieren tomar decisiones conscientes, no solo administrar dinero.**

No es una app de presupuestos.
No es una planilla inteligente.
No es un banco digital.

Es un sistema de pensamiento aplicado a las finanzas personales y empresariales — que enseña a las personas a ver hacia adelante antes de actuar.

### La Pregunta Central

Toda la experiencia de Kumbre orbita alrededor de una sola pregunta:

> **¿Esta decisión me acerca o me aleja de la vida que quiero construir?**

Esa pregunta debe ser respondible en segundos. No en horas de análisis. No en hojas de cálculo. En segundos, con contexto completo, con consecuencias visibles, sin culpa.

### Analogía Fundacional

Un corredor experto no corre al máximo desde el primer kilómetro. Administra energía, conoce el terreno, ajusta el ritmo según el objetivo. Un montañista no mira solo el siguiente paso — levanta la vista constantemente para entender el camino completo.

Kumbre enseña exactamente eso: **administración de energía económica** con perspectiva de largo plazo.

---

## 2. Propuesta de Valor

### Para el Usuario

| Dolor Actual | Lo que Kumbre entrega |
|---|---|
| "No sé si puedo permitirme esto" | Respuesta inmediata con consecuencias visibles |
| "Tengo ansiedad financiera crónica" | Claridad que reemplaza la incertidumbre |
| "Mis finanzas y mi empresa están mezcladas" | Dos universos separados, conectados estratégicamente |
| "No sé cómo mis gastos afectan mis sueños" | Proyección directa: gasto → impacto en objetivos |
| "Siempre tomo decisiones impulsivas" | Simulador que muestra el futuro antes de actuar |
| "Las apps financieras me hacen sentir culpable" | Lenguaje sin juicio. Sin castigos. Solo consecuencias. |

### Diferenciación Estratégica

La mayoría de las aplicaciones financieras responden: **¿Cuánto gasté?**

Kumbre responde: **¿Qué pasa si hago esto ahora?**

Ese cambio de pregunta lo cambia todo. Es la diferencia entre un espejo retrovisor y un parabrisas.

---

## 3. Público Objetivo

### Usuario Primario (MVP)

**Perfil: Emprendedora con vida financiera dual**

- Maneja finanzas personales y de una empresa simultáneamente
- Necesita mantenerlas separadas pero conectadas estratégicamente
- Tiene objetivos de vida claros (casa, viajes, expansión del negocio)
- Toma decisiones frecuentes que impactan ambas esferas
- Valora la estética, la calidad y los productos premium
- Tiene tolerancia cero a la complejidad innecesaria

**Ejemplo concreto:** Tú. Cambucho. Este producto.

### Usuarios Secundarios (Post-MVP)

**Tier 2 — Personas con un empleo y objetivos claros**
- Quieren comprar una casa, viajar, ahorrar, invertir
- Necesitan entender consecuencias, no solo registrar

**Tier 3 — Freelancers y consultores**
- Ingresos variables, múltiples clientes
- Necesitan proyección de flujo de caja más que presupuesto

**Tier 4 — Pequeñas empresas (1-10 personas)**
- Gestión de proyectos, contrataciones, flujo operacional
- El módulo empresarial se convierte en producto propio

### Personas Anti-Target (Explícitas)

- Contadores que buscan software contable completo
- Personas que quieren conectar todos sus bancos automáticamente (por ahora)
- Usuarios que esperan que la app administre sola sin participación activa

---

## 4. Problemas que Resuelve

### Problema 1: La Brecha entre Gasto y Consecuencia

Las personas saben cuánto gastan. No saben cómo ese gasto afecta sus sueños. Kumbre conecta directamente cada decisión con su impacto en los objetivos definidos por el usuario.

### Problema 2: La Ansiedad por Incertidumbre

La ansiedad financiera no viene del dinero — viene de no saber. De no poder responder "¿estoy bien?" con evidencia. Kumbre entrega una vista de estado permanente y honesta que reemplaza la incertidumbre con claridad.

### Problema 3: Decisiones Impulsivas sin Contexto

Cuando alguien quiere comprar algo, no tiene herramienta para simular el impacto antes de decidir. El simulador de Kumbre convierte ese impulso en una decisión consciente en segundos.

### Problema 4: La Mezcla Caótica Personal-Empresa

Los emprendedores mezclan gastos personales y empresariales por falta de estructura. Kumbre es el primer sistema que mantiene ambos universos separados pero con visibilidad cruzada estratégica.

### Problema 5: Objetivos sin Financiamiento

Las personas tienen sueños pero no tienen un plan financiero concreto conectado a esos sueños. Kumbre convierte cada objetivo en un sistema vivo con financiamiento, progreso y proyección.

### Problema 6: El Crédito como Caja Negra

Tarjetas, cuotas, líneas de crédito — las personas no entienden el costo real del crédito en el tiempo ni cómo afecta su capacidad de lograr objetivos. Kumbre hace visible ese impacto de forma no técnica.

---

## 5. Funcionalidades Principales

Estas son las funcionalidades que definen el producto. Sin ellas, no existe Kumbre.

### 5.1 — Centro de Decisiones (Decision Hub)

**El corazón de la experiencia.**

Una pantalla que responde permanentemente: *¿Cómo estoy? ¿Qué puedo hacer hoy?*

Incluye:
- Estado financiero actual (personal + empresa, separados)
- Objetivos activos con progreso visual
- Alertas de contexto ("tu flujo de caja baja en 3 semanas")
- Acceso rápido al simulador
- Actividad reciente con categorización automática

**Por qué es central:** Es la pantalla que el usuario abre cada día. Define el tono emocional de toda la experiencia. Si esta pantalla genera claridad, el producto funciona.

### 5.2 — Simulador de Decisiones

**El diferenciador más poderoso del mercado.**

El usuario describe una decisión en lenguaje natural o mediante formulario guiado:

- "Quiero comprar un auto de $15.000 en 36 cuotas"
- "Quiero contratar a una persona con sueldo de $800/mes"
- "Quiero viajar en diciembre, costo estimado $3.000"
- "Quiero usar la tarjeta para equipamiento de $2.500"

El simulador responde:
- **Impacto en flujo de caja** (mes a mes, próximos 12 meses)
- **Impacto en objetivos activos** (¿cuántos meses se retrasa cada uno?)
- **Costo real del crédito** si aplica
- **Escenarios alternativos** (¿qué pasa si espero 3 meses? ¿si ahorro antes?)
- **Recomendación sin juicio** ("si eliges este camino, esto ocurrirá")

**Lo que NO hace el simulador:**
- No dice "no puedes"
- No castiga ni genera culpa
- No recomienda de forma imperativa
- Solo muestra consecuencias con claridad

**Tipos de simulaciones:**
- Compra única (de contado o en cuotas)
- Gasto recurrente nuevo
- Ingreso nuevo (aumento, cliente nuevo, venta extra)
- Contratación (impacto en costos fijos del negocio)
- Crédito o préstamo
- Inversión
- Objetivo nuevo

### 5.3 — Objetivos (Cumbres)

**El sistema de sentido detrás de cada decisión.**

Cada objetivo es una "cumbre" — un destino hacia el que el usuario está caminando.

Cada cumbre tiene:
- Nombre y descripción
- Prioridad (editable, de 1 a N)
- Fecha objetivo
- Monto objetivo (opcional — hay cumbres no financieras)
- Avance actual
- Plan de financiamiento vinculado
- Fondos asignados
- Simulaciones históricas relacionadas
- Estado: activo / pausado / logrado / archivado

**Tipos de objetivos:**
- Financieros: casa, auto, viaje, fondo de emergencia, retiro
- Empresariales: expansión, equipo, equipamiento, campaña
- No financieros: hábitos, aprendizaje, salud (con seguimiento cualitativo)

**Regla de diseño:** El sistema de objetivos debe ser tan flexible que no asuma nada sobre la vida del usuario.

### 5.4 — Fondos (Envelopes Inteligentes)

El concepto de "envelope budgeting" modernizado y sin rigidez.

Un fondo es un contenedor de dinero con propósito:
- Fondo Emergencias
- Fondo Casa
- Fondo Inversión
- Fondo Viaje Europa
- Fondo Operacional Cambucho
- Fondo Nómina

Los fondos pueden:
- Recibir aportes automáticos o manuales
- Vincularse a uno o más objetivos
- Tener reglas de aporte ("15% de cada ingreso va a Fondo Casa")
- Mostrar proyección de cuándo alcanzará la meta
- Conectarse a cuentas bancarias reales (post-MVP)

**Diferencia con presupuesto:** Un fondo es dinero que YA existe con propósito asignado. Un presupuesto es un límite a futuro. Kumbre prioriza fondos sobre presupuestos porque generan abundancia psicológica, no restricción.

### 5.5 — Registro Inteligente de Movimientos

Diseñado para ser la acción más rápida de toda la app.

**Captura rápida:**
- Texto libre: "85 almuerzo restaurante Don Pedro"
- Voz: dictado de movimiento
- Foto de boleta/ticket (OCR)
- División de compra en cuotas

**OCR con Inteligencia:**
- Lee el ticket completo
- Identifica productos individuales
- Categoriza con contexto
- Aprende de correcciones: si corrijo "supermercado → despensa del hogar", nunca vuelve a preguntarme
- Construye base de conocimiento propia por usuario

**Aprendizaje Automático de Categorías:**
- Reconoce patrones: "Starbucks" siempre es café
- Aprende nombres de comercios locales
- El usuario puede crear reglas: "Todo pago a María → honorarios"
- Las reglas son transparentes y editables

**Categorización flexible:**
- Sin jerarquías rígidas
- El usuario define sus propias categorías y subcategorías
- Las categorías pueden vincularse a fondos automáticamente

### 5.6 — Vista de Flujo de Caja

No es un extracto bancario. Es una proyección.

Muestra:
- Lo que entró y salió (pasado)
- Lo que se proyecta que entrará y saldrá (futuro, 1-6-12 meses)
- Compromisos conocidos (cuotas, arriendos, nómina)
- Meses con riesgo de saldo negativo (visible de antemano)
- Impacto de decisiones simuladas sobre el flujo proyectado

### 5.7 — Patrimonio Neto

Una vista simple pero poderosa:

**Activos:**
- Cuentas bancarias (saldo)
- Inversiones
- Propiedades
- Otros activos

**Pasivos:**
- Deudas
- Tarjetas (deuda actual)
- Créditos vigentes

**Patrimonio = Activos - Pasivos**

Evolución histórica en gráfico. La tendencia es más importante que el número.

### 5.8 — Módulo Empresarial (Cambucho / Empresa)

Un universo paralelo al personal, con sus propias reglas.

Incluye:
- Ingresos y gastos del negocio
- Proyectos con seguimiento de rentabilidad
- Nómina y honorarios
- Flujo de caja operacional
- Conexión estratégica con finanzas personales (¿cuánto me puede pagar la empresa este mes?)

**La conexión personal-empresa es bidireccional pero controlada:**
- El usuario decide qué cruce existe entre ambos mundos
- Puede simular: "¿qué pasa si la empresa me paga $500 más este mes?"
- Puede ver el impacto de decisiones empresariales sobre sus finanzas personales

---

## 6. Funcionalidades Secundarias

Importantes pero no bloqueantes para el MVP.

### 6.1 — Tarjetas y Crédito

- Registro de tarjetas con límite, saldo usado, fecha de corte, fecha de pago
- Cálculo de deuda real vs saldo disponible
- Visualización de cuotas vigentes (todos los compromisos activos)
- Alertas de fecha de corte y pago
- Simulación de uso de tarjeta con costo real de interés

### 6.2 — Deudas

- Registro de créditos, préstamos, hipotecas
- Tabla de amortización simple
- Impacto en flujo de caja mensual
- Simulador de prepago ("¿cuánto ahorro si pago $500 extra este mes?")

### 6.3 — Inversiones

- Registro manual de posiciones (acciones, fondos, ETFs, cripto, bienes raíces)
- Valoración manual o via API (post-MVP)
- Integración con objetivos ("esta inversión financia mi retiro")
- Histórico de rendimiento

### 6.4 — Proyectos (Negocio)

- Proyectos con ingresos y gastos asociados
- Rentabilidad por proyecto
- Proyección de cierre
- Conexión con facturación y honorarios

### 6.5 — Reportes y Perspectiva

- Resumen mensual narrativo (generado con IA)
- Comparativa mes a mes
- Análisis de patrones de gasto
- Informe de salud financiera

### 6.6 — Reglas y Automatizaciones

- "Cuando recibo un ingreso, X% va al Fondo Emergencia"
- "Todo gasto en categoría Alimentación que supere $200 me avisa"
- "Cada primer día del mes, registra arriendo $850"
- Las reglas son visibles, editables, pausables

### 6.7 — Compras Compartidas

- Registro de gasto compartido con otras personas
- Seguimiento de quién debe qué
- División de gastos de viaje, hogar, eventos

---

## 7. Arquitectura Modular

Cada módulo es independiente. Puede activarse, desactivarse o reemplazarse sin afectar el núcleo.

```
┌─────────────────────────────────────────────────────────────────┐
│                         NÚCLEO (CORE)                           │
│  Identidad · Perfiles · Universos · Moneda · Configuración      │
│  Motor de Simulación · Motor de Proyección · Motor de Reglas    │
└─────────────────────────┬───────────────────────────────────────┘
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
   ┌───────────┐   ┌───────────┐   ┌───────────┐
   │ PERSONAL  │   │  EMPRESA  │   │  SHARED   │
   │ Universe  │   │ Universe  │   │  Views    │
   └─────┬─────┘   └─────┬─────┘   └─────┬─────┘
         │               │               │
         ▼               ▼               ▼

MÓDULOS ACTIVABLES:
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  OBJETIVOS   │  │  SIMULADOR   │  │    FONDOS    │  │   REGISTRO   │
│   (Cumbres)  │  │  Decisiones  │  │  (Envelopes) │  │  Inteligente │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  PATRIMONIO  │  │   TARJETAS   │  │    DEUDAS    │  │  INVERSIONES │
│  Neto        │  │  y Crédito   │  │              │  │              │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│     OCR      │  │  PROYECTOS   │  │   REPORTES   │  │      IA      │
│  + Aprend.   │  │  (Negocio)   │  │  Narrativos  │  │  Contextual  │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

### Principios de la Arquitectura Modular

1. **El Core no conoce los módulos** — los módulos se suscriben al core.
2. **Cada módulo expone una API interna** — contratos de datos estables.
3. **Los módulos pueden combinarse** — el simulador puede llamar a objetivos, fondos, tarjetas.
4. **La configuración del usuario controla qué módulos están activos** — no el código.
5. **Los módulos tienen su propio estado** — pueden cargarse lazy.

### Universos (Personal / Empresa)

Un "Universo" es un espacio financiero completamente aislado con su propia:
- Moneda
- Categorías
- Fondos
- Objetivos
- Reglas

El usuario puede tener múltiples universos (personal, Cambucho, proyecto freelance) y ver conexiones entre ellos sin mezclarlos.

---

## 8. Modelo de Datos de Alto Nivel

### Entidades Principales

```
USER
├── id
├── email
├── preferences (theme, language, currency, locale)
└── universes[]

UNIVERSE
├── id
├── user_id
├── name ("Personal", "Cambucho")
├── type (personal | business | project)
├── currency
├── color / icon
└── settings{}

ACCOUNT (Cuenta)
├── id
├── universe_id
├── name
├── type (checking | savings | cash | investment | crypto)
├── balance
├── institution (optional)
└── color / icon

TRANSACTION (Movimiento)
├── id
├── universe_id
├── account_id
├── amount
├── type (income | expense | transfer)
├── date
├── description
├── category_id
├── tags[]
├── fund_id (optional)
├── objective_id (optional)
├── is_recurring
├── recurrence_rule (optional)
├── receipt_image_url (optional)
├── ocr_raw_data (optional)
├── created_via (manual | ocr | rule | import)
└── metadata{}

CATEGORY
├── id
├── universe_id
├── name
├── parent_id (optional — para subcategorías)
├── color / icon
├── type (income | expense | transfer)
└── rules[] → auto-categorization

OBJECTIVE (Cumbre)
├── id
├── universe_id
├── name
├── description
├── type (financial | non_financial)
├── priority (int)
├── target_amount (nullable)
├── target_date (nullable)
├── current_amount
├── status (active | paused | achieved | archived)
├── funds[] → linked fund IDs
├── color / icon
└── notes

FUND (Fondo / Envelope)
├── id
├── universe_id
├── name
├── target_amount
├── current_amount
├── objectives[] → linked objective IDs
├── rules[] → funding rules
├── color / icon
└── notes

SIMULATION (Simulación)
├── id
├── universe_id
├── user_id
├── title
├── type (purchase | expense | income | hire | credit | investment)
├── created_at
├── inputs{}
├── results{}
│   ├── cashflow_impact[] (monthly, 12 months)
│   ├── objectives_impact[]
│   │   └── { objective_id, months_delayed, new_date }
│   ├── net_worth_impact
│   └── alternatives[]
└── saved (bool) — el usuario puede guardar simulaciones favoritas

CARD (Tarjeta)
├── id
├── universe_id
├── name
├── institution
├── limit
├── current_debt
├── cut_date
├── payment_date
├── interest_rate
└── installments[] → active installment plans

DEBT (Deuda)
├── id
├── universe_id
├── name
├── institution
├── original_amount
├── remaining_amount
├── monthly_payment
├── interest_rate
├── start_date
├── end_date
└── type (mortgage | personal | vehicle | other)

INVESTMENT
├── id
├── universe_id
├── name
├── type (stock | fund | etf | crypto | real_estate | other)
├── quantity
├── avg_cost
├── current_value
├── objective_id (optional)
└── notes

PROJECT (solo Universo Empresa)
├── id
├── universe_id
├── name
├── client
├── status (active | completed | paused)
├── estimated_income
├── actual_income
├── estimated_cost
├── actual_cost
└── transactions[]

OCR_RECEIPT
├── id
├── transaction_id
├── raw_text
├── parsed_items[]
│   └── { name, quantity, amount, category_id }
├── confidence_score
├── corrections[]
└── learned_rules[]

RULE (Regla de Automatización)
├── id
├── universe_id
├── name
├── trigger_type (transaction | schedule | income | amount_threshold)
├── conditions{}
├── actions[]
│   └── { type, params }
├── is_active
└── last_triggered_at
```

### Relaciones Clave

- Un `USER` tiene N `UNIVERSE`
- Un `UNIVERSE` tiene N `ACCOUNT`, `TRANSACTION`, `CATEGORY`, `OBJECTIVE`, `FUND`, `SIMULATION`
- Una `TRANSACTION` puede vincularse a 0-1 `FUND` y 0-1 `OBJECTIVE`
- Un `OBJECTIVE` puede vincularse a N `FUND`
- Una `SIMULATION` puede impactar N `OBJECTIVE` y genera N proyecciones de flujo
- Las `RULE` operan sobre `TRANSACTION` y pueden generar `FUND` movements

---

## 9. Flujo de Navegación

### Estructura de Navegación Principal

```
APP
├── 🏠 INICIO (Decision Hub)
│   ├── Vista de estado (personal / empresa / combinada)
│   ├── Objetivos activos con progreso
│   ├── Flujo de caja próximas 4 semanas
│   ├── Alertas y notificaciones
│   └── Acceso rápido → Simular / Registrar
│
├── 🎯 OBJETIVOS (Cumbres)
│   ├── Lista de objetivos con progreso visual
│   ├── Detalle de objetivo
│   │   ├── Progreso y proyección
│   │   ├── Fondos vinculados
│   │   ├── Simulaciones relacionadas
│   │   └── Notas y plan
│   ├── Crear / Editar objetivo
│   └── Objetivos logrados (archivo)
│
├── 🔭 SIMULADOR
│   ├── Nueva simulación
│   │   ├── Tipo de decisión (compra / ingreso / crédito / etc.)
│   │   ├── Formulario guiado
│   │   └── Resultados + alternativas
│   ├── Simulaciones guardadas
│   └── Comparar simulaciones
│
├── 📋 REGISTRO
│   ├── Feed de movimientos (con filtros)
│   ├── Registro rápido (overlay)
│   │   ├── Manual
│   │   ├── Foto / OCR
│   │   └── Voz
│   ├── Reglas y automatizaciones
│   └── Categorías (gestión)
│
├── 💼 FONDOS
│   ├── Vista general (todos los fondos, dinero asignado vs total)
│   ├── Detalle de fondo
│   └── Crear / Editar fondo
│
├── 📊 PERSPECTIVA (Reportes)
│   ├── Patrimonio neto (evolución)
│   ├── Flujo de caja (histórico + proyección)
│   ├── Gastos por categoría
│   ├── Comparativas
│   └── Resumen mensual IA
│
├── 🏢 EMPRESA (módulo activable)
│   ├── Dashboard empresa
│   ├── Proyectos
│   ├── Nómina / Honorarios
│   └── Conexión personal→empresa
│
└── ⚙️ CONFIGURACIÓN
    ├── Universos (crear, editar, archivar)
    ├── Cuentas
    ├── Tarjetas
    ├── Deudas
    ├── Inversiones
    ├── Módulos activos
    ├── Preferencias (moneda, idioma, tema)
    └── Datos (exportar, importar)
```

### Flujo de Decisión (Happy Path Principal)

```
Usuario quiere comprar algo
        │
        ▼
Abre Kumbre → Pantalla de Inicio
        │
        ▼
Toca "Simular Decisión"
        │
        ▼
Describe la decisión
(tipo → monto → condiciones)
        │
        ▼
Kumbre calcula impacto:
- Flujo de caja 12 meses
- Impacto en objetivos
- Costo real (si hay crédito)
- Alternativas
        │
        ▼
Usuario decide con claridad completa
        │
   ┌────┴────┐
   ▼         ▼
Procede   No procede
   │         │
   ▼         ▼
Registra  Guarda simulación
movimiento para revisar después
```

---

## 10. Wireframes Conceptuales

### 10.1 — Pantalla de Inicio (Decision Hub)

```
┌────────────────────────────────────┐
│  Kumbre                    👤  ⚙️  │
├────────────────────────────────────┤
│                                    │
│  Buenos días, Kali                 │
│  Viernes 27 de junio               │
│                                    │
│  ┌──────────────────────────────┐  │
│  │  💰 Posición actual          │  │
│  │                              │  │
│  │  Personal    $4.820          │  │
│  │  Cambucho    $12.340         │  │
│  │  ─────────────────────────   │  │
│  │  Patrimonio  $87.200 ↑       │  │
│  └──────────────────────────────┘  │
│                                    │
│  Tus cumbres                 Ver → │
│  ┌─────────────┐  ┌─────────────┐  │
│  │ 🏔 Casa     │  │ ✈️ Europa  │  │
│  │ ████░░░ 67% │  │ ██░░░░ 38% │  │
│  │ 8 meses más │  │ 14 meses   │  │
│  └─────────────┘  └─────────────┘  │
│                                    │
│  Próximas 4 semanas                │
│  ┌──────────────────────────────┐  │
│  │  Jul 1   Arriendo    -$850   │  │
│  │  Jul 5   ⚠️ flujo bajo       │  │
│  │  Jul 8   Ingreso Cambucho    │  │
│  └──────────────────────────────┘  │
│                                    │
│  ╔══════════════════════════════╗  │
│  ║    ¿Qué pasa si...?          ║  │
│  ║      Simular decisión        ║  │
│  ╚══════════════════════════════╝  │
│                                    │
│  [+] Registrar     [📷] Foto       │
│                                    │
│  🏠   🎯   🔭   📋   📊           │
└────────────────────────────────────┘
```

### 10.2 — Simulador de Decisiones

```
┌────────────────────────────────────┐
│  ← Simular decisión                │
├────────────────────────────────────┤
│                                    │
│  ¿Qué tipo de decisión?            │
│                                    │
│  ○ Compra                          │
│  ○ Gasto recurrente nuevo          │
│  ○ Usar tarjeta                    │
│  ○ Pedir crédito                   │
│  ○ Contratar persona               │
│  ○ Nuevo ingreso esperado          │
│  ○ Inversión                       │
│                                    │
│  [Compra seleccionada]             │
│  ─────────────────────────────     │
│                                    │
│  ¿Cuánto cuesta?   $__________     │
│                                    │
│  ¿Cómo pagarías?                   │
│  ○ De contado                      │
│  ○ En cuotas  [__] de $[___/mes]   │
│  ○ Con tarjeta (cuotas s/interés)  │
│  ○ Con tarjeta (cuotas c/interés)  │
│                                    │
│  ¿Con qué universo?                │
│  ○ Personal   ○ Cambucho           │
│                                    │
│  ──────────────────────────────    │
│       Ver consecuencias →          │
└────────────────────────────────────┘
```

### 10.3 — Resultados del Simulador

```
┌────────────────────────────────────┐
│  ← Si compras el auto $15.000      │
│                    en 36 cuotas    │
├────────────────────────────────────┤
│                                    │
│  Cuota mensual      $458/mes       │
│  Costo total        $16.488        │
│  Interés pagado     $1.488         │
│                                    │
│  Impacto en tus cumbres            │
│  ─────────────────────────────     │
│  🏔 Casa          + 4 meses        │
│  ✈️ Europa        + 7 meses        │
│  🔒 Emergencias   sin impacto      │
│                                    │
│  Flujo de caja                     │
│  ▁▂▄▄▃▂▁▁▂▃▄▄  [próximos 12 m]   │
│  ⚠️ Agosto y Sept: flujo ajustado  │
│                                    │
│  ─────────────────────────────     │
│  Alternativas                      │
│                                    │
│  💡 Si esperas 6 meses y ahorras:  │
│     Casa solo 1 mes más tarde      │
│     Europa sin impacto             │
│                                    │
│  💡 Si pagas 24 cuotas:            │
│     $580/mes · ahorras $320 total  │
│     Mayor impacto en cumbres       │
│                                    │
│  ─────────────────────────────     │
│  Si eliges este camino, en         │
│  36 meses habrás pagado $16.488    │
│  y tu casa se alcanza en mayo 2029 │
│  en lugar de enero 2029.           │
│                                    │
│  [Guardar simulación]  [Registrar] │
└────────────────────────────────────┘
```

### 10.4 — Vista de Objetivos

```
┌────────────────────────────────────┐
│  Cumbres                       [+] │
├────────────────────────────────────┤
│                                    │
│  Activas                           │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ 🏔 Casa propia          #1   │  │
│  │ ████████████░░░░░  $67.400   │  │
│  │ Meta: $100.000 · Ene 2029    │  │
│  │ Faltan: $32.600              │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ ✈️ Europa                #2  │  │
│  │ ███░░░░░░░░░░░░░░  $1.900    │  │
│  │ Meta: $5.000 · Ago 2027      │  │
│  │ Faltan: $3.100               │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ 🛡 Fondo Emergencia      #3  │  │
│  │ █████████████████░  $8.500   │  │
│  │ Meta: $9.000 · Dic 2026      │  │
│  │ Faltan: $500  · 6 semanas    │  │
│  └──────────────────────────────┘  │
│                                    │
│  Logradas                    Ver → │
│  🏆 MacBook Pro  ✓  Mar 2026       │
│  🏆 Fondo viaje Chile ✓ Ene 2026   │
│                                    │
│  🏠   🎯   🔭   📋   📊           │
└────────────────────────────────────┘
```

### 10.5 — Registro Rápido (Overlay)

```
┌────────────────────────────────────┐
│                                    │
│          Registrar gasto           │
│                                    │
│  ┌──────────────────────────────┐  │
│  │  $  ___________________      │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │  Descripción (opcional)      │  │
│  └──────────────────────────────┘  │
│                                    │
│  Categoría          Alimentación ▾ │
│  Universo           Personal ▾     │
│  Fondo              Sin fondo ▾    │
│  Fecha              Hoy ▾          │
│                                    │
│  ─────────────────────────────     │
│                                    │
│  [📷 Foto]  [🎤 Voz]  [÷ Cuotas]  │
│                                    │
│  ──────────  Guardar  ──────────   │
│                                    │
└────────────────────────────────────┘
```

---

## 11. Roadmap por Fases

### Fase 1 — Diseño y Arquitectura (Actual)
- Documento de producto completo
- Modelo de datos validado
- Wireframes de todas las pantallas clave
- Stack tecnológico definido
- Estructura de proyecto creada

### Fase 2 — MVP Core (Meses 1-3)

**Objetivo: Una aplicación funcional que sirva a la usuaria inicial (tú)**

Incluye:
- Autenticación (email/password)
- Universos Personal + Empresa
- Registro manual de movimientos
- Categorías personalizables
- Objetivos (Cumbres) básicos
- Fondos básicos
- Flujo de caja simple
- Patrimonio neto básico
- Simulador v1 (compra, gasto recurrente)
- Dashboard (Decision Hub)
- Aplicación web responsive (mobile-first)
- Datos locales con sincronización cloud

**Criterio de éxito Fase 2:** La usuaria usa la app todos los días. La app responde "¿puedo comprar esto?" en menos de 60 segundos.

### Fase 3 — OCR e Inteligencia (Meses 4-6)

- Captura fotográfica de boletas/tickets
- OCR con interpretación de productos
- Categorización automática con aprendizaje
- Reglas de automatización v1
- Simulador v2 (crédito, tarjetas, contrataciones)
- Módulo de tarjetas y deudas
- Reportes básicos
- Resumen mensual con IA narrativa

**Criterio de éxito Fase 3:** El tiempo de registro de un movimiento baja de 30 segundos a 10 segundos promedio. La categorización es correcta >85% de las veces.

### Fase 4 — Pulido y Preparación para Escala (Meses 7-9)

- UI/UX refinada a nivel premium
- Animaciones y transiciones
- Onboarding optimizado
- Inversiones básicas
- Proyectos (módulo empresa)
- Exportación de datos
- App móvil nativa (React Native)
- Testing con usuarios externos (beta privada)
- Métricas de uso y retención

**Criterio de éxito Fase 4:** 20 usuarios beta activos. NPS > 60. Retención a 30 días > 70%.

### Fase 5 — Lanzamiento y Crecimiento (Meses 10-18)

- Lanzamiento público (web + iOS + Android)
- Modelo de suscripción
- Conexiones bancarias (Open Banking donde disponible)
- Colaboración (compras compartidas, finanzas de pareja)
- API para integraciones
- Programa de referidos
- Dashboard para asesores financieros

### Fase 6 — Escala Global (Años 2-5)

Ver sección 21.

---

## 12. MVP Recomendado

### Lo que entra en el MVP

El MVP de Kumbre no es una versión incompleta. Es una versión intencionalmente pequeña que hace pocas cosas con excelencia.

**En el MVP:**

| Funcionalidad | Justificación |
|---|---|
| Registro manual de movimientos | Sin esto no hay base |
| Categorías personalizables | Core de la experiencia |
| Universos Personal + Empresa | Es el caso de uso principal |
| Objetivos (Cumbres) | Es el corazón filosófico |
| Fondos básicos | Sin fondos, los objetivos son solo deseos |
| Simulador v1 (compra + gasto recurrente) | El diferenciador principal |
| Decision Hub (Dashboard) | La pantalla que se abre cada día |
| Flujo de caja proyectado básico | Responde "¿estoy bien?" |
| Patrimonio neto | Perspectiva de largo plazo |
| Aplicación web responsive | El canal más rápido de lanzar |

**Criterio de inclusión:** ¿Puede la usuaria vivir sin esto en la versión 1? Si la respuesta es sí, no entra.

### Lo que NO entra en el MVP pero parece urgente

| Funcionalidad | Razón de exclusión |
|---|---|
| OCR / Foto de boleta | Complejidad alta, valor moderado para MVP |
| Conexiones bancarias | Regulatorio, costoso, no crítico para aprender |
| App móvil nativa | Web responsive es suficiente para validar |
| Tarjetas y deudas detalladas | El simulador puede aproximarlas |
| Inversiones | No urgente para el caso de uso inicial |
| IA narrativa | Requiere suficiente data histórica primero |
| Reglas automáticas | Demasiada complejidad de implementación |

### Definición de "Premium Small"

El MVP debe cumplir estos estándares sin excepción:
- Tiempo de carga < 2 segundos
- Registro de movimiento < 20 segundos
- Simulación < 5 segundos
- Cero errores en flujos principales
- Diseño que no se sienta provisional
- Lenguaje que genere calma, no ansiedad

---

## 13. Qué NO Construir Inicialmente

### Errores Comunes que Kumbre debe Evitar

**1. No construir un sistema de presupuestos tradicional**

Los presupuestos generan culpa. El usuario asigna límites y los rompe. Kumbre usa fondos (dinero real con propósito) en lugar de presupuestos (límites abstractos). Esta diferencia es filosófica y arquitectural.

**2. No construir un dashboard lleno de gráficos**

Más datos no es más claridad. Un dashboard sobrecargado genera lo opuesto de lo que buscamos: más ansiedad. El Decision Hub debe tener tres cosas visibles a primera vista: estado actual, progreso de objetivos, próximas semanas.

**3. No construir un sistema contable**

Kumbre no es para hacer contabilidad. No hay plan de cuentas, no hay asientos contables, no hay balance formal. Si alguien necesita eso, hay mejores herramientas.

**4. No construir gamificación superficial**

Puntos, badges y rachas son la versión barata de la motivación. Kumbre usa la motivación intrínseca: ver cómo tu cumbre se acerca, ver tu patrimonio crecer, tener claridad donde antes había confusión. Eso es infinitamente más poderoso que un badge.

**5. No construir notificaciones agresivas**

Las apps financieras que envían notificaciones de "¡Te has pasado del presupuesto!" destruyen la relación usuario-app. Kumbre solo notifica cuando el usuario se beneficia de saberlo: flujo bajo próximo, objetivo cerca de lograrse, recordatorio elegido por el usuario.

**6. No construir conexiones bancarias en el MVP**

Las conexiones bancarias son un gravamen: costos de licencia, problemas de actualización de APIs, falsos positivos, duplicados. Para la primera usuaria (y para aprender el producto), el registro manual es una ventaja: obliga a la conciencia activa sobre el dinero.

**7. No construir social features**

Comparaciones con otros usuarios, feeds públicos, "¿cómo se compara tu ahorro con el promedio?" — eso es destructivo. Las finanzas son profundamente personales.

---

## 14. Riesgos Técnicos

### RT-01: Complejidad del Motor de Simulación

**Severidad: Alta**

El simulador debe ser lo suficientemente flexible para manejar docenas de tipos de decisiones con interacciones complejas (cuotas + interés + impacto en flujo + impacto en objetivos simultáneamente). Un motor mal diseñado desde el inicio es difícil y costoso de corregir.

**Mitigación:** Diseñar el motor de simulación como un servicio puro de cálculo con input/output bien definido. Usar composition de calculadoras modulares. Implementar tests exhaustivos desde el día 1. No sobre-optimizar prematuramente.

### RT-02: Modelo de Datos Multi-Universo

**Severidad: Alta**

Diseñar mal el aislamiento entre universos puede llevar a bugs graves (datos mezclados entre personal y empresa). La refactorización posterior sería costosísima.

**Mitigación:** Diseñar con `universe_id` como campo de primera clase en TODAS las entidades desde el inicio. Row-level security en la base de datos. Tests de aislamiento como suite separada.

### RT-03: OCR en Fase 3

**Severidad: Media**

El OCR de boletas/tickets en Latinoamérica es desafiante: diversidad de formatos, calidad de impresión variable, tickets térmicos deteriorados, nombres de comercios no estandarizados.

**Mitigación:** Usar modelos de IA multimodal (GPT-4 Vision / Gemini Vision) en lugar de OCR tradicional. El modelo interpreta en lenguaje natural, no solo extrae texto. Diseñar el flujo para que la corrección del usuario sea parte esperada del proceso, y que esa corrección genere aprendizaje.

### RT-04: Performance con Datos Históricos

**Severidad: Media**

Usuarios activos con 2-3 años de datos pueden tener 10.000+ transacciones. Las proyecciones y simulaciones que iteran sobre toda la historia deben ser rápidas.

**Mitigación:** Índices correctos desde el inicio. Agregaciones pre-computadas (saldos, totales mensuales). Simulaciones calculadas en background si toman más de 500ms. No calcular lo que puede cachearse.

### RT-05: Seguridad de Datos Financieros

**Severidad: Crítica**

Los datos financieros de usuarios son de los más sensibles que existen. Una brecha destruiría la confianza irreversiblemente.

**Mitigación:** Cifrado en reposo y en tránsito. Sin datos financieros en logs. Autenticación con MFA desde la Fase 3. Auditorías de seguridad antes de lanzamiento público. Row-level security en base de datos. Política clara de no-sharing de datos con terceros.

---

## 15. Riesgos de Producto

### RP-01: El Simulador puede No Ser Usado

**Probabilidad: Media**

Si el simulador es difícil de encontrar, lento de usar, o sus resultados son confusos, los usuarios lo ignorarán y tendremos un producto ordinario.

**Mitigación:** El simulador debe ser accesible desde la pantalla de inicio con un solo toque. El botón "¿Qué pasa si...?" debe ser permanentemente visible. El flujo de simulación debe completarse en menos de 5 pasos.

### RP-02: El Registro Manual se Siente Como Trabajo

**Probabilidad: Alta**

Si registrar movimientos se siente tedioso, los usuarios abandona la app antes de ver valor. La mayoría de las apps financieras mueren aquí.

**Mitigación:** El registro rápido debe ser la acción más optimizada de toda la app. Debe completarse en < 20 segundos. La categorización automática aprende rápido. El OCR resuelve boletas en segundos. El usuario debe sentir que registrar le da claridad inmediata, no que es una obligación.

### RP-03: Complejidad Percibida

**Probabilidad: Media**

Kumbre tiene muchos conceptos: universos, fondos, objetivos, simulaciones, reglas. Si el onboarding no es extraordinario, el usuario se siente abrumado y abandona.

**Mitigación:** Onboarding progresivo — la app comienza simple y revela complejidad a medida que el usuario está listo. Módulos desactivados por defecto. El usuario activa lo que necesita. Nunca mostrar todas las funcionalidades al mismo tiempo.

### RP-04: Dependencia del Contexto Cultural

**Probabilidad: Media**

El producto está siendo diseñado para un contexto latinoamericano específico (tarjetas en cuotas, cultura financiera local, terminología). Al expandir a otros mercados, pueden surgir fricciones.

**Mitigación:** Diseñar todo como configurable desde el inicio. Moneda, terminología, categorías, tipos de tarjeta — nada hard-coded. Tener en cuenta desde el modelo de datos que "cuotas" funciona diferente en cada país.

### RP-05: Monetización Tardía

**Probabilidad: Alta**

Las apps de finanzas personales tienen un problema crónico de monetización. Los usuarios esperan que sea gratis porque "es solo una planilla".

**Mitigación:** Posicionar Kumbre como producto premium desde el día 1. Precio de lanzamiento que refleje valor real (USD 8-15/mes). Prueba gratis de 14 días, no freemium. El simulador y los módulos avanzados son features pagos. Las integraciones bancarias y la IA serán el valor del plan premium.

---

## 16. Recomendaciones de UX

### Principios de Experiencia que No Son Negociables

**1. Claridad sobre Completitud**
Mostrar menos, pero con perfecta claridad. Nunca mostrar datos que el usuario no pueda interpretar en 3 segundos.

**2. Progresión de Contexto**
La app debe parecer más simple la primera semana y más poderosa al tercer mes. El usuario descubre funcionalidades cuando las necesita, no desde el primer día.

**3. Lenguaje Sin Juicio**
Auditar cada texto de la app. Eliminar: "excediste", "te pasaste", "no puedes", "error", "límite superado". Reemplazar con: "si continúas este camino", "considera", "esto ocurrirá", "nuevo camino disponible".

**4. Zero Friction en el Flujo Principal**
El registro de un movimiento y la creación de una simulación son los flujos más usados. Deben ser perfectos. No pueden tener más de 3 pasos. No pueden requerir información que la app ya sabe.

**5. Confirmación sin Fricción**
Cada acción debe ser fácil de completar Y fácil de deshacer. El usuario nunca debe tener miedo de cometer un error en la app.

**6. Feedback Inmediato**
Cuando el usuario registra un gasto, la app debe mostrar inmediatamente cómo eso afecta sus objetivos y fondos. El ciclo de feedback debe ser instantáneo, no postergado a un reporte mensual.

**7. Onboarding como Experiencia, No Como Tutorial**
El primer uso debe sentirse como conocer un asistente inteligente, no como completar un formulario. Preguntas simples: "¿Cómo te llamas? ¿Qué quieres lograr este año? ¿Con qué empezamos — tu vida personal o tu empresa?" Y listo.

### Micro-Interacciones Clave

- Al completar un objetivo: animación de celebración discreta (no infantil)
- Al crear una simulación: transición suave hacia los resultados
- Al registrar un movimiento: confirmación visual rápida + impacto en fondo vinculado
- Al ver que un objetivo se atrasa: tono informativo, nunca alarmista

---

## 17. Recomendaciones de UI

### Sistema de Diseño

**Paleta de Colores**

Kumbre debe transmitir: calma, claridad, progreso, naturaleza (sin ser literal).

- **Base:** Blancos y grises muy claros (off-white, no blanco puro)
- **Primario:** Azul pizarra profundo (no azul bancario) — confianza sin frialdad
- **Acento:** Verde salvia o verde bosque — crecimiento, naturaleza, progreso
- **Alerta positiva:** Verde fresco (logros, ingresos)
- **Alerta neutra:** Ámbar suave (atención, no pánico)
- **Alerta crítica:** Rojo terracota (nunca rojo semáforo — es demasiado agresivo)
- **Backgrounds universo personal:** Tono frío
- **Backgrounds universo empresa:** Tono cálido (diferenciación inmediata)

**Tipografía**

- **Título/Marca:** Geist o Cal Sans — moderno, legible, premium
- **UI:** Inter — estándar de facto para apps de datos, alta legibilidad
- **Mono (datos financieros):** Geist Mono — los números deben verse en monoespaciado

**Escala Tipográfica**

Conservadora: máximo 5 tamaños. Los números financieros son el protagonista visual, no los títulos.

**Iconografía**

Lucide Icons o Phosphor Icons — lineales, elegantes, consistentes. Sin emojis en la UI funcional (sí en objetivos para personalización del usuario).

**Espaciado**

Generoso. El espacio en blanco es el lujo. Padding mínimo de 24px en tarjetas. Separación visual clara entre secciones. La pantalla nunca debe sentirse llena.

### Componentes Clave

**Tarjeta de Objetivo**
- Barra de progreso horizontal con color suave
- Número grande: monto actual / meta
- Subtexto: meses restantes
- Sin decoración excesiva

**Tarjeta de Simulación (Resultado)**
- Cifra de impacto principal: prominente
- Impacto en objetivos: lista ordenada por prioridad
- Alternativas: expandibles, no mostradas por defecto
- Tono: informativo, como un asesor que explica, no juzga

**Feed de Movimientos**
- Lista limpia, tipo Linear o Things 3
- Categoría como dot de color (no texto)
- Monto alineado a la derecha
- Agrupado por día con separador sutil

**Gráfico de Flujo de Caja**
- Minimal: área chart con gradiente muy suave
- Línea de cero prominente
- Puntos de interés marcados (compromisos, bajas proyectadas)
- Sin grid lines — no somos Excel

### Temas

- Claro (default)
- Oscuro
- Sin modo "automático por sistema" en MVP — el usuario elige

---

## 18. Recomendaciones Tecnológicas

### Principios de Decisión Tecnológica

1. **Velocidad de iteración sobre optimización prematura** — elegir tecnología que permita moverse rápido en los primeros 18 meses.
2. **Tipado fuerte en todo** — los errores en software financiero son inaceptables.
3. **Sin over-engineering en el MVP** — complejidad de microservicios solo cuando el crecimiento lo justifique.
4. **Escalable por diseño, no por implementación** — el modelo de datos y la arquitectura deben permitir escala; la implementación inicial puede ser monolítica.
5. **Vendor lock-in mínimo** — especialmente en infraestructura y IA.

### Decisiones Clave

**¿Web o Nativa?**

MVP: aplicación web con diseño mobile-first. Post Fase 3: React Native para iOS y Android con código compartido. La web permite iteraciones rápidas sin esperar aprobaciones de App Store.

**¿Monolito o Microservicios?**

MVP: monolito bien modular. La separación en servicios llega cuando hay un equipo de >5 ingenieros o cuando la carga lo justifica. El monolito modular es más rápido de construir, más fácil de debuggear, y la arquitectura modular del producto garantiza que la extracción futura sea posible.

**¿SQL o NoSQL?**

PostgreSQL. Los datos financieros son relacionales por naturaleza. La consistencia es crítica. Las capacidades de JSON de PostgreSQL (jsonb) manejan los campos de metadata flexible sin sacrificar integridad.

---

## 19. Stack Recomendado

### Frontend

| Decisión | Tecnología | Razón |
|---|---|---|
| Framework | **Next.js 15 (App Router)** | SSR/SSG, performance, ecosistema React, deploy en Vercel en segundos |
| Lenguaje | **TypeScript** | Tipado estricto para software financiero |
| UI Library | **shadcn/ui** | Componentes sin dependencia, 100% customizables, código propio |
| Styling | **Tailwind CSS** | Velocidad de desarrollo, consistencia |
| Estado global | **Zustand** | Simple, sin boilerplate, suficiente para el MVP |
| Estado servidor | **TanStack Query** | Cache, sincronización, loading states |
| Gráficos | **Recharts** o **Tremor** | Declarativos, personalizables, React-native |
| Animaciones | **Framer Motion** | Fluidas, no pesadas, profesionales |
| Formularios | **React Hook Form + Zod** | Validación tipada, performance |
| Mobile futuro | **React Native (Expo)** | Reutiliza lógica de negocio y tipos |

### Backend

| Decisión | Tecnología | Razón |
|---|---|---|
| Framework | **Next.js API Routes** (MVP) → **Hono.js** (Fase 3+) | Comenzar simple, migrar a servidor independiente cuando se necesite |
| Lenguaje | **TypeScript** | Tipos compartidos entre frontend y backend |
| ORM | **Drizzle ORM** | TypeScript-first, tipado perfecto, rendimiento |
| Base de datos | **PostgreSQL (Supabase)** | Managed, realtime built-in, auth built-in, row-level security |
| Auth | **Supabase Auth** | Magic link, Google, sin fricción |
| Storage (OCR) | **Supabase Storage** | Imágenes de boletas |
| Colas | **Inngest** (MVP) → **BullMQ** (escala) | Background jobs para OCR, simulaciones pesadas |
| Email | **Resend** | API simple, deliverability excelente |

### Inteligencia Artificial

| Funcionalidad | Tecnología | Razón |
|---|---|---|
| OCR / Interpretación boletas | **Claude 3.5 Sonnet** (Vision) | Mejor comprensión contextual de documentos |
| Categorización automática | **Embeddings + clasificador propio** | Control, costo, privacidad |
| Resumen narrativo mensual | **Claude Haiku 4.5** | Rápido, económico, buena escritura |
| Simulador (cálculos) | **Propio** — no IA | Los cálculos financieros son determinísticos, no probabilísticos |
| Chat financiero futuro | **Claude Sonnet 4.6** | Conversación contextual con datos del usuario |

### Infraestructura y DevOps

| Decisión | Tecnología | Razón |
|---|---|---|
| Deploy frontend | **Vercel** | Zero-config, previews por PR, excelente para Next.js |
| Deploy backend (futuro) | **Railway** o **Fly.io** | Simple, económico, escala cuando necesita |
| Base de datos | **Supabase** (managed PostgreSQL) | Sin ops de DB en el MVP |
| CDN / Assets | **Vercel Edge Network** | Incluido |
| Monitoring | **Sentry** | Errores en producción |
| Analytics | **PostHog** | Product analytics, session recording, feature flags |
| CI/CD | **GitHub Actions** | Tests automáticos, deploy en merge |

### Herramientas de Desarrollo

| Herramienta | Decisión |
|---|---|
| Monorepo | **Turborepo** (si se separa frontend/backend) |
| Testing | **Vitest** (unit), **Playwright** (e2e) |
| Linting | **ESLint + Prettier** |
| Git hooks | **Husky + lint-staged** |
| Tipos compartidos | **Zod schemas** exportados |

---

## 20. Organización de Carpetas

```
kumbre/
├── apps/
│   ├── web/                          # Next.js App Router
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── onboarding/
│   │   │   ├── (app)/
│   │   │   │   ├── layout.tsx        # Shell principal con navegación
│   │   │   │   ├── page.tsx          # Decision Hub (Dashboard)
│   │   │   │   ├── objectives/       # Cumbres
│   │   │   │   ├── simulator/        # Simulador de decisiones
│   │   │   │   ├── transactions/     # Registro de movimientos
│   │   │   │   ├── funds/            # Fondos
│   │   │   │   ├── perspective/      # Reportes y patrimonio
│   │   │   │   ├── business/         # Módulo empresa
│   │   │   │   └── settings/         # Configuración
│   │   │   └── api/
│   │   │       ├── auth/
│   │   │       ├── transactions/
│   │   │       ├── objectives/
│   │   │       ├── funds/
│   │   │       ├── simulator/
│   │   │       └── universes/
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui base components
│   │   │   ├── layout/               # Shell, Sidebar, Navigation
│   │   │   ├── decisions/            # Decision Hub components
│   │   │   ├── simulator/            # Simulator components
│   │   │   ├── objectives/           # Objectives components
│   │   │   ├── transactions/         # Transaction components
│   │   │   ├── funds/                # Funds components
│   │   │   ├── charts/               # Chart components
│   │   │   └── shared/               # Shared across features
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── stores/                   # Zustand stores
│   │   └── lib/
│   │       ├── api.ts                # API client
│   │       └── utils.ts
│   └── mobile/                       # React Native / Expo (Fase 4)
│
├── packages/
│   ├── core/                         # Lógica de negocio pura (sin framework)
│   │   ├── simulator/
│   │   │   ├── engines/
│   │   │   │   ├── purchase.ts       # Motor: simulación de compra
│   │   │   │   ├── recurring.ts      # Motor: gasto recurrente
│   │   │   │   ├── credit.ts         # Motor: crédito/tarjeta
│   │   │   │   ├── income.ts         # Motor: nuevo ingreso
│   │   │   │   └── hire.ts           # Motor: contratación
│   │   │   ├── projections.ts        # Proyección de flujo de caja
│   │   │   ├── objectives-impact.ts  # Impacto en objetivos
│   │   │   └── index.ts
│   │   ├── funds/
│   │   ├── objectives/
│   │   └── cashflow/
│   │
│   ├── db/                           # Drizzle ORM schemas y migrations
│   │   ├── schema/
│   │   │   ├── users.ts
│   │   │   ├── universes.ts
│   │   │   ├── accounts.ts
│   │   │   ├── transactions.ts
│   │   │   ├── categories.ts
│   │   │   ├── objectives.ts
│   │   │   ├── funds.ts
│   │   │   ├── simulations.ts
│   │   │   ├── cards.ts
│   │   │   ├── debts.ts
│   │   │   └── investments.ts
│   │   ├── migrations/
│   │   └── index.ts
│   │
│   ├── types/                        # Tipos TypeScript compartidos
│   │   ├── universe.ts
│   │   ├── transaction.ts
│   │   ├── objective.ts
│   │   ├── simulation.ts
│   │   └── index.ts
│   │
│   ├── validations/                  # Zod schemas compartidos
│   │   ├── transaction.schema.ts
│   │   ├── objective.schema.ts
│   │   ├── simulation.schema.ts
│   │   └── index.ts
│   │
│   └── ai/                           # Módulo de IA
│       ├── ocr/
│       │   ├── receipt-parser.ts     # Interpretación de boletas
│       │   └── learning.ts           # Sistema de aprendizaje
│       ├── categorization/
│       │   ├── classifier.ts         # Clasificador automático
│       │   └── rules-engine.ts       # Motor de reglas
│       └── narrative/
│           └── monthly-summary.ts    # Resumen mensual IA
│
├── docs/
│   ├── PRODUCT_DESIGN.md             # Este documento
│   ├── architecture/
│   ├── decisions/                    # Architecture Decision Records (ADRs)
│   └── wireframes/
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── turbo.json
├── package.json
└── README.md
```

---

## 21. Estrategia de Escalamiento — 5 Años

### Año 1 — Validación y Producto-Market Fit

**Foco:** Un solo tipo de usuario. Una sola región (Chile, Latinoamérica hispanohablante). Un producto que funciona perfectamente para emprendedoras con vida financiera dual.

**Métricas de éxito:**
- 500 usuarios activos pagos
- NPS > 65
- Retención a 90 días > 60%
- Churn mensual < 5%

**Modelo de negocio:** Suscripción mensual USD 12/mes o USD 99/año. Sin freemium. Trial de 14 días.

### Año 2 — Expansión Regional

**Foco:** Colombia, México, Argentina, Perú. Localización de moneda y normativa. Primer equipo (2-3 personas).

**Nuevas funcionalidades:**
- Conexiones bancarias (Open Banking regional)
- App móvil nativa (iOS primero)
- Módulo para parejas / finanzas compartidas
- API para asesores financieros

**Métricas de éxito:**
- 5.000 usuarios pagos
- MRR > USD 50.000
- Primera inversión externa o bootstrapped rentable

### Año 3 — Expansión de Producto

**Foco:** Ampliar el mercado vertical hacia PyMEs. El módulo empresa se convierte en un producto propio con precio diferenciado.

**Nuevas funcionalidades:**
- Kumbre Business (PyMEs 1-20 personas)
- Multiusuario por empresa
- Integraciones con sistemas contables (facturación electrónica)
- Chat financiero con IA contextual
- Programa de partners (contadores, asesores)

**Métricas de éxito:**
- 20.000 usuarios totales (personal + business)
- ARR > USD 2M
- Equipo de 8-12 personas

### Año 4 — Expansión Global (Español + Inglés)

**Foco:** España, Estados Unidos (mercado latino), Brasil (con localización).

**Nuevas funcionalidades:**
- Kumbre en inglés
- Adaptación de módulos para regulaciones de cada país
- Kumbre Advisor (plataforma para asesores financieros)
- Datos agregados anonimizados como producto B2B

**Métricas de éxito:**
- 100.000 usuarios
- ARR > USD 10M
- Serie A o bootstrapped profitable

### Año 5 — Plataforma Financiera de Decisiones

**Foco:** Kumbre no es una app. Es la plataforma sobre la que las personas y sus asesores toman decisiones financieras.

**Expansión:**
- API pública para integraciones
- Marketplace de módulos y templates
- White-label para bancos e instituciones financieras
- Kumbre AI: asistente financiero personal contextual, entrenado con los datos del usuario (con consentimiento explícito)

**Métricas de éxito:**
- 500.000+ usuarios
- ARR > USD 50M
- Expansión hacia mercados anglosajones con identidad propia

---

## 22. Ventajas Competitivas Difíciles de Copiar

### VCA-01: La Capa de Sentido

La mayoría de las apps registran transacciones. Kumbre conecta cada transacción con los objetivos de vida del usuario. Esa conexión — gastaste X, tu casa se retrasa Y meses — es emocionalmente poderosa y técnicamente compleja de replicar sin el modelo de datos correcto desde el inicio.

### VCA-02: El Motor de Simulación

Construir un simulador que maneje 10+ tipos de decisiones con interacciones correctas (cuotas + interés + impacto en flujo + impacto en objetivos simultáneamente) es meses de trabajo. Hacerlo con la UX correcta (no técnica, no intimidante) es aún más difícil. Una vez que el motor existe y está validado, los competidores que intentan copiarlo enfrentan la misma curva de aprendizaje.

### VCA-03: El Sistema de Aprendizaje OCR

Cada corrección que un usuario hace al OCR mejora el sistema. La base de conocimiento que se construye sobre comercios locales, productos, categorías — especialmente en mercados latinoamericanos donde no existe esta data — es un activo que crece con el tiempo y es imposible de replicar sin los mismos usuarios.

### VCA-04: El Lenguaje y la Filosofía

La voz de Kumbre — sin culpa, sin castigos, con perspectiva de largo plazo — es una ventaja cultural que tarda años en construirse. Es consistencia en miles de micro-decisiones de UX writing. No se puede copiar con un sprint de diseño.

### VCA-05: Datos para Benchmarking (Año 3+)

Con suficientes usuarios, Kumbre puede responder preguntas que nadie en el mercado hispanohablante puede responder: "¿Cuánto ahorra en promedio un emprendedor en Chile? ¿Cuál es el tiempo promedio para juntar pie de una casa en México?" Esos datos son producto. Ese conocimiento es moat.

### VCA-06: Red de Asesores (Año 3+)

Si los asesores financieros usan Kumbre para servir a sus clientes, el producto se convierte en infraestructura. Los asesores no cambian de plataforma fácilmente. La red de asesores-usuarios crea una barrera de switching muy alta.

---

## 23. Qué Cambiaría o Eliminaría

Estas son mis discrepancias con el diseño inicial. Las propongo porque creo que son superiores:

### C-01: Eliminar "Fondos de Compras" como Entidad Separada

Propusiste registrar "compras" como entidad propia. Mi recomendación: las compras son transacciones. La distinción entre "compra" y "gasto" crea confusión innecesaria en el modelo de datos. Una compra en cuotas es una transacción recurrente con un padre. Eso ya está en el modelo de datos propuesto.

### C-02: Cambiar "Gamificación" por "Ritual de Progreso"

Mencioné que evitaría gamificación superficial. Pero sí hay algo valioso: crear rituales. Una revisión semanal de 3 minutos ("tu semana financiera"), un momento de celebración cuando un objetivo se logra, un resumen de fin de mes con tono positivo. Eso no es gamificación — es diseño de hábito. Es mucho más poderoso y respeta más al usuario.

### C-03: Reestructurar el Onboarding como "Tu Primera Cumbre"

En lugar de un onboarding de configuración (agregar cuentas, categorías, universos), propongo comenzar con una pregunta: "¿Cuál es la primera cumbre que quieres lograr?" El usuario define UN objetivo, pone un monto, una fecha. Luego la app pregunta "¿cuánto tienes ahora?" Y con eso, ya tenemos una app que funciona. La configuración avanzada (universos, múltiples cuentas, reglas) llega después.

### C-04: Renombrar "Universos" a "Espacios" o "Mundos"

"Universo" es técnico e inusual. "Espacio" o "Mundo" comunica mejor la idea de contextos separados para usuarios no técnicos. Sin embargo, "Universo" puede funcionar como término interno. La UI puede usar "Personal" y "Cambucho" directamente, sin exponer la palabra "universo" al usuario.

### C-05: No Construir Módulo de Voz en el MVP

Dictado de movimientos por voz tiene una complejidad técnica alta y una tasa de abandono alta (los usuarios raramente dictan en público). El OCR es más valioso y más usado. La voz puede ser Fase 3 o Fase 4.

### C-06: No Exponer "Patrimonio Neto" Como Módulo Separado

El patrimonio neto es una vista dentro de la sección de Perspectiva, no un módulo independiente con su propia entrada en la navegación. Elevar el patrimonio neto a la navegación principal sobrecarga la arquitectura de información. Es una vista derivada, no una entidad de primer nivel.

### C-07: Inversiones en Fase 3, No Fase 2

El módulo de inversiones requiere actualización de precios, conexión a APIs de mercado, manejo de divisas, y una UX específica. Para la usuaria inicial (que no definió inversiones complejas como necesidad inmediata), incluirlo en el MVP agrega complejidad sin valor proporcional. Fase 3 es el momento correcto.

---

## 24. Qué Agregaría para Crear un Producto Extraordinario

Estas son las ideas que podrían diferenciar a Kumbre globalmente:

### A-01: El "Panorama de Vida" (Life Panorama)

Una vista única que muestra todos los objetivos del usuario en una línea de tiempo visual. No una lista — una narrativa temporal. "En 2027 llegas a Europa. En 2029 compras tu casa. En 2034 alcanzas independencia financiera." Ver la vida completa de un vistazo cambia cómo las personas se relacionan con su dinero. Esto no existe en ningún competidor del mercado.

### A-02: "Modo Pausa" para Decisiones Impulsivas

Cuando el usuario abre el simulador y el resultado muestra un impacto negativo importante en sus objetivos, la app ofrece "Pausar esta decisión 72 horas" — la guarda con un recordatorio para revisarla en 3 días. El 90% de las decisiones impulsivas cambian en 72 horas. Este feature simple tiene un valor conductual enorme y refuerza la filosofía central del producto.

### A-03: "Pregunta Semanal"

Cada semana, la app hace UNA pregunta contextual basada en los datos del usuario: "Esta semana gastaste más que el mes pasado en restaurantes. ¿Fue intencional?" No un reporte. No un juicio. Solo una pregunta. Que el usuario responda "sí, fue el cumpleaños de mamá" o "no, voy a ajustar". Esas respuestas construyen conciencia y también alimentan el sistema de aprendizaje.

### A-04: "Clima Financiero"

Un indicador persistente pero discreto que responde: "¿Cómo estoy hoy?" No un número. Una temperatura. "Estás sólido" / "Semana de cuidado" / "Buen momento para ahorrar más" / "Flujo ajustado próximas 2 semanas". Basado en flujo de caja proyectado, compromisos pendientes y progreso de objetivos. Simple, instantáneo, útil.

### A-05: "Plantillas de Vida" para Onboarding

En el onboarding, ofrecer plantillas que representen situaciones comunes: "Soy empleado con sueldo fijo", "Tengo una empresa pequeña", "Soy freelancer con ingresos variables", "Quiero comprar mi primera casa", "Acabo de empezar a ahorrar". Cada plantilla pre-configura categorías, objetivos sugeridos y módulos activos apropiados. El usuario llega a una app ya configurada para su vida en minutos.

### A-06: Kumbre Coach (Año 2-3)

No un chatbot genérico. Un asistente que conoce perfectamente los datos del usuario y puede responder: "¿Cuándo podría aumentarme el sueldo desde Cambucho sin afectar la operación?" "¿Qué pasaría si tomo un proyecto de $5.000 en agosto?" La diferencia con un chatbot genérico: tiene acceso a todos los datos del usuario con su consentimiento y responde con precisión, no con generalidades.

### A-07: "Decisiones Vinculadas"

Cuando el usuario crea una simulación, puede vincularla a un objetivo: "Estoy evaluando comprar un auto para Cambucho". Si en el futuro el objetivo de casa se mueve, la app puede recalcular cómo cambiaría esa simulación. Las decisiones no viven en aislamiento — están conectadas entre sí y con el panorama completo.

### A-08: "Vista de Pareja / Familia" (Año 2)

Dos usuarios pueden conectar sus cuentas para ver finanzas compartidas sin perder la privacidad individual. Cada persona elige qué comparte: solo los objetivos comunes, solo los gastos compartidos, o todo. Esta feature multiplica el mercado inmediatamente y crea un caso de uso viral (parejas que quieren comprar una casa juntos).

---

## CRITERIOS DE APROBACIÓN DE ESTE DOCUMENTO

Antes de pasar a la Fase 2 (implementación), este documento debe responder afirmativamente a:

- [ ] ¿La visión del producto es clara para cualquier persona que lo lea?
- [ ] ¿El MVP está suficientemente reducido para construirse en 3 meses?
- [ ] ¿El modelo de datos soporta todos los casos de uso definidos?
- [ ] ¿La arquitectura modular permite activar/desactivar funcionalidades sin refactoring?
- [ ] ¿El flujo de navegación es simple y tiene sentido?
- [ ] ¿Las recomendaciones de UX/UI son suficientemente específicas para implementar?
- [ ] ¿El stack tecnológico es el adecuado para el tamaño del equipo actual?
- [ ] ¿Los riesgos identificados tienen mitigaciones concretas?

---

*Documento preparado por el equipo fundador conceptual de Kumbre · Junio 2026*
*Este documento es un artefacto vivo — debe actualizarse conforme el producto aprende.*
