const modalProductoEdit = new mdb.Modal(document.getElementById('precioModal'));
let idProductoEdit = '';

function mostrarInfoPanel(idProductoEdit) {
    fetch('/api/productos/' + idProductoEdit)
        .then(response => response.json())
        .then(data => {
            setEditFormData(data.product);
        })
        .catch(error => console.log(error)); // Mover .catch() al final
}

on(document, 'click', '.btn-editar', async e => {
    const button = e.target.closest('.btn-editar'); 
    idProductoEdit = button.getAttribute('data-id');
    mostrarInfoPanel(idProductoEdit);
});

function setEditFormData(producto) {
    document.getElementById('precio1').value = producto.datosFinancieros.precio1 || '';
    document.getElementById('codigoBarra').value = producto.codigoBarra || '';
    modalProductoEdit.show();
}

document.getElementById('savePrecio1').addEventListener('click', async () => {
    const newPrice = document.getElementById('precio1').value;
    const codigoBarra = document.getElementById('codigoBarra').value;

    // Agregar logs para verificar los valores
    console.log('New Price:', newPrice);
    console.log('Código de barras:', codigoBarra);

    // Validar el precio
    if (newPrice && newPrice > 0 && codigoBarra) {
        try {
            const response = await fetch(`/api/productos/${idProductoEdit}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newPrice: newPrice, codigoBarra: codigoBarra }) // Convertir el cuerpo a JSON
            });

            if (response.ok) {
                Swal.fire('Éxito', 'Precio y código de barras actualizados', 'success')
                    .then(() => {
                        location.reload(); // Recargar la página después del éxito
                    });
            } else {
                Swal.fire('Error', 'No se pudo actualizar el precio y código de barras', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'Error en la conexión con el servidor', 'error');
        }
    } else {
        alert('Por favor ingresa un precio y código de barras válidos.');
    }
});
