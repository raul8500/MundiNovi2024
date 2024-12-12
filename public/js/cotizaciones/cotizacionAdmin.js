// Recuperar los clientes y manejarlos
const clientes = [];
const clientesSeleccionados = []; // Arreglo para guardar los clientes seleccionados

// Función para recuperar clientes desde la API
async function fetchClientes() {
    try {
        const response = await fetch('http://localhost:3000/api/clientes');
        if (!response.ok) {
            throw new Error('Error al recuperar los clientes');
        }
        const data = await response.json();
        clientes.push(...data); // Guardar los clientes en el arreglo global
    } catch (error) {
        console.error('Error:', error);
    }
}

// Llamar a la función para cargar los clientes al inicio
fetchClientes();

// Función para mostrar sugerencias
function mostrarSugerencias(inputValue) {
    const sugerenciasContainer = document.getElementById('sugerenciasContainer');
    sugerenciasContainer.innerHTML = ''; // Limpiar sugerencias previas

    if (inputValue.trim() === '') {
        return; // No mostrar sugerencias si el input está vacío
    }

    // Filtrar clientes por nombre o teléfono
    const resultados = clientes.filter(cliente => {
        const nombre = cliente.clientData.name.toLowerCase();
        const telefono = cliente.clientData.phonePrimary?.toLowerCase() || '';
        return nombre.includes(inputValue.toLowerCase()) || telefono.includes(inputValue.toLowerCase());
    });

    // Mostrar las sugerencias
    resultados.forEach(cliente => {
        const sugerencia = document.createElement('div');
        sugerencia.className = 'sugerencia';
        sugerencia.textContent = `${cliente.clientData.name} - ${cliente.clientData.phonePrimary || 'Sin teléfono'}`;
        sugerencia.addEventListener('click', () => seleccionarCliente(cliente));
        sugerenciasContainer.appendChild(sugerencia);
    });
}

// Función para manejar la selección de un cliente
function seleccionarCliente(cliente) {
    document.getElementById('nombreCliente').value = cliente.clientData.name || '';
    document.getElementById('telefonoCliente').value = cliente.clientData.phonePrimary || '';
    document.getElementById('correoCliente').value = cliente.clientData.email || '';

    document.getElementById('streetCliente').value = cliente.clientData.address.street || '';
    document.getElementById('exteriorNumberCliente').value = cliente.clientData.address.exteriorNumber || '';
    document.getElementById('interiorNumberCliente').value = cliente.clientData.address.interiorNumber || '';
    document.getElementById('colonyCliente').value = cliente.clientData.address.colony || '';
    document.getElementById('localityCliente').value = cliente.clientData.address.locality || '';
    document.getElementById('municipalityCliente').value = cliente.clientData.address.municipality || '';
    document.getElementById('zipCodeCliente').value = cliente.clientData.address.zipCode || '';
    document.getElementById('stateCliente').value = cliente.clientData.address.state || '';
    document.getElementById('countryCliente').value = cliente.clientData.address.country || '';

    // Agregar al cliente seleccionado al arreglo
    if (!clientesSeleccionados.some(c => c._id === cliente._id)) {
        clientesSeleccionados.push(cliente);
    }

    // Limpiar las sugerencias
    document.getElementById('sugerenciasContainer').innerHTML = '';
}

// Evento para capturar la entrada en el input
const inputBuscarCliente = document.getElementById('buscarCliente');
inputBuscarCliente.addEventListener('input', () => {
    mostrarSugerencias(inputBuscarCliente.value);
});

// Función para manejar el botón "Siguiente" y cambiar a la sección de productos
document.getElementById('btnSiguienteProductos').addEventListener('click', () => {
    const productosTab = document.getElementById('productos-tab');
    productosTab.disabled = false; // Habilitar la pestaña de productos
    productosTab.click(); // Cambiar a la pestaña de productos
});


//==========================================================

let productos = [];
let productosSeleccionados = [];
let indiceSeleccionado = -1; // Índice para la navegación con teclado

