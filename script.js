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
    // Obtenemos el estado de los mandos conectados
    const gamepads = navigator.getGamepads();
    let gp = null;

    // Buscamos el primer mando que esté activo (que no sea null)
    for (let i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) {
            gp = gamepads[i];
            break; 
        }
    }

    // ... (dentro de la función updateGamepad, después de detectar gp)

        const idLower = gp.id.toLowerCase();
        let currentImg = null;
        
        // Limpiamos clases viejas para que no se mezclen los colores
        imgPs.classList.remove('ps-style', 'xbox-style', 'generic-style');
        imgXbox.classList.remove('ps-style', 'xbox-style', 'generic-style');

        if (idLower.includes("xbox") || idLower.includes("xinput")) {
            currentImg = imgXbox;
            currentImg.classList.add('xbox-style'); // <--- ASIGNA VERDE
            infoDiv.innerText = "Modelo: Xbox";
        } 
        else if (idLower.includes("sony") || idLower.includes("playstation") || idLower.includes("wireless controller")) {
            currentImg = imgPs;
            currentImg.classList.add('ps-style'); // <--- ASIGNA AZUL
            infoDiv.innerText = "Modelo: PlayStation";
        } 
        else {
            currentImg = imgGeneric;
            currentImg.classList.add('generic-style'); // <--- ASIGNA BLANCO
            infoDiv.innerText = "Modelo: Genérico";
        }

        // Mostrar solo la imagen actual
        imgPs.style.display = (currentImg === imgPs) ? "block" : "none";
        imgXbox.style.display = (currentImg === imgXbox) ? "block" : "none";
        imgGeneric.style.display = (currentImg === imgGeneric) ? "block" : "none";

        // Lógica de presionar botón
        let buttonPressed = false;
        for (let j = 0; j < gp.buttons.length; j++) {
            if (gp.buttons[j].pressed) { buttonPressed = true; break; }
        }

        if (buttonPressed) {
            currentImg.classList.add('pressed');
        } else {
            currentImg.classList.remove('pressed');
        }

    if (gp) {
        // --- 1. ESTADO CONECTADO ---
        statusDiv.innerText = "CONECTADO";
        statusDiv.className = "connected";
        
        const idLower = gp.id.toLowerCase();
        let currentImg = null;
        
        // --- 2. DETECCIÓN DE MODELO ---
        // Ocultamos todas primero para evitar que se encimen
        imgPs.style.display = "none";
        imgXbox.style.display = "none";
        imgGeneric.style.display = "none";

        if (idLower.includes("xbox") || idLower.includes("xinput") || idLower.includes("microsoft")) {
            currentImg = imgXbox;
            infoDiv.innerText = "Modelo: Xbox Series / One / 360";
        } 
        else if (idLower.includes("sony") || idLower.includes("playstation") || idLower.includes("wireless controller")) {
            currentImg = imgPs;
            infoDiv.innerText = "Modelo: PlayStation (DualShock / DualSense)";
        } 
        else {
            currentImg = imgGeneric;
            infoDiv.innerText = "Modelo: Genérico / Desconocido";
        }

        // Mostramos la imagen del mando detectado
        currentImg.style.display = "block";

        // --- 3. LÓGICA DE BRILLO ---
        let buttonPressed = false;
        
        // Revisamos todos los botones físicos
        for (let j = 0; j < gp.buttons.length; j++) {
            if (gp.buttons[j].pressed) {
                buttonPressed = true;
                break;
            }
        }

        // Revisamos los ejes (Sticks o Gatillos analógicos como L2/R2)
        // Algunos mandos reportan los gatillos como ejes con valores de -1 a 1 o 0 a 1
        for (let k = 0; k < gp.axes.length; k++) {
            if (Math.abs(gp.axes[k]) > 0.5) { // Si mueves el stick más de la mitad
                buttonPressed = true;
                break;
            }
        }

        // Aplicamos el efecto de brillo si se detecta actividad
        if (buttonPressed) {
            currentImg.classList.add('pressed');
            // También hacemos que el contenedor brille un poco por si la imagen tiene fondo
            document.querySelector('.container').style.boxShadow = "0 0 30px #00ceff";
        } else {
            currentImg.classList.remove('pressed');
            document.querySelector('.container').style.boxShadow = "0 10px 40px rgba(0,0,0,0.7)";
        }

        // Actualización constante para respuesta inmediata
        requestAnimationFrame(updateGamepad);

    } else {
        // --- 4. ESTADO DESCONECTADO ---
        statusDiv.innerText = "DESCONECTADO - Presiona un botón";
        statusDiv.className = "disconnected";
        infoDiv.innerText = "Esperando señal del mando...";
        
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
