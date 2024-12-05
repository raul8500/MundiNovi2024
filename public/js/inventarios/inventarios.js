$('#tablaInventarios').DataTable({
    ajax: {
        url: '/api/inventario',
        dataSrc: ''
    },
    columns: [
        { data: 'folio', title: 'Folio' },
        { data: 'sucursal.nombre', title: 'Sucursal' },
        { data: 'encargado.name', title: 'Encargado' },
        {
            data: 'productosConMovimiento',
            title: 'Importe',
            render: function (productosConMovimiento) {
                if (!productosConMovimiento || productosConMovimiento.length === 0) return '$0.00';
                const totalImporte = productosConMovimiento.reduce((sum, producto) => sum + producto.importe, 0);
                return `$${totalImporte.toFixed(2)}`;
            }
        },
        {
            data: 'createdAt',
            title: 'Fecha y hora',
            render: function (data) {
                const date = new Date(data);
                const formattedDate = date.toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                });
                const formattedTime = date.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
                return `${formattedDate} ${formattedTime}`;
            }
        },
        {
            data: 'estado',
            title: 'Estado',
            render: function (estado) {
                // Agregar clases de badge dependiendo del estado
                const badgeClass = estado ? 'badge bg-success' : 'badge bg-warning text-dark';
                const estadoTexto = estado ? 'Finalizado' : 'Iniciado';
                return `<span class="${badgeClass}">${estadoTexto}</span>`;
            }
        },
        {
            data: null,
            title: 'Acciones',
            render: function (data, type, row) {
                if (!row.estado) {
                    // Si el estado es 'Iniciado'
                    return `
                        <button class="btn btn-danger btn-sm btn-finalizar" data-id="${row._id}" title="Finalizar">
                            <i class="fas fa-times"></i> Finalizar
                        </button>
                    `;
                } else {
                    // Si el estado es 'Finalizado'
                    return `
                        <button class="btn btn-primary btn-sm btn-detalles" data-id="${row._id}" title="Detalles">
                            <i class="fas fa-info-circle"></i> Detalles
                        </button>
                        <button class="btn btn-success btn-sm btn-descargar" data-id="${row._id}" title="Descargar">
                            <i class="fas fa-print"></i> Descargar
                        </button>
                    `;
                }
            }
        }
    ],
    order: [[4, 'desc']], // Ordenar por la columna 'createdAt' en orden descendente
    language: {
        "sProcessing": "Procesando...",
        "sLengthMenu": "Mostrar _MENU_ registros",
        "sZeroRecords": "No se encontraron resultados",
        "sInfo": "Mostrando _START_ a _END_ de _TOTAL_ registros",
        "sInfoEmpty": "Mostrando 0 a 0 de 0 registros",
        "sInfoFiltered": "(filtrado de _MAX_ registros totales)",
        "sSearch": "Buscar:",
        "sLoadingRecords": "Cargando...",
        "oPaginate": {
            "sFirst": "Primera",
            "sLast": "Última",
            "sNext": "Siguiente",
            "sPrevious": "Anterior"
        }
    }
});

