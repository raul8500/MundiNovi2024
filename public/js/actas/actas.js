document.addEventListener('DOMContentLoaded', () => {
    $('#tablaActas').DataTable({
        ajax: {
            url: '/api/actas', // URL donde obtienes los datos
            dataSrc: ''
        },
        columns: [
            { data: 'tipo', title: 'Formato' },
            { data: 'usuarioId.name', title: 'Usuario' },
            {
                data: 'fecha',
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
                        <button class="btn btn-primary btn-sm btn-imprimir" data-id="${row._id}" title="Imprimir">
                            <i class="fas fa-print"></i>
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
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primera",
                "sLast": "Última",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            }
        }
    });

    // Imprimir acta
    document.addEventListener('click', async (event) => {
        const imprimirBtn = event.target.closest('.btn-imprimir');
        if (imprimirBtn) {
            const actaId = imprimirBtn.getAttribute('data-id');
            try {
                const response = await fetch(`/api/actas/${actaId}`);
                if (!response.ok) throw new Error('No se pudo obtener la información del acta.');

                const acta = await response.json();

                // Generar vista de impresión
                const ventanaImpresion = window.open('', '', 'width=800,height=600');
                ventanaImpresion.document.write(`
                    <html>
                    <head>
                        <title>Acta Administrativa</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                margin: 20px;
                                line-height: 1.6;
                            }
                            .header {
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                            }
                            .header img {
                                height: 80px;
                            }
                            .header-title {
                                text-align: center;
                                flex: 1;
                                margin-left: -80px;
                            }
                            .title {
                                font-size: 1.5em;
                                font-weight: bold;
                                margin: 0;
                            }
                            .subtitle {
                                font-size: 1.2em;
                                margin: 0;
                                margin-top: 5px;
                            }
                            .content {
                                margin-top: 40px;
                                text-align: justify;
                                font-size: 1em;
                            }
                            .content p {
                                margin: 20px 0;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <img src="img/logoColor.png" alt="Logo Mundi Novi">
                            <div class="header-title">
                                <h1 class="title">Mundi Novi</h1>
                                <h2 class="subtitle">Acta Administrativa</h2>
                            </div>
                        </div>
                        <div class="content">
                            <p>${acta.mensaje}</p>
                        </div>
                    </body>
                    </html>
                `);
                ventanaImpresion.document.close();
                ventanaImpresion.print();
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'No se pudo imprimir el acta.', 'error');
            }
        }
    });

    // Eliminar acta
    document.addEventListener('click', async (event) => {
        const eliminarBtn = event.target.closest('.btn-eliminar');
        if (eliminarBtn) {
            const actaId = eliminarBtn.getAttribute('data-id');
            const confirmacion = await Swal.fire({
                title: '¿Estás seguro?',
                text: "Esta acción no se puede deshacer.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar'
            });

            if (confirmacion.isConfirmed) {
                try {
                    const response = await fetch(`/api/tipos-actas/${actaId}`, {
                        method: 'DELETE'
                    });

                    if (!response.ok) throw new Error('No se pudo eliminar el acta.');

                    Swal.fire('Eliminado', 'El acta ha sido eliminada.', 'success');

                    // Recargar la tabla
                    $('#tablaActas').DataTable().ajax.reload();
                } catch (error) {
                    console.error(error);
                    Swal.fire('Error', 'No se pudo eliminar el acta.', 'error');
                }
            }
        }
    });
});


const cargarTiposActas = async () => {
    const selectTipoActa = document.getElementById('tipoActa');
    const apiTiposActasUrl = '/api/tipos-actas'; // URL del endpoint

    try {
        // Realizar la petición al servidor
        const response = await fetch(apiTiposActasUrl);
        if (!response.ok) {
            throw new Error('Error al cargar los tipos de actas.');
        }

        // Obtener los datos como JSON
        const tiposActas = await response.json();

        // Limpiar el select antes de llenarlo
        selectTipoActa.innerHTML = `
            <option value="" disabled selected>Seleccione el tipo de acta</option>
        `;

        // Agregar las opciones dinámicamente
        tiposActas.forEach((tipo) => {
            const option = document.createElement('option');
            option.value = tipo.tipo;
            option.textContent = tipo.tipo;
            selectTipoActa.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar los tipos de actas:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los tipos de actas. Inténtelo más tarde.',
        });
    }
};

const cargarUsuarios = async () => {
    try {
        const response = await fetch('/api/auth/users'); // Cambia esta URL según tu endpoint
        if (!response.ok) throw new Error('Error al cargar usuarios.');

        const usuarios = await response.json();
        const usuarioSelect = document.getElementById('usuarioId');
        usuarioSelect.innerHTML = '<option value="" disabled selected>Seleccione un usuario</option>';

        usuarios.forEach(usuario => {
            const option = document.createElement('option');
            option.value = usuario._id; // Asigna el ID del usuario como valor
            option.textContent = `${usuario.name} (${usuario.username})`; // Muestra el nombre y el username
            usuarioSelect.appendChild(option);
        });
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudieron cargar los usuarios.', 'error');
    }
};

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', cargarTiposActas);
document.addEventListener('DOMContentLoaded', cargarUsuarios);


