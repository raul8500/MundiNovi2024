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
    $("#productsComplement").on("input", function () {
        let searchTerm = $(this).val().toLowerCase();
        let suggestionsContainer = $("#suggestionsProductsComplement");
        suggestionsContainer.empty(); // Limpiar sugerencias previas

        if (searchTerm.length > 1) {
            let filteredProducts = allProducts.filter(product =>
                product.reference.toLowerCase().includes(searchTerm)
            );

            filteredProducts.forEach(product => {
                let suggestionItem = $(`<div class="suggestion-item">${product.reference} - ${product.name}</div>`);
                suggestionItem.on("click", function () {
                    addComplementProductToTable(product);
                    suggestionsContainer.empty();
                    $("#productsComplement").val("");
                });
                suggestionsContainer.append(suggestionItem);
            });

            if (filteredProducts.length === 0) {
                suggestionsContainer.append('<div class="no-results">No se encontraron productos</div>');
            }
        }
    });

    // 🔹 Función para agregar producto complementario a la tabla
    function addComplementProductToTable(product) {
        if (!selectedComplementProducts.some(p => p._id === product._id)) {
            selectedComplementProducts.push(product);

            let newRow = `
                <tr data-id="${product._id}">
                    <td>${product.name}</td>
                    <td>
                        <button class="btn btn-danger btn-sm remove-product-complement" data-id="${product._id}">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </td>
                </tr>
            `;
            $("#providerTableComplementProducts tbody").append(newRow);
        }
    }

    // 🔹 Evento para eliminar un producto complementario de la tabla
    $(document).on("click", ".remove-product-complement", function () {
        let productId = $(this).data("id");
        selectedComplementProducts = selectedComplementProducts.filter(p => p._id !== productId);
        $(this).closest("tr").remove();
    });
});