// Función para cargar productos desde el endpoint
async function cargarProductos() {
    try {
        const response = await fetch("/api/productos");
        const data = await response.json();
        if (data.products) {
            productos = data.products; // Acceder al array de productos
        } else {
            console.error("No se encontraron productos en la respuesta del servidor");
        }
    } catch (error) {
        console.error("Error al cargar los productos:", error);
    }
}

// Función para buscar productos
function buscarProducto(query) {
    const options = {
        keys: ["reference", "inventory.unit"], // Claves para buscar
        threshold: 0.4, // Nivel de coincidencia flexible
    };

    const fuse = new Fuse(productos, options);
    return fuse.search(query).map((result) => result.item);
}

// Manejo de input de búsqueda
document.getElementById("buscarProducto").addEventListener("input", (e) => {
    const query = e.target.value.trim();
    const sugerenciasContainer = document.getElementById("sugerenciasProducto");

    // Reiniciar el índice de selección
    indiceSeleccionado = -1;

    // Limpiar sugerencias anteriores
    sugerenciasContainer.innerHTML = "";

    if (query.length > 0) {
        const sugerencias = buscarProducto(query);

        sugerencias.forEach((producto, index) => {
            const item = document.createElement("button");
            item.className = "list-group-item list-group-item-action";
            const precio = producto.datosFinancieros?.precio1 
                ? producto.datosFinancieros.precio1.toFixed(2) 
                : "0.00";
            item.textContent = `${producto.reference} - ${producto.inventory.unit} (${precio})`;

            // Evento para seleccionar con clic
            item.addEventListener("click", () => {
                agregarProducto(producto._id);
                sugerenciasContainer.innerHTML = ""; // Limpiar sugerencias
                document.getElementById("buscarProducto").value = ""; // Limpiar input
            });

            // Añadir al contenedor
            sugerenciasContainer.appendChild(item);
        });
    }
});

// Manejo de teclas para navegación y selección
document.getElementById("buscarProducto").addEventListener("keydown", (e) => {
    const sugerenciasContainer = document.getElementById("sugerenciasProducto");
    const items = sugerenciasContainer.querySelectorAll(".list-group-item");

    if (e.key === "ArrowDown") {
        e.preventDefault();
        if (indiceSeleccionado < items.length - 1) {
            indiceSeleccionado++;
        }
        actualizarSeleccion(items);
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (indiceSeleccionado > 0) {
            indiceSeleccionado--;
        }
        actualizarSeleccion(items);
    } else if (e.key === "Enter") {
        e.preventDefault();
        if (indiceSeleccionado >= 0 && indiceSeleccionado < items.length) {
            items[indiceSeleccionado].click();
        }
    }
});

// Actualizar la selección visual en las sugerencias
function actualizarSeleccion(items) {
    items.forEach((item, index) => {
        if (index === indiceSeleccionado) {
            item.classList.add("active");
            item.scrollIntoView({ block: "nearest" });
        } else {
            item.classList.remove("active");
        }
    });
}

// Agregar producto a la tabla
function agregarProducto(id) {
    const producto = productos.find((p) => p._id === id);
    if (producto) {
        const existente = productosSeleccionados.find((p) => p._id === id);
        if (existente) {
            existente.cantidad++;
            existente.precio = obtenerPrecioPorCantidad(producto.datosFinancieros, existente.cantidad);
            existente.total = existente.cantidad * existente.precio;
        } else {
            const precio = obtenerPrecioPorCantidad(producto.datosFinancieros, 1);
            productosSeleccionados.push({
                ...producto,
                cantidad: 1,
                precio: precio,
                total: precio,
            });
        }
        actualizarTabla();
        actualizarResumen();
    }
}

// Actualizar cantidad de producto
function actualizarCantidad(id, cantidad) {
    const producto = productosSeleccionados.find((p) => p._id === id);
    const originalProducto = productos.find((p) => p._id === id); // Producto completo con datosFinancieros
    if (producto && originalProducto) {
        cantidad = parseInt(cantidad, 10);
        if (!isNaN(cantidad) && cantidad > 0) {
            producto.cantidad = cantidad;
            producto.precio = obtenerPrecioPorCantidad(originalProducto.datosFinancieros, cantidad);
            producto.total = producto.cantidad * producto.precio;
            actualizarTabla();
            actualizarResumen();
        }
    }
}


