document.addEventListener("DOMContentLoaded", async function () {
    const inputBusqueda = document.getElementById("busquedaProducto");
    const listaSugerencias = document.getElementById("listaSugerencias");
    const tablaResultados = document.getElementById("tablaResultados");

    let productos = [];
    let indiceSeleccionado = -1; // Para manejar la navegación con las teclas

    try {
        // Cargar todos los productos al inicio
        const response = await fetch("/api/productos");
        const data = await response.json();

        if (!Array.isArray(data.products)) {
            console.error("Respuesta inesperada de /api/productos:", data);
            return;
        }

        productos = data.products;
    } catch (error) {
        console.error("Error al obtener productos:", error);
    }

    // Mostrar sugerencias a medida que el usuario escribe
    inputBusqueda.addEventListener("input", function () {
        const query = inputBusqueda.value.trim().toLowerCase();
        listaSugerencias.innerHTML = "";
        indiceSeleccionado = -1; // Reiniciar índice al escribir

        if (query.length < 3) {
            return;
        }

        const productosFiltrados = productos.filter(producto =>
            producto.name.toLowerCase().includes(query) || 
            producto.reference.toLowerCase().includes(query)
        );

        productosFiltrados.slice(0, 5).forEach((producto, index) => {
            const item = document.createElement("li");
            item.textContent = `${producto.reference} - ${producto.name}`;
            item.dataset.id = producto._id;
            item.dataset.index = index;
            item.classList.add("sugerencia-item");
            listaSugerencias.appendChild(item);
        });
    });

    // Manejar clic en una sugerencia
    listaSugerencias.addEventListener("click", async function (event) {
        if (event.target.classList.contains("sugerencia-item")) {
            seleccionarSugerencia(event.target);
        }
    });

    // Manejar navegación con flechas y Enter en el input
    inputBusqueda.addEventListener("keydown", function (event) {
        const sugerencias = document.querySelectorAll(".sugerencia-item");

        if (event.key === "ArrowDown") {
            event.preventDefault();
            if (indiceSeleccionado < sugerencias.length - 1) {
                indiceSeleccionado++;
            }
            actualizarSeleccion(sugerencias);
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (indiceSeleccionado > 0) {
                indiceSeleccionado--;
            }
            actualizarSeleccion(sugerencias);
        } else if (event.key === "Enter") {
            event.preventDefault();
            if (indiceSeleccionado >= 0 && sugerencias[indiceSeleccionado]) {
                seleccionarSugerencia(sugerencias[indiceSeleccionado]);
            }
        }
    });

    // Función para resaltar la sugerencia seleccionada
    function actualizarSeleccion(sugerencias) {
        sugerencias.forEach(item => item.classList.remove("seleccionado"));
        if (sugerencias[indiceSeleccionado]) {
            sugerencias[indiceSeleccionado].classList.add("seleccionado");
            inputBusqueda.value = sugerencias[indiceSeleccionado].textContent; // Mostrar el nombre en el input
        }
    }

    // Función para seleccionar un producto y buscar sus existencias
    async function seleccionarSugerencia(item) {
        const productoId = item.dataset.id;
        inputBusqueda.value = item.textContent; // Poner el producto en el input
        listaSugerencias.innerHTML = ""; // Limpiar sugerencias
        await buscarExistencias(productoId);
    }

    // Función para buscar existencias del producto seleccionado
    async function buscarExistencias(productoId) {
        try {
            const resExistencias = await fetch(`/api/existencia/productos/${productoId}`);
            const data = await resExistencias.json();

            let html = "";
            if (data.sucursales.length > 0) {
                data.sucursales.forEach(sucursal => {
                    html += `
                        <tr>
                            <td>${data.reference}</td>
                            <td>${data.name}</td>
                            <td>${sucursal.sucursal}</td>
                            <td>${sucursal.existencia}</td>
                        </tr>
                    `;
                });
            } else {
                html = `
                    <tr>
                        <td>${data.reference}</td>
                        <td>${data.name}</td>
                        <td colspan="2" class="text-center">Sin registros</td>
                    </tr>
                `;
            }

            tablaResultados.innerHTML = html;
        } catch (error) {
            console.error("Error al obtener existencias:", error);
            tablaResultados.innerHTML = "<tr><td colspan='4' class='text-center text-danger'>Error al recuperar datos</td></tr>";
        }
    }
});
