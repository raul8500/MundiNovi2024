$(document).ready(function () {
    $('#tablaAsistencias').DataTable({
        ajax: {
            url: '/api/getAllAsistencias', // URL donde obtienes los datos
            dataSrc: '' // Si los datos están en un array
        },
        columns: [
            { data: 'usuarioId.name' },
            { data: 'usuarioId.username' },
            { data: 'usuarioId.sucursalId.nombre' },
            { 
                data: 'acciones.entrada',
                render: function (data) {
                    return data 
                        ? new Date(data).toISOString().replace('T', ' ').slice(0, 16) 
                        : '<span class="badge bg-warning text-dark">Sin registrar</span>';
                }
            },
            { 
                data: 'acciones.salidaComer',
                render: function (data) {
                    return data 
                        ? new Date(data).toISOString().replace('T', ' ').slice(0, 16) 
                        : '<span class="badge bg-warning text-dark">Sin registrar</span>';
                }
            },
            { 
                data: 'acciones.regresoComer',
                render: function (data) {
                    return data 
                        ? new Date(data).toISOString().replace('T', ' ').slice(0, 16) 
                        : '<span class="badge bg-warning text-dark">Sin registrar</span>';
                }
            },
            { 
                data: 'acciones.terminoJornada',
                render: function (data) {
                    return data 
                        ? new Date(data).toISOString().replace('T', ' ').slice(0, 16) 
                        : '<span class="badge bg-warning text-dark">Sin registrar</span>';
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
});
