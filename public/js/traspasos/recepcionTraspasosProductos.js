document.addEventListener('DOMContentLoaded', () => {
    const traspasoSeleccionado = JSON.parse(sessionStorage.getItem('traspasoSeleccionado'));

    const tbodyProductos = document.querySelector('#tablaProductos tbody');
    const inputCodigoBarras = document.getElementById('inputCodigoBarras');

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
            const presentacion = parseInt(producto.presentacion, 10) || 1; // Evita valores NaN

            const unidades = Math.floor(cantidad / presentacion); // Número de filas a agregar

            for (let i = 0; i < unidades; i++) {
                const fila = `
                    <tr data-reference="${producto.reference}">
                        <td>${producto.reference}</td>
                        <td>${producto.name}</td>
                        <td>1</td>
                        <td class="text-center correcto">❌</td>
                    </tr>
                `;
                tbodyProductos.insertAdjacentHTML('beforeend', fila);
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
                inputCodigoBarras.value = '';
            } else {
                Swal.fire('❌ Error', 'El código no corresponde a ningún producto pendiente.', 'error');
                inputCodigoBarras.value = ""
            }
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

    // ✅ Evento para el botón Recibir
    document.getElementById('btnRecibir').addEventListener('click', () => {
        const filasPendientes = Array.from(tbodyProductos.querySelectorAll('tr')).filter(row => {
            return row.querySelector('.correcto').innerText === '❌';
        });

        if (filasPendientes.length > 0) {
            Swal.fire('⚠️ Advertencia', 'Aún hay productos pendientes por escanear.', 'warning');
        } else {
            Swal.fire('✅ Recepción completada', 'Todos los productos han sido marcados como recibidos.', 'success');
            // Aquí puedes enviar los datos al backend
        }
    });
});
