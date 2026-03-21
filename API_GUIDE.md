# Guía de Integración API (RSVP Webhook)

Esta sección describe la integración entre el formulario del sitio web y el servicio de procesamiento (backend) gestionado a través de Make.com.

## Endpoint

- **URL**: `https://hook.us2.make.com/1csu9bqqywlg9i4fz4uxv7ge34vdvcan`
- **Método**: `POST`
- **Content-Type**: `application/json`

## Estructura del Body (JSON)

El cuerpo de la petición contiene los siguientes campos:

| Campo | Tipo | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| `nombre` | String | Nombre del invitado titular. | `"Ana García"` |
| `telefono` | String | Número de contacto (WhatsApp). | `"+1 123 456 7890"` |
| `invitados` | Integer | Número total de personas confirmadas. | `2` |
| `asistencia` | String | Estado de confirmación (`si` o `no`). | `"si"` |
| `mensaje` | String | Texto combinado con acompañantes y deseos. | `"Acompañantes: Juan... Mensaje: Felicidades!"` |
| `title` | String | Alias para `nombre` (Compatibilidad Notion). | `"Ana García"` |

### Ejemplo de Petición

```json
{
  "nombre": "Clara Pérez",
  "title": "Clara Pérez",
  "telefono": "+1 987 654 3210",
  "invitados": 1,
  "asistencia": "si",
  "mensaje": "¡Allí estaré!"
}
```

## Respuestas

### ✅ Éxito (200 OK)
Indica que los datos se recibieron correctamente y se procesaron en la base de datos (Notion/Google Sheets).
- **Acción en el frontend**: Almacena `rsvpStatus: 'sent'` en `localStorage` y muestra el mensaje de éxito.

### ❌ Error (400 / 500)
Indica un problema con el envío o el servidor.
- **Acción en el frontend**: Muestra un mensaje de error visual en el botón de envío y permite reintentar.

## Seguridad

> [!IMPORTANT]
> El webhook está configurado para aceptar llamadas únicamente desde el dominio autorizado `notxngel.github.io`. Peticiones desde otros orígenes serán rechazadas por política de CORS.

---
Documentación técnica generada para el proyecto Boda de Angel & Clara.
