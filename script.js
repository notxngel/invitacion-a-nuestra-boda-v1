/** 0. CONFIGURACIÓN: Fecha y Elementos Base **/

// Fecha de la boda: 16 de Julio de 2026 (todo el día en general)
const weddingDate = new Date("2026-07-16T00:00:00");

// Elementos del contador cacheados para rendimiento
const countdownElements = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
  container: document.getElementById("countdown")
};

/**
 * Actualiza el contador de la cuenta regresiva en el DOM.
 * Calcula la diferencia entre la fecha de la boda y el momento actual.
 * Si la fecha ya pasó, muestra un mensaje de felicitación.
 * 
 * @returns {void}
 */
function updateCountdown() {
  const now = new Date();
  const difference = weddingDate - now;

  if (difference > 0) {
    // Calcular tiempo
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    // Actualizar el HTML usando las referencias cacheadas
    if (countdownElements.days) countdownElements.days.innerText = days;
    if (countdownElements.hours) countdownElements.hours.innerText = hours;
    if (countdownElements.minutes) countdownElements.minutes.innerText = minutes;
    if (countdownElements.seconds) countdownElements.seconds.innerText = seconds;
  } else {
    // Si la fecha ya pasó
    if (countdownElements.container) {
        countdownElements.container.innerHTML = `
        <div style="font-family: var(--font-serif); font-size: 1.6rem; letter-spacing: 0.1em; color: var(--color-gold); font-style: italic; text-transform:none;">
            ¡A partir de hoy, somos esposos!
        </div>
        `;
    }
  }
}

// Ejecutar al cargar la página (para que no haya retraso de 1 segundo)
updateCountdown();

// Repetir cada 1000ms (1 segundo)
setInterval(updateCountdown, 1000);

/** 1. CARRUSEL: Lógica de navegación del álbum **/
(function initCarousel() {
  const track = document.getElementById("albumTrack");
  const btnPrev = document.getElementById("btnPrev");
  const btnNext = document.getElementById("btnNext");
  
  if (!track || !btnPrev || !btnNext) return;

  // Obtener la cantidad a desplazar (una polaroid + el gap)
  const getScrollAmount = () => {
    const polaroid = track.querySelector(".polaroid");
    if (!polaroid) return 0;
    // Asumimos un gap de 2rem (~32px) configurado en css
    return polaroid.offsetWidth + 32; 
  };

  btnPrev.addEventListener("click", () => {
    track.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
  });

  btnNext.addEventListener("click", () => {
    track.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
  });
})();

/** 2. ANIMACIONES: Intersection Observer para Timeline **/
(function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target); // Animamos solo una vez al entrar
      }
    });
  }, { threshold: 0.2, rootMargin: "0px 0px -50px 0px" });

  document.querySelectorAll(".timeline__row, .map-in").forEach(el => {
    observer.observe(el);
  });
})();

/** 3. NAVBAR: Lógica de visibilidad al hacer scroll **/
(function initNavbarScroll() {
  const navbar = document.querySelector(".navbar");
  const heroSection = document.getElementById("home");

  if (!navbar || !heroSection) return;

  let isTicking = false;

  window.addEventListener("scroll", () => {
    if (!isTicking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroBottom = heroSection.offsetHeight - 80; // Margen para que sea fluido
        
        if (scrollY >= heroBottom) {
          // Aparece al salir del hero
          navbar.classList.add("is-visible");
        } else if (scrollY < 100) {
          // Se oculta solo al regresar completamente arriba
          navbar.classList.remove("is-visible");
        }
        isTicking = false;
      });
      isTicking = true;
    }
  });
})();

/** 4. MODAL: Apertura y cierre del RSVP **/

/**
 * Abre el modal de confirmación (RSVP).
 * Bloquea el scroll del fondo y muestra un mensaje de éxito si ya se envió previamente.
 * 
 * @example
 * openRSVP();
 * 
 * @returns {void}
 */
function openRSVP() {
  const modal = document.getElementById("rsvpModal");
  if (modal) {
    // Verificamos si el usuario ya envió su confirmación antes
    if (localStorage.getItem('rsvpStatus') === 'sent') {
        mostrarExito();
    }
    
    modal.classList.add("active");
    document.body.style.overflow = "hidden"; // Evitar scroll de fondo
  }
}

