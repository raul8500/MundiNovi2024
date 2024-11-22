$('#tablaPaginas').DataTable({
    ajax: {
        url: '/api/obtenerCapacitaciones', // URL donde obtienes los datos
        dataSrc: function (json) {
            // Filtrar solo los elementos de tipo "pagina"
            return json.capacitaciones.filter(capacitacion => capacitacion.tipo === 'pagina');
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
                    <button class="btn btn-primary btn-sm btn-ver-pagina" data-link="${row.link}" title="Ver Página">
                        <i class="fas fa-globe"></i>
                    </button>
                    <button class="btn btn-danger btn-sm btn-eliminar" data-id="${row._id}" title="Eliminar">
                        <i class="fas fa-trash-alt"></i>
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

// Evento para redirigir al enlace de la página
$(document).on('click', '.btn-ver-pagina', function () {
    const link = $(this).data('link'); // Obtén el enlace de la página
    if (link) {
        window.open(link, '_blank'); // Abrir en una nueva pestaña
    } else {
        Swal.fire({
            title: 'Error',
            text: 'El enlace de la página no está disponible.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
});

// Evento para eliminar una página
$(document).on('click', '.btn-eliminar', async function (e) {
    const button = $(this); // Obtén el botón clicado
    const id = button.data('id'); // Extrae el ID desde data-id

    // Confirmación con SweetAlert2
    Swal.fire({
        title: '¿Estás seguro de eliminar esta página?',
        text: 'No podrás revertir esta acción.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            await eliminarCapacitacion(id);
        }
    });
});

// Función para eliminar la capacitación
async function eliminarCapacitacion(id) {
    try {
        const response = await fetch(`/api/capacitaciones/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            Swal.fire({
                title: 'Eliminado',
                text: 'La página ha sido eliminada con éxito.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                // Recargar la tabla de páginas
                $('#tablaPaginas').DataTable().ajax.reload();
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al eliminar la página.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'Error en la conexión con el servidor.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
}


const paginaModal = new mdb.Modal(document.getElementById('ModalPaginas'));

document.getElementById('guardarPagina').addEventListener('click', async () => {
    const nombre = document.getElementById('nombrePagina').value;
    const descripcion = document.getElementById('descripcionPagina').value;
    const link = document.getElementById('linkPagina').value;

    // Crear el objeto con los datos necesarios
    const payload = {
        tipo: 'pagina',
        nombre: nombre,
        descripcion: descripcion,
        link: link
    };

    try {
        // Enviar la petición al servidor
        const response = await fetch('/api/crearCapacitacionSinArchivo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const result = await response.json();
            Swal.fire({
                title: 'Éxito',
                text: 'La página ha sido subida con éxito.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                // Ocultar el modal y recargar la tabla
                paginaModal.hide();
                $('#tablaPaginas').DataTable().ajax.reload();
            });
        } else {
            const error = await response.json();
            Swal.fire({
                title: 'Error',
                text: error.message || 'Hubo un problema al subir la página.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'Error en la conexión con el servidor.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
});

// Mostrar el modal para añadir página
document.getElementById('btnAñadirPagina').addEventListener('click', () => {
    paginaModal.show();
});
