$(document).ready(function () {
    $('#tablaClientes').DataTable({
        ajax: {
            url: '/api/cliente/test', // URL de la API
            dataSrc: 'clientes' // Clave dentro del JSON donde están los clientes
        },
        columns: [
            { data: 'clientData.name', defaultContent: "Sin nombre" },
            { data: 'clientData.identification', defaultContent: "N/A" },
            { data: 'clientData.email', defaultContent: "Sin email" },
            { 
                data: 'clientData.mobile',
                render: function (data, type, row) {
                    return data || row.clientData.phoneSecondary || "Sin teléfono";
                }
            },
            {
                data: 'esfactura',
                render: function (data) {
                    return data 
                        ? `<span class="badge badge-success rounded-pill d-inline">Sí</span>`
                        : `<span class="badge badge-danger rounded-pill d-inline">No</span>`;
                },
                defaultContent: `<span class="badge badge-secondary rounded-pill d-inline">N/A</span>`
            },
            { 
                data: 'monedero',
                render: function (data) {
                    return `$${data !== null ? data.toFixed(2) : "0.00"}`;
                }
            },
            { 
                data: 'updatedAt',
                render: function (data) {
                    return formatearFecha(data);
                }
            },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-warning btn-sm btn-editar" data-id="${row._id}" title="Editar">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="btn btn-danger btn-sm btn-eliminar" data-id="${row._id}" title="Eliminar">
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

    // Evento para eliminar cliente
    $('#tablaClientes tbody').on('click', '.btn-eliminar', function () {
        const id = $(this).data('id');
        eliminarCliente(id);
    });

    // Evento para guardar cambios del cliente editado
    $('#tablaClientes tbody').on('click', '.btn-editar', async function () {
        const id = $(this).data('id');
    
        try {
            const response = await fetch(`/api/cliente/test/${id}`);
    
            if (!response.ok) {
                throw new Error('Cliente no encontrado');
            }
    
            const cliente = await response.json();
            abrirModalCliente(cliente);
    
        } catch (error) {
            console.error('Error al cargar datos del cliente:', error);
            Swal.fire("Error", "No se pudo cargar el cliente.", "error");
        }
    });
    
    
});


function eliminarCliente(id) {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará el cliente de Alegra y la base de datos local.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Eliminando cliente...",
                text: "Por favor, espera un momento.",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            fetch(`/api/cliente/delete/${id}`, { method: "DELETE" })
                .then(response => response.json())
                .then(data => {
                    if (data.message) {
                        Swal.fire({
                            title: "¡Eliminado!",
                            text: "El cliente ha sido eliminado correctamente.",
                            icon: "success",
                            confirmButtonText: "Aceptar"
                        }).then(() => {
                            $('#tablaClientes').DataTable().ajax.reload(); // Recargar la tabla después de eliminar
                        });
                    } else {
                        Swal.fire({
                            title: "Error",
                            text: "No se pudo eliminar el cliente.",
                            icon: "error",
                            confirmButtonText: "Aceptar"
                        });
                    }
                })
                .catch(error => {
                    console.error("Error al eliminar cliente:", error);
                    Swal.fire({
                        title: "Error",
                        text: "Hubo un problema al eliminar el cliente.",
                        icon: "error",
                        confirmButtonText: "Aceptar"
                    });
                });
        }
    });
}


document.addEventListener("DOMContentLoaded", function () {
    const btnAddCliente = document.getElementById("btnAddCliente");

    btnAddCliente.addEventListener("click", function () {
        abrirModalCliente();
    });
});

