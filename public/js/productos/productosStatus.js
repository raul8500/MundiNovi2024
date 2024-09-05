// URL base para actualizar el estado del usuario
const urlUpdateProductoStatus = '/api/productosStatus/';

let newStatus = true;

function openChangeStatusAlert(productoId) {
    Swal.fire({
        title: 'Cambiar Estado del Producto',
        text: 'Selecciona el nuevo estado para el producto:',
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
            newStatus = true; // Activo
        } else if (result.isDenied) {
            newStatus = false; // Inactivo
        } else {
            return; // Si se cancela, salir de la función
        }

        try {
            const response = await fetch(`${urlUpdateProductoStatus}${productoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ esActivo: newStatus })
            });

            if (response.ok) {
                Swal.fire({
                    title: 'Éxito',
                    text: 'Estado del producto actualizado correctamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    window.location.reload(); // Recargar la página después de la actualización
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al actualizar el estado del producto.',
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
    const productoID = button.id;
    openChangeStatusAlert(productoID);
});
