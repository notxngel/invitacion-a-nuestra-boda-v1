// script.js
// Aquí va la lógica de la cuenta regresiva

// Fecha de la boda: 18 de Agosto de 2026
const weddingDate = new Date('2026-08-18T16:00:00');

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
        document.getElementById('days').innerText = days;
        document.getElementById('hours').innerText = hours;
        document.getElementById('minutes').innerText = minutes;
        document.getElementById('seconds').innerText = seconds;
    }
}

// Actualizar cada segundo (1000 milisegundos)
setInterval(updateCountdown, 1000);

// Ejecutar una vez al inicio para evitar retardo
updateCountdown();
