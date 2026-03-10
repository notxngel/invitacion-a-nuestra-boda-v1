// script.js — Invitación de Boda de Angel y Clara

// Fecha de la boda: 16 de Julio de 2026
const weddingDate = new Date("2026-07-16T17:00:00");

function updateCountdown() {
  const now = new Date();
  const difference = weddingDate - now;

  if (difference > 0) {
    // Calcular tiempo
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    // Actualizar el HTML
    document.getElementById("days").innerText = days;
    document.getElementById("hours").innerText = hours;
    document.getElementById("minutes").innerText = minutes;
    document.getElementById("seconds").innerText = seconds;
  } else {
    // Si la fecha ya pasó
    const countdownEl = document.getElementById("countdown");
    if (countdownEl) {
        countdownEl.innerHTML = `
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

/* ========================================================================
   CARRUSEL — Lógica de Botones y Swipe
   ======================================================================== */
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

/* ========================================================================
   MICRO-ANIMACIONES — Timeline (Intersection Observer)
   ======================================================================== */
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

// =============================================================
// 2. MODAL RSVP — Abrir y Cerrar
// =============================================================

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

// =============================================================
// 3. SISTEMA DE CUPOS POR LINK (?c=N en la URL)
// =============================================================

(function generarCamposDeNombres() {
  const params = new URLSearchParams(window.location.search);
  // Cupos: mínimo 1, máximo 6. Si no hay ?c= en la URL, muestra 1 campo.
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

// =============================================================
// VALIDACIONES VISUALES (INLINE)
// =============================================================

// Función reutilizable para marcar un campo como inválido
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
        setInvalid(
          input,
          "Por favor, ingresa tu nombre. Es necesario para confirmar.",
        );
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

// =============================================================
// 4. ENVÍO DEL FORMULARIO RSVP → MAKE → NOTION
// =============================================================

// --- Seguridad: URL ofuscada para dificultar abuso directo ---
const _wh = atob("aHR0cHM6Ly9ob29rLnVzMi5tYWtlLmNvbS8xY3N1OWJxcXl3bGc5aTRmejR1eHY3Z2UzNHZkdmNhbg==");

// --- Seguridad: Rate limiter (máx 1 envío cada 30 segundos) ---
let _lastSubmit = 0;

// Seleccionamos el formulario del HTML
const rsvpForm = document.getElementById("rsvpForm");

// Escuchamos el evento 'submit' (cuando el usuario presiona "Enviar Confirmación")
rsvpForm.addEventListener("submit", async (e) => {
  // LÍNEA CLAVE: Evita que el formulario recargue la página (comportamiento por defecto)
  e.preventDefault();

  // --- Seguridad: Rate limiting ---
  const now = Date.now();
  if (now - _lastSubmit < 30000) {
    mostrarError("Por favor espera unos segundos antes de intentar de nuevo.");
    return;
  }

  // --- Seguridad: Honeypot (si se llenó el campo oculto, es un bot) ---
  const honeypot = document.getElementById("website");
  if (honeypot && honeypot.value !== "") {
    // Simular éxito para el bot, sin enviar nada real
    mostrarExito();
    return;
  }

  // --- Validación general antes de enviar ---
  const requiredInputs = Array.from(
    document.querySelectorAll(".form__input[required]"),
  );
  let isValid = true;
  let firstInvalidInput = null;

  requiredInputs.forEach((input) => {
    if (input.value.trim() === "") {
      setInvalid(input, "Por favor, ingresa tu nombre.");
      isValid = false;
      if (!firstInvalidInput) firstInvalidInput = input; // Guardamos el primero para hacerle focus
    }
  });

  if (!isValid) {
    // Si hay error, enfocamos el primer input que falló y nos movemos hacia él
    firstInvalidInput.focus();
    firstInvalidInput.scrollIntoView({ behavior: "smooth", block: "center" });
    return; // Deteine el proceso de envío
  }

  // --- Cambiar el botón para indicar que está cargando ---
  const submitBtn = document.getElementById("submitBtn") || document.querySelector(".btn--submit");
  const originalBtnText = submitBtn.textContent;
  submitBtn.innerHTML = '<span class="spinner"></span> Enviando...';
  submitBtn.disabled = true;

  // --- Extraer Titular y Acompañantes moderno ---
  const nameInput = document.getElementById("guest1");
  const titular = nameInput ? nameInput.value.trim() : "";

  // Convertimos todos los inputs a un Array moderno usando funciones flecha
  const inputs = Array.from(document.querySelectorAll('input[id^="guest"]'));
  const todosLosNombres = inputs
    .map((input) => input.value.trim())
    .filter((val) => val !== "");

  // Filtramos para obtener solo los acompañantes (excluyendo al titular)
  const acompanantes = todosLosNombres.filter(
    (val) => val !== titular && val !== "",
  );

  const formData = new FormData(rsvpForm);
  const mensajeUsuario = formData.get("message") || "";
  const telefono = formData.get("phone") || "";

  // Armamos los datos que recibirá Make / Notion
  const data = {
    Nombre: titular, // Nombre principal
    title: titular, // (Respaldo)
    Title: titular, // (Respaldo)
    Telefono: telefono,
    Invitados: todosLosNombres.length, // Número de personas
    Asistencia: formData.get("attendance"), // "si" o "no"
    Mensaje:
      acompanantes.length > 0
        ? `Acompañantes: ${acompanantes.join(", ")}${mensajeUsuario ? "\n\nMensaje: " + mensajeUsuario : ""}`
        : mensajeUsuario, // Solo los nombres adicionales + mensaje
  };



  try {
    // --- Novedad: Timeout de 10 segundos ---
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    // ✉️ fetch() — La función que "sale" a internet y envía los datos
    // Es como cuando un mensajero lleva un sobre a otra dirección
    const response = await fetch(_wh, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId); // Limpiar el timeout si terminó a tiempo

    // Si la respuesta fue exitosa (código 200, 201, etc.)
    if (response.ok) {
      // --- Novedad: Sello de guardado ---
      localStorage.setItem('rsvpStatus', 'sent');
      _lastSubmit = Date.now();
      mostrarExito();
    } else {
      // El servidor respondió pero con un error
      throw new Error(`Error del servidor: ${response.status}`);
    }
  } catch (error) {
    // Si hubo un problema de red u otro error inesperado
    console.error("Error al enviar:", error);
    if (error.name === 'AbortError') {
      mostrarError("Tiempo agotado. Intenta de nuevo.");
    } else {
      mostrarError();
    }
  } finally {
    // El "equipo de limpieza": restablece el botón si falló
    if (localStorage.getItem('rsvpStatus') !== 'sent') {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
  }
});

// =============================================================
// 4. FUNCIONES DE FEEDBACK (Lo que ve el usuario al enviar)
// =============================================================

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
                    🗓️ Añadir a Apple Calendar
                </a>
            </div>
      `;
  } else {
      calendarButtonsHTML = `
            <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem;">
                <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Boda+de+Angel+y+Clara&dates=20260716T210000Z/20260717T050000Z&details=%C2%A1Te+esperamos+para+celebrar+nuestra+boda!&location=Garden+Vista+Ballroom,+29+Macarthur+Ave,+Passaic,+NJ+07055" target="_blank" rel="noopener" class="btn btn--dark" style="background-color: #4285F4; border-color: #4285F4; color: white;">
                    🗓️ Añadir a Google Calendar
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
                ¡Nos vemos el 16 de julio! 🥂
            </p>
            
            ${calendarButtonsHTML}

            <button
                class="btn btn--ghost"
                style="margin-top: 1.5rem; color: #6B7280; border: none; text-decoration: underline;"
                onclick="cerrarYReiniciar()"
            >
                Cerrar Formulario
            </button>
            
            ${botonPruebasHTML}
        </div>
    `;
}

function mostrarError(mensaje = "Hubo un error. Intenta de nuevo") {
  const submitBtn = document.querySelector(".btn--submit");
  if (submitBtn) {
      submitBtn.textContent = mensaje;
      submitBtn.disabled = false;
      submitBtn.style.backgroundColor = "#b91c1c"; // Rojo para indicar error
  }
}

// Cierra el modal y restaura el formulario a su estado original
function cerrarYReiniciar() {
  closeRSVP();

  // Esperamos a que termine la animación de cierre antes de restaurar
  setTimeout(() => {
    rsvpForm.reset(); // Limpia los campos del formulario
    location.reload(); // Recarga para restaurar el modal limpio
  }, 400);
}
