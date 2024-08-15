const urlDeleteUser = base + '/api/auth/users/'; // Define la URL base para eliminar

// Capturar el id del usuario al hacer clic en el botón eliminar
document.addEventListener('click', function(e) {
    if (e.target && e.target.matches('.btnDeleteUsers')) {
        const button = e.target.closest('.btnDeleteUsers'); // Obtiene el botón que fue clicado
        const idUser = button.id;

        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteUser(idUser);
            }
        });
    }
});

async function deleteUser(id) {
    try {
        const response = await fetch(`${urlDeleteUser}${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            Swal.fire({
                title: 'Eliminado',
                text: 'El usuario ha sido eliminado.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                window.location.reload(); // Refrescar la página después de eliminar
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al eliminar el usuario.',
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
