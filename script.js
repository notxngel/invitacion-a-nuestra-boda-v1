const weddingDate = new Date("2026-07-16T17:00:00");
const rsvpForm = document.getElementById("rsvpForm");
const webhookUrl = atob("aHR0cHM6Ly9ob29rLnVzMi5tYWtlLmNvbS8xY3N1OWJxcXl3bGc5aTRmejR1eHY3Z2UzNHZkdmNhbg==");
let lastSubmit = 0;

/* Countdown */
function updateCountdown() {
  const difference = weddingDate - new Date();

  if (difference <= 0) {
    const countdown = document.getElementById("countdown");
    if (countdown) {
      countdown.innerHTML = '<div style="font-family: var(--font-serif); font-size: 1.6rem; letter-spacing: 0.1em; color: var(--color-gold); font-style: italic;">¡A partir de hoy, somos esposos!</div>';
    }
    return;
  }

  const units = {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };

  Object.entries(units).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* Carrusel */
(function initCarousel() {
  const track = document.getElementById("albumTrack");
  const prev = document.getElementById("btnPrev");
  const next = document.getElementById("btnNext");
  if (!track || !prev || !next) return;

  const getScrollAmount = () => {
    const polaroid = track.querySelector(".polaroid");
    return polaroid ? polaroid.offsetWidth + 32 : 0;
  };

  prev.addEventListener("click", () => track.scrollBy({ left: -getScrollAmount(), behavior: "smooth" }));
  next.addEventListener("click", () => track.scrollBy({ left: getScrollAmount(), behavior: "smooth" }));
})();

/* Animaciones */
(function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -50px 0px" },
  );

  document.querySelectorAll(".timeline__row, .map-in").forEach((el) => observer.observe(el));
})();

/* Modal RSVP */
function openRSVP() {
  const modal = document.getElementById("rsvpModal");
  if (!modal) return;

  if (localStorage.getItem("rsvpStatus") === "sent") {
    mostrarExito();
  }

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeRSVP(e) {
  const closeRequested = !e || e.target.id === "rsvpModal" || e.target.closest(".modal__close");
  if (!closeRequested) return;

  const modal = document.getElementById("rsvpModal");
  if (!modal) return;

  modal.classList.remove("active");
  document.body.style.overflow = "";
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeRSVP();
});

/* Campos dinámicos y validación */
(function generateGuestFields() {
  const params = new URLSearchParams(window.location.search);
  const slots = Math.min(Math.max(Number.parseInt(params.get("c"), 10) || 1, 1), 4);
  const container = document.getElementById("guestNamesContainer");
  if (!container) return;

  container.innerHTML = Array.from({ length: slots }, (_, index) => {
    const i = index + 1;
    const isMainGuest = i === 1;
    return `
      <div class="form__group">
        <label class="form__label" for="guest${i}">${isMainGuest ? "Tu nombre completo" : `Acompañante ${index}`}</label>
        <input
          class="form__input"
          type="text"
          id="guest${i}"
          name="guest${i}"
          placeholder="${isMainGuest ? "Ej: Ana García" : "Nombre completo"}"
          ${isMainGuest ? "required" : ""}
          autocomplete="off"
        >
        <span class="form__error" id="error-guest${i}"></span>
      </div>`;
  }).join("");
})();