/**
 * Cierra el modal de confirmación (RSVP).
 * 
 * @param {MouseEvent|null} e - El evento de click (opcional).
 * @returns {void}
 */
function closeRSVP(e) {
  // Si se llama directamente (botón X) o si el evento es click en overlay
  if (!e || e.target.id === "rsvpModal" || e.target.closest(".modal__close")) {
    const modal = document.getElementById("rsvpModal");
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = ""; // Restaurar scroll
    }
  }
}

// Permitir cerrar con Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeRSVP();
});

/** 5. CUPOS: Generación dinámica de campos de invitados **/

(function generarCamposDeNombres() {
  const params = new URLSearchParams(window.location.search);
  // Cupos: mínimo 1, máximo 4. Si no hay ?c= en la URL, muestra 1 campo.
  const cupos = Math.min(Math.max(parseInt(params.get("c")) || 1, 1), 4);

  const container = document.getElementById("guestNamesContainer");
  if (!container) return;

  let html = "";
  for (let i = 1; i <= cupos; i++) {
    const label = i === 1 ? "Tu nombre completo" : `Acompañante ${i - 1}`;
    const placeholder = i === 1 ? "Ej: Ana García" : "Nombre completo";
    const required = i === 1 ? "required" : "";
    html += `
            <div class="form__group">
                <label class="form__label" for="guest${i}">${label}</label>
                <input
                    class="form__input"
                    type="text"
                    id="guest${i}"
                    name="guest${i}"
                    placeholder="${placeholder}"
                    ${required}
                    autocomplete="off"
                >
                <span class="form__error" id="error-guest${i}"></span>
            </div>`;
  }
  container.innerHTML = html;
})();

/** 6. VALIDACIÓN: Feedback visual inmediato en campos **/

// Función reutilizable para marcar un campo como inválido
/**
 * Marca un elemento de entrada como inválido y muestra un mensaje de error.
 * 
 * @param {HTMLInputElement} inputElement - El elemento del DOM a marcar.
 * @param {string} message - El mensaje de error a mostrar.
 * @returns {void}
 */
