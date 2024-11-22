$('#tablaExamenes').DataTable({
    ajax: {
        url: '/api/obtenerCapacitaciones', // URL donde obtienes los datos
        dataSrc: function (json) {
            // Filtrar solo los elementos de tipo "examen"
            return json.capacitaciones.filter(capacitacion => capacitacion.tipo === 'examen');
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
                    <button class="btn btn-primary btn-sm btn-descargar" data-id="${row._id}" data-archivo="${row.archivo}" title="Descargar">
                        <i class="fas fa-download"></i>
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

$('#tablaExamenes').on('click', '.btn-descargar', function () {
    const id = $(this).data('id'); // Obtén el ID de la capacitación
    const url = `/api/capacitaciones/${id}/descargar`; // Construye la URL de descarga

    // Redirigir al usuario a la ruta de descarga
    window.location.href = url;
});


