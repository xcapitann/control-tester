/**
 * Gamepad Tester Pro - Lógica de detección y efectos
 * Desarrollado para xCapitann
 */

const statusDiv = document.getElementById('status');
const infoDiv = document.getElementById('controller-info');
const buttonsContainer = document.getElementById('buttons-display');
const imgPs = document.getElementById('img-ps');
const imgXbox = document.getElementById('img-xbox');
const imgGeneric = document.getElementById('img-generic');

function updateGamepad() {
    const gamepads = navigator.getGamepads();
    let gp = null;

    // Buscar el primer mando activo
    for (let i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) {
            gp = gamepads[i];
            break; 
        }
    }

    if (gp) {
        statusDiv.innerText = "CONECTADO";
        statusDiv.className = "connected";

        const idLower = gp.id.toLowerCase();
        let currentImg = null;
        
        // Ocultar todas y limpiar clases
        [imgPs, imgXbox, imgGeneric].forEach(img => {
            img.style.display = "none";
            img.classList.remove('ps-style', 'xbox-style', 'generic-style');
        });

        // Detección de marca
        if (idLower.includes("xbox") || idLower.includes("xinput")) {
            currentImg = imgXbox;
            currentImg.classList.add('xbox-style');
            infoDiv.innerText = "Modelo detectado: Xbox";
        } 
        else if (idLower.includes("sony") || idLower.includes("playstation") || idLower.includes("wireless controller")) {
            currentImg = imgPs;
            currentImg.classList.add('ps-style');
            infoDiv.innerText = "Modelo detectado: PlayStation";
        } 
        else {
            currentImg = imgGeneric;
            currentImg.classList.add('generic-style');
            infoDiv.innerText = "Modelo detectado: Genérico";
        }

        currentImg.style.display = "block";

        // TESTEO DE BOTONES
        if (buttonsContainer) {
            buttonsContainer.innerHTML = ""; // Limpiar para actualizar
            gp.buttons.forEach((button, index) => {
                const btnEl = document.createElement('div');
                btnEl.className = 'btn-indicator';
                if (button.pressed) {
                    btnEl.classList.add('active');
                    btnEl.innerText = "B" + index + " (ON)";
                } else {
                    btnEl.innerText = "B" + index;
                }
                buttonsContainer.appendChild(btnEl);
            });
        }

        // --- TESTEO DE PALANCAS (STICKS) ---
        const dotL = document.getElementById('dot-l');
        const dotR = document.getElementById('dot-r');

        if (gp.axes.length >= 4) {
            // Stick Izquierdo (Ejes 0 y 1)
            let lx = gp.axes[0] * 35; // 35 es el radio del círculo
            let ly = gp.axes[1] * 35;
            dotL.style.transform = `translate(calc(-50% + ${lx}px), calc(-50% + ${ly}px))`;

            // Stick Derecho (Ejes 2 y 3)
            let rx = gp.axes[2] * 35;
            let ry = gp.axes[3] * 35;
            dotR.style.transform = `translate(calc(-50% + ${rx}px), calc(-50% + ${ry}px))`;
            
            // Si mueves mucho las palancas, también activamos el brillo
            if (Math.abs(gp.axes[0]) > 0.2 || Math.abs(gp.axes[1]) > 0.2 || 
                Math.abs(gp.axes[2]) > 0.2 || Math.abs(gp.axes[3]) > 0.2) {
                anyPressed = true;
            }
        }
        
        // Brillo general si se presiona cualquier cosa
        let anyPressed = gp.buttons.some(b => b.pressed);
        if (anyPressed) {
            currentImg.classList.add('pressed');
        } else {
            currentImg.classList.remove('pressed');
        }

        requestAnimationFrame(updateGamepad);
    } else {
        // Estado desconectado
        statusDiv.innerText = "DESCONECTADO - Presiona un botón";
        statusDiv.className = "disconnected";
        infoDiv.innerText = "Esperando señal del mando...";
        [imgPs, imgXbox, imgGeneric].forEach(img => img.style.display = "none");
        if (buttonsContainer) buttonsContainer.innerHTML = "";
    }
}

// Eventos de conexión
window.addEventListener("gamepadconnected", (e) => {
    console.log("Mando conectado:", e.gamepad.id);
    updateGamepad();
});

window.addEventListener("gamepaddisconnected", () => {
    console.log("Mando desconectado.");
});

// Bucle de seguridad
setInterval(updateGamepad, 1000);
