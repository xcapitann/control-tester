window.addEventListener("gamepadconnected", (e) => {
    console.log("Gamepad conectado:", e.gamepad.id);
    updateLoop();
});

function updateLoop() {
    const gamepads = navigator.getGamepads();
    const gp = gamepads[0]; // Tomamos el primer control conectado

    if (gp) {
        const id = gp.id.toLowerCase();
        const nameDisplay = document.getElementById("controller-name");
        const status = document.getElementById("status");
        
        // Ocultar todas las imágenes primero
        document.querySelectorAll('img').forEach(img => img.style.display = 'none');

        // Lógica de identificación
        if (id.includes("xbox") || id.includes("xinput")) {
            nameDisplay.innerText = "Mando Detectado: Xbox One / 360";
            document.getElementById("img-xbox").style.display = "block";
        } 
        else if (id.includes("sony") || id.includes("playstation") || id.includes("wireless controller")) {
            // Nota: PS3 y PS4 a veces comparten el string "Wireless Controller"
            nameDisplay.innerText = "Mando Detectado: PlayStation (PS3/PS4)";
            document.getElementById("img-ps4").style.display = "block";
        } 
        else {
            nameDisplay.innerText = "Mando Detectado: Genérico / Desconocido";
            document.getElementById("img-generic").style.display = "block";
        }

        status.innerText = "Estado: Conectado y activo";
        
        // Aquí podrías agregar lógica para ver qué botones se presionan (gp.buttons)
        requestAnimationFrame(updateLoop);
    } else {
        document.getElementById("status").innerText = "Estado: Desconectado";
    }
}