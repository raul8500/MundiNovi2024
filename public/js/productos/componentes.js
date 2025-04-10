    //--------------------------- Grupo

$(document).ready(function () {

    let grupoModo = 'crear';
    let grupoIdEditar = null;

    let grupoTabla = $('#grupoTabla').DataTable({
        ajax: {
            url: '/api/grupos',
            dataSrc: ''
        },
        columns: [
            { data: 'clave' },
            { data: 'nombre' },
            { data: 'descripcion' },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-primary btn-editarGrupo" data-id="${row._id}" title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="btn btn-danger btn-eliminarGrupo" data-id="${row._id}" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
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
            "oPaginate": {
                "sFirst": "Primera",
                "sLast": "Última",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
        }
    });

    $('#grupoBtnGuardarGrupo').click(function () {
        const nombre = $('#grupoNombre').val().trim();
        const descripcion = $('#grupoDescripcion').val().trim();
        const clave = $('#grupoClave').val().trim();

        if (!nombre || !descripcion || !clave) {
            return Swal.fire('Campos requeridos', 'Nombre, clave y descripción son obligatorios.', 'warning');
        }

        const datos = { nombre, descripcion, clave };

        if (grupoModo === 'crear') {
            $.post('/api/grupos', datos, function () {
                grupoTabla.ajax.reload();
                limpiarFormularioGrupo();
                Swal.fire('Creado', 'Grupo creado exitosamente.', 'success');
            });
        } else {
            $.ajax({
                url: `/api/grupos/${grupoIdEditar}`,
                method: 'PUT',
                data: datos,
                success: function () {
                    grupoTabla.ajax.reload();
                    limpiarFormularioGrupo();
                    Swal.fire('Actualizado', 'Grupo actualizado correctamente.', 'success');
                }
            });
        }
    });

    $('#grupoTabla tbody').on('click', '.btn-editarGrupo', function () {
        const id = $(this).data('id');

        $.get(`/api/grupos/${id}`, function (grupo) {
            $('#grupoNombre').val(grupo.nombre);
            $('#grupoDescripcion').val(grupo.descripcion);
            $('#grupoClave').val(grupo.clave);
            $('#grupoBtnGuardarGrupo').text('Actualizar');

            grupoModo = 'editar';
            grupoIdEditar = grupo._id;
        });
    });

    $('#grupoTabla tbody').on('click', '.btn-eliminarGrupo', function () {
        const id = $(this).data('id');

        Swal.fire({
            title: '¿Eliminar grupo?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `/api/grupos/${id}`,
                    method: 'DELETE',
                    success: function () {
                        grupoTabla.ajax.reload();
                        limpiarFormularioGrupo();
                        Swal.fire('Eliminado', 'El grupo ha sido eliminado.', 'success');
                    }
                });
            }
        });
    });

    function limpiarFormularioGrupo() {
        $('#grupoNombre').val('');
        $('#grupoDescripcion').val('');
        $('#grupoClave').val('');
        $('#grupoBtnGuardarGrupo').text('Agregar');
        grupoModo = 'crear';
        grupoIdEditar = null;
    }

});

    //--------------------------- MARCA

let marcaModo = 'crear';
let marcaIdEditar = null;
let marcaTabla;

