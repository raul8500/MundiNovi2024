const btnAñadirProveedor = document.getElementById('btnAñadirProveedor');
const modalProveedor = new mdb.Modal(document.getElementById('modalProveedor'));

$(document).ready(function () {
    $('#tablaProveedores').DataTable({
        ajax: {
            url: '/api/proveedor', // URL donde obtienes los datos
            dataSrc: '' // Si los datos están en un array
        },
        columns: [
            { data: 'nombre' },
            { data: 'informacionContacto.telefono' },
            { data: 'informacionContacto.correo' },
            { data: 'direccion.ciudad' },
            {
                data: 'estado',
                render: function (data, type, row) {
                    // Cambia el badge según el estado
                    if (data === 'activo') {
                        return '<span class="badge badge-success rounded-pill d-inline">Activo</span>';
                    } else {
                        return '<span class="badge badge-danger rounded-pill d-inline">Inactivo</span>';
                    }
                }
            },
            {
                data: null, // Esta columna es para los botones
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-primary btn-editar" data-id="${row._id}" title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="btn btn-danger btn-eliminar" data-id="${row._id}" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
                    `;
                },
                orderable: false, // Desactiva el ordenamiento en esta columna
                searchable: false // Desactiva la búsqueda en esta columna
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
});

btnAñadirProveedor.addEventListener('click', () => {
    resetForm()
    modalProveedor.show();
});

function resetForm() {
    document.getElementById('nombre').value = "";
    document.getElementById('telefono').value = "";
    document.getElementById('correo').value = "";
    document.getElementById('calle').value = "";
    document.getElementById('ciudad').value = "";
    document.getElementById('estado').value = "";
    document.getElementById('codigoPostal').value = "";
    document.getElementById('pais').value = "";
    document.getElementById('estadoProveedor').value = "activo"; // Establece el valor por defecto
}

function getFormData() {
    return {
        nombre: document.getElementById('nombre').value.trim(),
        informacionContacto: {
            telefono: document.getElementById('telefono').value.trim(),
            correo: document.getElementById('correo').value.trim()
        },
        direccion: {
            calle: document.getElementById('calle').value.trim(),
            ciudad: document.getElementById('ciudad').value.trim(),
            estado: document.getElementById('estado').value.trim(),
            codigoPostal: document.getElementById('codigoPostal').value.trim(),
            pais: document.getElementById('pais').value.trim()
        },
        // La fecha de registro puede ser generada en el servidor o ajustada aquí
        fechaRegistro: new Date().toISOString(), // Usa la fecha actual
        estado: document.getElementById('estadoProveedor').value.trim(),
        // El campo _id no se incluirá aquí, ya que es generado por MongoDB
    };
}

function validateFormData(formData) {
    const errors = [];

    if (!formData.nombre) {
        errors.push('El nombre es obligatorio.');
    }
    if (!formData.informacionContacto.telefono) {
        errors.push('El teléfono es obligatorio.');
    }
    if (!formData.informacionContacto.correo) {
        errors.push('El correo electrónico es obligatorio.');
    }
    if (!formData.direccion.calle) {
        errors.push('La calle es obligatoria.');
    }
    if (!formData.direccion.ciudad) {
        errors.push('La ciudad es obligatoria.');
    }
    if (!formData.direccion.estado) {
        errors.push('El estado es obligatorio.');
    }
    if (!formData.direccion.codigoPostal) {
        errors.push('El código postal es obligatorio.');
    }
    if (!formData.direccion.pais) {
        errors.push('El país es obligatorio.');
    }

    return errors;
}

document.getElementById('guardarProveedor').addEventListener('click', () => {
    const formData = getFormData();
    const errors = validateFormData(formData);

    if (errors.length > 0) {
        // Mostrar los errores con SweetAlert2
        Swal.fire({
            title: 'Error',
            text: errors.join('\n'),
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    } else {
        // Si no hay errores, envía los datos al servidor
        fetch('/api/proveedor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            
            // Mostrar alerta de éxito con SweetAlert2
            Swal.fire({
                title: 'Éxito',
                text: 'Proveedor agregado correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                location.reload();
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});

