document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("btnGuardarCliente").addEventListener("click", async function (event) {
        event.preventDefault(); // Evita el envío del formulario por defecto
        const clienteId = document.getElementById("clienteId").value || null;
        console.log(clienteId ? '🛠 Editando cliente existente' : '🆕 Creando nuevo cliente');


        // Obtener valores del formulario
        let clientData = {
            name: document.getElementById("nombreCliente").value,
            identification: document.getElementById("rfc").value || null,
            phonePrimary: document.getElementById("telefonoPrincipal").value || null,
            email: document.getElementById("correoElectronicoContacto").value || null,
            regime: document.getElementById("regimen").value,
            address: {
                street: document.getElementById("calle").value || null,
                exterior: document.getElementById("numeroExterior").value || null,
                interior: document.getElementById("numeroInterior").value || null,
                neighborhood: document.getElementById("colonia").value || null,
                city: document.getElementById("localidad").value || null,
                municipality: document.getElementById("municipioDelegacion").value || null,
                state: document.getElementById("estado").value || null,
                zip: document.getElementById("codigoPostal").value || null,
                country: "MEX"
            }
        };

        // Determinar la zona seleccionada
        const zonaId = document.getElementById('selectZonaCliente').value;

        let databaseClient = {
            zonaCliente: zonaId,
            esfactura: true, // ya no se pregunta, se asume que sí o lo decides tú
            estado: true,
            monedero: 0,
            login: {
                username: clientData.phonePrimary,
                pasword: null
            }
        };

        let postData = {
            facturapi: clientData,
            client: databaseClient
        };

        const url = clienteId ? `/api/cliente/test/${clienteId}` : `/api/cliente/test`;
        const method = clienteId ? 'PUT' : 'POST';
        const mensajeProgreso = clienteId ? 'Actualizando cliente...' : 'Registrando cliente...';
        const mensajeExito = clienteId ? '¡Cliente actualizado!' : '¡Cliente registrado!';

        try {
            Swal.fire({
                title: mensajeProgreso,
                text: "Por favor, espera un momento.",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(postData)
            });

            const result = await response.json();

            if (response.ok) {
                Swal.fire({
                    title: mensajeExito,
                    text: "La operación se realizó correctamente.",
                    icon: "success",
                    confirmButtonText: "Aceptar"
                }).then(() => {
                    const modal = bootstrap.Modal.getInstance(document.getElementById("ModalCliente"));
                    if (modal) modal.hide();

                    $('#tablaClientes').DataTable().ajax.reload();
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: result.message || "Hubo un problema con la operación.",
                    icon: "error",
                    confirmButtonText: "Aceptar"
                });
            }

        } catch (error) {
            console.error("Error en la petición:", error);
            Swal.fire({
                title: "Error de conexión",
                text: "No se pudo conectar con el servidor.",
                icon: "error",
                confirmButtonText: "Aceptar"
            });
        }
    });
});
