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
            {
                data: 'datosFinancieros.costo',
                render: function (data, type, row) {
                    return data && data > 0 ? `$${data.toFixed(2)}` : 'Sin registro';
                }
            },            
            {
                data: 'datosFinancieros.precio1',
                render: function (data, type, row) {
                    return data && data > 0 ? `$${data.toFixed(2)}` : 'Sin registro';
                }
            },            
            {
                data: null, // Esta columna es para los botones
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-primary btn-editarProducto" data-id="${row._id}" title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="btn btn-danger btn-eliminarProducto" data-id="${row._id}" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
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

    cargarSelects([
        { id: 'grupoEdit', url: '/api/grupos', placeholder: 'Selecciona Grupo' },
        { id: 'marcaEdit', url: '/api/marca', placeholder: 'Selecciona Marca' },
        { id: 'lineaEdit', url: '/api/linea', placeholder: 'Selecciona Línea' },
        { id: 'departamentoEdit', url: '/api/departamento', placeholder: 'Selecciona Departamento' },
        { id: 'impuestoEdtit', url: '/api/impuesto', placeholder: 'Selecciona Impuesto' },
        { id: 'unidadEdit', url: '/api/unidad', placeholder: 'Selecciona Unidad' },

        { id: 'grupo', url: '/api/grupos', placeholder: 'Selecciona Grupo' },
        { id: 'marca', url: '/api/marca', placeholder: 'Selecciona Marca' },
        { id: 'linea', url: '/api/linea', placeholder: 'Selecciona Línea' },
        { id: 'departamento', url: '/api/departamento', placeholder: 'Selecciona Departamento' },
        { id: 'impuesto', url: '/api/impuesto', placeholder: 'Selecciona Impuesto' },
        { id: 'unidad', url: '/api/unidad', placeholder: 'Selecciona Unidad' },
    ]);
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
        $("#estadoProducto").val("false");
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

$("#productoImagen").on("change", function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            $("#previewImagen").attr("src", e.target.result).show();
        };
        reader.readAsDataURL(file);
    }
});

function cargarSelects(configs) {
    configs.forEach(cfg => {
        $.get(cfg.url, function (data) {
            const $select = $('#' + cfg.id);
            $select.empty(); // Limpia el select

            // Agrega la opción por defecto
            $select.append(`<option value="">${cfg.placeholder || 'Selecciona una opción'}</option>`);

            data.forEach(item => {
                $select.append(`<option value="${item._id}">${item.nombre}</option>`);
            });
        });
    });
}



document.addEventListener('click', e => {
    if (e.target.matches('.btn-editarProducto')) {
        const button = e.target.closest('.btn-editarProducto'); 
        idEditProducto = button.getAttribute('data-id');
        console.log('aiuda')
        cargarProductoEdit(idEditProducto)
        const modal = new bootstrap.Modal(document.getElementById('editarProductos'));
        modal.show();
    }
});

function cargarProductoEdit(idEditProducto) {
    fetch('/api/producto/test/'+idEditProducto)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            setEditFormData(data.product);
        })
        .catch(error => console.log(error)); // Mover .catch() al final
}

function setEditFormData(producto) {
    // Datos generales
    document.getElementById('claveEdit').value = producto.reference || '';
    document.getElementById('nombreEdit').value = producto.name || '';
    document.getElementById('codigoBarrasEdit').value = producto.codigoBarra || '';
    document.getElementById('claveSATEdit').value = producto.productKey || '';
    document.getElementById('descripcionEdit').value = producto.description || '';
    document.getElementById('fechaAltaEdit').value = producto.createdAt?.split('T')[0] || '';
  
    // Estado del producto
    document.getElementById('estadoProductoEdit').value = producto.esActivo === false ? "false" : "true";
  
    // Tipo Kit / Grupo
    document.getElementById('tipoKitEdit').checked = producto.esKit || false;
    document.getElementById('tipoGrupoEdit').checked = producto.esGrupo || false;
  
    // Selects con relaciones (puede ser ID o el objeto populate)
    document.getElementById('grupoEdit').value = producto.grupo?._id || producto.grupo || '';
    document.getElementById('marcaEdit').value = producto.marca?._id || producto.marca || '';
    document.getElementById('lineaEdit').value = producto.linea?._id || producto.linea || '';
    document.getElementById('departamentoEdit').value = producto.departamento?._id || producto.departamento || '';
    document.getElementById('impuestoEdtit').value = producto.impuesto?._id || producto.impuesto || '';
    document.getElementById('unidadEdit').value = producto.unidad?._id || producto.unidad || '';
}



  