$(document).ready(function () {
    $('#grupoTabla').DataTable({
        ajax: {
            url: '/api/grupos', // URL donde obtienes los datos
            dataSrc: '' 
        },
        columns: [
            { data: 'clave' },
            { data: 'nombre' },        
            {
                data: null, // Esta columna es para los botones
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-primary btn-editarProducto" data-id="${row._id}" title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="btn btn-danger btn-eliminarProducto" data-id="${row._id}" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
                    `;
                },
                orderable: false, // Desactiva el ordenamiento en esta columna
                searchable: false // Desactiva la búsqueda en esta columna
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

$(document).ready(function () {
    $('#marcaTabla').DataTable({
        ajax: {
            url: '/api/marca', // URL donde obtienes los datos
            dataSrc: '' 
        },
        columns: [
            { data: 'clave' },
            { data: 'nombre' },        
            {
                data: null, // Esta columna es para los botones
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-primary btn-editarProducto" data-id="${row._id}" title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="btn btn-danger btn-eliminarProducto" data-id="${row._id}" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
                    `;
                },
                orderable: false, // Desactiva el ordenamiento en esta columna
                searchable: false // Desactiva la búsqueda en esta columna
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