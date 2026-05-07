const statusDiv = document.getElementById('status');
const infoDiv = document.getElementById('controller-info');
const imgPs = document.getElementById('img-ps');
const imgXbox = document.getElementById('img-xbox');
const imgGeneric = document.getElementById('img-generic');

function updateGamepad() {
    const gamepads = navigator.getGamepads();
    let gp = null;

    // Buscar el mando activo
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
        
        // Ocultar todas las imágenes antes de mostrar la correcta
        imgPs.style.display = "none";
        imgXbox.style.display = "none";
        imgGeneric.style.display = "none";

        if (idLower.includes("xbox") || idLower.includes("xinput")) {
            imgXbox.style.display = "block";
            infoDiv.innerText = "Modelo: Xbox Series / One / 360";
        } 
        else if (idLower.includes("sony") || idLower.includes("playstation") || idLower.includes("wireless controller")) {
            imgPs.style.display = "block";
            infoDiv.innerText = "Modelo: PlayStation (DualShock)";
        } 
        else {
            imgGeneric.style.display = "block";
            infoDiv.innerText = "Modelo: Genérico / Desconocido";
        }

        requestAnimationFrame(updateGamepad);
    } else {
        statusDiv.innerText = "DESCONECTADO";
        statusDiv.className = "disconnected";
        infoDiv.innerText = "Esperando señal...";
        imgPs.style.display = "none";
        imgXbox.style.display = "none";
        imgGeneric.style.display = "none";
    }
}

window.addEventListener("gamepadconnected", updateGamepad);
window.addEventListener("gamepaddisconnected", updateGamepad);

// Revisar cada segundo por si el navegador no lanza el evento automáticamente
setInterval(updateGamepad, 1000);