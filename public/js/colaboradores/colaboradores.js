$(document).ready(function () {
    // Inicializar DataTable
    $('#tablaColaboradores').DataTable({
        ajax: { url: '/api/colaborador', dataSrc: '' },
        columns: [
            {
                data: 'datos_empresa.estado',
                title: 'Estado',
                className: 'text-center', // ✅ Centra el contenido
                render: function (data) {
                    return data
                        ? `<span class="badge bg-success">Sí</span>`
                        : `<span class="badge bg-danger">No</span>`;
                }
            },
            { data: 'datos_personales.nombres', title: 'Nombre', className: 'text-center' },
            { data: 'datos_empresa.sucursales.nombre', title: 'Sucursal', className: 'text-center' },
            { data: 'datos_empresa.usuario_sistema.username', title: 'Usuario', className: 'text-center' },
            {
                data: '_id',
                title: 'Acciones',
                className: 'text-center', // ✅ Centra los botones de acción
                render: function (data) {
                    return `
                        <button class="btn btn-warning btn-sm btn-editar" data-id="${data}">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn btn-danger btn-sm btn-eliminar" data-id="${data}">
                            <i class="fas fa-trash-alt"></i> Eliminar
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

    $('#agregarSucursal').on('change', async function () {
        const sucursalId = $(this).val();
        await loadUsersBySucursal(sucursalId, 'agregarUsuarioSistema'); // 🚀 Cargar usuarios en el select del modal agregar
    });
    

    // 🚀 Abrir modal para agregar colaborador
    $('#btnAgregarColaborador').on('click', async function () {
        const form = document.getElementById('agregarColaboradorForm');
        if (!form) {
            console.error('Error: No se encontró el formulario de agregar');
            return;
        }
    
        form.reset();
    
        // 🚀 Cargar sucursales en el select antes de abrir el modal
        await loadSelectOptions('agregarSucursal');
    
        // 🚀 Cuando el usuario seleccione una sucursal, cargar los usuarios de esa sucursal
        $('#agregarSucursal').on('change', async function () {
            const sucursalId = $(this).val();
            await loadUsersBySucursal(sucursalId, 'agregarUsuarioSistema'); // 🚀 Cargar usuarios dinámicamente
        });
    
        // 🚀 Mostrar el modal de agregar colaborador
        new bootstrap.Modal(document.getElementById("agregarColaboradorModal")).show();
    });
    

    // 🚀 Guardar nuevo colaborador
    $('#agregarColaboradorForm').on('submit', function (e) {
        e.preventDefault();
    
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Vas a agregar un nuevo colaborador.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, agregar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const colaborador = {
                    datos_personales: {
                        nombres: $('#agregarNombres').val(),
                        apellido_paterno: $('#agregarApellidoPaterno').val(),
                        apellido_materno: $('#agregarApellidoMaterno').val(),
                        edad: $('#agregarEdad').val(),
                        sexo: $('#agregarSexo').val(),
                        estado_civil: $('#agregarEstadoCivil').val(),
                        domicilio: $('#agregarDomicilio').val(),
                        ciudad: $('#agregarCiudad').val(),
                        nacionalidad: $('#agregarNacionalidad').val(),
                        curp: $('#agregarCurp').val(),
                        rfc: $('#agregarRfc').val(),
                        fecha_nacimiento: $('#agregarFechaNacimiento').val(),
                    },
                    datos_empresa: {
                        sucursales: $('#agregarSucursal').val(),
                        usuario_sistema: $('#agregarUsuarioSistema').val(),
                        fecha_ingreso: $('#agregarFechaIngreso').val(),
                        tipo_contrato: $('#agregarTipoContrato').val(),
                        hora_entrada: $('#agregarHoraEntrada').val(),
                        hora_salida: $('#agregarHoraSalida').val(),
                        funciones: $('#agregarFunciones').val().split(',').map(f => f.trim()),
                        sueldo: $('#agregarSueldo').val(),
                        autorizacion_credito: $('#agregarAutorizacionCredito').val() === "true",
                        fecha_baja: $('#agregarFechaBaja').val() || null,
                        estado: $('#agregarEstado').val() === "true"
                    }
                };
    
                try {
                    await fetch('/api/colaborador', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(colaborador)
                    });
    
                    $('#agregarColaboradorModal').modal('hide');
                    $('#tablaColaboradores').DataTable().ajax.reload();
    
                    Swal.fire('¡Agregado!', 'El colaborador ha sido agregado.', 'success');
                } catch (error) {
                    console.error('Error al agregar colaborador:', error);
                    Swal.fire('Error', 'Hubo un problema al agregar el colaborador.', 'error');
                }
            }
        });
    });
    
    $('#editarSucursal').on('change', async function () {
        const sucursalId = $(this).val();
        await loadUsersBySucursal(sucursalId, 'editarUsuarioSistema'); // 🚀 Cargar usuarios en el select del modal editar
    });
    

    // 🚀 Abrir modal para editar colaborador
    $(document).on('click', '.btn-editar', async function () {
        const colaboradorId = $(this).data('id');
    
        try {
            const response = await fetch(`/api/colaborador/${colaboradorId}`);
            const colaborador = await response.json();
    
            if (!colaborador) {
                console.error(`Error: No se encontró el colaborador con ID ${colaboradorId}`);
                return;
            }
    
            $('#editarColaboradorId').val(colaborador._id);
            $('#editarNombres').val(colaborador.datos_personales.nombres);
            $('#editarApellidoPaterno').val(colaborador.datos_personales.apellido_paterno);
            $('#editarApellidoMaterno').val(colaborador.datos_personales.apellido_materno);
            $('#editarEdad').val(colaborador.datos_personales.edad);
            $('#editarSexo').val(colaborador.datos_personales.sexo);
            $('#editarEstadoCivil').val(colaborador.datos_personales.estado_civil);
            $('#editarDomicilio').val(colaborador.datos_personales.domicilio);
            $('#editarCiudad').val(colaborador.datos_personales.ciudad);
            $('#editarNacionalidad').val(colaborador.datos_personales.nacionalidad);
            $('#editarCurp').val(colaborador.datos_personales.curp);
            $('#editarRfc').val(colaborador.datos_personales.rfc);
            $('#editarFechaNacimiento').val(colaborador.datos_personales.fecha_nacimiento.split('T')[0]);
    
            // 🚀 Verificar si la sucursal existe antes de asignarla
            const sucursalId = colaborador.datos_empresa.sucursales ? colaborador.datos_empresa.sucursales._id : null;
            await loadSelectOptions('editarSucursal', sucursalId);
    
            // 🚀 Verificar si el usuario del sistema existe antes de asignarlo
            const usuarioId = colaborador.datos_empresa.usuario_sistema ? colaborador.datos_empresa.usuario_sistema._id : null;
            await loadUsersBySucursal(sucursalId, 'editarUsuarioSistema', usuarioId);
    
            $('#editarFechaIngreso').val(colaborador.datos_empresa.fecha_ingreso.split('T')[0]);
            $('#editarTipoContrato').val(colaborador.datos_empresa.tipo_contrato);
            $('#editarHoraEntrada').val(colaborador.datos_empresa.hora_entrada);
            $('#editarHoraSalida').val(colaborador.datos_empresa.hora_salida);
            $('#editarFunciones').val(colaborador.datos_empresa.funciones.join(', '));
            $('#editarSueldo').val(colaborador.datos_empresa.sueldo);
            $('#editarAutorizacionCredito').val(colaborador.datos_empresa.autorizacion_credito ? "true" : "false");
            $('#editarFechaBaja').val(colaborador.datos_empresa.fecha_baja ? colaborador.datos_empresa.fecha_baja.split('T')[0] : '');
            $('#editarEstado').val(colaborador.datos_empresa.estado ? "true" : "false");
    
            new bootstrap.Modal(document.getElementById("editarColaboradorModal")).show();
        } catch (error) {
            console.error('Error al obtener colaborador:', error);
        }
    });
    


    // 🚀 Guardar cambios al editar colaborador
    $('#editarColaboradorForm').on('submit', function (e) {
        e.preventDefault();
    
        Swal.fire({
            title: '¿Actualizar colaborador?',
            text: "Se guardarán los cambios en la base de datos.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, actualizar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const colaboradorId = $('#editarColaboradorId').val();
    
                const colaborador = {
                    datos_personales: {
                        nombres: $('#editarNombres').val(),
                        apellido_paterno: $('#editarApellidoPaterno').val(),
                        apellido_materno: $('#editarApellidoMaterno').val(),
                        edad: $('#editarEdad').val(),
                        sexo: $('#editarSexo').val(),
                        estado_civil: $('#editarEstadoCivil').val(),
                        domicilio: $('#editarDomicilio').val(),
                        ciudad: $('#editarCiudad').val(),
                        nacionalidad: $('#editarNacionalidad').val(),
                        curp: $('#editarCurp').val(),
                        rfc: $('#editarRfc').val(),
                        fecha_nacimiento: $('#editarFechaNacimiento').val(),
                    },
                    datos_empresa: {
                        sucursales: $('#editarSucursal').val(),
                        usuario_sistema: $('#editarUsuarioSistema').val(),
                        fecha_ingreso: $('#editarFechaIngreso').val(),
                        tipo_contrato: $('#editarTipoContrato').val(),
                        hora_entrada: $('#editarHoraEntrada').val(),
                        hora_salida: $('#editarHoraSalida').val(),
                        funciones: $('#editarFunciones').val().split(',').map(f => f.trim()),
                        sueldo: $('#editarSueldo').val(),
                        autorizacion_credito: $('#editarAutorizacionCredito').val() === "true",
                        fecha_baja: $('#editarFechaBaja').val() || null,
                        estado: $('#editarEstado').val() === "true"
                    }
                };
    
                try {
                    await fetch(`/api/colaborador/${colaboradorId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(colaborador)
                    });
    
                    $('#editarColaboradorModal').modal('hide');
                    $('#tablaColaboradores').DataTable().ajax.reload();
    
                    Swal.fire('¡Actualizado!', 'Los cambios han sido guardados.', 'success');
                } catch (error) {
                    console.error('Error al actualizar colaborador:', error);
                    Swal.fire('Error', 'Hubo un problema al actualizar el colaborador.', 'error');
                }
            }
        });
    });

    $(document).on('click', '.btn-eliminar', function () {
        const colaboradorId = $(this).data('id');
    
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡Esta acción no se puede deshacer!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await fetch(`/api/colaborador/${colaboradorId}`, { method: 'DELETE' });
    
                    $('#tablaColaboradores').DataTable().ajax.reload();
    
                    Swal.fire('¡Eliminado!', 'El colaborador ha sido eliminado.', 'success');
                } catch (error) {
                    console.error('Error al eliminar colaborador:', error);
                    Swal.fire('Error', 'No se pudo eliminar el colaborador.', 'error');
                }
            }
        });
    });
    
    
});


