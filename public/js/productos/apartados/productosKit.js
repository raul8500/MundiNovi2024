$(document).ready(async function () {
    let allProducts = []; // Almacena todos los productos obtenidos de la API

    // 🔹 Obtener productos de la API
    async function loadProducts() {
        try {
            const response = await fetch("http://localhost:3000/api/producto/test");
            const data = await response.json();
            allProducts = data.products; // Guardar los productos en la variable
        } catch (error) {
            console.error("Error al cargar productos:", error);
        }
    }

    await loadProducts(); // Cargar productos al inicio

    // 🔹 Evento de entrada en el input para mostrar sugerencias por reference
    $("#productsKitSearch").on("input", function () {
        let searchTerm = $(this).val().toLowerCase();
        let suggestionsContainer = $("#suggestionsProductsKit");
        suggestionsContainer.empty(); // Limpiar sugerencias previas

        if (searchTerm.length > 1) {
            let filteredProducts = allProducts.filter(product =>
                product.reference.toLowerCase().includes(searchTerm)
            );

            filteredProducts.forEach(product => {
                let suggestionItem = $(`<div class="suggestion-item">${product.reference} - ${product.name}</div>`);
                suggestionItem.on("click", function () {
                    addKitProductToTable(product);
                    suggestionsContainer.empty();
                    $("#productsKitSearch").val("");
                });
                suggestionsContainer.append(suggestionItem);
            });

            if (filteredProducts.length === 0) {
                suggestionsContainer.append('<div class="no-results">No se encontraron productos</div>');
            }
        }
    });

    // 🔹 Función para agregar producto a la tabla
    function addKitProductToTable(product) {
        const amount = parseInt($("#productsKitAmount").val()) || 1; // Obtener cantidad ingresada
        const cost = parseFloat(product.datosFinancieros?.costo || 0); // Obtener costo del producto
        const totalCost = (amount * cost).toFixed(2); // Calcular costo total

        if (!selectedKitProducts.some(p => p._id === product._id)) {
            selectedKitProducts.push({
                ...product,
                amount,
                visible: true, // Por defecto, el producto es visible
                sumable: false, // Por defecto, el producto no es sumable
                totalCost,
            });

            let newRow = `
                <tr data-id="${product._id}">
                    <td>${product.reference}</td>
                    <td>${product.name}</td>
                    <td>
                        <input type="number" class="form-control product-amount" value="${amount}" min="1" data-id="${product._id}">
                    </td>
                    <td>
                        <input type="checkbox" class="product-visible" data-id="${product._id}" checked>
                    </td>
                    <td>
                        <input type="checkbox" class="product-sumable" data-id="${product._id}">
                    </td>
                    <td>$${cost.toFixed(2)}</td>
                    <td class="total-cost">$${totalCost}</td>
                    <td>
                        <button class="btn btn-danger btn-sm remove-product-kit" data-id="${product._id}">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </td>
                </tr>
            `;
            $("#providerTableKit tbody").append(newRow);
            updateTotalGeneral(); // ✅ Actualizar total general
        }
    }

    // 🔹 Función para actualizar el total general
    function updateTotalGeneral() {
        let total = selectedKitProducts.reduce((sum, product) => sum + parseFloat(product.totalCost || 0), 0);
        $("#totalGeneral").text(`$${total.toFixed(2)}`);
    }

    // 🔹 Evento para actualizar la cantidad y recalcular costo total
    $(document).on("input", ".product-amount", function () {
        const productId = $(this).data("id");
        const newAmount = parseInt($(this).val()) || 1;

        selectedKitProducts.forEach(product => {
            if (product._id === productId) {
                product.amount = newAmount;
                product.totalCost = (newAmount * parseFloat(product.datosFinancieros?.costo || 0)).toFixed(2);
                $(`tr[data-id="${productId}"] .total-cost`).text(`$${product.totalCost}`);
            }
        });

        updateTotalGeneral(); // ✅ Actualizar total general
    });

    // 🔹 Evento para cambiar la visibilidad del producto
    $(document).on("change", ".product-visible", function () {
        const productId = $(this).data("id");
        selectedKitProducts.forEach(product => {
            if (product._id === productId) {
                product.visible = $(this).is(":checked");
            }
        });
    });

    // 🔹 Evento para cambiar si el producto es sumable
    $(document).on("change", ".product-sumable", function () {
        const productId = $(this).data("id");
        selectedKitProducts.forEach(product => {
            if (product._id === productId) {
                product.sumable = $(this).is(":checked");
            }
        });
    });

    // 🔹 Evento para eliminar un producto del kit
    $(document).on("click", ".remove-product-kit", function () {
        let productId = $(this).data("id");
        selectedKitProducts = selectedKitProducts.filter(p => p._id !== productId);
        $(this).closest("tr").remove();
        updateTotalGeneral(); // ✅ Actualizar total general
    });

});
