const statusDiv = document.getElementById('status');
const infoDiv = document.getElementById('controller-info');
const buttonsContainer = document.getElementById('buttons-display');
const dotL = document.getElementById('dot-l');
const dotR = document.getElementById('dot-r');
const imgPs = document.getElementById('img-ps');
const imgXbox = document.getElementById('img-xbox');
const imgGeneric = document.getElementById('img-generic');

function updateGamepad() {
    const gamepads = navigator.getGamepads();
    let gp = null;

    // Buscamos el primer mando conectado
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
        
        // 1. Detección de mando y visibilidad
        [imgPs, imgXbox, imgGeneric].forEach(img => img.style.display = "none");

        if (idLower.includes("xbox") || idLower.includes("xinput")) {
            currentImg = imgXbox;
            infoDiv.innerText = "Modelo: Xbox";
        } else if (idLower.includes("sony") || idLower.includes("playstation")) {
            currentImg = imgPs;
            infoDiv.innerText = "Modelo: PlayStation";
        } else {
            currentImg = imgGeneric;
            infoDiv.innerText = "Modelo: Genérico";
        }
        currentImg.style.display = "block";

        // 2. Movimiento de Palancas (INSTANTÁNEO)
        if (gp.axes.length >= 4) {
            // Stick Izquierdo
            let lx = gp.axes[0] * 35;
            let ly = gp.axes[1] * 35;
            dotL.style.transform = `translate(calc(-50% + ${lx}px), calc(-50% + ${ly}px))`;

            // Stick Derecho
            let rx = gp.axes[2] * 35;
            let ry = gp.axes[3] * 35;
            dotR.style.transform = `translate(calc(-50% + ${rx}px), calc(-50% + ${ry}px))`;
        }

        // 3. Testeo de Botones
        if (buttonsContainer) {
            buttonsContainer.innerHTML = "";
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

        // Brillo de imagen si hay actividad
        let anyPressed = gp.buttons.some(b => b.pressed) || gp.axes.some(a => Math.abs(a) > 0.1);
        if (anyPressed) {
            currentImg.classList.add('pressed');
        } else {
            currentImg.classList.remove('pressed');
        }

        // ESTA ES LA LÍNEA CLAVE: Hace que se repita el ciclo a máxima velocidad
        requestAnimationFrame(updateGamepad);

    } else {
        // Estado cuando no hay mando
        statusDiv.innerText = "DESCONECTADO - Presiona un botón";
        statusDiv.className = "disconnected";
        [imgPs, imgXbox, imgGeneric].forEach(img => img.style.display = "none");
        
        // Si no hay mando, revisamos cada segundo hasta que conectes uno
        setTimeout(updateGamepad, 1000);
    }
}

// Iniciar el tester
updateGamepad();
