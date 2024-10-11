// Define la función de guardado por separado
async function guardarNuevaInfoCliente() {
    console.log(document.getElementById('regimenFiscalCliente').value);

    clienteSeleccionado.phonePrimary = document.getElementById('numeroTelefonoCliente').value;
    clienteSeleccionado.regime = document.getElementById('regimenFiscalCliente').value;
    if (!Array.isArray(clienteSeleccionado.regimeObject)) {
        clienteSeleccionado.regimeObject = [];
    }
    clienteSeleccionado.regimeObject[0] = document.getElementById('regimenFiscalCliente').value;
    clienteSeleccionado.email = document.getElementById('correoCliente').value;

    try {
        const response = await fetch('/api/clientes/' + clienteSeleccionado.clientData.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clienteSeleccionado)
        });

        if (response.ok) {
            // Mostrar mensaje de éxito
            Swal.fire({
                title: 'Éxito',
                text: 'Actualizacion correcta',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                cargarClientes();
                clienteSeleccionado.clientData.email = document.getElementById('correoCliente').value;
                clienteSeleccionado.clientData.phonePrimary = document.getElementById('numeroTelefonoCliente').value;
                const telefonoActual = document.getElementById('numeroTelefonoCliente').value;
            });

        } else {
            // Mostrar mensaje de error genérico
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al enviar los datos.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'Error en la conexión con el servidor.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
}

// Asociar la función al evento click
document.getElementById('guardarNuevaInfoCliente').addEventListener('click', guardarNuevaInfoCliente);
