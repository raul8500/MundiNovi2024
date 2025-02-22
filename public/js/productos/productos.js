$(document).ready(function () {
    $('#tablaProductos').DataTable({
        ajax: {
            url: '/api/producto/test', // URL donde obtienes los datos
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

const btnCalcularPrecios = document.getElementById('btnCalcularPrecios')

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
// Función para activar/desactivar los inputs de precio
function togglePrecios() {
    // Obtener el estado del checkbox
    const calcularPrecio = document.getElementById("calcular-precio").checked;

    // Lista de IDs de los inputs de precios
    const preciosIds = [
        'precio-1', 'precio-2', 'precio-3', 'precio-4', 'precio-5',
        'precio-6', 'precio-7', 'precio-8', 'precio-9', 'precio-10'
    ];


    // Activar o desactivar los inputs de precios y porcentajes
    preciosIds.forEach(function(id) {
        document.getElementById(id).disabled = !calcularPrecio;
    });
}
// Inicializar desactivados los inputs al cargar la página
document.addEventListener('DOMContentLoaded', (event) => {
    togglePrecios();
});

$(document).ready(function () {
    $("#btnAddProducto").on("click", function () {
        // 🔹 Reiniciar el formulario dentro del modal
        $("#crearProducto form")[0].reset();

        // 🔹 Resetear manualmente los valores de los inputs en "Datos Generales"
        $("#clave, #nombre, #codigoBarras, #claveSAT, #descripcion, #fechaAlta").val("");

        // 🔹 Resetear los select en "Datos Generales"
        $("#estadoProducto").val("activo");
        $("#grupo, #marca, #linea, #departamento, #impuesto, #unidad").val("");

        // 🔹 Resetear los checkboxes
        $("#tipoKit, #tipoGrupo").prop("checked", false);

        // 🔹 Resetear manualmente los valores de "Datos Financieros"
        $("#tiempo-surtido, #volumen, #peso, #costo, #ultimo-costo, #costo-promedio, #num-precio-minimo, #num-precio-maximo, #presentacion").val("0");

        // 🔹 Resetear manualmente los precios y porcentajes en "Datos Financieros"
        for (let i = 1; i <= 10; i++) {
            $(`#porcentaje-precio-${i}, #precio-${i}, #rango-inicial-${i}, #rango-final-${i}, #porcentaje-monedero-${i}`).val("0");
        }

        // 🔹 Limpiar imagen del producto
        $("#productoImagen").val("");
        $("#previewImagen").attr("src", "").hide(); // Ocultar la vista previa de la imagen

        // 🔹 Limpiar todas las tablas de productos y proveedores
        $("#providerTable tbody").empty();
        $("#providerTableProductAditional tbody").empty();
        $("#providerTableKit tbody").empty();
        $("#providerTableGroup tbody").empty();
        $("#providerTableComplementProducts tbody").empty();

        // 🔹 Limpiar variables de productos seleccionados
        selectedProviders = [];
        selectedProducts = [];
        selectedKitProducts = [];
        selectedGroupProducts = [];
        selectedComplementProducts = [];

        // 🔹 Limpiar los contenedores de sugerencias
        $("#suggestions, #suggestionsProducts, #suggestionsProductsKit, #suggestionsProductsComplement, #suggestionsProductsGroup").empty();

        // 🔹 Restablecer el contador de costo total en kits
        $("#totalGeneral").text("$0.00");

        // 🔹 Reiniciar el modal en la primera pestaña
        $(".nav-pills .nav-link").removeClass("active");
        $(".tab-pane").removeClass("show active");
        $("#ex1-tab-1").addClass("active"); // Activar la primera pestaña
        $("#ex1-pills-1").addClass("show active"); // Mostrar su contenido
    });
});
