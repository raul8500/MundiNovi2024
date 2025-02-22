$(document).ready(function () {
    $("#btnGuardarProducto").on("click", async function () {
        try {
            // 🔹 Mostrar alerta de carga
            Swal.fire({
                title: "Guardando producto...",
                text: "Por favor, espera mientras se guarda el producto.",
                allowOutsideClick: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            // 🔹 Recopilar datos generales
            let generalData = {
                reference: $("#clave").val().trim(),
                name: $("#nombre").val().trim(),
                codigoBarra: $("#codigoBarras").val().trim(),
                productKey: $("#claveSAT").val().trim(),
                description: $("#descripcion").val().trim(),
                fechaAlta: $("#fechaAlta").val(),
                estado: $("#estadoProducto").val(),
                grupo: $("#grupo").val() || null,
                marca: $("#marca").val() || null,
                linea: $("#linea").val() || null,
                departamento: $("#departamento").val() || null,
                impuesto: $("#impuesto").val() || null,
                unidad: $("#unidad").val() || null,
                esKit: $("#tipoKit").prop("checked"),
                esGrupo: $("#tipoGrupo").prop("checked"),
            };

            // 🔹 Filtrar datos generales eliminando los valores vacíos
            Object.keys(generalData).forEach(key => {
                if (generalData[key] === "" || generalData[key] === null) {
                    delete generalData[key];
                }
            });

            // 🔹 Recopilar datos financieros
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

            // 🔹 Recopilar precios y porcentajes
            for (let i = 1; i <= 10; i++) {
                financialData[`precio${i}`] = parseFloat($(`#precio-${i}`).val()) || 0;
                financialData[`porcentajePrecio${i}`] = parseFloat($(`#porcentaje-precio-${i}`).val()) || 0;
                financialData[`rangoInicial${i}`] = parseFloat($(`#rango-inicial-${i}`).val()) || 0;
                financialData[`rangoFinal${i}`] = parseFloat($(`#rango-final-${i}`).val()) || 0;
                financialData[`porcentajeMonedero${i}`] = parseFloat($(`#porcentaje-monedero-${i}`).val()) || 0;
            }

            // 🔹 Recopilar proveedores seleccionados
            let proveedores = selectedProviders.length > 0 ? selectedProviders.map(p => p._id) : undefined;

            // 🔹 Recopilar productos adicionales
            let productosAdicionales = selectedProducts.length > 0 ? selectedProducts.map(p => p._id) : undefined;

            // 🔹 Recopilar productos del kit con cantidad y sumable/visible
            let productosKit = selectedKitProducts.length > 0 ? selectedKitProducts.map(p => ({
                id: p._id,
                cantidad: p.amount,
                visible: p.visible,
                sumable: p.sumable,
                costoTotal: p.totalCost,
            })) : undefined;

            // 🔹 Recopilar productos del grupo
            let productosGrupo = selectedGroupProducts.length > 0 ? selectedGroupProducts.map(p => p._id) : undefined;

            // 🔹 Recopilar productos complementarios
            let productosComplementarios = selectedComplementProducts.length > 0 ? selectedComplementProducts.map(p => p._id) : undefined;

            // 🔹 Datos para Alegra
            let alegraData = {
                inventory: { unit: generalData.unidad || "H87" },
                name: generalData.name,
                description: generalData.description,
                reference: generalData.reference,
                price: financialData.precio1 || 0,
                tax: generalData.impuesto || "1",
                type: generalData.esKit ? "kit" : "product",
                productKey: generalData.productKey || "47131700"
            };

            // 🔹 Estructura del producto para el POST (Excluye arrays vacíos o nulos)
            let productoData = {
                alegra: alegraData,
                product: {
                    ...generalData,
                    datosFinancieros: financialData,
                    ...(proveedores && { proveedor: proveedores }),
                    ...(productosAdicionales && { productosAdicionales: productosAdicionales }),
                    ...(productosKit && { productosKit: productosKit }),
                    ...(productosGrupo && { productosGrupo: productosGrupo }),
                    ...(productosComplementarios && { productosComplementarios: productosComplementarios }),
                }
            };

            console.log("Producto a enviar:", productoData); // DEBUG

            // 🔹 Enviar el producto al backend
            const response = await fetch("/api/producto/crear", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productoData),
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
                    $("#crearProducto").modal("hide"); // Cerrar modal
                    location.reload(); // Recargar la página
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