$(document).ready(function () {
    marcaTabla = $('#marcaTabla').DataTable({
        ajax: {
            url: '/api/marca',
            dataSrc: ''
        },
        columns: [
            { data: 'clave' },
            { data: 'nombre' },
            { data: 'descripcion' },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-primary btn-editarMarca" data-id="${row._id}" title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="btn btn-danger btn-eliminarMarca" data-id="${row._id}" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
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
            "oPaginate": {
                "sFirst": "Primera",
                "sLast": "Última",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            }
        }
    });

    $('#marcaBtnGuardar').click(function () {
        const clave = $('#marcaClave').val().trim();
        const nombre = $('#marcaNombre').val().trim();
        const descripcion = $('#marcaDescripcion').val().trim();

        if (!clave || !nombre || !descripcion) {
            return Swal.fire('Campos requeridos', 'Clave, nombre y descripción son obligatorios.', 'warning');
        }

        const datos = { clave, nombre, descripcion };

        if (marcaModo === 'crear') {
            $.post('/api/marca', datos, function () {
                marcaTabla.ajax.reload();
                limpiarFormularioMarca();
                Swal.fire('Creado', 'Marca creada exitosamente.', 'success');
            });
        } else {
            $.ajax({
                url: `/api/marca/${marcaIdEditar}`,
                method: 'PUT',
                data: datos,
                success: function () {
                    marcaTabla.ajax.reload();
                    limpiarFormularioMarca();
                    Swal.fire('Actualizado', 'Marca actualizada correctamente.', 'success');
                }
            });
        }
    });

    $('#marcaTabla tbody').on('click', '.btn-editarMarca', function () {
        const id = $(this).data('id');

        $.get(`/api/marca/${id}`, function (marca) {
            $('#marcaClave').val(marca.clave);
            $('#marcaNombre').val(marca.nombre);
            $('#marcaDescripcion').val(marca.descripcion);
            $('#marcaBtnGuardar').text('Actualizar');

            marcaModo = 'editar';
            marcaIdEditar = marca._id;
        });
    });

    $('#marcaTabla tbody').on('click', '.btn-eliminarMarca', function () {
        const id = $(this).data('id');

        Swal.fire({
            title: '¿Eliminar marca?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `/api/marca/${id}`,
                    method: 'DELETE',
                    success: function () {
                        marcaTabla.ajax.reload();
                        limpiarFormularioMarca();
                        Swal.fire('Eliminado', 'La marca ha sido eliminada.', 'success');
                    }
                });
            }
        });
    });

    function limpiarFormularioMarca() {
        $('#marcaClave').val('');
        $('#marcaNombre').val('');
        $('#marcaDescripcion').val('');
        $('#marcaBtnGuardar').text('Agregar');
        marcaModo = 'crear';
        marcaIdEditar = null;
    }
});



    //--------------------------- Linea

let lineaModo = 'crear';
let lineaIdEditar = null;
let lineaTabla;

$(document).ready(function () {
    lineaTabla = $('#lineaTabla').DataTable({
        ajax: {
            url: '/api/linea',
            dataSrc: ''
        },
        columns: [
            { data: 'clave' },
            { data: 'nombre' },
            { data: 'descripcion' },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-primary btn-editarLinea" data-id="${row._id}" title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="btn btn-danger btn-eliminarLinea" data-id="${row._id}" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
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
            "oPaginate": {
                "sFirst": "Primera",
                "sLast": "Última",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            }
        }
    });

    // Guardar (crear o actualizar)
    $('#lineaBtnGuardar').click(function () {
        const clave = $('#lineaClave').val().trim();
        const nombre = $('#lineaNombre').val().trim();
        const descripcion = $('#lineaDescripcion').val().trim();

        if (!clave || !nombre || !descripcion) {
            return Swal.fire('Campos requeridos', 'Clave, nombre y descripción son obligatorios.', 'warning');
        }

        const datos = { clave, nombre, descripcion };

        if (lineaModo === 'crear') {
            $.post('/api/linea', datos, function () {
                lineaTabla.ajax.reload();
                limpiarFormularioLinea();
                Swal.fire('Creado', 'Línea creada exitosamente.', 'success');
            });
        } else {
            $.ajax({
                url: `/api/linea/${lineaIdEditar}`,
                method: 'PUT',
                data: datos,
                success: function () {
                    lineaTabla.ajax.reload();
                    limpiarFormularioLinea();
                    Swal.fire('Actualizado', 'Línea actualizada correctamente.', 'success');
                }
            });
        }
    });

    // Editar
    $('#lineaTabla tbody').on('click', '.btn-editarLinea', function () {
        const id = $(this).data('id');

        $.get(`/api/linea/${id}`, function (linea) {
            $('#lineaClave').val(linea.clave);
            $('#lineaNombre').val(linea.nombre);
            $('#lineaDescripcion').val(linea.descripcion);
            $('#lineaBtnGuardar').text('Actualizar');

            lineaModo = 'editar';
            lineaIdEditar = linea._id;
        });
    });

    // Eliminar
    $('#lineaTabla tbody').on('click', '.btn-eliminarLinea', function () {
        const id = $(this).data('id');

        Swal.fire({
            title: '¿Eliminar línea?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `/api/linea/${id}`,
                    method: 'DELETE',
                    success: function () {
                        lineaTabla.ajax.reload();
                        limpiarFormularioLinea();
                        Swal.fire('Eliminado', 'La línea ha sido eliminada.', 'success');
                    }
                });
            }
        });
    });

    function limpiarFormularioLinea() {
        $('#lineaClave').val('');
        $('#lineaNombre').val('');
        $('#lineaDescripcion').val('');
        $('#lineaBtnGuardar').text('Agregar');
        lineaModo = 'crear';
        lineaIdEditar = null;
    }
});


    //--------------------------- Departamento

let departamentoModo = 'crear';
let departamentoIdEditar = null;
let departamentoTabla;