function setInvalid(inputElement, message) {
  const errorSpan = document.getElementById(`error-${inputElement.id}`);
  inputElement.classList.add("is-invalid");
  if (errorSpan) {
    // Usamos un ícono SVG de advertencia pequeñito junto al mensaje
    errorSpan.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            ${message}
        `;
    errorSpan.classList.add("active");
  }
}

// Función reutilizable para limpiar los errores de un campo
/**
 * Limpia el estado de error de un elemento de entrada.
 * 
 * @param {HTMLInputElement} inputElement - El elemento del DOM a limpiar.
 * @returns {void}
 */
function clearInvalid(inputElement) {
  const errorSpan = document.getElementById(`error-${inputElement.id}`);
  inputElement.classList.remove("is-invalid");
  if (errorSpan) {
    errorSpan.classList.remove("active");
    errorSpan.innerHTML = "";
  }
}

// Configurar los event listeners ("Los espías") a los campos
function setupValidationListeners() {
  const inputs = document.querySelectorAll(".form__input[required]");

  inputs.forEach((input) => {
    // Evento 'blur': se dispara cuando el usuario sale (pierde el foco) del campo
    input.addEventListener("blur", () => {
      if (input.value.trim() === "") {
        const msg = input.id === "phone" ? "Por favor, ingresa tu teléfono." : "Por favor, ingresa tu nombre.";
        setInvalid(input, msg);
      }
    });

    // Evento 'input': se dispara en tiempo real mientras el usuario escribe
    input.addEventListener("input", () => {
      // Si el usuario empieza a escribir, quitamos el error inmediatamente
      if (input.value.trim() !== "" && input.classList.contains("is-invalid")) {
        clearInvalid(input);
      }
    });
  });
}

// Ejecutar la asignación de espías apenas se crea el HTML en "generarCamposDeNombres()"
// Usamos requestAnimationFrame o simplemente lo llamamos aquí abajo porque las funciones ya corrieron.
setupValidationListeners();

/** 7. FORMULARIO: Procesamiento y envío de datos (Make/Notion) **/

// --- Seguridad: URL expuesta en el frontend ---
// Make debe configurarse para aceptar llamadas solo desde notxngel.github.io
const _wh = "https://hook.us2.make.com/1csu9bqqywlg9i4fz4uxv7ge34vdvcan";

// Seleccionamos el formulario del HTML
const rsvpForm = document.getElementById("rsvpForm");

// --- Funciones Auxiliares para el Submit ---
let _lastSubmit = 0;

function isSafeToSubmit() {
  // Rate limiting extraido
  const now = Date.now();
  if (now - _lastSubmit < 30000) {
    mostrarError("Por favor espera unos segundos antes de intentar de nuevo.");
    return false;
  }

  // Honeypot extraido
  const honeypot = document.getElementById("website");
  if (honeypot && honeypot.value !== "") {
    mostrarExito(); // Simular éxito para bots
    return false;
  }
  return true;
}

/**
 * Valida todos los campos obligatorios del formulario RSVP.
 * Enfoca el primer campo inválido si se encuentran errores.
 * 
 * @returns {boolean} True si el formulario es válido, False en caso contrario.
 */
function handleValidation() {
  const requiredInputs = Array.from(document.querySelectorAll(".form__input[required]"));
  let isValid = true;
  let firstInvalidInput = null;

  requiredInputs.forEach((input) => {
    if (input.value.trim() === "") {
      const msg = input.id === "phone" ? "Por favor, ingresa tu teléfono." : "Por favor, ingresa tu nombre.";
      setInvalid(input, msg);
      isValid = false;
      if (!firstInvalidInput) firstInvalidInput = input;
    }
  });

  if (!isValid) {
    firstInvalidInput.focus();
    firstInvalidInput.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  return isValid;
}

/**
 * Cambia el estado del botón de envío durante el proceso de procesamiento.
 * Muestra u oculta un spinner y deshabilita/habilita el botón.
 * 
 * @param {boolean} isSubmitting - Indica si se está enviando el formulario.
 * @returns {void}
 */
function toggleSubmitState(isSubmitting) {
  const submitBtn = document.getElementById("submitBtn");
  if (!submitBtn) return;
  
  if (isSubmitting) {
    submitBtn.dataset.originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<span class="spinner"></span> Enviando...';
    submitBtn.disabled = true;
  } else {
    submitBtn.innerHTML = submitBtn.dataset.originalText || "Enviar Confirmación";
    submitBtn.disabled = false;
  }
}

/**
 * Extrae los datos de los invitados y el formulario para su envío.
 * Organiza los nombres de acompañantes y el mensaje en un objeto estructurado.
 * 
 * @returns {Object} Un objeto con los campos: Nombre, Telefono, Invitados, Asistencia, Mensaje.
 */
function extractGuestData() {
  const nameInput = document.getElementById("guest1");
  const titular = nameInput ? nameInput.value.trim() : "";

  const inputs = Array.from(document.querySelectorAll('input[id^="guest"]'));
  const todosLosNombres = inputs
    .map((input) => input.value.trim())
    .filter((val) => val !== "");

  const acompanantes = todosLosNombres.filter((val) => val !== titular && val !== "");

  const formData = new FormData(rsvpForm);
  const mensajeUsuario = formData.get("message") || "";
  const telefono = formData.get("phone") || "";

  return {
    Nombre: titular,
    title: titular,
    Title: titular,
    Telefono: telefono,
    Invitados: todosLosNombres.length,
    Asistencia: formData.get("attendance"),
    Mensaje: acompanantes.length > 0
        ? `Acompañantes: ${acompanantes.join(", ")}${mensajeUsuario ? "\n\nMensaje: " + mensajeUsuario : ""}`
        : mensajeUsuario,
  };
}

/**
 * Envía los datos del RSVP al webhook de Make.com.
 * Maneja el estado de éxito y error, y almacena el estado en localStorage.
 * 
 * @param {Object} data - Los datos extraídos del formulario.
 * @returns {Promise<void>}
 */
async function sendDataToMake(data) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(_wh, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (response.ok) {
      localStorage.setItem('rsvpStatus', 'sent');
      _lastSubmit = Date.now();
      mostrarExito();
    } else {
      throw new Error(`Error del servidor: ${response.status}`);
    }
  } catch (error) {
    console.error("Error al enviar:", error);
    if (error.name === 'AbortError') {
      mostrarError("Tiempo agotado. Intenta de nuevo.");
    } else {
      mostrarError();
    }
  }
}

// Escuchamos el evento 'submit' refactorizado
rsvpForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!isSafeToSubmit()) return;
  if (!handleValidation()) return;

  toggleSubmitState(true);
  
  const guestData = extractGuestData();
  await sendDataToMake(guestData);
  
  // Limpia el botón si no fue éxito
  if (localStorage.getItem('rsvpStatus') !== 'sent') {
    toggleSubmitState(false);
  }
});

/** 8. FEEDBACK: Mensajes de éxito, error y cierre **/

/**
 * Muestra el mensaje de éxito en el modal tras un envío exitoso.
 * Genera botones dinámicos para añadir el evento al calendario según el dispositivo.
 * 
 * @returns {void}
 */
function mostrarExito() {
  // Reemplazamos el contenido del modal con un mensaje de éxito
  const modalContent = document.querySelector(".modal__content");

  // Permite ver el botón secreto de reinicio de pruebas solo si el URL lo autoriza
  const urlParams = new URLSearchParams(window.location.search);
  const isAdmin = urlParams.get('dbg') === 'r7xQ3';
  const botonPruebasHTML = isAdmin 
    ? `<p style="margin-top: 1.5rem; font-size: 0.75rem; color: #d1d5db; text-decoration: underline; cursor: pointer;" onclick="localStorage.removeItem('rsvpStatus'); location.reload();">
          (Pruebas: Enviar otra respuesta)
       </p>` 
    : '';

  // Detección de dispositivo para Mostrar Calendario Adecuado
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  const isMac = /Macintosh/.test(userAgent);
  const isApple = isIOS || isMac;

  let calendarButtonsHTML = '';
  if (isApple) {
      calendarButtonsHTML = `
            <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem;">
                <a href="boda.ics" class="btn btn--dark" style="background-color: #000; border-color: #000; color: white;">
                    Añadir a Apple Calendar
                </a>
            </div>
      `;
  } else {
      calendarButtonsHTML = `
            <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem;">
                <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Boda+de+Angel+y+Clara&dates=20260716T210000Z/20260717T050000Z&details=%C2%A1Te+esperamos+para+celebrar+nuestra+boda!&location=Garden+Vista+Ballroom,+29+Macarthur+Ave,+Passaic,+NJ+07055" target="_blank" rel="noopener" class="btn btn--dark" style="background-color: #4285F4; border-color: #4285F4; color: white;">
                    Añadir a Google Calendar
                </a>
            </div>
      `;
  }

  modalContent.innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">💍</div>
            <h2 style="font-family: 'Playfair Display', serif; font-size: 2rem; margin-bottom: 0.5rem;">
                ¡Gracias!
            </h2>
            <p style="color: #c5a059; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.1em; margin-bottom: 1.5rem;">
                Tu confirmación fue recibida
            </p>
            <p style="color: #57534e; line-height: 1.6;">
                Nos alegra mucho contar contigo en este día tan especial. 
                ¡Nos vemos el 16 de julio!
            </p>
            
            ${calendarButtonsHTML}

            <button
                class="btn"
                style="margin-top: 1.5rem; color: #6B7280; text-decoration: underline; background: transparent; border: none;"
                onclick="cerrarYReiniciar()"
            >
                Cerrar Formulario
            </button>
            
            ${botonPruebasHTML}
        </div>
    `;
}

/**
 * Muestra un mensaje de error visual en el botón de envío.
 * 
 * @param {string} [mensaje="Hubo un error. Intenta de nuevo"] - El mensaje de error a mostrar.
 * @returns {void}
 */
function mostrarError(mensaje = "Hubo un error. Intenta de nuevo") {
  const submitBtn = document.querySelector(".btn--submit");
  if (submitBtn) {
      submitBtn.textContent = mensaje;
      submitBtn.disabled = false;
      submitBtn.style.backgroundColor = "#b91c1c"; // Rojo para indicar error
  }
}

// Cierra el modal y restaura el formulario a su estado original
/**
 * Cierra el modal de éxito y recarga la página para resetear el estado.
 * 
 * @returns {void}
 */
function cerrarYReiniciar() {
  closeRSVP();

  // Esperamos a que termine la animación de cierre antes de restaurar
  setTimeout(() => {
    rsvpForm.reset(); // Limpia los campos del formulario
    location.reload(); // Recarga para restaurar el modal limpio
  }, 400);
}
