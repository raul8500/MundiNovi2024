document.addEventListener("DOMContentLoaded", function () {
    // 🚀 Abrir modal al hacer clic en "Renuncias"
    document.getElementById("btnRenuncias").addEventListener("click", async function () {
        try {
            const response = await fetch("/api/renuncia/plantilla");
            const data = await response.json();

            if (data.renuncia) {
                document.getElementById("contenidoRenuncia").value = data.renuncia;
            } else {
                document.getElementById("contenidoRenuncia").value = "No hay plantilla guardada.";
            }

            new bootstrap.Modal(document.getElementById("modalEditarRenuncia")).show();
        } catch (error) {
            console.error("Error al obtener la plantilla de renuncia:", error);
            Swal.fire("Error", "No se pudo cargar la plantilla de renuncia.", "error");
        }
    });

    // 🚀 Guardar los cambios en la plantilla de renuncia
    document.getElementById("btnGuardarRenuncia").addEventListener("click", async function () {
        const contenido = document.getElementById("contenidoRenuncia").value;

        try {
            const response = await fetch("/api/renuncia/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contenido })
            });

            const data = await response.json();
            Swal.fire("Éxito", data.message, "success");
            document.getElementById("modalEditarRenuncia").querySelector(".btn-close").click();
        } catch (error) {
            console.error("Error al guardar la plantilla de renuncia:", error);
            Swal.fire("Error", "No se pudo guardar la plantilla de renuncia.", "error");
        }
    });
});
