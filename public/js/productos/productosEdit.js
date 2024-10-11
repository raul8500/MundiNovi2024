const modalProductoEdit = new mdb.Modal(document.getElementById('precioModal'));
let idProductoEdit = ''

    function mostrarInfoPanel(idProductoEdit) {
        fetch('/api/productos/'+idProductoEdit)
            .then(response => response.json())
            .then(data => {
                setEditFormData(data.product);
            })
            .catch(error => console.log(error)); // Mover .catch() al final
    }


    on(document, 'click', '.btn-editar', async e => {
        const button = e.target.closest('.btn-editar'); 
        idProductoEdit = button.getAttribute('data-id');
        mostrarInfoPanel(idProductoEdit)
    });

    function setEditFormData(producto) {
        document.getElementById('precio1').value = producto.datosFinancieros.precio1 || '';
        modalProductoEdit.show()
    }

    document.getElementById('savePrecio1').addEventListener('click', async () => {
        const newPrice = document.getElementById('precio1').value;

        // Validar el precio
        if (newPrice && newPrice > 0) {
            try {
                const response = await fetch(`/api/productos/${idProductoEdit}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ newPrice: newPrice }) // Convertir el cuerpo a JSON
                });

                if (response.ok) {
                    Swal.fire('Éxito', 'Precio actualizado', 'success')
                        .then(() => {
                            location.reload(); // Recargar la página después del éxito
                        });
                } else {
                    Swal.fire('Error', 'No se pudo actualizar el precio', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                Swal.fire('Error', 'Error en la conexión con el servidor', 'error');
            }
        } else {
            alert('Por favor ingresa un precio válido.');
        }
    });
