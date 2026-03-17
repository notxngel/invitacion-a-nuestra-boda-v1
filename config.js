/**
 * Configuración centralizada del proyecto.
 * Para rotar el webhook, solo edita este archivo.
 *
 * SEGURIDAD: En Make.com, configura el módulo Webhook para que
 * valide el encabezado "Origin: https://notxngel.github.io"
 * y rechace cualquier otra procedencia.
 */
const CONFIG = Object.freeze({
  webhookURL: "https://hook.us2.make.com/1csu9bqqywlg9i4fz4uxv7ge34vdvcan",
  adminKey: "r7xQ3",
  maxCupos: 4,
  rateLimitMs: 30000,
  fetchTimeoutMs: 10000,
  securityToken: "boda-angel-clara-2026"
});
