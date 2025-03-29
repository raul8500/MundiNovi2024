
$(document).ready(function() {
    $('#usersTable').DataTable({
        ajax: {
            url: '/api/auth/users', // URL de la API
            dataSrc: '' // Clave dentro del JSON donde están los clientes
        },
        columns: [
            { data: 'name', defaultContent: "Sin nombre" },
            { data: 'username', defaultContent: "Sin usuario" },
            {
                data: 'rol',
                render: function (data) {
                    return obtenerNombreRol(data) || "Sin rol"; // Usamos la función obtenerNombreRol y un valor por defecto
                },
                defaultContent: "Sin Rol"
            },            
            { data: 'sucursalId.nombre', defaultContent: "Sin tienda" },
            {
                data: 'createdAt',
                render: function (data) {
                    if (data) {
                        const date = new Date(data);
                        return new Intl.DateTimeFormat('es-ES', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                        }).format(date);
                    } else {
                        return "Sin fecha";
                    }
                },
                defaultContent: "Sin fecha"
            },            
            {
                data: null,
                render: function (data, type, row) {
                    return `
                        <button id="${row._id}" type="button" class="btn btn-primary btn-rounded btnEditUsers">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        
                        <button id="${row._id}" type="button" class="btn btn-secondary btn-rounded btnChangePassword">
                                <i class="fa-solid fa-key"></i>
                        </button>

                        <button id="${row._id} "type="button" class="btn ${data.status === 1 ? 'btn-success' : 'btn-danger'} btn-rounded btnChangeStatus" data-status="${data.status}">
                                <i class="fa-regular fa-circle"></i>
                        </button>
                        
                        <button id="${row._id}" type="button" class="btn btn-danger btn-rounded btnDeleteUsers">
                            <i class="fa-solid fa-trash"></i>
                        </button>

                    `;
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
  