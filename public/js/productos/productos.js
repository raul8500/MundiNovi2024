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

                // Abrir modal
        $('#crearProducto').modal('show');
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
    const button = e.target.closest('.btn-editarProducto');
    if (button) {
        const idEditProducto = button.getAttribute('data-id');
        cargarProductoEdit(idEditProducto);
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
    esEdicion = true;
    productoEditandoId = producto._id; // Guarda ID para PUT

    // Llena todos los campos igual que ya tienes...
    $("#clave").val(producto.reference || '');
    $("#nombre").val(producto.name || '');
    $("#codigoBarras").val(producto.codigoBarra || '');
    $("#claveSAT").val(producto.productKey || '');
    $("#descripcion").val(producto.description || '');
    $("#fechaAlta").val(producto.createdAt?.split('T')[0] || '');
    $("#estadoProducto").val(producto.esActivo === false ? "false" : "true");
    $("#tipoKit").prop("checked", producto.esKit || false);
    $("#tipoGrupo").prop("checked", producto.esGrupo || false);

    
    $("#grupo").val(producto.grupo?._id || producto.grupo || '');
    $("#marca").val(producto.marca?._id || producto.marca || '');
    $("#linea").val(producto.linea?._id || producto.linea || '');
    $("#departamento").val(producto.departamento?._id || producto.departamento || '');
    $("#impuesto").val(producto.impuesto?._id || producto.impuesto || '');
    $("#unidad").val(producto.unidad?._id || producto.unidad || '');

    // Datos Financieros
    $("#tiempo-surtido").val(producto.tiempoSurtido || 0);
    $("#volumen").val(producto.volumen || 0);
    $("#peso").val(producto.peso || 0);
    $("#costo").val(producto.datosFinancieros?.costo || 0);
    $("#ultimo-costo").val(producto.datosFinancieros?.ultimoCosto || 0);
    $("#costo-promedio").val(producto.datosFinancieros?.costoPromedio || 0);
    $("#num-precio-minimo").val(producto.datosFinancieros?.numeroPrecioMinimo || 0);
    $("#num-precio-maximo").val(producto.datosFinancieros?.numeroPrecioMaximo || 0);
    $("#presentacion").val(producto.presentacion || 0);
    $("#claveAlmacen").val(producto.claveAlmacen || 0);

    for (let i = 1; i <= 10; i++) {
        $(`#porcentaje-precio-${i}`).val(producto.datosFinancieros?.[`porcentajePrecio${i}`] || 0);
        $(`#precio-${i}`).val(producto.datosFinancieros?.[`precio${i}`] || 0);
        $(`#rango-inicial-${i}`).val(producto.datosFinancieros?.[`rangoInicial${i}`] || 0);
        $(`#rango-final-${i}`).val(producto.datosFinancieros?.[`rangoFinal${i}`] || 0);
        $(`#porcentaje-monedero-${i}`).val(producto.datosFinancieros?.[`porcentajeMonedero${i}`] || 0);
    }

    // Imagen
    const preview = document.getElementById("previewImagen");
    if (producto.rutaImagen) {
        preview.src = producto.rutaImagen;
        preview.style.display = "block";
    } else {
        preview.src = "";
        preview.style.display = "none";
    }

        // === Poblar tablas de relaciones ===

    // Proveedores
    if (producto.proveedor) {
        const proveedor = producto.proveedor;
        selectedProviders = [proveedor._id.toString()]; // aseguramos string para comparación
    
        const fila = `
            <tr data-id="${proveedor._id}">
                <td>${proveedor.nombre}</td>
                <td>
                    <button class="btn btn-danger btn-sm remove-provider" data-id="${proveedor._id}">
                        <i class="fas fa-trash-alt"></i> Eliminar
                    </button>
                </td>
            </tr>
        `;
    
        $("#providerTable tbody").html(fila);
    }
    

    //Adicionales

    if (producto.productosAdicionales && producto.productosAdicionales.length > 0) {
        selectedProducts = producto.productosAdicionales;
        const filas = selectedProducts.map(p => `
            <tr data-id="${p._id}">
                <td>${p.reference} - ${p.name}</td>
                <td>
                    <button class="btn btn-danger btn-sm remove-product" data-id="${p._id}">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </td>
            </tr>
        `).join("");
        $("#providerTableProductAditional tbody").html(filas);
    }

    
    //Grupos

    if (producto.productosGrupo && producto.productosGrupo.length > 0) {
        selectedGroupProducts = producto.productosGrupo;
        const filas = selectedGroupProducts.map(p => `
            <tr data-id="${p._id}">
                <td>${p.reference} - ${p.name}</td>
                <td>
                    <button class="btn btn-danger btn-sm remove-product-group" data-id="${p._id}">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </td>
            </tr>
        `).join("");
        $("#providerTableGroup tbody").html(filas);
    }

    
    //Complementarios
    if (producto.productosComplementarios && producto.productosComplementarios.length > 0) {
        selectedComplementProducts = producto.productosComplementarios;
        const filas = selectedComplementProducts.map(p => `
            <tr data-id="${p._id}">
                <td>${p.reference} - ${p.name}</td>
                <td>
                    <button class="btn btn-danger btn-sm remove-product-complement" data-id="${p._id}">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </td>
            </tr>
        `).join("");
        $("#providerTableComplementProducts tbody").html(filas);
    }


    //kit
    if (producto.productosKit && producto.productosKit.length > 0) {
        selectedKitProducts = producto.productosKit.map(pk => {
            const baseProduct = pk.id || pk; // <-- este cambio asegura compatibilidad
            const costo = baseProduct?.datosFinancieros?.costo || 0;
            const cantidad = pk.cantidad || 1;
            const totalCost = (cantidad * costo).toFixed(2);
    
            return {
                ...baseProduct,
                amount: cantidad,
                visible: pk.visible ?? true,
                sumable: pk.sumable ?? false,
                totalCost
            };
        });
    
        const filas = selectedKitProducts.map(p => `
            <tr data-id="${p._id}">
                <td>${p.reference}</td>
                <td>${p.name}</td>
                <td>
                    <input type="number" class="form-control product-amount" value="${p.amount}" min="1" data-id="${p._id}">
                </td>
                <td>
                    <input type="checkbox" class="product-visible" data-id="${p._id}" ${p.visible ? "checked" : ""}>
                </td>
                <td>
                    <input type="checkbox" class="product-sumable" data-id="${p._id}" ${p.sumable ? "checked" : ""}>
                </td>
                <td>$${(p.datosFinancieros?.costo || 0).toFixed(2)}</td>
                <td class="total-cost">$${p.totalCost}</td>
                <td>
                    <button class="btn btn-danger btn-sm remove-product-kit" data-id="${p._id}">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </td>
            </tr>
        `).join("");
    
        $("#providerTableKit tbody").html(filas);
        updateTotalGeneral();
    }
    
    

    function updateTotalGeneral() {
        let total = selectedKitProducts.reduce((sum, product) => sum + parseFloat(product.totalCost || 0), 0);
        $("#totalGeneral").text(`$${total.toFixed(2)}`);
    }
    
    
            // 🔹 Reiniciar el modal en la primera pestaña
            $(".nav-pills .nav-link").removeClass("active");
            $(".tab-pane").removeClass("show active");
            $("#ex1-tab-1").addClass("active"); // Activar la primera pestaña
            $("#ex1-pills-1").addClass("show active"); // Mostrar su contenido

            
            // Datos Financieros
            $("#productsKitAmount").val(1);

    // Abrir modal
    $('#crearProducto').modal('show');
}

document.addEventListener('click', async (e) => {
    if (e.target.closest('.btn-eliminarProducto')) {
        const btn = e.target.closest('.btn-eliminarProducto');
        const productoId = btn.getAttribute('data-id');

        Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`/api/producto/eliminar/${productoId}`, {
                        method: 'DELETE'
                    });

                    const result = await response.json();

                    if (response.ok) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Eliminado',
                            text: 'El producto fue eliminado correctamente',
                            confirmButtonColor: '#28a745',
                        }).then(() => {
                            location.reload(); // o recargar tabla
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: result.message || 'No se pudo eliminar el producto',
                        });
                    }
                } catch (err) {
                    console.error('Error al eliminar producto:', err);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de red',
                        text: 'No se pudo conectar con el servidor',
                    });
                }
            }
        });
    }
});





  