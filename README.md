# 💰 Economic Balance

**Autores:**

* Rubén Saavedra
* Iván Pérez
* José Antonio


## 🧾 Descripción del Proyecto

**Economic Balance** es una aplicación web inspirada en el estilo de organización de Notion, diseñada para gestionar presupuestos personales o familiares de forma sencilla, visual y organizada.

El objetivo principal es permitir al usuario controlar su economía diaria mediante bloques dinámicos de ingresos y gastos, facilitando el seguimiento del dinero de forma clara y accesible.

## 🎯 Objetivos Principales

* Crear bloques personalizados de **Ingresos** y **Gastos**
* Clasificar gastos por **categorías predefinidas**
* Diferenciar entre:

  * Gastos **fijos** (hipoteca, luz, agua…)
  * Gastos **variables** (ocio, comida, transporte…)
* Establecer presupuestos para categorías variables
* Visualizar el progreso del gasto respecto al presupuesto
* Desplegable con historial de movimientos (ej: `21/02 -50€`)

## 🧱 Funcionalidades Clave

### 📊 Gestión por Bloques

El usuario podrá crear bloques organizados como:

* Bloque de Ingresos
* Bloque de Gastos

Cada bloque tendrá categorías por defecto como:

* Hipoteca
* Ocio
* Comida
* Luz
* Agua
* Transporte
* Otros

### 📉 Control de Presupuestos Variables

* Definir un presupuesto (ej: 200€ para ocio)
* Añadir gastos progresivamente
* Visualizar cuánto se ha gastado y cuánto queda
* Historial desplegable de movimientos por fecha

Ejemplo:

```
Presupuesto Ocio: 200€
- 21/02: -50€
- 25/02: -30€
Total gastado: 80€
Restante: 120€
```

## 🛠️ Tecnologías Utilizadas

### Frontend

* Angular
* HTML5
* Bootstrap
* TypeScript

### Backend

* Node.js
* Express

### Base de Datos

* MongoDB (persistencia de datos)

## 🔌 APIs Externas

* API de Google (inicio de sesión con cuenta Google)
* Posible integración futura con más APIs financieras

## 🧑‍💻 Estructura del Proyecto

```
economic-balance/
│── frontend/        # Aplicación Angular
│── backend/         # Servidor Node.js + Express
│── README.md
```

## 🚀 Futuras Mejoras

* Gráficas de estadísticas financieras
* Exportación de datos (PDF/Excel)
* Modo oscuro
* Sincronización en tiempo real
* App móvil

## 📌 Público Objetivo

* Familias que quieran controlar sus gastos
* Estudiantes
* Usuarios que buscan una gestión económica simple
* Personas que desean visualizar su presupuesto de forma clara

<br>

<p align="center">
  <img src="https://images.squarespace-cdn.com/content/v1/65c9daef199ea70aa66592fe/3531b00a-f155-4567-ad44-ea0ad1c90555/White+on+black.png" 
       alt="Economic Balance Logo" 
       width="300">
</p>

