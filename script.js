const statusDiv = document.getElementById('status');
const infoDiv = document.getElementById('controller-info');
const buttonsContainer = document.getElementById('buttons-display');
const dotL = document.getElementById('dot-l');
const dotR = document.getElementById('dot-r');
const imgPs = document.getElementById('img-ps');
const imgXbox = document.getElementById('img-xbox');
const imgGeneric = document.getElementById('img-generic');

let buttonsCreated = false; // Para crear los botones solo una vez

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

        // 1. Mostrar imagen correcta (solo si cambió el modelo)
        const idLower = gp.id.toLowerCase();
        if (imgPs.style.display === "none" && imgXbox.style.display === "none" && imgGeneric.style.display === "none") {
            if (idLower.includes("xbox") || idLower.includes("xinput")) {
                imgXbox.style.display = "block";
                infoDiv.innerText = "Modelo: Xbox";
            } else if (idLower.includes("sony") || idLower.includes("playstation")) {
                imgPs.style.display = "block";
                infoDiv.innerText = "Modelo: PlayStation";
            } else {
                imgGeneric.style.display = "block";
                infoDiv.innerText = "Modelo: Genérico";
            }
        }

        // 2. Crear botones SOLO UNA VEZ para no saturar la memoria
        if (!buttonsCreated && buttonsContainer) {
            buttonsContainer.innerHTML = "";
            gp.buttons.forEach((_, index) => {
                const btnEl = document.createElement('div');
                btnEl.className = 'btn-indicator';
                btnEl.id = `btn-${index}`;
                btnEl.innerText = "B" + index;
                buttonsContainer.appendChild(btnEl);
            });
            buttonsCreated = true;
        }

        // 3. Actualizar estado de botones (Sin borrar el HTML)
        let anyPressed = false;
        gp.buttons.forEach((button, index) => {
            const btnEl = document.getElementById(`btn-${index}`);
            if (btnEl) {
                if (button.pressed) {
                    btnEl.classList.add('active');
                    anyPressed = true;
                } else {
                    btnEl.classList.remove('active');
                }
            }
        });

        // 4. Movimiento de Palancas (INSTANTÁNEO)
        if (gp.axes.length >= 4) {
            let lx = gp.axes[0] * 35;
            let ly = gp.axes[1] * 35;
            dotL.style.transform = `translate(calc(-50% + ${lx}px), calc(-50% + ${ly}px))`;

            let rx = gp.axes[2] * 35;
            let ry = gp.axes[3] * 35;
            dotR.style.transform = `translate(calc(-50% + ${rx}px), calc(-50% + ${ry}px))`;
            
            if (Math.abs(gp.axes[0]) > 0.1 || Math.abs(gp.axes[1]) > 0.1) anyPressed = true;
        }

        // Efecto visual en la imagen
        const currentImg = document.querySelector('.image-container img[style*="display: block"]');
        if (currentImg) {
            if (anyPressed) currentImg.classList.add('pressed');
            else currentImg.classList.remove('pressed');
        }

        requestAnimationFrame(updateGamepad);

    } else {
        // Reset cuando se desconecta
        statusDiv.innerText = "DESCONECTADO";
        statusDiv.className = "disconnected";
        buttonsCreated = false; // Permitir recrear botones al reconectar
        if (buttonsContainer) buttonsContainer.innerHTML = "";
        [imgPs, imgXbox, imgGeneric].forEach(img => img.style.display = "none");
        
        setTimeout(updateGamepad, 1000);
    }
}

updateGamepad();
