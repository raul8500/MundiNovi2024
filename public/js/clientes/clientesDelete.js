const urlDeleteClientes = '/api/clientes/';

on(document, 'click', '.btnDeleteClientes', async e => {
    const button = e.target.closest('.btnDeleteClientes'); // Obtiene el botón que fue clicado
    const idCliente = button.id;

    Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esto.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            await deleteCliente(idCliente);
        }
    });
});

async function deleteCliente(id) {
    try {
        const response = await fetch(`${urlDeleteClientes}${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            Swal.fire({
                title: 'Eliminado',
                text: 'El cliente ha sido eliminado.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                // Eliminar cliente de la lista local
                clientes = clientes.filter(cliente => cliente.clientData.id !== id);
            
                mostrarClientes(clientes, currentPageClientes, itemsPerPageClientes);
                actualizarControlesPaginacionClientes();
                generarNumerosDePaginaClientes();
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al eliminar el cliente.',
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

