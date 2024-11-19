$(document).ready(function () {
    $('#tablaProducciones').DataTable({
        ajax: {
            url: '/api/recuperarProducciones', // URL donde obtienes los datos
            dataSrc: '' // Si los datos están en un array
        },
        columns: [
            { data: 'folio' },
            { data: 'numeroLote' },
            { data: 'cantidad' },
            { data: 'nombreProducto' },
            { data: 'usuario.username' },
            { 
                data: 'Estado',
                render: function (data) {
                    let badgeClass = '';
                    let badgeText = '';

                    if (data === 1) {
                        badgeClass = 'badge bg-primary';
                        badgeText = 'En Producción';
                    } else if (data === 2) {
                        badgeClass = 'badge bg-success';
                        badgeText = 'Producido';
                    } else if (data === 3) {
                        badgeClass = 'badge bg-danger';
                        badgeText = 'Cancelado';
                    }

                    return `<span class="${badgeClass}">${badgeText}</span>`;
                }
            },
            {
                data: null, // Esta columna es para los botones
                render: function (data, type, row) {
                    const estado = row.Estado;
                    let botones = `
                        <div style="display: flex; flex-direction: column; gap: 5px;">
                            <button class="btn btn-primary btn-ver btn-sm" data-id="${row._id}" title="Ver"> 
                                <i class="fa-solid fa-arrow-right"></i> Ver
                            </button>
                    `;

                    if (estado === 1) {
                        botones += `
                            <button class="btn btn-success btn-confirmar btn-sm" data-id="${row._id}" title="Confirmar"> 
                                <i class="fa-solid fa-screwdriver-wrench"></i> Recibir
                            </button>
                            <button class="btn btn-danger btn-cancelar btn-sm" data-id="${row._id}" title="Cancelar"> 
                                <i class="fa-solid fa-times-circle"></i> Cancelar
                            </button>
                        `;
                    }

                    botones += `
                            <button class="btn btn-secondary btn-eliminar btn-sm" data-id="${row._id}" title="Eliminar"> 
                                <i class="fa-solid fa-trash"></i> Eliminar
                            </button>
                        </div>
                    `;

                    return botones;
                },
                orderable: false, // Desactiva el ordenamiento en esta columna
                searchable: false // Desactiva la búsqueda en esta columna
            }
        ],
        order: [[0, 'desc']], // Orden inicial: primera columna (folio), descendente
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



const modalVerProduccion = new mdb.Modal(document.getElementById('VerProduccion'));
const contenedorMaterias = document.getElementById('materiasPrimasTable');


on(document, 'click', '.btn-eliminar', async (e) => {
    const button = e.target.closest('.btn-eliminar');
    const id = button.getAttribute('data-id');

    // Verificar el estado de la producción antes de permitir la eliminación
    try {
        const response = await fetch('/api/recuperarProducciones/' + id);
        if (!response.ok) {
            Swal.fire({
                title: 'Error',
                text: 'No se pudo obtener el estado de la producción.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        const produccion = await response.json();
        if (produccion.Estado !== 3) {
            Swal.fire({
                title: 'No permitido',
                text: 'La producción debe estar cancelada antes de eliminarla.',
                icon: 'warning',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        // Confirmar eliminación
        Swal.fire({
            title: '¿Estás seguro de eliminar la producción?',
            text: 'No podrás revertir esto.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await borrarProduccion(id);
            }
        });

    } catch (error) {
        console.error('Error al verificar el estado:', error);
        Swal.fire({
            title: 'Error',
            text: 'Error al verificar el estado de la producción.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
});

async function borrarProduccion(id) {
    try {
        const response = await fetch('/api/eliminarProduccion/'+id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            Swal.fire({
                title: 'Eliminado',
                text: 'La producción ha sido eliminada.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                window.location.reload();
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al eliminar la producción.',
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

on(document, 'click', '.btn-cancelar', async e => {
    const button = e.target.closest('.btn-cancelar');
     const id = button.getAttribute('data-id');

    Swal.fire({
            title: '¿Estás seguro que deseas cancelar la producción?',
            text: "No podrás revertir esto.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await cancelarProduccion(id);
            }
        });
});

async function cancelarProduccion(id) {
    try {
        const response = await fetch('/api/cancelarProduccion/'+id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            Swal.fire({
                title: 'Cancelado',
                text: 'La producción ha sido cancelada.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                window.location.reload();
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al cancelar la producción.',
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

on(document, 'click', '.btn-confirmar', async e => {
    const button = e.target.closest('.btn-confirmar');
     const id = button.getAttribute('data-id');

    Swal.fire({
            title: '¿Estás seguro que deseas recibir la producción?',
            text: "No podrás revertir esto.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, recibir',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await recibirProduccion(id);
            }
        });
});

async function recibirProduccion(id) {
    try {
        const response = await fetch('/api/confirmarProduccion/'+id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            Swal.fire({
                title: 'Confirmado',
                text: 'La producción ha sido recibida.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                window.location.reload();
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al recibir la producción.',
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

on(document, 'click', '.btn-ver', async e => {
    const button = e.target.closest('.btn-ver');
    const id = button.getAttribute('data-id');
    await mostrarProduccion(id);

});

async function mostrarProduccion(id) {
    fetch('/api/recuperarProducciones/'+id)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            llenarcampos(data)
        })
        .catch(error => console.error('Error al cargar produccion:', error));
}

function llenarcampos(data) {
    // Formatear la fecha
    const fechaFormateada = new Date(data.fechaHora).toLocaleString('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    document.getElementById('fecha').textContent = fechaFormateada;
    document.getElementById('nombreProducto').textContent = data.nombreProducto;
    document.getElementById('cantidad').textContent = data.cantidad;
    document.getElementById('folio').textContent = data.folio;
    document.getElementById('lote').textContent = data.numeroLote;

    // Asignar badge al estado
    const estadoBadge = document.getElementById('estado');
    let badgeStyle = '';
    let badgeText = '';

    if (data.Estado === 1) {
        badgeStyle = 'background-color: #007bff; color: #fff;'; // Azul
        badgeText = 'En Producción';
    } else if (data.Estado === 2) {
        badgeStyle = 'background-color: #28a745; color: #fff;'; // Verde
        badgeText = 'Producido';
    } else if (data.Estado === 3) {
        badgeStyle = 'background-color: #dc3545; color: #fff;'; // Rojo
        badgeText = 'Cancelado';
    }

    estadoBadge.style.cssText = badgeStyle + 'font-size: 0.85rem; padding: 3px 8px; border-radius: 5px; width: fit-content;';
    estadoBadge.textContent = badgeText;

    // Generar las materias primas
    let materiasPrimas = '';
    data.materiasPrimas.forEach((item) => {
        materiasPrimas += `
                <tr class="text-center">
                    <td>${item.nombre}</td>
                    <td>${item.cantidad}</td>
                </tr>
            `;
    });

    contenedorMaterias.innerHTML = materiasPrimas;
    modalVerProduccion.show();
}
