// Variables globales
var selectedProducts = [];
var selectedProviders = [];
var selectedKitProducts = [];
var selectedGroupProducts = [];
var selectedComplementProducts = [];
let proveedoresSeleccionados = [];

$(document).ready(function () {
    $("#btnGuardarProducto").on("click", async function () {
        try {
            Swal.fire({
                title: "Guardando producto...",
                text: "Por favor, espera mientras se guarda el producto.",
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
            };

            for (let i = 1; i <= 10; i++) {
                financialData[`precio${i}`] = parseFloat($(`#precio-${i}`).val()) || 0;
                financialData[`porcentajePrecio${i}`] = parseFloat($(`#porcentaje-precio-${i}`).val()) || 0;
                financialData[`rangoInicial${i}`] = parseFloat($(`#rango-inicial-${i}`).val()) || 0;
                financialData[`rangoFinal${i}`] = parseFloat($(`#rango-final-${i}`).val()) || 0;
                financialData[`porcentajeMonedero${i}`] = parseFloat($(`#porcentaje-monedero-${i}`).val()) || 0;
            }

            // Recopilar relaciones
            let proveedores = selectedProviders.length > 0 ? selectedProviders : undefined;
            let productosAdicionales = selectedProducts.length > 0 ? selectedProducts.map(p => p._id) : undefined;
            let productosKit = selectedKitProducts.length > 0 ? selectedKitProducts.map(p => ({
                id: p._id,
                cantidad: p.amount,
                visible: p.visible,
                sumable: p.sumable,
                costoTotal: p.totalCost,
            })) : undefined;
            let productosGrupo = selectedGroupProducts.length > 0 ? selectedGroupProducts.map(p => p._id) : undefined;
            let productosComplementarios = selectedComplementProducts.length > 0 ? selectedComplementProducts.map(p => p._id) : undefined;

            // facApiProduct
            let facApiProduct = {
                unit_key: generalData.unidad || "H87",
                unit_name: generalData.unit_name,
                description: generalData.description,
                sku: generalData.sku,
                price: financialData.precio1 || 0,
                type: generalData.esKit ? "kit" : "product",
                product_key: generalData.product_key || "47131700"
            };

            // Construir payload
            let productoData = {
                facApiProduct: facApiProduct,
                product: {
                    ...generalData,
                    datosFinancieros: financialData,
                    ...(proveedores && { proveedor: proveedores }),
                    ...(productosAdicionales && { productosAdicionales }),
                    ...(productosKit && { productosKit }),
                    ...(productosGrupo && { productosGrupo }),
                    ...(productosComplementarios && { productosComplementarios }),
                }
            };

            const formData = new FormData();
formData.append("producto", JSON.stringify(productoData));

const imageFile = document.getElementById("productoImagen").files[0];
console.log(imageFile)
if (imageFile) {
  formData.append("imagen", imageFile); // ✅ aquí estaba el problema
}

const response = await fetch("/api/producto/crear", {
  method: "POST",
  body: formData, // No pongas headers, el navegador lo maneja solo
});



            const result = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Producto guardado",
                    text: "El producto ha sido guardado correctamente.",
                    showConfirmButton: true,
                    confirmButtonColor: "#28a745",
                }).then(() => {
                    $("#crearProducto").modal("hide");
                    // location.reload();
                });
            } else {
                console.error("Error al guardar producto:", result);
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
});
