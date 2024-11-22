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

// Evento para eliminar un video
$(document).on('click', '.btn-eliminar', async function (e) {
    const button = $(this); // Obtén el botón clicado
    const id = button.data('id'); // Extrae el ID desde data-id

    // Confirmación con SweetAlert2
    Swal.fire({
        title: '¿Estás seguro de eliminar este video?',
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
                text: 'El video ha sido eliminado con éxito.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                // Recargar la tabla de videos
                $('#tablaVideos').DataTable().ajax.reload();
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al eliminar el video.',
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
const videoModal = new mdb.Modal(document.getElementById('ModalVideos'));

// Validar campos vacíos
function validarCampos(form) {
    let valido = true;
    const campos = form.querySelectorAll('input, textarea');

    campos.forEach(campo => {
        if (campo.required && !campo.value.trim()) {
            valido = false;
            campo.classList.add('is-invalid'); // Agregar clase de error
        } else {
            campo.classList.remove('is-invalid'); // Quitar clase de error si está correcto
        }
    });

    return valido;
}

// Limpiar el formulario
function limpiarFormulario(form) {
    form.reset(); // Reiniciar valores del formulario
    const campos = form.querySelectorAll('input, textarea');
    campos.forEach(campo => campo.classList.remove('is-invalid')); // Quitar clases de error
}

// Manejar el cierre del modal
document.getElementById('ModalVideos').addEventListener('hidden.bs.modal', () => {
    const form = document.getElementById('formVideos');
    limpiarFormulario(form);
});

// Guardar video
document.getElementById('guardarVideo').addEventListener('click', async () => {
    const form = document.getElementById('formVideos');

    if (!validarCampos(form)) {
        Swal.fire({
            title: 'Campos incompletos',
            text: 'Por favor, completa todos los campos obligatorios.',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    const nombre = document.getElementById('nombreVideo').value;
    const descripcion = document.getElementById('descripcionVideo').value;
    const link = document.getElementById('linkVideo').value;

    // Crear el objeto con los datos necesarios
    const payload = {
        tipo: 'video',
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
                text: 'El video ha sido subido con éxito.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                // Ocultar el modal y recargar la tabla
                videoModal.hide();
                $('#tablaVideos').DataTable().ajax.reload();
                location.reload(); // Recargar la página
            });
        } else {
            const error = await response.json();
            Swal.fire({
                title: 'Error',
                text: error.message || 'Hubo un problema al subir el video.',
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

// Mostrar el modal para añadir video
document.getElementById('btnAñadirVideo').addEventListener('click', () => {
    videoModal.show();
});


