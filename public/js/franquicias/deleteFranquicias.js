const urlDeleteFranquicia ='/api/franquicia/'; // Define la URL base para eliminar

// Capturar el id de la franquicia al hacer clic en el botón eliminar
on(document, 'click', '.btnDelete', async e => {
    const button = e.target.closest('.btnDelete'); // Obtiene el botón que fue clicado
    idFranquicia = button.id;

    Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esto.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            await deleteFranquicia(idFranquicia);
        }
    });
});

async function deleteFranquicia(id) {
    try {
        const response = await fetch(`${urlDeleteFranquicia}${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            Swal.fire({
                title: 'Eliminado',
                text: 'La franquicia ha sido eliminada.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                window.location.reload(); // Refrescar la página después de eliminar
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al eliminar la franquicia.',
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
