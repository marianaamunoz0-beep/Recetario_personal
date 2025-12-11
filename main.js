/* ============================
   REGISTRO DEL SERVICE WORKER
============================ */
if ('serviceWorker' in navigator) {
    console.log('puedes usar los Service Workers del navegador');

    navigator.serviceWorker.register('./sw.js')
        .then(res => console.log('ServiceWorker cargado al 100%', res))
        .catch(err => console.log('El ServiceWorker falló', err));
} else {
    console.log('NO PUEDES USAR los Service Workers del navegador');
}


/* ============================
     PERMISO DE NOTIFICACIÓN
============================ */
async function pedirPermiso() {
    if (!("Notification" in window)) {
        alert("El navegador no soporta notificaciones.");
        return false;
    }

    if (Notification.permission === "granted") return true;

    const permiso = await Notification.requestPermission();
    return permiso === "granted";
}



document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector('#nueva-receta form');
    if (!form) {
        console.warn("Formulario de nueva pieza no encontrado.");
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const ingredientes = document.getElementById("ingredientes").value.trim();
        const instrucciones = document.getElementById("instrucciones").value.trim();

        if (!nombre) {
            alert("Debes escribir el nombre de la pieza.");
            return;
        }

        // ==== PERMISO NOTIFICACIONES ====
        const permitido = await pedirPermiso();
        if (!permitido) {
            alert("Debes permitir notificaciones para continuar.");
            return;
        }

        // ==== REGISTRO DEL SERVICE WORKER ====
        const reg = await navigator.serviceWorker.getRegistration();

        const opciones = {
            body: `Ingredientes: ${ingredientes || "—"}\nInstrucciones: ${instrucciones || "—"}`,
            icon: "imagenes/fav.png",
            badge: "imagenes/fav.png",
            vibrate: [200, 100, 200],
            tag: "receta-nueva",
            renotify: true
        };

        // ==== NOTIFICACIÓN ====
        if (reg && reg.showNotification) {
            reg.showNotification(`Registro de refraccion: ${nombre}`, opciones);
        } else {
            new Notification(`Registro de refraccion: ${nombre}`, opciones);
        }

        // ==== ENVIAR A WHATSAPP ====
        const numeroWhats = "2751105385"; // <-- CAMBIA AQUÍ

        const textoWhats =
            "*Nuevo registro guardado*\n\n" +
            "*Nombre de la pieza:* " + nombre + "\n\n" +
            "*Descripción:*\n" + (ingredientes || "—") + "\n\n" +
            "*Precio:*\n" + (instrucciones || "—") + "\n\n" +
            "Enviado desde tu Registro de refraccion ✔️";

        const urlWhats = "https://wa.me/" + numeroWhats + "?text=" + encodeURIComponent(textoWhats);

        window.open(urlWhats, "_blank");

        // ==== LIMPIAR FORMULARIO ====
        form.reset();
    });
});





