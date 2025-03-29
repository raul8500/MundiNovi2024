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

    // Evento para abrir el modal de edición
    $('#tablaClientes tbody').on('click', '.btn-editar', function () {
        const id = $(this).data('id');
        abrirModalEditarCliente(id);
    });

    // Evento para guardar cambios del cliente editado
    $('#btnGuardarEdicionCliente').on('click', function () {
        guardarEdicionCliente();
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
        var modal = new bootstrap.Modal(document.getElementById("ModalAddCliente"));
        modal.show();
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

// Función para cargar datos del cliente en el modal de edición
async function abrirModalEditarCliente(id) {
    try {
        const response = await fetch(`/api/cliente/test/${id}`);
        const cliente = await response.json();

        $('#editClienteId').val(cliente._id);
        $('#editNombreCliente').val(cliente.clientData.name);
        $('#editRfc').val(cliente.clientData.identification) || null,
        $('#editTelefonoPrincipal').val(cliente.clientData.phonePrimary) || null,
        $('#editCorreoElectronicoContacto').val(cliente.clientData.email) || null,
        $('#editCodigoPostal').val(cliente.clientData.address?.zipCode || '');
        $('#editEstado').val(cliente.clientData.address?.state || '');
        $('#editMunicipioDelegacion').val(cliente.clientData.address?.municipality || '');
        $('#editLocalidad').val(cliente.clientData.address?.locality || '');
        $('#editColonia').val(cliente.clientData.address?.colony || '');
        $('#editCalle').val(cliente.clientData.address?.street || '');
        $('#editNumeroExterior').val(cliente.clientData.address?.exteriorNumber || '');
        $('#editNumeroInterior').val(cliente.clientData.address?.interiorNumber || '');

        // Cargar opción de Zona Cliente
        await cargarZonasEnSelectEdit('#editSelectZonaCliente');
        $('#editSelectZonaCliente').val(cliente.zonaCliente?._id || '');

        // Cargar opciones del régimen y seleccionar el actual
        loadEditRegimenOptions(cliente.clientData.identification, cliente.clientData.regime);

        // Seleccionar radio de factura
        if (cliente.esfactura) {
            $('#edit_factura_si').prop('checked', true);
        } else {
            $('#edit_factura_no').prop('checked', true);
        }

        // Mostrar el modal
        var modal = new bootstrap.Modal(document.getElementById("ModalEditCliente"));
        modal.show();

    } catch (error) {
        console.error('Error al cargar datos del cliente:', error);
        alert('Error al cargar los datos del cliente.');
    }
}

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

// Función para guardar los cambios del cliente editado
async function guardarEdicionCliente() {
    const id = $('#editClienteId').val();
    const clienteActualizado = {
        alegra: {
            address: {
                street: $('#editCalle').val(),
                exteriorNumber: $('#editNumeroExterior').val(),
                interiorNumber: $('#editNumeroInterior').val(),
                colony: $('#editColonia').val(),
                locality: $('#editLocalidad').val(),
                municipality: $('#editMunicipioDelegacion').val(),
                state: $('#editEstado').val(),
                zipCode: $('#editCodigoPostal').val(),
                country: "MEX"
            },
            thirdType: "NATIONAL",
            regime: $('#editRegimen').val() || "NO_REGIME",
            name: $('#editNombreCliente').val(),
            identification: $('#editRfc').val(),
            phonePrimary: $('#editTelefonoPrincipal').val(),
            mobile: $('#editTelefonoPrincipal').val(),
            email: $('#editCorreoElectronicoContacto').val(),
            status: "active"
        },
        client: {
            esfactura: $('#edit_factura_si').is(':checked'),
            estado: true,
            zonaCliente: $('#editSelectZonaCliente').val(),
            login: {
                username: $('#editTelefonoPrincipal').val(),
                pasword: null // Aquí puedes incluir lógica para cambiar la contraseña si es necesario
            }
        }
    };

    try {
        // Mostrar alerta de carga
        Swal.fire({
            title: "Actualizando cliente...",
            text: "Por favor, espera un momento.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const response = await fetch(`/api/cliente/test/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clienteActualizado)
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el cliente');
        }

        Swal.fire({
            title: "¡Éxito!",
            text: "El cliente ha sido actualizado correctamente.",
            icon: "success",
            confirmButtonText: "Aceptar"
        }).then(() => {
            $('#ModalEditCliente').modal('hide');
            $('#tablaClientes').DataTable().ajax.reload();
        });

    } catch (error) {
        console.error("Error al actualizar cliente:", error);
        Swal.fire({
            title: "Error",
            text: "Hubo un problema al actualizar el cliente.",
            icon: "error",
            confirmButtonText: "Aceptar"
        });
    }
}

// Función para formatear fechas
function formatearFecha(fecha) {
    if (!fecha) return "N/A";
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString("es-MX", { year: 'numeric', month: '2-digit', day: '2-digit' });
}

function loadEditRegimenOptions(rfcValue, selectedRegimen) {
    const regimenSelect = document.getElementById('editRegimen');
    regimenSelect.innerHTML = ''; // Limpiar opciones previas

    if (!rfcValue || rfcValue.trim() === '') {
        // Si no hay RFC, solo permitimos "Sin Obligaciones Fiscales"
        const opt = document.createElement('option');
        opt.value = '616';
        opt.text = 'Sin Obligaciones Fiscales';
        regimenSelect.add(opt);
        return;
    }

    const opciones12 = [
        { value: '616', text: 'Régimen General de Ley Personas Morales' },
        { value: '616', text: 'Personas Morales con Fines no Lucrativos' },
        { value: '616', text: 'Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras (AGAPES)' },
        { value: '624', text: 'Coordinados' },
        { value: '620', text: 'Sociedades Cooperativas de Producción que optan por diferir sus ingresos' },
        { value: '620', text: 'Regimen simplificado de confianza (RESICO)' },
        { value: '616', text: 'Sin obligaciones fiscales' },
        { value: '623', text: 'Opcional para Grupos de Sociedades' }
    ];

    const opciones13 = [
        { value: '612', text: 'Personas Físicas con Actividades Empresariales y Profesionales' },
        { value: '621', text: 'Incorporación Fiscal' },
        { value: '606', text: 'Arrendamiento' },
        { value: '625', text: 'Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas' },
        { value: '605', text: 'Sueldos y Salarios e Ingresos Asimilados a Salarios' },
        { value: '626', text: 'Regimen simplificado de confianza (RESICO)' },
        { value: '616', text: 'Sin obligaciones fiscales' },
        { value: '611', text: 'Ingresos por Dividendos (socios y accionistas)' },
    ];

    let opciones = [];
    if (rfcValue.length === 12) {
        opciones = opciones12;
    } else if (rfcValue.length === 13) {
        opciones = opciones13;
    }

    opciones.forEach(opcion => {
        const opt = document.createElement('option');
        opt.value = opcion.value;
        opt.text = opcion.text;
        if (opcion.value === selectedRegimen) {
            opt.selected = true; // Selecciona el régimen actual del cliente
        }
        regimenSelect.add(opt);
    });
}

document.getElementById('editRfc').addEventListener('input', function () {
    loadEditRegimenOptions(this.value);
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


