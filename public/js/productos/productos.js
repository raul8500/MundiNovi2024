const btnCalcularPrecios = document.getElementById('btnCalcularPrecios')

//Tabla para mostrar datos
$(document).ready(function () {
    $('#tablaProductos').DataTable({
        ajax: {
            url: '/api/productos', // URL donde obtienes los datos
            dataSrc: 'products' 
        },
        columns: [
            { data: 'reference' },
            {
                data: 'esActivo',
                render: function (data, type, row) {
                    if (data === true) {
                        return `<span class="badge badge-success rounded-pill d-inline">Activo</span>`;
                    } else {
                        return `<span class="badge badge-danger rounded-pill d-inline">Inactivo</span>`;
                    }
                }
            },
            { data: 'name' },
            { data: 'datosFinancieros.costo' },
            { data: 'datosFinancieros.precio1' },
            { data: 'idAlegra' },
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



btnCalcularPrecios.addEventListener('click', () => {

    for (let i = 1; i <= 10; i++) {
        let costo = document.getElementById('costo').value;
        let porcentaje = document.getElementById('porcentaje-precio-' + i)?.value;
        let precioInput = document.getElementById('precio-' + i);

        // Si el porcentaje no es nulo, no está vacío y no es igual a 0
        if (porcentaje !== undefined && porcentaje !== null && porcentaje !== '' && parseFloat(porcentaje) !== 0) {
            let precio = calcularPrecio(costo, porcentaje);

            if (precioInput !== null) {
                precioInput.value = precio;
            }
        } else {
            // Si el porcentaje es vacío o igual a 0, vacía el campo de precio
            if (precioInput !== null) {
                precioInput.value = 0;
            }
        }
    }
});

function calcularPrecio(costo, porcentaje){
    let precio = (costo * (1 + (porcentaje / 100)))

    return precio;
}


