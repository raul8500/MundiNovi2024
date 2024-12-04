$('#tablaEvaluaciones').DataTable({
    ajax: {
        url: '/api/evaluaciones', // URL donde obtienes los datos
        dataSrc: ''
    },
    columns: [
        { data: 'sucursalId.nombre', title: 'Nombre' },
        { data: 'evaluadorId.name', title: 'Supervisor' },
        { 
            data: 'fechaHora', 
            title: 'Fecha y hora',
            render: function (data, type, row) {
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
        { 
            data: null,
            title: 'Acciones',
            render: function (data, type, row) {
                return `
                    <button class="btn btn-primary btn-sm btn-ver" data-id="${row._id}" data-archivo="${row.archivo}" title="Ver">
                        <i class="fas fa-eye"></i> <!-- Icono para "ver" -->
                    </button>
                    <button class="btn btn-danger btn-sm btn-eliminar" data-id="${row._id}" title="Eliminar">
                        <i class="fas fa-trash-alt"></i> <!-- Icono para "Eliminar" -->
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



// Evento para eliminar examen
$(document).on('click', '.btn-eliminar', async function () {
    const id = $(this).data('id'); // Obtener el ID del examen a eliminar

    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esto eliminará la evaluación seleccionada.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`/api/evaluaciones/${id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    Swal.fire('Eliminado', 'La evaluación ha sido eliminado exitosamente.', 'success');
                    $('#tablaEvaluaciones').DataTable().ajax.reload(); // Recargar la tabla de exámenes
                } else {
                    Swal.fire('Error', 'No se pudo eliminar la evaluación.', 'error');
                }
            } catch (error) {
                console.error('Error al eliminar la evaluación:', error);
                Swal.fire('Error', 'No se pudo conectar con el servidor.', 'error');
            }
        }
    });
});


const parametrosNombres = {
    ordenPisoVenta: 'ORDEN PISO DE VENTA',
    limpiezaPisoVenta: 'LIMPIEZA PISO DE VENTA',
    ordenLimpiezaBodega: 'ORDEN Y LIMPIEZA BODEGA',
    ordenLimpiezaBaño: 'ORDEN LIMPIEZA BAÑO',
    ordenLimpiezaMostrador: 'ORDEN LIMPIEZA MOSTRADOR',
    limpiezaExterior: 'LIMPIEZA EXTERIOR',
    frenteoMercancia: 'FRENTEO MERCANCIA',
    limpiezaTambosGarrafas: 'LIMPIEZA DE TAMBOS Y GARRAFAS',
    uniformePresentacion: 'UNIFORME Y PRESENTACION',
    musicaPantallas: 'MUSICA Y PANTALLAS',
    capturaRecepcionFaltantes: 'CAPTURA Y RECEPCION DE FALTANTES',
    etiquetadoBaston: 'ETIQUETADDO DE BASTON',
    quimicosBuenasCondicionesPreparado: 'QUIMICOS EN BUENAS CONDICIONES Y PREPARADO',
    preciadoresPromocionales: 'PRECIADORES Y PROMOCIONALES',
    codigosBarras: 'CODIGOS DE BARRAS',
    peps: 'PEPS',
    segmentosPtsCalientesTorres: 'SEGMENTOS PTS CALIENTES Y TORRES',
    boteEscobas: 'BOTE ESCOBAS',
    arqueoMercancia: 'ARQUEO MERCANCIA',
    arqueoEfectivo: 'ARQUEO EFECTIVO',
    asignarActividades: 'ASIGNAR ACTIVIDADES',
    recepcionCortes: 'RECEPCION DE CORTES'
};

document.addEventListener('DOMContentLoaded', () => {


    document.body.addEventListener('click', async (event) => {
        if (event.target.closest('.btn-ver')) {
            const button = event.target.closest('.btn-ver');
            const evaluacionId = button.getAttribute('data-id');

            try {
                // Realizar la solicitud al backend para obtener los detalles de la evaluación
                const response = await fetch(`/api/evaluaciones/${evaluacionId}`);
                if (!response.ok) throw new Error('Error al obtener la evaluación.');

                const evaluacion = await response.json();

                console.log(evaluacion)

                // Llenar el modal con los datos de la evaluación
                document.getElementById('modalSucursal').textContent = evaluacion.sucursalId?.nombre || 'Sin nombre';
                document.getElementById('modalEvaluador').textContent = evaluacion.evaluadorId?.name || 'Sin nombre';
                document.getElementById('modalFechaHora').textContent = new Date(evaluacion.fechaHora).toLocaleString();

                // Generar la lista de parámetros con títulos y calificaciones
                const parametros = evaluacion.calificaciones
                    .map(calificacion => `<li><strong>${calificacion.titulo}:</strong> ${calificacion.calificacion}</li>`)
                    .join('');

                // Actualizar el contenido del modal con los parámetros
                document.getElementById('modalParametros').innerHTML = parametros;

                // Mostrar el modal
                const modal = new bootstrap.Modal(document.getElementById('modalVerEvaluacion'));
                modal.show();
            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo cargar la información de la evaluación.'
                });
            }
        }
    });



});


