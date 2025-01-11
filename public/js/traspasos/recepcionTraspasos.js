$(document).ready(function () {
    const tabla = $('#tablaRecepcion').DataTable({
        ajax: {
            url: '/api/traspasos', // URL del backend
            dataSrc: 'traspasos' // Apunta al array 'traspasos'
        },
        order: [[1, 'desc']], // Ordenar por la columna de la fecha (2da columna) de forma descendente
        columns: [
            { data: 'folio', title: 'Folio' },
            { 
                data: 'fecha', 
                title: 'Fecha', 
                render: function (data) {
                    return new Date(data).toLocaleDateString();
                }
            },
            { data: 'sucursalOrigen.nombre', title: 'Sucursal Origen' },
            { data: 'usuarioOrigen.name', title: 'Usuario Origen' },
            { data: 'sucursalDestino.nombre', title: 'Sucursal Destino' },
            { data: 'estado', title: 'Estado' },
            { data: 'observaciones', title: 'Observaciones' },
            {
                data: null,
                title: 'Acciones',
                render: function (data, type, row) {
                    let botones = '';
                    
                    // Botón Recibir (solo si el estado es "pendiente")
                    if (row.estado === 'pendiente') {
                        botones += `
                            <button class="btn btn-warning btn-recibir" data-id="${row._id}" title="Recibir">
                                <i class="fa-solid fa-truck"></i> Recibir
                            </button>
                        `;
                    }

                    return botones;
                },
                orderable: false,
                searchable: false
            }
        ],
        language: {
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sInfo": "Mostrando _START_ a _END_ de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando 0 a 0 de 0 registros",
            "sInfoFiltered": "(filtrado de _MAX_ registros totales)",
            "sSearch": "Buscar:",
            "oPaginate": {
                "sFirst": "Primera",
                "sLast": "Última",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            }
        }
    });

    // ✅ Evento para el botón "Recibir"
    $('#tablaRecepcion').on('click', '.btn-recibir', async function () {
        const id = $(this).data('id'); // Obtener el ID del traspaso

        try {
            // Mostrar alerta de carga
            Swal.fire({
                title: 'Cargando Traspaso...',
                text: 'Por favor, espera un momento.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // ✅ Hacer la petición al backend
            const response = await fetch(`/api/traspasos/${id}`);
            if (!response.ok) {
                throw new Error('No se pudo obtener la información del traspaso');
            }

            const data = await response.json();

            // ✅ Guardar datos en sessionStorage
            sessionStorage.setItem('traspasoSeleccionado', JSON.stringify(data.traspaso));

            // ✅ Redirigir a la página de recepción de productos
            window.location.href = '/recepcionFaltantesProductos';

        } catch (error) {
            console.error('❌ Error al obtener el traspaso:', error);
            Swal.fire('❌ Error', 'No se pudo obtener la información del traspaso.', 'error');
        }
    });
});
