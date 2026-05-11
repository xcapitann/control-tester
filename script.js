// --- Elementos del DOM ---
const statusDiv = document.getElementById('status');
const infoDiv = document.getElementById('controller-info');
const buttonsContainer = document.getElementById('buttons-display');
const dotL = document.getElementById('dot-l');
const dotR = document.getElementById('dot-r');
const imgPs = document.getElementById('img-ps');
const imgXbox = document.getElementById('img-xbox');
const imgGeneric = document.getElementById('img-generic');

// --- Variables de Estado ---
let buttonsCreated = false;
let isPolling = false; // Nueva: Para saber si el bucle está activo

// --- Configuración ---
const DEADZONE = 0.1; // Los sticks ignoran movimientos menores al 10%

function updateGamepad() {
    const gamepads = navigator.getGamepads();
    let gp = null;

    // Buscamos el primer mando válido
    for (let i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) {
            gp = gamepads[i];
            break; 
        }
    }

    // SI NO HAY MANDO: Detenemos el bucle y reseteamos
    if (!gp) {
        pararBucle();
        return; 
    }

    // SI HAY MANDO: Actualizamos UI
    statusDiv.innerText = "CONECTADO";
    statusDiv.className = "connected";

    // 1. Mostrar imagen correcta (solo si no hay ninguna mostrándose)
    const idLower = gp.id.toLowerCase();
    if (imgPs.style.display !== "block" && imgXbox.style.display !== "block" && imgGeneric.style.display !== "block") {
        
        // Detección más robusta de PlayStation (incluye DS4/DualSense)
        if (idLower.includes("xbox") || idLower.includes("xinput") || idLower.includes("wgi")) {
            imgXbox.style.display = "block";
            infoDiv.innerText = "Modelo Detectado: Xbox";
        } else if (idLower.includes("sony") || idLower.includes("playstation") || idLower.includes("dualshock") || idLower.includes("dualsense")) {
            imgPs.style.display = "block";
            infoDiv.innerText = "Modelo Detectado: PlayStation";
        } else {
            imgGeneric.style.display = "block";
            infoDiv.innerText = "Modelo Detectado: Genérico / Desconocido";
        }
    }

    // 2. Crear botones SOLO UNA VEZ
    // 2. Crear botones con nombres amigables
if (!buttonsCreated && buttonsContainer) {
    buttonsContainer.innerHTML = "";

    // Diccionario de nombres según el estándar de la industria
    const nombresBotones = {
        0: "A / ✕",
        1: "B / ◯",
        2: "X / □",
        3: "Y / △",
        4: "LB / L1",
        5: "RB / R1",
        6: "LT / L2",
        7: "RT / R2",
        8: "Share",
        9: "Start / Options",
        10: "L3",
        11: "R3",
        12: "Arriba",
        13: "Abajo",
        14: "Izquierda",
        15: "Derecha",
        16: "Home"
    };

    gp.buttons.forEach((_, index) => {
        const btnEl = document.createElement('div');
        btnEl.className = 'btn-indicator';
        btnEl.id = `btn-${index}`;
        
        // Si el índice existe en nuestro diccionario lo usamos, 
        // si no, ponemos el número por defecto (ej. B17)
        btnEl.innerText = nombresBotones[index] || "B" + index;
        
        buttonsContainer.appendChild(btnEl);
    });
    buttonsCreated = true;
}

    // 3. Actualizar estado de botones e Imagen
    let anyPressed = false;
    gp.buttons.forEach((button, index) => {
        const btnEl = document.getElementById(`btn-${index}`);
        if (btnEl) {
            // Usamos value para gatillos analógicos (L2/R2)
            if (button.pressed || button.value > 0.1) {
                btnEl.classList.add('active');
                if(index < 4 || index > 5) anyPressed = true; // Ignoramos L1/R1 para el brillo central
            } else {
                btnEl.classList.remove('active');
            }
        }
    });

    // 4. Movimiento de Palancas (Con Zona Muerta)
    if (gp.axes.length >= 4) {
        // Stick Izquierdo (Ejes 0 y 1)
        let lx = Math.abs(gp.axes[0]) > DEADZONE ? gp.axes[0] * 35 : 0;
        let ly = Math.abs(gp.axes[1]) > DEADZONE ? gp.axes[1] * 35 : 0;
        dotL.style.transform = `translate(calc(-50% + ${lx}px), calc(-50% + ${ly}px))`;

        // Stick Derecho (Ejes 2 y 3)
        let rx = Math.abs(gp.axes[2]) > DEADZONE ? gp.axes[2] * 35 : 0;
        let ry = Math.abs(gp.axes[3]) > DEADZONE ? gp.axes[3] * 35 : 0;
        dotR.style.transform = `translate(calc(-50% + ${rx}px), calc(-50% + ${ry}px))`;
        
        // Brillo si se mueven los sticks
        if (lx !== 0 || ly !== 0 || rx !== 0 || ry !== 0) anyPressed = true;
    }

    // Efecto visual de brillo en la imagen
    const currentImg = document.querySelector('.image-container img[style*="display: block"]');
    if (currentImg) {
        if (anyPressed) currentImg.classList.add('pressed');
        else currentImg.classList.remove('pressed');
    }

    // Siguiente fotograma
    if (isPolling) {
        requestAnimationFrame(updateGamepad);
    }
}

// --- Gestión Eficiente del Bucle ---
function iniciarBucle() {
    if (!isPolling) {
        isPolling = true;
        updateGamepad();
    }
}

function pararBucle() {
    isPolling = false;
    // Reset visual
    statusDiv.innerText = "DESCONECTADO";
    statusDiv.className = "disconnected";
    buttonsCreated = false; 
    if (buttonsContainer) buttonsContainer.innerHTML = "";
    [imgPs, imgXbox, imgGeneric].forEach(img => {
        img.style.display = "none";
        img.classList.remove('pressed');
    });
}

// --- Eventos Nativos (La clave del rendimiento) ---
window.addEventListener("gamepadconnected", (e) => {
    console.log("Mando conectado:", e.gamepad.id);
    iniciarBucle();
});

window.addEventListener("gamepaddisconnected", (e) => {
    console.log("Mando desconectado:", e.gamepad.id);
    // El bucle se detendrá solo en la siguiente iteración de updateGamepad al no encontrar gp
});

// Intento inicial por si el mando ya estaba conectado al cargar
iniciarBucle();

// =========================================
// Lógica de Saludo (Versión Estable)
// =========================================
function cargarBienvenidaSimple() {
    const textElement = document.getElementById('location-text');
    if (!textElement) return;

    const hora = new Date().getHours();
    let saludo = (hora >= 5 && hora < 12) ? "¡Buenos días!" : 
                 (hora >= 12 && hora < 19) ? "¡Buenas tardes!" : "¡Buenas noches!";

    textElement.innerHTML = `${saludo} Bienvenido a <b>Gamepad Tester Pro</b>. Esperamos que te sea útil.`;
}

// ÚNICO PUNTO DE ENTRADA: Ejecutar todo al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    cargarBienvenidaSimple();
    iniciarBucle(); 
});