const apiParametrosUrl = '/api/parametros'; // Endpoint para parámetros

// Inicializar DataTable para parámetros
const tablaParametros = $('#tablaParametros').DataTable({
    ajax: {
        url: apiParametrosUrl,
        dataSrc: ''
    },
    columns: [
        { data: 'nombre', title: 'Nombre' },
        { data: 'descripcion', title: 'Descripción', defaultContent: '-' },
        {
            data: null,
            title: 'Acciones',
            render: function (data, type, row) {
                return `
                    <button class="btn btn-warning btn-sm btn-editar" data-id="${row._id}" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm btn-eliminar-parametros" data-id="${row._id}" title="Eliminar">
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
        "sLoadingRecords": "Cargando...",
        "oPaginate": {
            "sFirst": "Primera",
            "sLast": "Última",
            "sNext": "Siguiente",
            "sPrevious": "Anterior"
        }
    }
});

// Manejar el formulario de creación/edición
$('#parametroForm').on('submit', async (e) => {
    e.preventDefault();

    const parametroId = $('#parametroId').val();
    const nombre = $('#nombreParametro').val().trim();
    const descripcion = $('#descripcionParametro').val().trim();

    if (!nombre) {
        Swal.fire('Error', 'El nombre del parámetro es obligatorio.', 'error');
        return;
    }

    const parametro = { nombre, descripcion };

    try {
        let response;
        if (parametroId) {
            // Actualizar
            response = await fetch(`${apiParametrosUrl}/${parametroId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(parametro),
            });
        } else {
            // Crear
            response = await fetch(apiParametrosUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(parametro),
            });
        }

        if (!response.ok) throw new Error('Error al guardar el parámetro.');

        await Swal.fire('¡Éxito!', 'Parámetro guardado exitosamente.', 'success');
        $('#parametroForm')[0].reset();
        $('#parametroId').val('');
        tablaParametros.ajax.reload(); // Recargar la tabla
    } catch (error) {
        console.error('Error al guardar el parámetro:', error);
        Swal.fire('Error', 'Hubo un problema al guardar el parámetro.', 'error');
    }
});

// Manejar la edición de parámetros
$('#tablaParametros').on('click', '.btn-editar', async (e) => {
    const id = $(e.currentTarget).data('id');

    try {
        const response = await fetch(`${apiParametrosUrl}/${id}`);
        if (!response.ok) throw new Error('Error al obtener el parámetro.');

        const parametro = await response.json();
        $('#parametroId').val(parametro._id);
        $('#nombreParametro').val(parametro.nombre);
        $('#descripcionParametro').val(parametro.descripcion);
    } catch (error) {
        console.error('Error al cargar el parámetro:', error);
        Swal.fire('Error', 'Hubo un problema al cargar el parámetro.', 'error');
    }
});

// Manejar la eliminación de parámetros
$('#tablaParametros').on('click', '.btn-eliminar-parametros', async (e) => {
    const id = $(e.currentTarget).data('id');

    const confirmacion = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás revertir esta acción.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
    });

    if (!confirmacion.isConfirmed) return;

    try {
        const response = await fetch(`${apiParametrosUrl}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Error al eliminar el parámetro.');

        await Swal.fire('¡Eliminado!', 'Parámetro eliminado exitosamente.', 'success');
        tablaParametros.ajax.reload(); // Recargar la tabla
    } catch (error) {
        console.error('Error al eliminar el parámetro:', error);
        Swal.fire('Error', 'Hubo un problema al eliminar el parámetro.', 'error');
    }
});

// Abrir el modal para gestionar parámetros
$('#gestionarParametrosBtn').on('click', () => {
    $('#parametroForm')[0].reset();
    $('#parametroId').val('');
    tablaParametros.ajax.reload(); // Recargar los datos en el modal
    $('#modalGestionParametros').modal('show');
});


