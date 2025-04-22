// Variables globales
var selectedProducts = [];
var selectedProviders = [];
var selectedKitProducts = [];
var selectedGroupProducts = [];
var selectedComplementProducts = [];
let proveedoresSeleccionados = [];

let esEdicion = false;
let productoEditandoId = null;


$(document).ready(function () {


    $("#btnGuardarProducto").on("click", async function () {
        try {
            Swal.fire({
                title: esEdicion ? "Actualizando producto..." : "Guardando producto...",
                text: "Por favor, espera.",
                allowOutsideClick: false,
                showConfirmButton: false,
                didOpen: () => Swal.showLoading(),
            });
    
            // Recopilar datos generales
            let generalData = {
                sku: $("#clave").val().trim(),
                unit_name: $("#nombre").val().trim(),
                codigoBarra: $("#codigoBarras").val().trim(),
                product_key: $("#claveSAT").val().trim(),
                description: $("#descripcion").val().trim(),
                fechaAlta: $("#fechaAlta").val(),
                estado: $("#estadoProducto").val() === "true",
                grupo: $("#grupo").val() || null,
                marca: $("#marca").val() || null,
                linea: $("#linea").val() || null,
                departamento: $("#departamento").val() || null,
                impuesto: $("#impuesto").val() || null,
                unidad: $("#unidad").val() || null,
                esKit: $("#tipoKit").prop("checked"),
                esGrupo: $("#tipoGrupo").prop("checked"),
            };
    
            // Limpiar vacíos
            Object.keys(generalData).forEach(key => {
                if (generalData[key] === "" || generalData[key] === null) delete generalData[key];
            });
    
            // Recopilar datos financieros
            let financialData = {
                tiempoSurtido: parseInt($("#tiempo-surtido").val()) || 0,
                volumen: parseFloat($("#volumen").val()) || 0,
                peso: parseFloat($("#peso").val()) || 0,
                costo: parseFloat($("#costo").val()) || 0,
                ultimoCosto: parseFloat($("#ultimo-costo").val()) || 0,
                costoPromedio: parseFloat($("#costo-promedio").val()) || 0,
                numeroPrecioMinimo: parseInt($("#num-precio-minimo").val()) || 0,
                numeroPrecioMaximo: parseInt($("#num-precio-maximo").val()) || 0,
                presentacion: parseInt($("#presentacion").val()) || 0,
                claveAlmacen: parseInt($("#claveAlmacen").val()) || 0,

            };
    
            for (let i = 1; i <= 10; i++) {
                financialData[`precio${i}`] = parseFloat($(`#precio-${i}`).val()) || 0;
                financialData[`porcentajePrecio${i}`] = parseFloat($(`#porcentaje-precio-${i}`).val()) || 0;
                financialData[`rangoInicial${i}`] = parseFloat($(`#rango-inicial-${i}`).val()) || 0;
                financialData[`rangoFinal${i}`] = parseFloat($(`#rango-final-${i}`).val()) || 0;
                financialData[`porcentajeMonedero${i}`] = parseFloat($(`#porcentaje-monedero-${i}`).val()) || 0;
            }
    
            // 🟡 Normalizar relaciones como arrays vacíos si no hay
            let proveedores = selectedProviders.length > 0 ? selectedProviders : null;
            let productosAdicionales = selectedProducts.length > 0 ? selectedProducts.map(p => p._id) : null;
            let productosKit = selectedKitProducts.length > 0 ? selectedKitProducts.map(p => ({
                id: p._id,
                cantidad: p.amount,
                visible: p.visible,
                sumable: p.sumable,
                costoTotal: p.totalCost,
            })) : null;
            let productosGrupo = selectedGroupProducts.length > 0 ? selectedGroupProducts.map(p => p._id) : null;
            let productosComplementarios = selectedComplementProducts.length > 0 ? selectedComplementProducts.map(p => p._id) : null;

            // Datos para Facturapi
            let facApiProduct = {
                unit_key: generalData.unidad || "H87",
                unit_name: generalData.unit_name,
                description: generalData.description,
                sku: generalData.sku,
                price: financialData.precio1 || 0,
                type: generalData.esKit ? "kit" : "product",
                product_key: generalData.product_key || "47131700"
            };
    
            // Construir el objeto completo
            let productoData = {
                facApiProduct: facApiProduct,
                product: {
                    ...generalData,
                    datosFinancieros: financialData,
                    proveedor: proveedores ? proveedores[0] : null, // solo uno permitido
                    productosAdicionales,
                    productosKit,
                    productosGrupo,
                    productosComplementarios,
                }
            };
    
            const formData = new FormData();
            formData.append("producto", JSON.stringify(productoData));
    
            const imageFile = document.getElementById("productoImagen").files[0];
            if (imageFile) {
                formData.append("imagen", imageFile);
            }
    
            const url = esEdicion
                ? `/api/producto/editar/${productoEditandoId}`
                : `/api/producto/crear`;
    
            const metodo = esEdicion ? "PUT" : "POST";
    
            const response = await fetch(url, {
                method: metodo,
                body: formData,
            });
    
            const result = await response.json();
    
            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: esEdicion ? "Producto actualizado" : "Producto guardado",
                    text: "La información se ha guardado correctamente.",
                    confirmButtonColor: "#28a745",
                }).then(() => {
                    $("#crearProducto").modal("hide");
                    esEdicion = false;
                    productoEditandoId = null;
                    resetFormularioProducto();
                    $('#tablaProductos').DataTable().ajax.reload();
                });
            } else {
                console.error("Error:", result);
                Swal.fire({
                    icon: "error",
                    title: "Error al guardar",
                    text: "Hubo un problema al guardar el producto.",
                    confirmButtonColor: "#dc3545",
                });
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            Swal.fire({
                icon: "error",
                title: "Error de conexión",
                text: "No se pudo conectar con el servidor.",
                confirmButtonColor: "#dc3545",
            });
        }
    });
    

    function resetFormularioProducto() {
        esEdicion = false;
        productoEditandoId = null;
    
        $('#crearProducto input').val('');
        $('#crearProducto select').val('');
        $('#crearProducto input[type="checkbox"]').prop('checked', false);
        $('#previewImagen').hide().attr('src', '');
    
        // Opcional: limpia arrays
        selectedProducts = [];
        selectedProviders = [];
        selectedKitProducts = [];
        selectedGroupProducts = [];
        selectedComplementProducts = [];
    }
    $('#crearProducto').on('hidden.bs.modal', function () {
        resetFormularioProducto();
    });
            
});
