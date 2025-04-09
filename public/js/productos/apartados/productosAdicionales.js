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
    $("#productsSearch").on("input", function () {
        let searchTerm = $(this).val().toLowerCase();
        let suggestionsContainer = $("#suggestionsProducts");
        suggestionsContainer.empty(); // Limpiar sugerencias previas

        if (searchTerm.length > 1) {
            let filteredProducts = allProducts.filter(product =>
                product.reference.toLowerCase().includes(searchTerm) // 🔹 Filtrar por `reference`
            );

            filteredProducts.forEach(product => {
                let suggestionItem = $(`<div class="suggestion-item">${product.reference} - ${product.name}</div>`);
                suggestionItem.on("click", function () {
                    addProductToTable(product);
                    suggestionsContainer.empty();
                    $("#productsSearch").val("");
                });
                suggestionsContainer.append(suggestionItem);
            });
        }
    });

    // 🔹 Función para agregar producto a la tabla
    function addProductToTable(product) {
        if (!selectedProducts.some(p => p._id === product._id)) {
            selectedProducts.push(product);

            let newRow = `
                <tr data-id="${product._id}">
                    <td>${product.reference} - ${product.name}</td>
                    <td>
                        <button class="btn btn-danger btn-sm remove-product" data-id="${product._id}">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </td>
                </tr>
            `;
            $("#providerTableProductAditional tbody").append(newRow);
        }
    }

    // 🔹 Evento para eliminar un producto de la tabla
    $(document).on("click", ".remove-product", function () {
        let productId = $(this).data("id");
        selectedProducts = selectedProducts.filter(p => p._id !== productId);
        $(this).closest("tr").remove();
    });
});
