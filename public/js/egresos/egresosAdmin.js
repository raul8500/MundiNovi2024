$('#tablaEgresos').DataTable({
    ajax: {
        url: '/api/egresos', // Endpoint para obtener los egresos
        dataSrc: ''
    },
    columns: [
        { data: 'folioEgreso', title: 'Folio' },
        { data: 'folioPadre', title: 'Folio corte' },
        { data: 'sucursal.nombre', title: 'Sucursal' },
        { data: 'usuario.name', title: 'Usuario' },
        {
            data: 'importe',
            title: 'Importe',
            render: function (importe) {
                return `$${importe.toFixed(2)}`;
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
        { data: 'observaciones', title: 'Observaciones' },
        {
            data: 'archivoComprobatorio',
            title: 'Acciones',
            render: function (archivoComprobatorio, type, row) {
                return `
                    ${
                        archivoComprobatorio
                            ? `<a href="/${archivoComprobatorio}" download class="btn btn-primary btn-sm" title="Descargar archivo">
                                    <i class="fas fa-download"></i> Comprobante
                                </a>`
                            : '<span class="text-muted">Sin archivo</span>'
                    }
                    <button class="btn btn-danger btn-sm btn-eliminar" data-id="${row._id}" title="Eliminar">
                        <i class="fas fa-trash-alt"></i> Eliminar
                    </button>
                `;
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


$(document).on('click', '.btn-eliminar', function () {
    const egresoId = $(this).data('id');
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esta acción!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `/api/egresos/${egresoId}`,
                type: 'DELETE',
                success: function () {
                    Swal.fire(
                        '¡Eliminado!',
                        'El egreso ha sido eliminado.',
                        'success'
                    );
                    $('#tablaEgresos').DataTable().ajax.reload();
                },
                error: function () {
                    Swal.fire(
                        'Error',
                        'No se pudo eliminar el egreso.',
                        'error'
                    );
                }
            });
        }
    });
});
