// ✅ Asegúrate de declarar esto en un archivo global o al inicio de tu HTML
// var selectedProviders = [];

document.addEventListener("DOMContentLoaded", async () => {
    let proveedores = []; // Lista de proveedores obtenidos de la API
    selectedProviders = []; // ✅ Usamos la variable global en lugar de let local

    // 🟢 Obtener la lista de proveedores desde la API
    async function cargarProveedores() {
        try {
            const response = await fetch("http://localhost:3000/api/proveedor");
            if (!response.ok) throw new Error("Error al obtener proveedores");
            proveedores = await response.json();
        } catch (error) {
            console.error("Error cargando proveedores:", error);
        }
    }

    // 🟢 Mostrar sugerencias de proveedores
    document.getElementById("providerSearch").addEventListener("input", function () {
        const inputTexto = this.value.toLowerCase();
        const sugerenciasDiv = document.getElementById("suggestions");
        sugerenciasDiv.innerHTML = ""; // Limpiar sugerencias previas

        if (inputTexto.length === 0) {
            return;
        }

        const proveedoresFiltrados = proveedores.filter(p =>
            p.nombre.toLowerCase().includes(inputTexto)
        );

        proveedoresFiltrados.forEach(proveedor => {
            const sugerencia = document.createElement("div");
            sugerencia.classList.add("suggestion-item");
            sugerencia.textContent = proveedor.nombre;
            sugerencia.dataset.id = proveedor._id;

            sugerencia.addEventListener("click", function () {
                agregarProveedor(proveedor._id, proveedor.nombre);
                document.getElementById("providerSearch").value = "";
                sugerenciasDiv.innerHTML = "";
            });

            sugerenciasDiv.appendChild(sugerencia);
        });
    });

    // 🟢 Agregar proveedor a la tabla
    function agregarProveedor(id, nombre) {
        if (selectedProviders.includes(id)) {
            alert("El proveedor ya ha sido agregado.");
            return;
        }

        selectedProviders.push(id);

        const tableBody = document.querySelector("#providerTable tbody");
        const fila = document.createElement("tr");
        fila.dataset.id = id;

        fila.innerHTML = `
            <td>${nombre}</td>
            <td>
                <button class="btn btn-danger btn-sm btn-remove-provider">
                    <i class="fas fa-trash-alt"></i> Eliminar
                </button>
            </td>
        `;

        fila.querySelector(".btn-remove-provider").addEventListener("click", function () {
            eliminarProveedor(id, fila);
        });

        tableBody.appendChild(fila);
    }

    // 🟢 Eliminar proveedor de la tabla
    function eliminarProveedor(id, fila) {
        selectedProviders = selectedProviders.filter(provID => provID !== id);
        fila.remove();
    }

    await cargarProveedores();
});
