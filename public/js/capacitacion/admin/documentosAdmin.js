$('#tablaDocumentos').DataTable({
    ajax: {
        url: '/api/obtenerCapacitaciones', // URL donde obtienes los datos
        dataSrc: function (json) {
            // Filtrar solo los elementos de tipo "examen"
            return json.capacitaciones.filter(capacitacion => capacitacion.tipo === 'documento');
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

$('#tablaDocumentos').on('click', '.btn-descargar', function () {
    const id = $(this).data('id'); // Obtén el ID de la capacitación
    const url = `/api/capacitaciones/${id}/descargar`; // Construye la URL de descarga
    // Redirigir al usuario a la ruta de descarga
    window.location.href = url;
});


$(document).on('click', '.btn-eliminar', async function (e) {
    const button = $(this); // Obtén el botón clicado
    const id = button.data('id'); // Extrae el ID desde data-id

    // Confirmación con SweetAlert2
    Swal.fire({
        title: '¿Estás seguro de eliminar esta capacitación?',
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
                text: 'La capacitación ha sido eliminada con éxito.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                // Recargar la tabla de capacitaciones
                $('#tablaExamenes').DataTable().ajax.reload();
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al eliminar la capacitación.',
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


const documentoModal = new mdb.Modal(document.getElementById('ModalDocumentos'));

// Validar campos vacíos
function validarCampos(form) {
    let valido = true;
    const campos = form.querySelectorAll('input, textarea, select');

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
    const campos = form.querySelectorAll('input, textarea, select');
    campos.forEach(campo => campo.classList.remove('is-invalid')); // Quitar clases de error
}

// Manejar el cierre del modal
document.getElementById('ModalDocumentos').addEventListener('hidden.bs.modal', () => {
    const form = document.getElementById('formDocumentos');
    limpiarFormulario(form);
});

// Guardar documento
document.getElementById('guardarDocumento').addEventListener('click', async () => {
    const form = document.getElementById('formDocumentos');

    if (!validarCampos(form)) {
        Swal.fire({
            title: 'Campos incompletos',
            text: 'Por favor, completa todos los campos obligatorios.',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    const formData = new FormData(form);
    formData.append('tipo', 'documento');

    try {
        // Enviar la petición al servidor
        const response = await fetch('/api/capacitaciones', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            Swal.fire({
                title: 'Éxito',
                text: 'El documento ha sido subido con éxito.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                // Ocultar el modal y recargar la tabla
                documentoModal.hide();
                $('#tablaDocumentos').DataTable().ajax.reload();
                location.reload(); // Recargar la página
            });
        } else {
            const error = await response.json();
            Swal.fire({
                title: 'Error',
                text: error.message || 'Hubo un problema al subir el documento.',
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

// Mostrar el modal para añadir documento
document.getElementById('btnAñadirDocumento').addEventListener('click', () => {
    documentoModal.show();
});
