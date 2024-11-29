$('#tablaArqueos').DataTable({
    ajax: {
        url: '/api/arqueo', // URL donde obtienes los datos
        dataSrc: ''
    },
    columns: [
        { data: 'sucursal.nombre', title: 'Nombre' },
        { data: 'usuario.name', title: 'Supervisor' },
        { data: 'totalVentasEfectivo', title: 'Total ventas efectivo' },
        { data: 'efectivoEnCaja', title: 'Efectivo en caja' },
        { 
            data: 'diferencia', 
            title: 'Diferencia',
            render: function (data, type, row) {
                let colorClass = '';
                if (data > 0) {
                    colorClass = 'text-warning'; // Naranja
                } else if (data < 0) {
                    colorClass = 'text-danger'; // Rojo
                } else {
                    colorClass = 'text-success'; // Verde
                }
                return `<span class="${colorClass}">${data.toFixed(2)}</span>`;
            }
        },
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
                    <button class="btn btn-primary btn-sm btn-imprimir" data-id="${row._id}" data-archivo="${row.archivo}" title="Imprimir">
                        <i class="fas fa-print"></i> <!-- Icono para "Imprimir" -->
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
        text: 'Esto eliminará el arqueo seleccionado.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`/api/arqueo/${id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    Swal.fire('Eliminado', 'El Arqueo ha sido eliminado exitosamente.', 'success');
                    $('#tablaArqueos').DataTable().ajax.reload(); // Recargar la tabla de exámenes
                } else {
                    Swal.fire('Error', 'No se pudo eliminar el arqueo.', 'error');
                }
            } catch (error) {
                console.error('Error al eliminar el arqueo:', error);
                Swal.fire('Error', 'No se pudo conectar con el servidor.', 'error');
            }
        }
    });
});

// Evento para manejar la impresión
$('#tablaArqueos').on('click', '.btn-imprimir', function () {
    const id = $(this).data('id');
    
    // Hacer una llamada AJAX para obtener los datos del registro
    $.ajax({
        url: `/api/arqueo/${id}`,
        method: 'GET',
        success: function (data) {
            // Crear el contenido para imprimir
            const printableContent = `
                <h2>Arqueo de Efectivo</h2>
                <p><strong>Sucursal:</strong> ${data.sucursal.nombre}</p>
                <p><strong>Usuario:</strong> ${data.usuario.name}</p>
                <p><strong>Total Ventas Efectivo:</strong> ${data.totalVentasEfectivo}</p>
                <p><strong>Efectivo en Caja:</strong> ${data.efectivoEnCaja}</p>
                <p><strong>Diferencia:</strong> ${data.diferencia}</p>
                <p><strong>Fecha y Hora:</strong> ${new Date(data.fechaHora).toLocaleString()}</p>
            `;

            // Abrir una nueva ventana e imprimir el contenido
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                <head>
                    <title>Impresión de Arqueo</title>
                </head>
                <body>${printableContent}</body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        },
        error: function (err) {
            console.error('Error al obtener los datos:', err);
            alert('No se pudo obtener los datos para imprimir.');
        }
    });
});
