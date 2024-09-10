guardarNuevaInfoCliente

document.getElementById('guardarNuevaInfoCliente').addEventListener('click', async (e) => {

    console.log(document.getElementById('regimenFiscalCliente').value)

    clienteSeleccionado.phonePrimary = document.getElementById('numeroTelefonoCliente').value
    clienteSeleccionado.phonePrimary = document.getElementById('numeroTelefonoCliente').value
    clienteSeleccionado.regime = document.getElementById('regimenFiscalCliente').value
    if (!Array.isArray(clienteSeleccionado.regimeObject)) {
        clienteSeleccionado.regimeObject = [];
    }
    clienteSeleccionado.regimeObject[0] = document.getElementById('regimenFiscalCliente').value;
    clienteSeleccionado.email = document.getElementById('correoCliente').value

    try {
        const response = await fetch('/api/clientesUpdate/puntoVenta/' + clienteSeleccionado.id, {
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
                modalSelectUser.hide()
                
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

});