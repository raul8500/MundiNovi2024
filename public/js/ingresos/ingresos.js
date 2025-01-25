$(document).ready(function () {
    let isEditMode = false;

    // Inicializar DataTable
    const tablaIngresos = $('#tablaIngresos').DataTable({
        ajax: {
            url: '/api/ingresos',
            dataSrc: 'data'
        },
        columns: [
            { data: 'sucursal.nombre' },
            { data: 'folio' },
            { data: 'tipoIngreso.nombre' },
            { data: 'importe' },
            { data: 'usuario.username' },
            {
                data: 'fecha',
                render: function (data) {
                    return new Date(data).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                    });
                }
            },
            { data: 'observaciones' },
            {
                data: null,
                render: function (data) {
                    return `
                        <button class="btn btn-warning btnEditarIngresos" data-ingreso-id="${data._id}">Editar</button>
                        <button class="btn btn-danger btnEliminarIngresos" data-ingreso-id="${data._id}">Eliminar</button>
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


    async function loadSelectOptions(options) {
        try {
            const loadOptions = async (url, selectId, dataFormatter) => {
                const select = document.getElementById(selectId);
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Error al obtener los datos de ${selectId}`);
                }

                const data = await response.json(); // Obtén los datos en formato JSON

                select.innerHTML = '';

                // Agrega una opción predeterminada
                const defaultOption = document.createElement('option');
                defaultOption.textContent = `Selecciona una opción`;
                defaultOption.value = '';
                select.appendChild(defaultOption);

                // Usa el formato proporcionado por dataFormatter para estructurar los datos
                dataFormatter(data).forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.value; // Usa el _id como valor
                    option.textContent = item.text; // Usa el nombre como texto visible
                    select.appendChild(option);
                });
            };

            for (const option of options) {
                await loadOptions(option.url, option.selectId, option.formatter);
            }
        } catch (error) {
            console.error('Error al cargar los selects:', error);
        }
    }

    // Configuración de selects dinámicos
    const selectOptions = [
        {
            url: '/api/sucursal',
            selectId: 'sucursal',
            formatter: (data) =>
                data.map((sucursal) => ({
                    value: sucursal._id,
                    text: sucursal.nombre, // Usa el nombre de la sucursal como texto visible
                })),
        },
        {
            url: '/api/tipos-ingreso',
            selectId: 'tipoIngreso',
            formatter: (data) => data.data.map((tipo) => ({ value: tipo._id, text: tipo.nombre })),
        },
    ];


    // Mostrar modal para agregar ingreso
    $('#btnAgregarIngreso').on('click', async function () {
        try {
            isEditMode = false; // Cambiar a modo agregar
            resetForm(); // Limpia el formulario
            await loadSelectOptions(selectOptions); // Carga dinámicamente los selects
            $('#modalIngreso').modal('show'); // Muestra el modal
        } catch (error) {
            console.error('Error al cargar el modal:', error);
        }
    });

// Guardar (Agregar o Actualizar)
$('#formIngreso').on('submit', function (e) {
    e.preventDefault();

    const sucursal = $('#sucursal').val();
    const tipoIngreso = $('#tipoIngreso').val();
    const importe = $('#importe').val();
    const fecha = $('#fecha').val();
    const observaciones = $('#observaciones').val();
    const ingresoId = $('#ingresoId').val(); // Obtén el ID del campo oculto

    // Validación básica
    if (!sucursal || !tipoIngreso || !importe || !fecha) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, completa todos los campos obligatorios.',
        });
        return;
    }

    // Configuración de la solicitud
    const url = isEditMode
        ? `/api/ingresos/679482a4f8df10956deea88f` // Usa el ID en modo edición
        : '/api/ingresos';
    const method = isEditMode ? 'PUT' : 'POST';

    $.ajax({
        url,
        method,
        contentType: 'application/json',
        data: JSON.stringify({
            sucursal,
            tipoIngreso,
            importe,
            fecha,
            observaciones,
            usuario: infoUser._id, // Asigna automáticamente el usuario actual
        }),
        success: function () {
            tablaIngresos.ajax.reload();
            resetForm();
            $('#modalIngreso').modal('hide');
            Swal.fire({
                icon: 'success',
                title: isEditMode ? 'Actualizado' : 'Agregado',
                text: `Ingreso ${isEditMode ? 'actualizado' : 'agregado'} correctamente.`,
            });
        },
        error: function () {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Error al ${isEditMode ? 'actualizar' : 'agregar'} el ingreso.`,
            });
        },
    });
});

// Editar Ingreso
$('#tablaIngresos').on('click', '.btnEditarIngresos', async function () {
    const id = $(this).attr('data-ingreso-id'); // Obtén el ID desde el atributo personalizado
    console.log('ID recuperado:', id); // Depuración

    if (!id) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo identificar el ingreso a editar.',
        });
        return;
    }

    try {
        const response = await fetch(`/api/ingresos/${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener los datos del ingreso.');
        }
        const { data: ingreso } = await response.json();

        // Carga las opciones de los selects y espera a que estén disponibles
        await loadSelectOptions([
            {
                url: '/api/sucursal',
                selectId: 'sucursal',
                formatter: (data) =>
                    data.map((sucursal) => ({
                        value: sucursal._id,
                        text: sucursal.nombre, // Usa el nombre de la sucursal como texto visible
                    })),
            },
            {
                url: '/api/tipos-ingreso',
                selectId: 'tipoIngreso',
                formatter: (data) => data.data.map((tipo) => ({ value: tipo._id, text: tipo.nombre })),
            },
        ]);

        // Asigna los valores al formulario
        $('#ingresoId').val(ingreso._id); // Asigna el ID al campo oculto
        $('#sucursal').val(ingreso.sucursal._id); // Selecciona la sucursal correspondiente
        $('#tipoIngreso').val(ingreso.tipoIngreso._id); // Selecciona el tipo de ingreso correspondiente
        $('#importe').val(ingreso.importe);
        $('#fecha').val(new Date(ingreso.fecha).toISOString().split('T')[0]);
        $('#observaciones').val(ingreso.observaciones);

        isEditMode = true; // Cambia a modo edición
        $('#modalIngreso').modal('show');
    } catch (error) {
        console.error('Error al cargar datos para editar:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cargar los datos del ingreso.',
        });
    }
});




    // Eliminar ingreso
    $('#tablaIngresos').on('click', '.btnEliminarIngresos', function () {
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
        }).then(result => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `/api/ingresos/${id}`,
                    method: 'DELETE',
                    success: function () {
                        tablaIngresos.ajax.reload();
                        Swal.fire({
                            icon: 'success',
                            title: 'Eliminado',
                            text: 'Ingreso eliminado correctamente.'
                        });
                    },
                    error: function () {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Error al eliminar el ingreso.'
                        });
                    }
                });
            }
        });
    });

    // Resetear formulario
// Resetear Formulario
function resetForm() {
    $('#formIngreso')[0].reset(); // Limpia todos los campos del formulario
    $('#ingresoId').val(''); // Limpia el ID oculto
    isEditMode = false; // Cambia a modo agregar
}
});
