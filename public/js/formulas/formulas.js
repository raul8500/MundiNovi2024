const btnAñadirFormula = document.getElementById('btnAñadirFormula');
const formulaModal = new mdb.Modal(document.getElementById('formulaModal'));
const btnGuardarFormula = document.getElementById('btnGuardarFormula');

$(document).ready(function () {
    $('#tablaFormulasProduccion').DataTable({
        ajax: {
            url: '/api/formulasProduccion', // URL donde obtienes los datos
            dataSrc: '' // Si los datos están en un array
        },
        columns: [
            { data: 'productoFinal.name' },
            { data: 'nombreFormula' },
            { data: 'paraQueCantidadEsLaFormula' },
            {
                data: 'fechaRegistro',
                render: function (data, type, row) {
                    if (type === 'display' && data) {
                        // Convertir la fecha en formato dd/mm/aaaa
                        const date = new Date(data);
                        const day = String(date.getDate()).padStart(2, '0');
                        const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
                        const year = date.getFullYear();
                        return `${day}/${month}/${year}`;
                    }
                    return data; // Para otros tipos de renderizado, simplemente devuelve la fecha original
                }
            },
            { data: 'observaciones' },
            { data: 'costoPorcion' },
            { data: 'costoUnidad' },
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

btnAñadirFormula.addEventListener('click', () => {
    formulaModal.show();
});

btnGuardarFormula.addEventListener('click', () => {
    console.log(selectedProductId)
    console.log(materiasPrimasSeleccionadas)
});



 