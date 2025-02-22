document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("btnGuardarCliente").addEventListener("click", async function (event) {
        event.preventDefault(); // Evita el envío del formulario por defecto

        // Obtener valores del formulario
        let clientData = {
            name: document.getElementById("nombreCliente").value,
            identification: document.getElementById("rfc").value || null,
            phonePrimary: document.getElementById("telefonoPrincipal").value || null,
            email: document.getElementById("correoElectronicoContacto").value || null,
            regime: document.getElementById("regimen").value,
            thirdType: "NATIONAL",
            status: "active",
            address: {
                street: document.getElementById("calle").value || null,
                exteriorNumber: document.getElementById("numeroExterior").value || null,
                interiorNumber: document.getElementById("numeroInterior").value || null,
                colony: document.getElementById("colonia").value || null,
                locality: document.getElementById("localidad").value || null,
                municipality: document.getElementById("municipioDelegacion").value || null,
                state: document.getElementById("estado").value || null,
                zipCode: document.getElementById("codigoPostal").value || null,
                country: "MEX"
            }
        };

        // Determinar si factura
        let esfactura = document.querySelector("input[name='factura']:checked").value === "si";

        //Determinar la zona
        const select = document.getElementById('selectZonaCliente');
        const zonaId = select.value; // Obtiene el ID seleccionado

        let databaseClient = {
            zonaCliente: zonaId,
            esfactura: esfactura,
            estado: true,
            monedero: 0, // Siempre inicia en 0
            login: {
                username: clientData.phonePrimary, // El username es el número de teléfono
                pasword: null // Opcional, puedes pedirlo en el formulario si es necesario
            }
        };

        // JSON que se enviará al backend
        let postData = {
            alegra: clientData,
            client: databaseClient
        };

        console.log("Enviando cliente:", postData);

        try {
            // Mostrar alerta de carga
            Swal.fire({
                title: "Registrando cliente...",
                text: "Por favor, espera un momento.",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const response = await fetch("/api/cliente/test", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(postData)
            });

            const result = await response.json();

            if (response.ok) {
                Swal.fire({
                    title: "¡Cliente registrado!",
                    text: "El cliente ha sido registrado correctamente.",
                    icon: "success",
                    confirmButtonText: "Aceptar"
                }).then(() => {
                    document.getElementById("ModalAddCliente").classList.remove("show"); // Cierra el modal
                    document.body.classList.remove("modal-open"); // Elimina la clase modal-open del body
                    document.querySelector(".modal-backdrop").remove(); // Remueve el fondo del modal
                    location.reload(); // Recargar la tabla
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: result.message || "Hubo un problema al registrar el cliente.",
                    icon: "error",
                    confirmButtonText: "Aceptar"
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error de conexión",
                text: "No se pudo conectar con el servidor.",
                icon: "error",
                confirmButtonText: "Aceptar"
            });
            console.error("Error en la petición:", error);
        }
    });
});
