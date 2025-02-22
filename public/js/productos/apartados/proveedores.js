document.addEventListener("DOMContentLoaded", async () => {
    let proveedores = []; // Lista de proveedores obtenidos de la API
    let proveedoresSeleccionados = []; // Lista de IDs de proveedores seleccionados

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

        // Filtrar proveedores cuyo nombre coincida con el texto ingresado
        const proveedoresFiltrados = proveedores.filter(p =>
            p.nombre.toLowerCase().includes(inputTexto)
        );

        // Mostrar sugerencias
        proveedoresFiltrados.forEach(proveedor => {
            const sugerencia = document.createElement("div");
            sugerencia.classList.add("suggestion-item");
            sugerencia.textContent = proveedor.nombre;
            sugerencia.dataset.id = proveedor._id;

            // Agregar evento para seleccionar proveedor al hacer clic
            sugerencia.addEventListener("click", function () {
                agregarProveedor(proveedor._id, proveedor.nombre);
                document.getElementById("providerSearch").value = "";
                sugerenciasDiv.innerHTML = ""; // Limpiar sugerencias
            });

            sugerenciasDiv.appendChild(sugerencia);
        });
    });

    // 🟢 Agregar proveedor a la tabla
    function agregarProveedor(id, nombre) {
        if (proveedoresSeleccionados.includes(id)) {
            alert("El proveedor ya ha sido agregado.");
            return;
        }

        proveedoresSeleccionados.push(id);

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

        // Agregar evento para eliminar proveedor
        fila.querySelector(".btn-remove-provider").addEventListener("click", function () {
            eliminarProveedor(id, fila);
        });

        tableBody.appendChild(fila);
    }

    // 🟢 Eliminar proveedor de la tabla
    function eliminarProveedor(id, fila) {
        proveedoresSeleccionados = proveedoresSeleccionados.filter(provID => provID !== id);
        fila.remove();
    }

    // Cargar proveedores al iniciar la página
    await cargarProveedores();
});
