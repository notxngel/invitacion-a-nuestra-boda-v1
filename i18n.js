/** i18n — Soporte bilingüe (ES por defecto, EN con ?lang=en) **/

const LANG = (() => {
  const params = new URLSearchParams(window.location.search);
  return params.get("lang") === "en" ? "en" : "es";
})();

const I18N = {
  es: {
    // Navbar
    nav_home: "Inicio",
    nav_moments: "Momentos",
    nav_details: "Detalles",

    // Hero
    hero_eyebrow: "¡NOS CASAMOS!",
    hero_date: "Julio 16, 2026",
    hero_instruction: "Desplázate para conocer los detalles del evento.",
    countdown_days: "Días",
    countdown_hours: "Horas",
    countdown_minutes: "Minutos",
    countdown_seconds: "Segundos",
    countdown_passed: "¡A partir de hoy, somos esposos!",

    // Album
    album_title: "Momentos que nos trajeron aquí",
    album_subtitle: "Un día que cambio nuestras vidas para siempre",
    caption_1: "La gran pregunta",
    caption_2: "¡Dijo que sí!",
    caption_3: "Tú y yo, siempre",
    caption_4: "Para siempre",
    caption_5: "Con todo mi corazón",
    caption_6: "Mi lugar favorito",

    // Details
    details_title: "Detalles del Evento",
    details_subtitle: "Todo lo que necesitas saber",
    timeline_event: "Ceremonia & Recepción",
    timeline_desc: "4:30 PM - Inicio puntual; los esperamos para celebrar juntos.",
    dress_title: "Código de Vestimenta",
    dress_desc: "Formal / Etiqueta Rigurosa / No usar colores verdes o blancos.",
    no_kids_title: "No Niños",
    no_kids_desc: "Celebración sólo para adultos.",
    gifts_title: "Regalos",
    gifts_desc: "Lluvia de sobres.",
    seats_title: "Cupos",
    seats_desc: "Agradecemos respetar los cupos asignados en su invitación.",

    // Locations
    loc_title: "¿Cómo Llegar?",
    loc_subtitle: "Te esperamos en",
    loc_btn: "Abrir en Google Maps",

    // RSVP
    rsvp_title: "Confirmación",
    rsvp_subtitle: "Sera un placer compartir este momento tan especial con ustedes",
    rsvp_card_subtitle: "Esperamos contar con tu presencia",
    rsvp_card_text: "¿Ya revisaste todos los detalles del evento? Asegúrate de leerlos antes de confírmarnos tu asistencia.",
    rsvp_deadline: "Fecha límite: 22 de Mayo",
    rsvp_open_btn: "Abrir Formulario",

    // Modal Form
    modal_title: "Confirmación",
    modal_subtitle: "Será un placer contar contigo",
    modal_deadline: "Por favor confirma antes del <strong>22 de Mayo</strong>",
    form_name: "Tu nombre completo",
    form_companion: "Acompañante",
    form_name_placeholder: "Ej: Ana García",
    form_companion_placeholder: "Nombre completo",
    form_attendance: "¿Asistirás?",
    form_yes: "¡Sí, ahí estaré!",
    form_no: "Lo siento, no podré ir",
    form_phone: "Teléfono Móvil (WhatsApp)",
    form_phone_placeholder: "Ej. +1 123 456 7890",
    form_message: "Mensaje (Opcional)",
    form_message_placeholder: "Déjanos tus mejores deseos...",
    form_submit: "Enviar Confirmación",

    // Validation
    val_name: "Por favor, ingresa tu nombre.",
    val_phone: "Por favor, ingresa tu teléfono.",
    val_rate_limit: "Por favor espera unos segundos antes de intentar de nuevo.",

    // Success
    success_title: "¡Gracias!",
    success_subtitle: "Tu confirmación fue recibida",
    success_text: "Nos alegra mucho contar contigo en este día tan especial. ¡Nos vemos el 16 de julio!",
    success_apple_cal: "Añadir a Apple Calendar",
    success_google_cal: "Añadir a Google Calendar",
    success_close: "Cerrar Formulario",
    success_test: "(Pruebas: Enviar otra respuesta)",

    // Error
    error_default: "Hubo un error. Intenta de nuevo",
    error_timeout: "Tiempo agotado. Intenta de nuevo.",

    // Footer
    footer_eyebrow: "Con cariño y gratitud",
    footer_made: "Hecho con amor para nuestros invitados"
  },

  en: {
    // Navbar
    nav_home: "Home",
    nav_moments: "Moments",
    nav_details: "Details",

    // Hero
    hero_eyebrow: "WE'RE GETTING MARRIED!",
    hero_date: "July 16, 2026",
    hero_instruction: "Scroll down for event details.",
    countdown_days: "Days",
    countdown_hours: "Hours",
    countdown_minutes: "Minutes",
    countdown_seconds: "Seconds",
    countdown_passed: "As of today, we are married!",

    // Album
    album_title: "Moments that brought us here",
    album_subtitle: "A day that changed our lives forever",
    caption_1: "The big question",
    caption_2: "She said yes!",
    caption_3: "You and me, always",
    caption_4: "Forever",
    caption_5: "With all my heart",
    caption_6: "My favorite place",

    // Details
    details_title: "Event Details",
    details_subtitle: "Everything you need to know",
    timeline_event: "Ceremony & Reception",
    timeline_desc: "4:30 PM - Doors open; we look forward to celebrating with you.",
    dress_title: "Dress Code",
    dress_desc: "Formal / Black Tie / No green or white colors, please.",
    no_kids_title: "Adults Only",
    no_kids_desc: "This is an adults-only celebration.",
    gifts_title: "Gifts",
    gifts_desc: "Cash gifts are preferred.",
    seats_title: "Seats",
    seats_desc: "Please respect the number of seats assigned in your invitation.",

    // Locations
    loc_title: "How to Get There",
    loc_subtitle: "We are waiting for you at",
    loc_btn: "Open in Google Maps",

    // RSVP
    rsvp_title: "RSVP",
    rsvp_subtitle: "It will be a pleasure to share this special moment with you",
    rsvp_card_subtitle: "We hope to count on your presence",
    rsvp_card_text: "Have you reviewed all the event details? Make sure to read them before confirming your attendance.",
    rsvp_deadline: "Deadline: May 22nd",
    rsvp_open_btn: "Open Form",

    // Modal Form
    modal_title: "Confirmation",
    modal_subtitle: "It will be a pleasure to have you",
    modal_deadline: "Please confirm before <strong>May 22nd</strong>",
    form_name: "Your full name",
    form_companion: "Guest",
    form_name_placeholder: "e.g. Jane Doe",
    form_companion_placeholder: "Full name",
    form_attendance: "Will you attend?",
    form_yes: "Yes, I'll be there!",
    form_no: "Sorry, I can't make it",
    form_phone: "Mobile Phone (WhatsApp)",
    form_phone_placeholder: "e.g. +1 123 456 7890",
    form_message: "Message (Optional)",
    form_message_placeholder: "Send us your best wishes...",
    form_submit: "Send Confirmation",

    // Validation
    val_name: "Please enter your name.",
    val_phone: "Please enter your phone number.",
    val_rate_limit: "Please wait a few seconds before trying again.",

    // Success
    success_title: "Thank you!",
    success_subtitle: "Your RSVP has been received",
    success_text: "We are so happy to have you join us on this special day. See you on July 16th!",
    success_apple_cal: "Add to Apple Calendar",
    success_google_cal: "Add to Google Calendar",
    success_close: "Close Form",
    success_test: "(Testing: Send another response)",

    // Error
    error_default: "There was an error. Please try again",
    error_timeout: "Request timed out. Please try again.",

    // Footer
    footer_eyebrow: "With love and gratitude",
    footer_made: "Made with love for our guests"
  }
};

/** Función auxiliar: obtener una traducción por clave **/
function t(key) {
  return I18N[LANG]?.[key] ?? I18N.es[key] ?? key;
}

/** Aplicar traducciones a todos los elementos con data-i18n **/
function applyTranslations() {
  if (LANG === "es") return; // Español es el idioma base del HTML

  // Cambiar el atributo lang del <html>
  document.documentElement.lang = "en";

  // Traducir elementos estáticos con data-i18n
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const value = t(key);
    if (value) {
      // Soportar HTML en ciertas keys (como modal_deadline que tiene <strong>)
      if (value.includes("<")) {
        el.innerHTML = value;
      } else {
        el.textContent = value;
      }
    }
  });

  // Traducir placeholders con data-i18n-placeholder
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    const value = t(key);
    if (value) el.placeholder = value;
  });

  // Traducir aria-labels con data-i18n-aria
  document.querySelectorAll("[data-i18n-aria]").forEach(el => {
    const key = el.getAttribute("data-i18n-aria");
    const value = t(key);
    if (value) el.setAttribute("aria-label", value);
  });
}

// Ejecutar traducciones al cargar
applyTranslations();