const generarActa = async () => {
    const tipoActa = document.getElementById('tipoActa').value;
    const usuarioId = document.getElementById('usuarioId').value;

    // Validar que los campos requeridos estén completos
    if (!tipoActa || !usuarioId) {
        Swal.fire('Error', 'Debe seleccionar un tipo de acta y un usuario.', 'error');
        return;
    }

    try {
        // Enviar datos al backend
        const response = await fetch('/api/actas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tipo: tipoActa, usuarioId }),
        });

        if (response.ok) {
            const acta = await response.json(); // Obtener el acta creada desde la respuesta
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Acta generada exitosamente.',
            }).then(() => {
                // Recargar la página después de cerrar el SweetAlert
                window.location.reload();
            });

            document.getElementById('formActas').reset(); // Limpiar el formulario

            // Opcional: Actualizar la tabla de actas si se muestra en pantalla
            $('#tablaActas').DataTable().ajax.reload();

            // Generar la vista de impresión del acta
            generarVistaActa(acta);
        } else {
            const error = await response.json();
            Swal.fire('Error', error.message || 'No se pudo generar el acta.', 'error');
        }
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Error de conexión con el servidor.', 'error');
    }
};


const generarVistaActa = (acta) => {
    const ventanaImpresion = window.open('', '', 'width=800,height=600');
    ventanaImpresion.document.write(`
        <html>
        <head>
            <title>Acta Administrativa</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    line-height: 1.6;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .header img {
                    height: 80px;
                }
                .header-title {
                    text-align: center;
                    flex: 1;
                    margin-left: -80px;
                }
                .title {
                    font-size: 1.5em;
                    font-weight: bold;
                    margin: 0;
                }
                .subtitle {
                    font-size: 1.2em;
                    margin: 0;
                    margin-top: 5px;
                }
                .content {
                    margin-top: 40px;
                    text-align: justify;
                    font-size: 1em;
                }
                .content p {
                    margin: 20px 0;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <img src="img/logoColor.png" alt="Logo Mundi Novi">
                <div class="header-title">
                    <h1 class="title">Mundi Novi</h1>
                    <h2 class="subtitle">Acta Administrativa</h2>
                </div>
            </div>
            <div class="content">
                <p>${acta.mensaje}</p>
            </div>
        </body>
        </html>
    `);
    ventanaImpresion.document.close();
    ventanaImpresion.print();
};

document.getElementById('btnGenerarActa').addEventListener('click', generarActa);


    const apiTiposActasUrl = '/api/tipos-actas'; // Endpoint para los tipos de actas
    // Formularios y campos
    const tipoActaForm = document.getElementById('tipoActaForm');
    const tipoInput = document.getElementById('tipoInput');
    const mensajeInput = document.getElementById('mensajeInput');
    const tipoActaId = document.getElementById('tipoActaId');

    // Inicializar DataTables para los tipos de actas
    const tablaTiposActas = $('#tiposActasTabla').DataTable({
        ajax: {
            url: apiTiposActasUrl,
            dataSrc: ''
        },
        columns: [
            { data: 'tipo', title: 'Tipo' },
            { data: 'mensaje', title: 'Mensaje' },
            {
                data: null,
                title: 'Acciones',
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-warning btn-sm btn-editar" data-id="${row._id}" title="Editar">
                            <i class="fas fa-edit"></i>
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
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primera",
                "sLast": "Última",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            }
        }
    });

   // Crear o actualizar un tipo de acta
tipoActaForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const tipo = tipoInput.value.trim();
    const mensaje = mensajeInput.value.trim();

    if (!tipo || !mensaje) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor, completa todos los campos.',
        });
        return;
    }

    const tipoActa = { tipo, mensaje };
    try {
        let response;
        if (tipoActaId.value) {
            // Actualizar
            response = await fetch(`${apiTiposActasUrl}/${tipoActaId.value}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tipoActa),
            });
        } else {
            // Crear
            response = await fetch(apiTiposActasUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tipoActa),
            });
        }

        if (!response.ok) throw new Error('Error al guardar el tipo de acta.');

        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Tipo de acta guardado exitosamente.',
        });

        tipoActaForm.reset();
        tipoActaId.value = '';
                cargarTiposActas()
        tablaTiposActas.ajax.reload(); // Recargar DataTable
    } catch (error) {
        console.error('Error al guardar el tipo de acta:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al guardar el tipo de acta.',
        });
    }
});

// Editar un tipo de acta
$('#tiposActasTabla').on('click', '.btn-editar', async (e) => {
    const id = $(e.currentTarget).data('id');
    try {
        const response = await fetch(`${apiTiposActasUrl}/${id}`);
        if (!response.ok) throw new Error('Error al obtener el tipo de acta.');

        const tipoActa = await response.json();
        tipoActaId.value = tipoActa._id;
        tipoInput.value = tipoActa.tipo;
        mensajeInput.value = tipoActa.mensaje;
    } catch (error) {
        console.error('Error al cargar el tipo de acta:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al cargar el tipo de acta.',
        });
    }
});

// Eliminar un tipo de acta
$('#tiposActasTabla').on('click', '.btn-eliminar-tipo', async (e) => {
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
        const response = await fetch(`${apiTiposActasUrl}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Error al eliminar el tipo de acta.');

        Swal.fire({
            icon: 'success',
            title: '¡Eliminado!',
            text: 'Tipo de acta eliminado exitosamente.',
        });
                cargarTiposActas()
        tablaTiposActas.ajax.reload(); // Recargar DataTable
    } catch (error) {
        console.error('Error al eliminar el tipo de acta:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al eliminar el tipo de acta.',
        });
    }
});

// Abrir el modal y recargar los datos
const modal = new bootstrap.Modal(document.getElementById('tipoActasModal'));
document.getElementById('abrirModalTipoActas').addEventListener('click', () => {
    modal.show();
    tablaTiposActas.ajax.reload(); // Asegurar que los datos estén actualizados
});


