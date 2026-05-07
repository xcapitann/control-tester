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

        currentImg.style.display = "block";

        // --- 3. NUEVA LÓGICA DE TESTEO DE BOTONES ---
        // Buscamos el contenedor de botones (asegúrate de tenerlo en el HTML)
        const buttonsContainer = document.getElementById('buttons-display');
        if (buttonsContainer) {
            buttonsContainer.innerHTML = ""; // Limpiamos para redibujar
            
            gp.buttons.forEach((button, index) => {
                const btnEl = document.createElement('div');
                btnEl.className = 'btn-indicator';
                
                // Si el botón está presionado
                if (button.pressed) {
                    btnEl.classList.add('active');
                    btnEl.innerText = "B" + index + " (OK)";
                } else {
                    btnEl.innerText = "B" + index;
                }
                
                buttonsContainer.appendChild(btnEl);
            });
        }

        // 4. LÓGICA DE PRESIÓN (BRILLO DEL CONTROL)
        let anyButtonPressed = gp.buttons.some(b => b.pressed);

        if (anyButtonPressed) {
            currentImg.classList.add('pressed');
        } else {
            currentImg.classList.remove('pressed');
        }

        requestAnimationFrame(updateGamepad);

    } else {
        // Estado desconectado
        statusDiv.innerText = "DESCONECTADO";
        statusDiv.className = "disconnected";
        infoDiv.innerText = "Esperando señal del mando...";
        [imgPs, imgXbox, imgGeneric].forEach(img => {
            img.style.display = "none";
            img.classList.remove('pressed');
        });
        
        const bDisplay = document.getElementById('buttons-display');
        if (bDisplay) bDisplay.innerHTML = "";
    }
}

// Eventos
window.addEventListener("gamepadconnected", (e) => {
    console.log("Mando conectado: " + e.gamepad.id);
    updateGamepad();
});

window.addEventListener("gamepaddisconnected", () => {
    console.log("Mando desconectado.");
});

setInterval(updateGamepad, 1000);
