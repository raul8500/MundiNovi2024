$(document).ready(function () {
    // Inicializar DataTable
    $('#tablaColaboradores').DataTable({
        ajax: { url: '/api/colaborador', dataSrc: '' },
        columns: [
            {
                data: 'datos_empresa.estado',
                title: 'Estado',
                className: 'text-center',
                render: function (data) {
                    return data
                        ? `<span class="badge bg-success">Activo</span>`
                        : `<span class="badge bg-danger">Inactivo</span>`;
                }
            },
            { data: 'datos_personales.nombres', title: 'Nombre', className: 'text-center' },
            { data: 'datos_empresa.sucursales.nombre', title: 'Sucursal', className: 'text-center' },
            { data: 'datos_empresa.usuario_sistema.username', title: 'Usuario', className: 'text-center' },
            {
                data: '_id',
                title: 'Acciones',
                className: 'text-center',
                render: function (data) {
                    return `
                        <button class="btn btn-warning btn-sm btn-editar" data-id="${data}">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn btn-danger btn-sm btn-eliminar" data-id="${data}">
                            <i class="fas fa-trash-alt"></i> Eliminar
                        </button>
                        <button class="btn btn-primary btn-sm btn-contrato" data-id="${data}">
                            <i class="fas fa-file-contract"></i> Contrato
                        </button>
                        <button class="btn btn-secondary btn-sm btn-renuncia" data-id="${data}">
                            <i class="fas fa-file-signature"></i> Renuncia
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

    $(document).on('click', '.btn-contrato', async function () {
        const colaboradorId = $(this).data('id');
    
        try {
            // 🚀 Obtener el contrato personalizado desde el backend
            const response = await fetch(`/api/contrato/${colaboradorId}`);
            if (!response.ok) throw new Error("Error al obtener el contrato");
    
            const data = await response.json();
            const contratoTexto = data.contrato;
            const gerenteNombre = data.gerente_nombre || "Gerente General";
            const colaboradorNombre = data.colaborador || "Juan Perez Perez";
    
            // 🚀 Asegurar que jsPDF está disponible
            const { jsPDF } = window.jspdf;
    
            // 🚀 Crear un nuevo documento PDF
            const doc = new jsPDF({
                orientation: "p", // Vertical (portrait)
                unit: "mm",       // Unidad en milímetros
                format: "a4"      // Formato A4
            });
    
            // 🚀 Configurar el documento
            const margenIzquierdo = 20;
            const margenDerecho = 20;
            const margenSuperior = 20;
            const anchoTexto = 170; // Ancho máximo del texto dentro del PDF
            const altoLinea = 7; // Espaciado entre líneas
            const maxAlturaPagina = 270; // Altura máxima antes de hacer un salto de página
            let y = margenSuperior; // Posición inicial en Y
    
            // 🚀 TÍTULO CENTRADO
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.text("CONTRATO INDIVIDUAL DE TRABAJO", 105, y, { align: "center" });
            y += 10; // Espacio después del título
    
            // 🚀 TEXTO JUSTIFICADO
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
    
            // 🚀 Dividir el texto en líneas para que se ajuste al ancho
            const textoDividido = doc.splitTextToSize(contratoTexto, anchoTexto);
    
            // 🚀 Iterar sobre las líneas y agregarlas al PDF
            textoDividido.forEach(linea => {
                // 🚀 Verificar si hay que hacer un salto de página
                if (y + altoLinea > maxAlturaPagina) {
                    doc.addPage(); // Agregar una nueva página
                    y = margenSuperior; // Reiniciar la posición Y en la nueva página
                }
    
                // 🚀 Agregar la línea al PDF (simulación de justificación)
                doc.text(linea, margenIzquierdo, y);
                y += altoLinea; // Mover la posición Y para la siguiente línea
            });
    
            // 🚀 Espacio antes de las firmas
            y += 20;
    
            // 🚀 Línea para firmas
            const firmaY = y + 10; // Posición de la línea de firma
            doc.line(40, firmaY, 100, firmaY); // Línea para gerente
            doc.line(120, firmaY, 180, firmaY); // Línea para trabajador
    
            // 🚀 Texto de las firmas (Centrado)
            doc.text("POR 'MUNDI NOVI'", 70, firmaY + 5, { align: "center" });
            doc.text("EL 'TRABAJADOR'", 150, firmaY + 5, { align: "center" });
    
            // 🚀 Nombres debajo de las firmas
            doc.text(gerenteNombre, 70, firmaY + 10, { align: "center" });
            doc.text(colaboradorNombre, 150, firmaY + 10, { align: "center" });
    
            // 🚀 Guardar o mostrar el PDF
            doc.save(`Contrato_${colaboradorId}.pdf`);
            Swal.fire("¡Contrato Generado!", "El contrato ha sido descargado en PDF.", "success");
    
        } catch (error) {
            console.error("Error al generar el contrato:", error);
            Swal.fire("Error", "No se pudo generar el contrato.", "error");
        }
    });
    
    const { jsPDF } = window.jspdf; // ✅ Importar correctamente jsPDF

    $(document).on("click", ".btn-renuncia", function () {
        const colaboradorId = $(this).data("id");
        $("#renunciaColaboradorId").val(colaboradorId);
        $("#modalRenuncia").modal("show");
    });

    $("#btnGenerarRenuncia").on("click", async function () {
        const colaboradorId = $("#renunciaColaboradorId").val();
        const testigo1 = $("#testigo1").val();
        const testigo2 = $("#testigo2").val();

        if (!testigo1 || !testigo2) {
            Swal.fire("Error", "Debes ingresar los nombres de los testigos.", "error");
            return;
        }

        try {
            const response = await fetch(`/api/renuncia/${colaboradorId}?testigo1=${testigo1}&testigo2=${testigo2}`);
            const data = await response.json();

            const { jsPDF } = window.jspdf; 
            const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

            // 📌 Configuración de Márgenes
            const marginLeft = 15;
            const marginRight = 195;
            let y = 20; // 📌 Posición inicial

            // 📌 Título centrado
            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.text("RENUNCIA", 105, y, { align: "center" });

            // 📌 Configuración de texto justificado
            y += 15;
            doc.setFont("times", "normal");
            doc.setFontSize(12);
            const pageHeight = doc.internal.pageSize.height - 20; // Ajustar para no cortar contenido

            // 📌 Dividir texto en bloques para no salir de la hoja
            let textLines = doc.splitTextToSize(data.renuncia, marginRight - marginLeft);
            textLines.forEach(line => {
                if (y + 10 >= pageHeight) { // Si se llega al final de la página, agregar nueva
                    doc.addPage();
                    y = 20;
                }
                doc.text(line, marginLeft, y, { align: "justify" });
                y += 7;
            });

            // 📌 Espacio antes de las firmas
            y += 15;

            // 📌 Firma del colaborador (centrada)
            doc.setFont("helvetica", "bold");
            doc.text("_________________________", 105, y, { align: "center" });
            y += 5;
            doc.text(data.colaborador, 105, y, { align: "center" });

            // 📌 Espacio para testigos (centrado con espacio entre ellos)
            y += 20;
            doc.text("_________________________      _________________________", 105, y, { align: "center" });
            y += 5;
            doc.text(`${testigo1}                          ${testigo2}`, 105, y, { align: "center" });

            // 📌 Guardar el PDF
            doc.save(`Renuncia_${data.colaborador}.pdf`);

            $("#modalRenuncia").modal("hide");
            Swal.fire("Éxito", "Se ha generado la carta de renuncia correctamente.", "success");

        } catch (error) {
            console.error("Error al generar renuncia:", error);
            Swal.fire("Error", "Hubo un problema al generar la renuncia.", "error");
        }
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