const selectOptions = [
    { url: '/api/sucursal', selectId: 'agregarSucursal' },
    {url: '/api/sucursal', selectId: 'editarSucursal'}
];

async function loadSelectOptions(selectId, selectedValue = null) {
    try {
        const select = document.getElementById(selectId);
        if (!select) {
            console.error(`Error: El select con id "${selectId}" no existe en el DOM.`);
            return;
        }

        const response = await fetch('/api/sucursal'); // 🔹 Llamada a la API de sucursales
        if (!response.ok) throw new Error('Error al obtener sucursales');

        const data = await response.json();
        select.innerHTML = '<option value="">Selecciona una sucursal</option>'; // 🔹 Opción por defecto

        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item._id; // 🔹 Usa el ID de la sucursal
            option.textContent = item.nombre;
            select.appendChild(option);
        });

        // 🔹 Si hay un valor seleccionado, lo marcamos
        if (selectedValue) {
            select.value = selectedValue;
        }

        return true; // ✅ Indica que la carga terminó
    } catch (error) {
        console.error('Error cargando sucursales:', error);
    }
}


async function loadUsersBySucursal(sucursalId, selectId, usuarioSeleccionado = null) {
    const usuarioSelect = document.getElementById(selectId);
    if (!usuarioSelect) {
        console.error(`Error: El select con id "${selectId}" no existe en el DOM.`);
        return;
    }

    // 🚀 Mostrar un mensaje de carga mientras se obtienen los datos
    usuarioSelect.innerHTML = '<option value="">Cargando...</option>';

    if (!sucursalId) {
        usuarioSelect.innerHTML = '<option value="">Selecciona una sucursal primero</option>';
        return;
    }

    try {
        const response = await fetch(`/api/auth/users/sucursales/${sucursalId}`);
        if (!response.ok) throw new Error('Error al obtener usuarios');

        const data = await response.json();
        usuarioSelect.innerHTML = '<option value="">Selecciona un usuario</option>'; // 🚀 Opción por defecto

        if (!data.usuarios.length) {
            usuarioSelect.innerHTML = '<option value="">No hay usuarios disponibles</option>';
            return;
        }

        // 🚀 Agregar usuarios como opciones en el select
        data.usuarios.forEach(user => {
            const option = document.createElement('option');
            option.value = user._id;
            option.textContent = user.username; // Mostrar el username del usuario
            usuarioSelect.appendChild(option);
        });

        // 🚀 Seleccionar el usuario asignado si existe
        if (usuarioSeleccionado) {
            usuarioSelect.value = usuarioSeleccionado;
        }

    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        usuarioSelect.innerHTML = '<option value="">Error al cargar usuarios</option>';
    }
}

