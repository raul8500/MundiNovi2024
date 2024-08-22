// URL base para actualizar el estado del usuario
const urlUpdateUserStatus = '/api/auth/users/status/';

let idUserStatus = '';
let newStatus = 0;

// Función para manejar el cambio de estado con tres opciones
function openChangeStatusAlert(userId) {
    Swal.fire({
        title: 'Cambiar Estado del Usuario',
        text: 'Selecciona el nuevo estado para el usuario:',
        icon: 'question',
        showCancelButton: true,
        showDenyButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Activo',
        denyButtonText: 'Inactivo',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    }).then(async (result) => {
        if (result.isConfirmed) {
            newStatus = 1; // Activo
        } else if (result.isDenied) {
            newStatus = 2; // Inactivo
        } else {
            return; // Si se cancela, salir de la función
        }

        try {
            const response = await fetch(`${urlUpdateUserStatus}${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus }) // Enviar el nuevo estado
            });

            if (response.ok) {
                Swal.fire({
                    title: 'Éxito',
                    text: 'Estado del usuario actualizado correctamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    window.location.reload(); // Recargar la página después de la actualización
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al actualizar el estado del usuario.',
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
}

// Manejador de clic para abrir la alerta con los datos correctos
on(document, 'click', '.btnChangeStatus', async e => {
    const button = e.target.closest('.btnChangeStatus');
    const userId = button.id;
    openChangeStatusAlert(userId);
});
