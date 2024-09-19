const btnAñadirMateriaPrima = document.getElementById('btnAñadirMateriaPrima');
const btnGuardarMateriaPrima = document.getElementById('btnGuardarMateriaPrima');

const modalMateriaPrima = new mdb.Modal(document.getElementById('modalMateriaPrima'));

$(document).ready(function () {
    $('#tablaMateriasPrimas').DataTable({
        ajax: {
            url: '/api/materiasPrimas', 
            dataSrc: '' 
        },
        columns: [
            { data: 'clave' },
            { data: 'nombre' },
            { data: 'fechaAlta' },
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
            {data: 'datosFinancieros.costo'},
            {
                data: null, // Esta columna es para los botones
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-primary btn-editar" data-id="${row._id}" title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="btn btn-danger btn-eliminar" data-id="${row._id}" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
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
});

btnAñadirMateriaPrima.addEventListener('click', () => {
    setFormValuesEmpty()
    modalMateriaPrima.show();
});

btnGuardarMateriaPrima.addEventListener('click', () => {

    let formData = getFormValues()

    fetch('/api/materiasPrimas', {
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
                text: 'Materia prima agregada correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                location.reload();
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

function getFormValues() {
    return {
        clave: document.getElementById('clave').value,
        codigoBarras: document.getElementById('codigoBarras').value,
        nombre: document.getElementById('nombre').value,
        descripcion: document.getElementById('descripcion').value,
        claveProductoSAT: document.getElementById('claveProductoSAT').value,
        estado: document.getElementById('estado').value,
        datosFinancieros:{
            tiempoSurtido: document.getElementById('tiempoSurtido').value,
            controlAlmacen: document.getElementById('controlAlmacen').value,
            volumen: document.getElementById('volumen').value,
            peso: document.getElementById('peso').value,
            stockMinimo: document.getElementById('stockMinimo').value,
            stockMaximo: document.getElementById('stockMaximo').value,
            costo: document.getElementById('costo').value,
            ultimoCosto: document.getElementById('ultimoCosto').value,
            costoPromedio: document.getElementById('costoPromedio').value,
            numeroPrecioMinimo: document.getElementById('numeroPrecioMinimo').value,
            numeroPrecioMaximo: document.getElementById('numeroPrecioMaximo').value,
            presentacion: document.getElementById('presentacion').value,
            precio1: document.getElementById('precio1').value,
            porcentajePrecio1: document.getElementById('porcentajePrecio1').value,
            precio2: document.getElementById('precio2').value,
            porcentajePrecio2: document.getElementById('porcentajePrecio2').value,
            precio3: document.getElementById('precio3').value,
            porcentajePrecio3: document.getElementById('porcentajePrecio3').value,
            precio4: document.getElementById('precio4').value,
            porcentajePrecio4: document.getElementById('porcentajePrecio4').value,
            precio5: document.getElementById('precio5').value,
            porcentajePrecio5: document.getElementById('porcentajePrecio5').value,
            precio6: document.getElementById('precio6').value,
            porcentajePrecio6: document.getElementById('porcentajePrecio6').value,
            precio7: document.getElementById('precio7').value,
            porcentajePrecio7: document.getElementById('porcentajePrecio7').value,
            precio8: document.getElementById('precio8').value,
            porcentajePrecio8: document.getElementById('porcentajePrecio8').value,
            precio9: document.getElementById('precio9').value,
            porcentajePrecio9: document.getElementById('porcentajePrecio9').value,
            precio10: document.getElementById('precio10').value,
            porcentajePrecio10: document.getElementById('porcentajePrecio10').value,
            rangoInicial1: document.getElementById('rangoInicial1').value,
            rangoFinal1: document.getElementById('rangoFinal1').value,
            rangoInicial2: document.getElementById('rangoInicial2').value,
            rangoFinal2: document.getElementById('rangoFinal2').value,
            rangoInicial3: document.getElementById('rangoInicial3').value,
            rangoFinal3: document.getElementById('rangoFinal3').value,
            rangoInicial4: document.getElementById('rangoInicial4').value,
            rangoFinal4: document.getElementById('rangoFinal4').value,
            rangoInicial5: document.getElementById('rangoInicial5').value,
            rangoFinal5: document.getElementById('rangoFinal5').value,
            rangoInicial6: document.getElementById('rangoInicial6').value,
            rangoFinal6: document.getElementById('rangoFinal6').value,
            rangoInicial7: document.getElementById('rangoInicial7').value,
            rangoFinal7: document.getElementById('rangoFinal7').value,
            rangoInicial8: document.getElementById('rangoInicial8').value,
            rangoFinal8: document.getElementById('rangoFinal8').value,
            rangoInicial9: document.getElementById('rangoInicial9').value,
            rangoFinal9: document.getElementById('rangoFinal9').value,
            rangoInicial10: document.getElementById('rangoInicial10').value,
            rangoFinal10: document.getElementById('rangoFinal10').value
        },
        proveedores : proveedoresSeleccionados
    };
}

function setFormValuesEmpty() {
    // Campos anteriores
    document.getElementById('clave').value = '';
    document.getElementById('codigoBarras').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('descripcion').value = '';
    document.getElementById('claveProductoSAT').value = '';
    document.getElementById('estado').value = 'activo';

    // Nuevos campos
    document.getElementById('tiempoSurtido').value = '';
    document.getElementById('controlAlmacen').value = '';
    document.getElementById('volumen').value = '';
    document.getElementById('peso').value = '';
    document.getElementById('stockMinimo').value = '';
    document.getElementById('stockMaximo').value = '';
    document.getElementById('costo').value = '';
    document.getElementById('ultimoCosto').value = '';
    document.getElementById('costoPromedio').value = '';
    document.getElementById('numeroPrecioMinimo').value = '';
    document.getElementById('numeroPrecioMaximo').value = '';
    document.getElementById('presentacion').value = '';

    // Precios
    document.getElementById('precio1').value = '';
    document.getElementById('porcentajePrecio1').value = '';
    document.getElementById('precio2').value = '';
    document.getElementById('porcentajePrecio2').value = '';
    document.getElementById('precio3').value = '';
    document.getElementById('porcentajePrecio3').value = '';
    document.getElementById('precio4').value = '';
    document.getElementById('porcentajePrecio4').value = '';
    document.getElementById('precio5').value = '';
    document.getElementById('porcentajePrecio5').value = '';
    document.getElementById('precio6').value = '';
    document.getElementById('porcentajePrecio6').value = '';
    document.getElementById('precio7').value = '';
    document.getElementById('porcentajePrecio7').value = '';
    document.getElementById('precio8').value = '';
    document.getElementById('porcentajePrecio8').value = '';
    document.getElementById('precio9').value = '';
    document.getElementById('porcentajePrecio9').value = '';
    document.getElementById('precio10').value = '';
    document.getElementById('porcentajePrecio10').value = '';

    // Rangos
    document.getElementById('rangoInicial1').value = '';
    document.getElementById('rangoFinal1').value = '';
    document.getElementById('rangoInicial2').value = '';
    document.getElementById('rangoFinal2').value = '';
    document.getElementById('rangoInicial3').value = '';
    document.getElementById('rangoFinal3').value = '';
    document.getElementById('rangoInicial4').value = '';
    document.getElementById('rangoFinal4').value = '';
    document.getElementById('rangoInicial5').value = '';
    document.getElementById('rangoFinal5').value = '';
    document.getElementById('rangoInicial6').value = '';
    document.getElementById('rangoFinal6').value = '';
    document.getElementById('rangoInicial7').value = '';
    document.getElementById('rangoFinal7').value = '';
    document.getElementById('rangoInicial8').value = '';
    document.getElementById('rangoFinal8').value = '';
    document.getElementById('rangoInicial9').value = '';
    document.getElementById('rangoFinal9').value = '';
    document.getElementById('rangoInicial10').value = '';
    document.getElementById('rangoFinal10').value = '';

    // Limpiar la tabla de proveedores
    const proveedoresTable = document.getElementById('proveedores');
    proveedoresTable.innerHTML = '';
    proveedoresSeleccionados = [];
}








