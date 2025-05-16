document.addEventListener('DOMContentLoaded', () => {
    const traspasoSeleccionado = JSON.parse(sessionStorage.getItem('traspasoSeleccionado'));

    const tbodyProductos = document.querySelector('#tablaProductos tbody');
    const inputCodigoBarras = document.getElementById('inputCodigoBarras');

    // Array para guardar los productos recibidos
    let productosRecibidos = [];

    if (traspasoSeleccionado) {
        console.log('Datos del Traspaso:', traspasoSeleccionado);

        // ✅ Mostrar información en la interfaz
        document.getElementById('sucursalOrigen').innerText = traspasoSeleccionado.sucursalOrigen.nombre || 'N/A';
        document.getElementById('sucursalDestino').innerText = traspasoSeleccionado.sucursalDestino.nombre || 'N/A';
        document.getElementById('usuarioOrigen').innerText = `${traspasoSeleccionado.usuarioOrigen.name} (@${traspasoSeleccionado.usuarioOrigen.username})` || 'N/A';
        document.getElementById('usuarioDestino').innerText = `${traspasoSeleccionado.usuarioDestino.name} (@${traspasoSeleccionado.usuarioDestino.username})` || 'N/A';

        // ✅ Cargar productos en la tabla
traspasoSeleccionado.productos.forEach(producto => {
    const cantidad = producto.cantidad;
    const presentacion = parseInt(producto.presentacion, 10) || 1;

    const unidadesCompletas = Math.floor(cantidad / presentacion);
    const restante = cantidad % presentacion;

    // Agrega filas completas
    for (let i = 0; i < unidadesCompletas; i++) {
        const fila = `
            <tr data-reference="${producto.reference}">
                <td>${producto.reference}</td>
                <td>${producto.name}</td>
                <td>${presentacion}</td>
                <td class="text-center correcto">❌</td>
            </tr>
        `;
        tbodyProductos.insertAdjacentHTML('beforeend', fila);
    }

    // Agrega una fila para el sobrante si existe
    if (restante > 0) {
        const filaRestante = `
            <tr data-reference="${producto.reference}">
                <td>${producto.reference}</td>
                <td>${producto.name}</td>
                <td>${restante}</td>
                <td class="text-center correcto">❌</td>
            </tr>
        `;
        tbodyProductos.insertAdjacentHTML('beforeend', filaRestante);
    }
});

    } else {
        Swal.fire('⚠️ Error', 'No hay datos del traspaso seleccionados.', 'warning');
    }

    // ✅ Capturar código de barras
    inputCodigoBarras.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const codigo = inputCodigoBarras.value.trim();

            if (codigo === '') {
                Swal.fire('⚠️ Advertencia', 'El código no puede estar vacío.', 'warning');
                return;
            }

            // Buscar la fila en la tabla con el código escaneado
            const fila = Array.from(tbodyProductos.querySelectorAll('tr')).find(row => {
                return row.dataset.reference === codigo && row.querySelector('.correcto').innerText === '❌';
            });

            if (fila) {
                fila.querySelector('.correcto').innerHTML = '✅';
                fila.classList.add('table-success'); // Marcar la fila como válida

                // Guardar el producto recibido en el array
                const productoRecibido = {
                    reference: fila.dataset.reference,
                    name: fila.querySelector('td:nth-child(2)').innerText,
                    cantidad: 1 // Asumimos que cada producto recibido es 1 unidad
                };
                productosRecibidos.push(productoRecibido);

                inputCodigoBarras.value = '';
            } else {
                Swal.fire('❌ Error', 'El código no corresponde a ningún producto pendiente.', 'error');
                inputCodigoBarras.value = "";
            }
        }
    });

    // ✅ Evento para el botón Recibir
    document.getElementById('btnRecibir').addEventListener('click', async () => {

            // Obtener el usuario de reparto (por ejemplo, desde el sessionStorage)
            const usuarioRepartoId = infoUser._id

            // Enviar los productos recibidos al backend para actualizar el traspaso
            const traspasoId = traspasoSeleccionado._id;

            try {
                // Realizar la solicitud PUT para actualizar el traspaso en el backend
                const response = await fetch(`/api/traspasos/recibirReparto/${traspasoId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        productosRecibidos: productosRecibidos,
                        usuarioRepartoId: usuarioRepartoId // Enviar el ID del usuario de reparto
                    }),
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Error al actualizar el traspaso');
                }

                Swal.fire('✅', 'El traspaso ha sido actualizado exitosamente', 'success')
                    .then(() => {
                        window.location.href = '/recepcionFaltantes';
                    }
                );

            } catch (error) {
                console.error('❌ Error al recibir los productos:', error);
                Swal.fire('❌ Error', 'No se pudo actualizar el traspaso.', 'error');
            }
        
    });

    // ✅ Evento para el botón Cancelar
    document.getElementById('btnCancelar').addEventListener('click', () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Se perderán los cambios no guardados.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/recepcion';
            }
        });
    });
});
