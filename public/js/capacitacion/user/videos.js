$('#tablaVideos').DataTable({
    ajax: {
        url: '/api/obtenerCapacitaciones', // URL donde obtienes los datos
        dataSrc: function (json) {
            // Filtrar solo los elementos de tipo "video"
            return json.capacitaciones.filter(capacitacion => capacitacion.tipo === 'video');
        }
    },
    columns: [
        { data: 'nombre', title: 'Nombre' },
        { data: 'descripcion', title: 'Descripción' },
        { 
            data: null,
            title: 'Acciones',
            render: function (data, type, row) {
                return `
                    <button class="btn btn-primary btn-sm btn-ver" data-link="${row.link}" title="Ver Video">
                        <i class="fas fa-play"></i>
                    </button>
                `;
            }
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
        "sUrl": "",
        "sInfoThousands": ",",
        "sLoadingRecords": "Cargando...",
        "oPaginate": {
            "sFirst": "Primera",
            "sLast": "Última",
            "sNext": "Siguiente",
            "sPrevious": "Anterior"
        },
        "oAria": {
            "sSortAscending": ": activar para ordenar la columna de manera ascendente",
            "sSortDescending": ": activar para ordenar la columna de manera descendente"
        }
    }
});

// Evento para redirigir al enlace del video
$(document).on('click', '.btn-ver', function () {
    const link = $(this).data('link'); // Obtén el enlace del video
    if (link) {
        window.open(link, '_blank'); // Abrir en una nueva pestaña
    } else {
        Swal.fire({
            title: 'Error',
            text: 'El enlace del video no está disponible.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
});
