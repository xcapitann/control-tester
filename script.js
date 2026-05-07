/**
 * Gamepad Tester Pro - Lógica de detección y efectos
 * Desarrollado para xCapitann
 */

const statusDiv = document.getElementById('status');
const infoDiv = document.getElementById('controller-info');
const imgPs = document.getElementById('img-ps');
const imgXbox = document.getElementById('img-xbox');
const imgGeneric = document.getElementById('img-generic');

function updateGamepad() {
    const gamepads = navigator.getGamepads();
    let gp = null;

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
        
        // 1. OCULTAMOS TODAS Y LIMPIAMOS CLASES PRIMERO
        [imgPs, imgXbox, imgGeneric].forEach(img => {
            img.style.display = "none";
            img.classList.remove('ps-style', 'xbox-style', 'generic-style');
        });

        // 2. DETECCIÓN Y ASIGNACIÓN DE ESTILO
        if (idLower.includes("xbox") || idLower.includes("xinput")) {
            currentImg = imgXbox;
            currentImg.classList.add('xbox-style');
            infoDiv.innerText = "Modelo: Xbox";
        } 
        else if (idLower.includes("sony") || idLower.includes("playstation") || idLower.includes("wireless controller")) {
            currentImg = imgPs;
            currentImg.classList.add('ps-style');
            infoDiv.innerText = "Modelo: PlayStation";
        } 
        else {
            currentImg = imgGeneric;
            currentImg.classList.add('generic-style');
            infoDiv.innerText = "Modelo: Genérico";
        }

        // 3. MOSTRAR SOLO LA IMAGEN CORRESPONDIENTE
        currentImg.style.display = "block";

        // 4. LÓGICA DE PRESIÓN (BRILLO)
        let buttonPressed = false;
        for (let j = 0; j < gp.buttons.length; j++) {
            if (gp.buttons[j].pressed) {
                buttonPressed = true;
                break;
            }
        }

        if (buttonPressed) {
            currentImg.classList.add('pressed');
        } else {
            currentImg.classList.remove('pressed');
        }

        requestAnimationFrame(updateGamepad);
    } else {
        // Estado desconectado
        statusDiv.innerText = "DESCONECTADO";
        statusDiv.className = "disconnected";
        [imgPs, imgXbox, imgGeneric].forEach(img => img.style.display = "none");
    }
}
        
        // Limpiamos todo
        imgPs.style.display = "none";
        imgXbox.style.display = "none";
        imgGeneric.style.display = "none";
        document.querySelector('.container').style.boxShadow = "0 10px 40px rgba(0,0,0,0.7)";
    }
}

// Escuchamos cuando se conecta un mando
window.addEventListener("gamepadconnected", (e) => {
    console.log("Mando conectado: " + e.gamepad.id);
    updateGamepad();
});

// Escuchamos cuando se desconecta
window.addEventListener("gamepaddisconnected", () => {
    console.log("Mando desconectado.");
});

// Revisión de seguridad cada segundo por si el evento no dispara
setInterval(updateGamepad, 1000);

// --- NUEVA LÓGICA DE TESTEO DE BOTONES ---
        const buttonsContainer = document.getElementById('buttons-display');
        buttonsContainer.innerHTML = ""; // Limpiamos para redibujar

        let anyButtonPressed = false;

        gp.buttons.forEach((button, index) => {
            // Crear el cuadrito del botón
            const btnEl = document.createElement('div');
            btnEl.className = 'btn-indicator';
            btnEl.innerText = "B" + index;

            // Si el botón está presionado físicamente
            if (button.pressed) {
                btnEl.classList.add('active');
                anyButtonPressed = true;
                
                // Si quieres ver el valor exacto (para gatillos analógicos L2/R2)
                if (button.value > 0) {
                    btnEl.innerText += ` (${Math.round(button.value * 100)}%)`;
                }
            }

            buttonsContainer.appendChild(btnEl);
        });

        // El brillo del control sigue funcionando igual
        if (anyButtonPressed) {
            currentImg.classList.add('pressed');
        } else {
            currentImg.classList.remove('pressed');
        }