async function cargarZonasEnSelect() {
    try {
        const response = await fetch('/api/zonaclientes'); // Llamada al endpoint que devuelve las zonas
        const zonas = await response.json();

        const select = document.getElementById('selectZonaCliente');
        select.innerHTML = '<option value="">Seleccione una zona</option>'; // Opción por defecto

        zonas.forEach(zona => {
            const option = document.createElement('option');
            option.value = zona._id; // Usa el ID de la zona como valor
            option.textContent = `${zona.nombre} (${zona.clave})`; // Muestra el nombre y clave
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando zonas:', error);
    }
}

// Llamar a la función cuando se cargue la página
document.addEventListener('DOMContentLoaded', cargarZonasEnSelect);

// Función para cargar zonas en el select del modal
async function cargarZonasEnSelectEdit(selectId) {
    try {
        const response = await fetch('/api/zonaclientes');
        const zonas = await response.json();
        const select = document.querySelector(selectId);
        select.innerHTML = '<option value="">Seleccione una zona</option>';

        zonas.forEach(zona => {
            const option = document.createElement('option');
            option.value = zona._id;
            option.textContent = `${zona.nombre} (${zona.clave})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando zonas:', error);
    }
}

// Función para formatear fechas
function formatearFecha(fecha) {
    if (!fecha) return "N/A";
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString("es-MX", { year: 'numeric', month: '2-digit', day: '2-digit' });
}

function eliminarCliente(id) {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará el cliente de Alegra y la base de datos local.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Eliminando cliente...",
                text: "Por favor, espera un momento.",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            fetch(`/api/cliente/delete/${id}`, { method: "DELETE" })
                .then(response => response.json())
                .then(data => {
                    if (data.message) {
                        Swal.fire({
                            title: "¡Eliminado!",
                            text: "El cliente ha sido eliminado correctamente.",
                            icon: "success",
                            confirmButtonText: "Aceptar"
                        }).then(() => {
                            $('#tablaClientes').DataTable().ajax.reload(); // Recargar la tabla después de eliminar
                        });
                    } else {
                        Swal.fire({
                            title: "Error",
                            text: "No se pudo eliminar el cliente.",
                            icon: "error",
                            confirmButtonText: "Aceptar"
                        });
                    }
                })
                .catch(error => {
                    console.error("Error al eliminar cliente:", error);
                    Swal.fire({
                        title: "Error",
                        text: "Hubo un problema al eliminar el cliente.",
                        icon: "error",
                        confirmButtonText: "Aceptar"
                    });
                });
        }
    });
}
async function abrirModalCliente(cliente) {
    // Limpiar todos los campos del formulario
    document.getElementById("ModalCliente").querySelectorAll("input, select").forEach(el => {
        el.value = "";
    });

    // Limpiar el select de régimen al iniciar
    regimenSelect.innerHTML = '';
    const defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.text = 'Seleccione un régimen fiscal';
    regimenSelect.appendChild(defaultOpt);


    // Limpiar ID si es creación
    if (!cliente) {
        document.getElementById("clienteId").value = "";
    }
    
    // Cargar zonas
    await cargarZonasEnSelect();

    console.log(cliente);

    // Si hay cliente, es edición
    if (cliente) {
        $('#clienteId').val(cliente._id);
        $('#nombreCliente').val(cliente.clientData.name);
        $('#rfc').val(cliente.clientData.identification || '');
        $('#telefonoPrincipal').val(cliente.clientData.mobile || '');
        $('#correoElectronicoContacto').val(cliente.clientData.email || '');
        $('#calle').val(cliente.clientData.address?.street || '');
        $('#numeroExterior').val(cliente.clientData.address?.exterior || '');
        $('#numeroInterior').val(cliente.clientData.address?.interior || '');
        $('#colonia').val(cliente.clientData.address?.neighborhood || '');
        $('#localidad').val(cliente.clientData.address?.city || '');
        $('#municipioDelegacion').val(cliente.clientData.address?.municipality || '');
        $('#estado').val(cliente.clientData.address?.state || '');
        $('#codigoPostal').val(cliente.clientData.address?.zip || '');

        // Seleccionar zona (después de cargar opciones)
        const zonaId = cliente.zonaCliente?._id || '';
        $('#selectZonaCliente').val(zonaId);
        
        // Cargar regímenes en base al RFC y seleccionar el correspondiente
        const rfcValue = cliente.clientData.identification || '';
        const selectedRegimen = cliente.clientData.regime || '';
        loadRegimenOptionsWithSelection(rfcValue, selectedRegimen);
    }

    const modal = new bootstrap.Modal(document.getElementById("ModalCliente"));
    modal.show();
}








