// Inicializar el modal
const modalPass = new mdb.Modal(document.getElementById('ModalUpdatePassword'));

let idUserPass = ''

// Función para actualizar la contraseña
async function updatePassword(userId) {
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    if (!newPassword || !confirmNewPassword) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor, completa todos los campos.',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    if (newPassword !== confirmNewPassword) {
        Swal.fire({
            title: 'Error',
            text: 'Las contraseñas nuevas no coinciden.',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    try {
        const response = await fetch(`/api/auth/users/password/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newPassword })
        });

        if (response.ok) {
            Swal.fire({
                title: 'Éxito',
                text: 'Contraseña actualizada correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                // Cerrar el modal después de la actualización
                modalPass.hide();
            });
        } else if (response.status === 400) {
            Swal.fire({
                title: 'Error',
                text: 'La contraseña no cumple con los requisitos.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al actualizar la contraseña.',
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

// Evento para manejar el clic en el botón de actualizar contraseña
document.getElementById('btnUpdatePassword').addEventListener('click', () => {
    updatePassword(idUserPass);
});

on(document, 'click', '.btnChangePassword', async e => {
    const button = e.target.closest('.btnChangePassword');
    idUserPass = e.target.id; // Asume que el ID del usuario está en el botón

    document.getElementById('newPassword').value = ''
    document.getElementById('confirmNewPassword').value = ''

    modalPass.show();
});