document.body.addEventListener('click', async (event) => {
    if (event.target.closest('.btn-detalles')) {
        const button = event.target.closest('.btn-detalles');
        const inventarioId = button.getAttribute('data-id');

        try {
            // Hacer solicitud al endpoint para obtener los detalles
            const response = await fetch(`/api/inventario/${inventarioId}`);
            if (!response.ok) throw new Error('Error al obtener los detalles del inventario.');

            const inventario = await response.json();

            // Mostrar sucursal y folio en el header del modal
            const headerInfo = document.getElementById('headerInfo');
            headerInfo.innerHTML = `
                <strong>Sucursal:</strong> ${inventario.sucursal.nombre || 'N/A'} |
                <strong>Folio:</strong> ${inventario.folio || 'N/A'}
            `;

            // Filtrar productos para cada categoría
            const productosInventariado = inventario.productosConMovimiento;
            const productosNoInventariado = inventario.productos.filter(p => p.existenciaFisica === 0);
            const productosTodos = inventario.productos;

            // Función para determinar la clase del badge de diferencia
            const getDiferenciaClass = (diferencia) => {
                if (diferencia === 0) return 'badge bg-success';
                if (diferencia > 0) return 'badge bg-warning text-dark';
                return 'badge bg-danger';
            };

            // Función para crear tarjetas
            const crearTarjetaProducto = (producto, esInventariado = false, esNoInventariado = false) => {
                const diferencia = producto.diferencia ?? producto.existenciaFisica - producto.existenciaContable;

                const diferenciaClass = esNoInventariado
                    ? 'badge bg-secondary'
                    : getDiferenciaClass(diferencia);

                const badgeClass = esNoInventariado ? 'badge bg-secondary' : '';
                const cardClass = esInventariado
                    ? 'text-white bg-success'
                    : esNoInventariado
                    ? 'bg-light'
                    : '';

                return `
                    <div class="col-md-4">
                        <div class="card mb-2 shadow-sm ${cardClass}">
                            <div class="card-body p-2">
                                <p class="card-text mb-1" style="font-size: 0.85rem;">
                                    <strong>Referencia:</strong> <span>${producto.referencia}</span>
                                </p>
                                <p class="card-text mb-1" style="font-size: 0.85rem;">
                                    <strong>Existencia Física:</strong> 
                                    <span class="badge ${badgeClass}">${producto.existenciaFisica}</span>
                                </p>
                                <p class="card-text mb-1" style="font-size: 0.85rem;">
                                    <strong>Existencia Contable:</strong> 
                                    <span class="badge ${badgeClass}">${producto.existenciaContable}</span>
                                </p>
                                <p class="card-text mb-1" style="font-size: 0.85rem;">
                                    <strong>Diferencia:</strong> 
                                    <span class="${diferenciaClass}">${diferencia}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                `;
            };

            // Llenar las pestañas con los productos correspondientes
            document.getElementById('productos-inventariado').innerHTML = productosInventariado.map(p =>
                crearTarjetaProducto(p, true)
            ).join('');

            document.getElementById('productos-no-inventariado').innerHTML = productosNoInventariado.map(p =>
                crearTarjetaProducto(p, false, true)
            ).join('');

            document.getElementById('productos-todos').innerHTML = productosTodos.map(p =>
                crearTarjetaProducto(
                    p,
                    productosInventariado.some(pi => pi.referencia === p.referencia),
                    productosNoInventariado.some(pni => pni.referencia === p.referencia)
                )
            ).join('');

            // Mostrar el modal
            const modal = new bootstrap.Modal(document.getElementById('modalDetallesInventario'));
            modal.show();

            // Reiniciar el input de búsqueda
            const inputBusqueda = document.getElementById('busquedaProductos');
            inputBusqueda.value = '';

            // Activar la primera pestaña
            const firstTab = document.querySelector('#modalDetallesInventario .nav-tabs .nav-link:first-child');
            const firstTabContent = document.querySelector('#modalDetallesInventario .tab-pane:first-child');

            document.querySelectorAll('#modalDetallesInventario .nav-tabs .nav-link').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('#modalDetallesInventario .tab-pane').forEach(tabPane => tabPane.classList.remove('active', 'show'));

            firstTab.classList.add('active');
            firstTabContent.classList.add('active', 'show');
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar los detalles del inventario.'
            });
        }
    }
});


// Filtrar productos en las pestañas del modal
document.getElementById('busquedaProductos').addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();
    const activeTabContentId = document.querySelector('.tab-pane.active').id;
    const tarjetas = document.querySelectorAll(`#${activeTabContentId} .card`);

    tarjetas.forEach(tarjeta => {
        const referencia = tarjeta.querySelector('.card-text span').textContent.toLowerCase();
        if (referencia.includes(query)) {
            tarjeta.parentElement.style.display = 'block'; // Mostrar tarjeta
        } else {
            tarjeta.parentElement.style.display = 'none'; // Ocultar tarjeta
        }
    });
});
