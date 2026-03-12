# Invitación de boda — Angel & Clara

## Ver cambios localmente
1. Abre una terminal en este proyecto.
2. Ejecuta:
   ```bash
   python -m http.server 8000
   ```
3. Abre en tu navegador:
   - http://localhost:8000/index.html

## Si no ves cambios (muy común por caché)
- Haz recarga forzada:
  - **Windows/Linux:** `Ctrl + F5` o `Ctrl + Shift + R`
  - **Mac:** `Cmd + Shift + R`
- Abre en incógnito para descartar caché.
- Verifica que el servidor esté corriendo en el mismo folder del proyecto.

## Verificación rápida de JS
```bash
node --check script.js
```

## Nota
El `index.html` incluye versión en `style.css` y `script.js` (`?v=20260312`) para evitar caché agresivo en navegador.
