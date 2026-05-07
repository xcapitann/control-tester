const statusDiv = document.getElementById('status');
const infoDiv = document.getElementById('controller-info');
const imgPs = document.getElementById('img-ps');
const imgXbox = document.getElementById('img-xbox');
const imgGeneric = document.getElementById('img-generic');

let activeImageUrl = null; // Para rastrear qué imagen está visible

function updateGamepad() {
    const gamepads = navigator.getGamepads();
    let gp = null;

    // 1. Buscar el mando activo
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
        
        // 2. Determinar y mostrar la imagen correcta (solo si cambia)
        if (idLower.includes("xbox") || idLower.includes("xinput")) {
            currentImg = imgXbox;
            infoDiv.innerText = "Modelo: Xbox Series / One / 360";
        } 
        else if (idLower.includes("sony") || idLower.includes("playstation") || idLower.includes("wireless controller")) {
            currentImg = imgPs;
            infoDiv.innerText = "Modelo: PlayStation (DualShock)";
        } 
        else {
            currentImg = imgGeneric;
            infoDiv.innerText = "Modelo: Genérico / Desconocido";
        }

        // En la parte donde detectas el modelo:
    if (idLower.includes("xbox")) {
            currentImg = imgXbox;
            currentImg.className = "mando-xbox"; // Clase para Xbox
}       else if (idLower.includes("sony")) {
            currentImg = imgPs;
            currentImg.className = "mando-ps"; // Clase para PS
}

        // Ocultar las otras y mostrar la actual
        [imgPs, imgXbox, imgGeneric].forEach(img => {
            if (img !== currentImg) img.style.display = "none";
        });
        currentImg.style.display = "block";


        // 3. --- LÓGICA DE BRILLO (ESTO ES LO NUEVO) ---
        let buttonPressed = false;
        
        // Verificamos si CUALQUIER botón estándar está presionado
        for (let j = 0; j < gp.buttons.length; j++) {
            if (gp.buttons[j].pressed) {
                buttonPressed = true;
                break; // Con uno que esté presionado, basta
            }
        }

        // Verificamos también los gatillos analógicos (L2/R2) si se configuran como ejes
        if (gp.axes.length >= 4) {
             // A veces L2/R2 son ejes 3 y 4. Verificamos si están muy presionados.
             if (Math.abs(gp.axes[2]) > 0.8 || Math.abs(gp.axes[3]) > 0.8) {
                 buttonPressed = true;
             }
        }

        // Aplicamos o quitamos la clase de brillo
        if (buttonPressed) {
            currentImg.classList.add('pressed');
        } else {
            currentImg.classList.remove('pressed');
        }

        // Usamos requestAnimationFrame para una actualización ultra rápida
        requestAnimationFrame(updateGamepad);

    } else {
        // Estado Desconectado
        statusDiv.innerText = "DESCONECTADO";
        statusDiv.className = "disconnected";
        infoDiv.innerText = "Esperando señal...";
        [imgPs, imgXbox, imgGeneric].forEach(img => {
            img.style.display = "none";
            img.classList.remove('pressed'); // Asegurarnos de quitar el brillo
        });
    }
}

// Eventos para iniciar/detener el bucle
window.addEventListener("gamepadconnected", () => {
    console.log("Mando conectado.");
    updateGamepad();
});

window.addEventListener("gamepaddisconnected", () => {
    console.log("Mando desconectado.");
    // El bucle updateGamepad se encargará de limpiar la interfaz.
});

// Verificación de respaldo cada segundo
setInterval(updateGamepad, 1000);
