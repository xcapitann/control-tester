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
