$(document).ready(async function () {
    let proveedores = [];
    selectedProviders = []; // Global

    // 🔹 Cargar proveedores desde la API
    async function loadProviders() {
        try {
            const response = await fetch("/api/proveedor");
            if (!response.ok) throw new Error("Error al obtener proveedores");
            proveedores = await response.json();
        } catch (error) {
            console.error("Error cargando proveedores:", error);
        }
    }

    await loadProviders();

    // 🔹 Buscar proveedores
    $("#providerSearch").on("input", function () {
        const searchTerm = $(this).val().toLowerCase();
        const suggestionsDiv = $("#suggestions");
        suggestionsDiv.empty();

        if (searchTerm.length === 0) return;

        const filtrados = proveedores.filter(p =>
            p.nombre.toLowerCase().includes(searchTerm)
        );

        filtrados.forEach(proveedor => {
            const item = $(`<div class="suggestion-item">${proveedor.nombre}</div>`);
            item.data("id", proveedor._id);

            item.on("click", function () {
                addProviderToTable(proveedor._id, proveedor.nombre);
                $("#providerSearch").val("");
                suggestionsDiv.empty();
            });

            suggestionsDiv.append(item);
        });
    });

    // 🔹 Agregar proveedor a la tabla
    function addProviderToTable(id, nombre) {
        if (selectedProviders.includes(id)) {
            alert("El proveedor ya ha sido agregado.");
            return;
        }

        selectedProviders.push(id);

        const newRow = `
            <tr data-id="${id}">
                <td>${nombre}</td>
                <td>
                    <button class="btn btn-danger btn-sm remove-provider" data-id="${id}">
                        <i class="fas fa-trash-alt"></i> Eliminar
                    </button>
                </td>
            </tr>
        `;

        $("#providerTable tbody").append(newRow);
    }

    // 🔹 Eliminar proveedor con delegación (funciona también con los cargados desde edición)
    $(document).on("click", ".remove-provider", function () {
        const id = $(this).data("id").toString();

        // Eliminar de arreglo global
        selectedProviders = selectedProviders.filter(provID => provID.toString() !== id);

        // Eliminar fila de la tabla
        $(this).closest("tr").remove();
    });
});
