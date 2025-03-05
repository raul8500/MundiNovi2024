$(document).ready(async function () {
    let allProducts = []; // Almacena todos los productos obtenidos de la API
    let selectedGroupProducts = []; // Almacena los productos del grupo seleccionados

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
    $("#productsGroupSearch").on("input", function () {
        let searchTerm = $(this).val().toLowerCase();
        let suggestionsContainer = $("#suggestionsProductsGroup");
        suggestionsContainer.empty(); // Limpiar sugerencias previas

        if (searchTerm.length > 1) {
            let filteredProducts = allProducts.filter(product =>
                product.reference.toLowerCase().includes(searchTerm)
            );

            filteredProducts.forEach(product => {
                let suggestionItem = $(`<div class="suggestion-item">${product.reference} - ${product.name}</div>`);
                suggestionItem.on("click", function () {
                    addGroupProductToTable(product);
                    suggestionsContainer.empty();
                    $("#productsGroupSearch").val("");
                });
                suggestionsContainer.append(suggestionItem);
            });

            if (filteredProducts.length === 0) {
                suggestionsContainer.append('<div class="no-results">No se encontraron productos</div>');
            }
        }
    });

    // 🔹 Función para agregar producto a la tabla
    function addGroupProductToTable(product) {
        if (!selectedGroupProducts.some(p => p._id === product._id)) {
            selectedGroupProducts.push(product);

            let newRow = `
                <tr data-id="${product._id}">
                    <td>${product.reference} - ${product.name}</td>
                    <td>
                        <button class="btn btn-danger btn-sm remove-product-group" data-id="${product._id}">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </td>
                </tr>
            `;
            $("#providerTableGroup tbody").append(newRow);
        }
    }

    // 🔹 Evento para eliminar un producto del grupo
    $(document).on("click", ".remove-product-group", function () {
        let productId = $(this).data("id");
        selectedGroupProducts = selectedGroupProducts.filter(p => p._id !== productId);
        $(this).closest("tr").remove();
    });
});
