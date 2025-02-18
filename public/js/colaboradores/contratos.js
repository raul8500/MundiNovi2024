document.addEventListener("DOMContentLoaded", function () {

    // 🚀 Evento para abrir el modal de Contrato y cargar el contenido
    document.getElementById("btnContratos").addEventListener("click", async function () {
        try {
            const response = await fetch("/api/contrato");
            if (!response.ok) throw new Error("Error al obtener el contrato");

            const data = await response.json();
            document.getElementById("contratoTexto").value = data.contenido;

            // Mostrar el modal
            new bootstrap.Modal(document.getElementById("contratoModal")).show();
        } catch (error) {
            console.error("Error al obtener el contrato:", error);
            Swal.fire("Error", "No se pudo cargar el contrato.", "error");
        }
    });

    // 🚀 Evento para habilitar la edición del contrato
    document.getElementById("btnEditarContrato").addEventListener("click", function () {
        document.getElementById("contratoTexto").removeAttribute("readonly");
        document.getElementById("btnGuardarContrato").classList.remove("d-none");
        document.getElementById("btnCancelarEdicion").classList.remove("d-none");
        this.classList.add("d-none"); // Oculta el botón de editar
    });

    // 🚀 Evento para cancelar la edición
    document.getElementById("btnCancelarEdicion").addEventListener("click", function () {
        document.getElementById("contratoTexto").setAttribute("readonly", true);
        document.getElementById("btnGuardarContrato").classList.add("d-none");
        document.getElementById("btnCancelarEdicion").classList.add("d-none");
        document.getElementById("btnEditarContrato").classList.remove("d-none");
    });

    // 🚀 Evento para guardar el contrato editado
    document.getElementById("btnGuardarContrato").addEventListener("click", async function () {
        const nuevoContenido = document.getElementById("contratoTexto").value;

        Swal.fire({
            title: "¿Guardar cambios?",
            text: "Se actualizará el contrato en la base de datos.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, guardar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch("/api/contrato", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ contenido: nuevoContenido })
                    });

                    if (!response.ok) throw new Error("Error al actualizar el contrato");

                    Swal.fire("Guardado", "El contrato se ha actualizado correctamente.", "success");
                    
                    // Deshabilitar edición después de guardar
                    document.getElementById("contratoTexto").setAttribute("readonly", true);
                    document.getElementById("btnGuardarContrato").classList.add("d-none");
                    document.getElementById("btnCancelarEdicion").classList.add("d-none");
                    document.getElementById("btnEditarContrato").classList.remove("d-none");

                } catch (error) {
                    console.error("Error al actualizar el contrato:", error);
                    Swal.fire("Error", "No se pudo actualizar el contrato.", "error");
                }
            }
        });
    });

    // 🚀 Evento para Imprimir el Contrato
    document.getElementById("btnImprimirContrato").addEventListener("click", function () {
        const contenido = document.getElementById("contratoTexto").value;
        const ventana = window.open("", "_blank");
        ventana.document.write(`
            <html>
            <head>
                <title>Contrato Laboral</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
            </head>
            <body class="container mt-4">
                <h4 class="text-center">CONTRATO INDIVIDUAL DE TRABAJO</h4>
                <pre>${contenido}</pre>
                <div class="mt-4 text-center">
                    <p>________________________________</p>
                    <p>Firma del Colaborador</p>
                </div>
                <script>
                    window.onload = function() { window.print(); }
                </script>
            </body>
            </html>
        `);
        ventana.document.close();
    });

});