function setInvalid(input, message) {
  const error = document.getElementById(`error-${input.id}`);
  input.classList.add("is-invalid");
  if (error) {
    error.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"/>
      </svg>
      <span>${message}</span>`;
    error.classList.add("active");
  }
}

function clearInvalid(input) {
  const error = document.getElementById(`error-${input.id}`);
  input.classList.remove("is-invalid");
  if (error) {
    error.classList.remove("active");
    error.textContent = "";
  }
}

function setupValidationListeners() {
  document.querySelectorAll(".form__input[required]").forEach((input) => {
    input.addEventListener("blur", () => {
      if (!input.value.trim()) setInvalid(input, "Por favor, ingresa tu nombre. Es necesario para confirmar.");
    });

    input.addEventListener("input", () => {
      if (input.value.trim() && input.classList.contains("is-invalid")) clearInvalid(input);
    });
  });
}

setupValidationListeners();

/* Envío de formulario */
if (rsvpForm) {
  rsvpForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (Date.now() - lastSubmit < 30000) {
      mostrarError("Por favor espera unos segundos antes de intentar de nuevo.");
      return;
    }

    const honeypot = document.getElementById("website");
    if (honeypot?.value) {
      mostrarExito();
      return;
    }

    const requiredInputs = Array.from(document.querySelectorAll(".form__input[required]"));
    const firstInvalidInput = requiredInputs.find((input) => !input.value.trim());

    if (firstInvalidInput) {
      setInvalid(firstInvalidInput, "Por favor, ingresa tu nombre.");
      firstInvalidInput.focus();
      firstInvalidInput.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const submitBtn = document.getElementById("submitBtn") || document.querySelector(".btn--submit");
    const originalBtnText = submitBtn?.innerHTML || "Enviar";
    if (submitBtn) {
      submitBtn.innerHTML = '<span class="spinner"></span> Enviando...';
      submitBtn.disabled = true;
    }

    const titular = (document.getElementById("guest1")?.value || "").trim();
    const guestNames = Array.from(document.querySelectorAll('input[id^="guest"]'))
      .map((input) => input.value.trim())
      .filter(Boolean);

    const companions = guestNames.filter((name) => name !== titular);
    const formData = new FormData(rsvpForm);
    const message = formData.get("message") || "";

    const payload = {
      Nombre: titular,
      title: titular,
      Title: titular,
      Telefono: formData.get("phone") || "",
      Invitados: guestNames.length,
      Asistencia: formData.get("attendance"),
      Mensaje:
        companions.length > 0
          ? `Acompañantes: ${companions.join(", ")}${message ? `\n\nMensaje: ${message}` : ""}`
          : message,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      localStorage.setItem("rsvpStatus", "sent");
      lastSubmit = Date.now();
      mostrarExito();
    } catch (error) {
      console.error("Error al enviar:", error);
      mostrarError(error.name === "AbortError" ? "Tiempo agotado. Intenta de nuevo." : undefined);
    } finally {
      if (localStorage.getItem("rsvpStatus") !== "sent" && submitBtn) {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }
    }
  });
}

/* Feedback */
function mostrarExito() {
  const modalContent = document.querySelector(".modal__content");
  if (!modalContent) return;

  const urlParams = new URLSearchParams(window.location.search);
  const isAdmin = urlParams.get("dbg") === "r7xQ3";
  const resetButton = isAdmin
    ? `<p style="margin-top: 1.5rem; font-size: 0.75rem; color: #d1d5db; text-decoration: underline; cursor: pointer;" onclick="localStorage.removeItem('rsvpStatus'); location.reload();">(Pruebas: Enviar otra respuesta)</p>`
    : "";

  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const isApple = (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) || /Macintosh/.test(userAgent);

  const calendarButton = isApple
    ? `<a href="boda.ics" class="btn btn--dark" style="background-color: #000; border-color: #000; color: white;">Añadir a Apple Calendar</a>`
    : `<a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Boda+de+Angel+y+Clara&dates=20260716T210000Z/20260717T050000Z&details=%C2%A1Te+esperamos+para+celebrar+nuestra+boda!&location=Garden+Vista+Ballroom,+29+Macarthur+Ave,+Passaic,+NJ+07055" target="_blank" rel="noopener" class="btn btn--dark" style="background-color: #4285F4; border-color: #4285F4; color: white;">Añadir a Google Calendar</a>`;

  modalContent.innerHTML = `
    <div style="text-align: center; padding: 2rem 1rem;">
      <div style="font-size: 3rem; margin-bottom: 1rem;">💍</div>
      <h2 style="font-family: 'Playfair Display', serif; font-size: 2rem; margin-bottom: 0.5rem;">¡Gracias!</h2>
      <p style="color: #c5a059; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.1em; margin-bottom: 1.5rem;">Tu confirmación fue recibida</p>
      <p style="color: #57534e; line-height: 1.6;">Nos alegra mucho contar contigo en este día tan especial. ¡Nos vemos el 16 de julio!</p>
      <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem;">${calendarButton}</div>
      <button class="btn" style="margin-top: 1.5rem; color: #6B7280; text-decoration: underline; background: transparent; border: none;" onclick="cerrarYReiniciar()">Cerrar Formulario</button>
      ${resetButton}
    </div>`;
}

function mostrarError(mensaje = "Hubo un error. Intenta de nuevo") {
  const submitBtn = document.querySelector(".btn--submit");
  if (!submitBtn) return;
  submitBtn.textContent = mensaje;
  submitBtn.disabled = false;
  submitBtn.style.backgroundColor = "#b91c1c";
}

function cerrarYReiniciar() {
  closeRSVP();
  setTimeout(() => {
    rsvpForm?.reset();
    location.reload();
  }, 400);
}