$(document).ready(function () {
    departamentoTabla = $('#departamentoTabla').DataTable({
        ajax: {
            url: '/api/departamento',
            dataSrc: ''
        },
        columns: [
            { data: 'clave' },
            { data: 'nombre' },
            { data: 'descripcion' },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-primary btn-editarDepartamento" data-id="${row._id}" title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="btn btn-danger btn-eliminarDepartamento" data-id="${row._id}" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
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
            "oPaginate": {
                "sFirst": "Primera",
                "sLast": "Última",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            }
        }
    });

    // Crear o actualizar departamento
    $('#departamentoBtnGuardar').click(function () {
        const clave = $('#departamentoClave').val().trim();
        const nombre = $('#departamentoNombre').val().trim();
        const descripcion = $('#departamentoDescripcion').val().trim();

        if (!clave || !nombre || !descripcion) {
            return Swal.fire('Campos requeridos', 'Clave, nombre y descripción son obligatorios.', 'warning');
        }

        const datos = { clave, nombre, descripcion };

        if (departamentoModo === 'crear') {
            $.post('/api/departamento', datos, function () {
                departamentoTabla.ajax.reload();
                limpiarFormularioDepartamento();
                Swal.fire('Creado', 'Departamento creado exitosamente.', 'success');
            });
        } else {
            $.ajax({
                url: `/api/departamento/${departamentoIdEditar}`,
                method: 'PUT',
                data: datos,
                success: function () {
                    departamentoTabla.ajax.reload();
                    limpiarFormularioDepartamento();
                    Swal.fire('Actualizado', 'Departamento actualizado correctamente.', 'success');
                }
            });
        }
    });

    // Editar
    $('#departamentoTabla tbody').on('click', '.btn-editarDepartamento', function () {
        const id = $(this).data('id');

        $.get(`/api/departamento/${id}`, function (dep) {
            $('#departamentoClave').val(dep.clave);
            $('#departamentoNombre').val(dep.nombre);
            $('#departamentoDescripcion').val(dep.descripcion);
            $('#departamentoBtnGuardar').text('Actualizar');

            departamentoModo = 'editar';
            departamentoIdEditar = dep._id;
        });
    });

    // Eliminar
    $('#departamentoTabla tbody').on('click', '.btn-eliminarDepartamento', function () {
        const id = $(this).data('id');

        Swal.fire({
            title: '¿Eliminar departamento?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `/api/departamento/${id}`,
                    method: 'DELETE',
                    success: function () {
                        departamentoTabla.ajax.reload();
                        limpiarFormularioDepartamento();
                        Swal.fire('Eliminado', 'El departamento ha sido eliminado.', 'success');
                    }
                });
            }
        });
    });

    function limpiarFormularioDepartamento() {
        $('#departamentoClave').val('');
        $('#departamentoNombre').val('');
        $('#departamentoDescripcion').val('');
        $('#departamentoBtnGuardar').text('Agregar');
        departamentoModo = 'crear';
        departamentoIdEditar = null;
    }
});


    //--------------------------- Impuesto

let impuestoModo = 'crear';
let impuestoIdEditar = null;
let impuestoTabla;

