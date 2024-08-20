const urlDeleteProductos = base + '/api/productos/'; // Define la URL base para eliminar

// Capturar el id del usuario al hacer clic en el botón eliminar
document.addEventListener('click', function(e) {
    if (e.target && e.target.matches('.btnDeleteProductos')) {
        const button = e.target.closest('.btnDeleteProductos'); // Obtiene el botón que fue clicado
        const idProduct = button.id;

        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteProducto(idProduct);
            }
        });
    }
});

async function deleteProducto(id) {
    try {
        const response = await fetch(`${urlDeleteProductos}${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            Swal.fire({
                title: 'Eliminado',
                text: 'El producto ha sido eliminado.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                window.location.reload(); // Refrescar la página después de eliminar
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al eliminar el producto.',
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
