# Invitación a Nuestra Boda - Angel & Clara

Invitación digital elegante y minimalista para la boda de Angel y Clara. Este proyecto presenta una landing page interactiva con cuenta regresiva, galería de fotos, detalles del evento y confirmación de asistencia (RSVP) integrada.

## Stack Tecnológico

- **Frontend**: HTML5 semántico, CSS3 (Metodología BEM, Variables CSS), JavaScript Vanilla.
- **Fuentes**: Playfair Display (Serif), Lato (Sans-serif) vía Google Fonts.
- **Integración**: Make.com (Webhooks) para procesamiento de RSVP.
- **Diseño**: Responsivo, minimalista con temática verde oliva y oro.

## Requisitos Previos

- Cualquier navegador web moderno (Chrome, Firefox, Safari, Edge).
- Servidor web estático (ej. Live Server de VS Code, Nginx, Apache, GitHub Pages).

## Instalación y Uso

1. **Clonar el repositorio o descargar los archivos**:

   ```bash
   git clone https://github.com/notxngel/invitacion-a-nuestra-boda-v1.git
   cd invitacion-a-nuestra-boda-v1
   ```

2. **Abrir en un servidor local**:
   Si usas VS Code, puedes usar la extensión **Live Server**. Simplemente haz clic derecho en `index.html` y selecciona "Open with Live Server".

3. **Acceso rápido**:
   Abre el archivo `index.html` directamente en tu navegador.

## Estructura del Proyecto

```text
invitacion-a-nuestra-boda-v1/
├── images/             # Activos visuales (fotografías, íconos, fondos)
├── index.html          # Estructura principal de la invitación
├── script.js           # Lógica interactiva (Cuenta regresiva, Carrusel, Formulario)
├── style.css           # Estilos generales y diseño responsivo (BEM)
├── boda.ics            # Archivo de calendario para invitados (Apple Calendar)
└── favicon.png         # Ícono del sitio
```

## Configuración y URL Parameters

El sistema de confirmación de asistencia utiliza parámetros en la URL para personalizar la experiencia:

| Parámetro | Descripción                                         | Ejemplo      | Obligatorio     |
| :-------- | :-------------------------------------------------- | :----------- | :-------------- |
| `c`       | Número de cupos permitidos (1-4).                   | `?c=2`       | No (Default: 1) |
| `dbg`     | Modo depuración para habilitar reinicio de pruebas. | `?dbg=r7xQ3` | No              |

## Pruebas

Este proyecto no cuenta con un framework de testing automatizado. Las pruebas se realizan de forma manual verificando:

- La interactividad del carrusel.
- El correcto funcionamiento del contador.
- La validación de campos en el formulario RSVP.
- El envío de datos al webhook configurado (`_wh` en `script.js`).

## Contribución

Actualmente es un proyecto de uso personal, pero si deseas sugerir mejoras:

1. Haz un fork del proyecto.
2. Crea una rama para tu mejora (`git checkout -b feature/mejora`).
3. Envía un Pull Request.

---

Hecho con ❤️ por Angel & Clara.
