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

                // Llenar el modal con los datos de la evaluación
                document.getElementById('modalSucursal').textContent = evaluacion.sucursalId.nombre || 'Sin nombre';
                document.getElementById('modalEvaluador').textContent = evaluacion.evaluadorId.nombre || 'Sin nombre';
                document.getElementById('modalFechaHora').textContent = new Date(evaluacion.fechaHora).toLocaleString();

                // Generar la lista de parámetros con nombres correctos
                const parametros = Object.entries(evaluacion)
                    .filter(([key]) => parametrosNombres[key]) // Filtrar solo los parámetros válidos
                    .map(([key, value]) => `<li><strong>${parametrosNombres[key]}:</strong> ${value}</li>`)
                    .join('');

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
