$(document).ready(function () {
    let isEditMode = false; // Para distinguir entre agregar y actualizar
    const tablaTiposIngreso = $('#tablaTiposIngreso').DataTable({
        ajax: {
            url: '/api/tipos-ingreso',
            dataSrc: 'data' // Corregido para usar el campo "data" del JSON
        },
        columns: [
            { data: 'nombre' },
            { data: 'descripcion' },
            {
                data: null,
                render: function (data) {
                    return `
                        <button class="btn btn-warning btnEditar" data-id="${data._id}">Editar</button>
                        <button class="btn btn-danger btnEliminar" data-id="${data._id}">Eliminar</button>
                    `;
                }
            }
        ],
        language: {
            sProcessing: "Procesando...",
            sLengthMenu: "Mostrar _MENU_ registros",
            sZeroRecords: "No se encontraron resultados",
            sInfo: "Mostrando _START_ a _END_ de _TOTAL_ registros",
            sInfoEmpty: "Mostrando 0 a 0 de 0 registros",
            sInfoFiltered: "(filtrado de _MAX_ registros totales)",
            sSearch: "Buscar:",
            oPaginate: {
                sFirst: "Primera",
                sLast: "Última",
                sNext: "Siguiente",
                sPrevious: "Anterior"
            }
        }
    });

    // Mostrar modal
    $('#btnConfiguracion').on('click', function () {
        $('#modalTipoIngreso').modal('show');
        resetForm(); // Limpia el formulario al abrir el modal
    });

    // Guardar (Agregar o Actualizar)
    $('#formTipoIngreso').on('submit', function (e) {
        e.preventDefault();

        const nombre = $('#nombre').val();
        const descripcion = $('#descripcion').val();
        const tipoIngresoId = $('#tipoIngresoId').val();

        if (!nombre || !descripcion) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, completa todos los campos.'
            });
            return;
        }

        const url = isEditMode
            ? `/api/tipos-ingreso/${tipoIngresoId}`
            : '/api/tipos-ingreso';
        const method = isEditMode ? 'PUT' : 'POST';

        $.ajax({
            url,
            method,
            contentType: 'application/json',
            data: JSON.stringify({ nombre, descripcion }),
            success: function () {
                tablaTiposIngreso.ajax.reload();
                resetForm();
                Swal.fire({
                    icon: 'success',
                    title: isEditMode ? 'Actualizado' : 'Agregado',
                    text: `Tipo de ingreso ${isEditMode ? 'actualizado' : 'agregado'} correctamente.`
                });
            },
            error: function () {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `Error al ${isEditMode ? 'actualizar' : 'agregar'} el tipo de ingreso.`
                });
            }
        });
    });



    // Editar
    $('#tablaTiposIngreso').on('click', '.btnEditar', function () {
        const id = $(this).data('id'); // Obtén el ID del botón

        $.ajax({
            url: `/api/tipos-ingreso/${id}`,
            method: 'GET',
            success: function (response) {
                const data = response.data; // Asegúrate de que se usa el campo "data"
                $('#tipoIngresoId').val(data._id); // Carga el ID oculto
                $('#nombre').val(data.nombre); // Carga el nombre en el formulario
                $('#descripcion').val(data.descripcion); // Carga la descripción
                $('#btnGuardar').text('Actualizar'); // Cambia el texto del botón a "Actualizar"
                isEditMode = true; // Cambiar a modo edición
                $('#modalTipoIngreso').modal('show'); // Muestra el modal con los datos cargados
            },
            error: function () {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al obtener los datos del tipo de ingreso.'
                });
            }
        });
    });


    // Eliminar
    $('#tablaTiposIngreso').on('click', '.btnEliminar', function () {
        const id = $(this).data('id');
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `/api/tipos-ingreso/${id}`,
                    method: 'DELETE',
                    success: function () {
                        tablaTiposIngreso.ajax.reload();
                        Swal.fire({
                            icon: 'success',
                            title: 'Eliminado',
                            text: 'Tipo de ingreso eliminado correctamente.'
                        });
                    },
                    error: function () {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Error al eliminar el tipo de ingreso.'
                        });
                    }
                });
            }
        });
    });


    // Resetear formulario
    function resetForm() {
        $('#formTipoIngreso')[0].reset(); // Limpia todos los campos del formulario
        $('#tipoIngresoId').val(''); // Limpia el ID oculto
        $('#btnGuardar').text('Guardar'); // Restablece el texto del botón
        isEditMode = false; // Cambia a modo agregar
    }

});