$(document).ready(function () {
    impuestoTabla = $('#impuestoTabla').DataTable({
        ajax: {
            url: '/api/impuesto',
            dataSrc: ''
        },
        columns: [
            { data: 'clave' },
            { data: 'nombre' },
            { data: 'descripcion' },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-primary btn-editarImpuesto" data-id="${row._id}" title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="btn btn-danger btn-eliminarImpuesto" data-id="${row._id}" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
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
            "oPaginate": {
                "sFirst": "Primera",
                "sLast": "Última",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            }
        }
    });

    // Crear o actualizar impuesto
    $('#impuestoBtnGuardar').click(function () {
        const clave = $('#impuestoClave').val().trim();
        const nombre = $('#impuestoNombre').val().trim();
        const descripcion = $('#impuestoDescripcion').val().trim();

        if (!clave || !nombre || !descripcion) {
            return Swal.fire('Campos requeridos', 'Clave, nombre y descripción son obligatorios.', 'warning');
        }

        const datos = { clave, nombre, descripcion };

        if (impuestoModo === 'crear') {
            $.post('/api/impuesto', datos, function () {
                impuestoTabla.ajax.reload();
                limpiarFormularioImpuesto();
                Swal.fire('Creado', 'Impuesto creado exitosamente.', 'success');
            });
        } else {
            $.ajax({
                url: `/api/impuesto/${impuestoIdEditar}`,
                method: 'PUT',
                data: datos,
                success: function () {
                    impuestoTabla.ajax.reload();
                    limpiarFormularioImpuesto();
                    Swal.fire('Actualizado', 'Impuesto actualizado correctamente.', 'success');
                }
            });
        }
    });

    // Editar
    $('#impuestoTabla tbody').on('click', '.btn-editarImpuesto', function () {
        const id = $(this).data('id');

        $.get(`/api/impuesto/${id}`, function (impuesto) {
            $('#impuestoClave').val(impuesto.clave);
            $('#impuestoNombre').val(impuesto.nombre);
            $('#impuestoDescripcion').val(impuesto.descripcion);
            $('#impuestoBtnGuardar').text('Actualizar');

            impuestoModo = 'editar';
            impuestoIdEditar = impuesto._id;
        });
    });

    // Eliminar
    $('#impuestoTabla tbody').on('click', '.btn-eliminarImpuesto', function () {
        const id = $(this).data('id');

        Swal.fire({
            title: '¿Eliminar impuesto?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `/api/impuesto/${id}`,
                    method: 'DELETE',
                    success: function () {
                        impuestoTabla.ajax.reload();
                        limpiarFormularioImpuesto();
                        Swal.fire('Eliminado', 'El impuesto ha sido eliminado.', 'success');
                    }
                });
            }
        });
    });

    function limpiarFormularioImpuesto() {
        $('#impuestoClave').val('');
        $('#impuestoNombre').val('');
        $('#impuestoDescripcion').val('');
        $('#impuestoBtnGuardar').text('Agregar');
        impuestoModo = 'crear';
        impuestoIdEditar = null;
    }
});


    //--------------------------- Unidad

let unidadModo = 'crear';
let unidadIdEditar = null;
let unidadTabla;

$(document).ready(function () {
    unidadTabla = $('#unidadTabla').DataTable({
        ajax: {
            url: '/api/unidad',
            dataSrc: ''
        },
        columns: [
            { data: 'clave' },
            { data: 'nombre' },
            { data: 'descripcion' },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-primary btn-editarUnidad" data-id="${row._id}" title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="btn btn-danger btn-eliminarUnidad" data-id="${row._id}" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
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
            "oPaginate": {
                "sFirst": "Primera",
                "sLast": "Última",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            }
        }
    });

    // Crear o actualizar unidad
    $('#unidadBtnGuardar').click(function () {
        const clave = $('#unidadClave').val().trim();
        const nombre = $('#unidadNombre').val().trim();
        const descripcion = $('#unidadDescripcion').val().trim();

        if (!clave || !nombre || !descripcion) {
            return Swal.fire('Campos requeridos', 'Clave, nombre y descripción son obligatorios.', 'warning');
        }

        const datos = { clave, nombre, descripcion };

        if (unidadModo === 'crear') {
            $.post('/api/unidad', datos, function () {
                unidadTabla.ajax.reload();
                limpiarFormularioUnidad();
                Swal.fire('Creado', 'Unidad creada exitosamente.', 'success');
            });
        } else {
            $.ajax({
                url: `/api/unidad/${unidadIdEditar}`,
                method: 'PUT',
                data: datos,
                success: function () {
                    unidadTabla.ajax.reload();
                    limpiarFormularioUnidad();
                    Swal.fire('Actualizado', 'Unidad actualizada correctamente.', 'success');
                }
            });
        }
    });

    // Editar
    $('#unidadTabla tbody').on('click', '.btn-editarUnidad', function () {
        const id = $(this).data('id');

        $.get(`/api/unidad/${id}`, function (unidad) {
            $('#unidadClave').val(unidad.clave);
            $('#unidadNombre').val(unidad.nombre);
            $('#unidadDescripcion').val(unidad.descripcion);
            $('#unidadBtnGuardar').text('Actualizar');

            unidadModo = 'editar';
            unidadIdEditar = unidad._id;
        });
    });

    // Eliminar
    $('#unidadTabla tbody').on('click', '.btn-eliminarUnidad', function () {
        const id = $(this).data('id');

        Swal.fire({
            title: '¿Eliminar unidad?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `/api/unidad/${id}`,
                    method: 'DELETE',
                    success: function () {
                        unidadTabla.ajax.reload();
                        limpiarFormularioUnidad();
                        Swal.fire('Eliminado', 'La unidad ha sido eliminada.', 'success');
                    }
                });
            }
        });
    });

    function limpiarFormularioUnidad() {
        $('#unidadClave').val('');
        $('#unidadNombre').val('');
        $('#unidadDescripcion').val('');
        $('#unidadBtnGuardar').text('Agregar');
        unidadModo = 'crear';
        unidadIdEditar = null;
    }
});