// Actualizar la tabla
function actualizarTabla() {
    const tbody = document.getElementById("tablaProductos");
    tbody.innerHTML = productosSeleccionados
        .map(
            (p) => {
                const descripcionRangos = construirDescripcionRangos(p.datosFinancieros);
                return `
            <tr>
                <td>${p.reference}</td>
                <td>
                    <input style="width: 75px" type="number" value="${p.cantidad}" min="1" onchange="actualizarCantidad('${p._id}', this.value)" />
                </td>
                <td>
                    <input style="width: 75px" type="number" value="${p.precio.toFixed(2)}" step="0.01" onchange="actualizarPrecio('${p._id}', this.value)" />
                </td>
                <td>${p.total.toFixed(2)}</td>
                <td>${descripcionRangos}</td>
                <td><button class="btn btn-danger btn-sm" onclick="eliminarProducto('${p._id}')">Eliminar</button></td>
            </tr>
        `;
            }
        )
        .join("");
}


// Eliminar producto de la tabla
function eliminarProducto(id) {
    productosSeleccionados = productosSeleccionados.filter((p) => p._id !== id);
    actualizarTabla();
    actualizarResumen();
}

// Actualizar resumen
function actualizarResumen() {
    const total = productosSeleccionados.reduce((acc, p) => acc + p.total, 0);

    document.getElementById("subtotalCotizacion").textContent = `$${total.toFixed(2)}`;
    document.getElementById("totalCotizacion").textContent = `$${total.toFixed(2)}`;
}

function obtenerPrecioPorCantidad(datosFinancieros, cantidad) {
    for (let i = 1; i <= 10; i++) {
        const rangoInicial = datosFinancieros[`rangoInicial${i}`];
        const rangoFinal = datosFinancieros[`rangoFinal${i}`];
        const precio = datosFinancieros[`precio${i}`];

        if (cantidad >= rangoInicial && cantidad <= rangoFinal) {
            return precio; // Retornar el precio correspondiente al rango
        }
    }
    return datosFinancieros.precio1 || 0; // Precio por defecto si no entra en ningún rango
}

function construirDescripcionRangos(datosFinancieros) {
    let descripcion = "";
    let ultimoPrecioValido = null; // Almacena el último precio válido
    let lineaActual = ""; // Controla la línea actual

    for (let i = 1; i <= 4; i++) {
        const rangoInicial = datosFinancieros[`rangoInicial${i}`];
        const rangoFinal = datosFinancieros[`rangoFinal${i}`];
        const precio = datosFinancieros[`precio${i}`];

        // Si el precio es válido, lo almacenamos como último precio
        if (precio !== undefined && precio !== null) {
            ultimoPrecioValido = precio;
        }

        // Usamos el último precio válido si el actual es nulo
        if (rangoInicial !== undefined && rangoFinal !== undefined) {
            lineaActual += `Más de ${rangoInicial} = ${ultimoPrecioValido || 0} | `;
        }

        // Dividir en dos líneas después de cada dos rangos
        if (i % 2 === 0 || i === 4) {
            descripcion += `<span style="font-size: smaller;">${lineaActual.trimEnd().replace(/\|$/, "")}</span><br>`;
            lineaActual = ""; // Reiniciar para la siguiente línea
        }
    }

    return descripcion || "<span style='font-size: smaller;'>Sin rangos disponibles</span>";
}

function actualizarPrecio(id, nuevoPrecio) {
    const producto = productosSeleccionados.find((p) => p._id === id);
    if (producto) {
        nuevoPrecio = parseFloat(nuevoPrecio);
        if (!isNaN(nuevoPrecio) && nuevoPrecio > 0) {
            producto.precio = nuevoPrecio;
            producto.total = producto.cantidad * producto.precio;
            actualizarTabla();
            actualizarResumen();
        }
    }
}




// Inicializar
cargarProductos();
