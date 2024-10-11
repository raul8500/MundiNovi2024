let productosKit = [];  // Lista de todos los productos kit
let productosKitSeleccionados = []; // Lista de productos seleccionados para la tabla kit
let productoKitIndex = -1; // Índice para la navegación de sugerencias

// Cargar todos los productos al inicio
function cargarProductosKit() {
    fetch('/api/productos')
        .then(response => response.json())
        .then(data => {
            productosKit = data.products; // Almacenar productos para búsquedas
        })
        .catch(error => console.error('Error al cargar productos kit:', error));
}

cargarProductosKit();  // Llamar al cargar la página

// Buscar productos según lo que el usuario escriba en el input
document.getElementById('productsKitSearch').addEventListener('input', function() {
    const query = this.value.toLowerCase().trim();

    // Solo mostrar sugerencias si hay algo en el input
    if (query.length === 0) {
        ocultarSugerenciasKit();
        return;
    }

    const resultados = productosKit.filter(producto => producto.reference && producto.reference.toLowerCase().includes(query));
    mostrarSugerenciasKit(resultados);
});

// Mostrar las sugerencias debajo del input
function mostrarSugerenciasKit(resultados) {
    const sugerenciasContainer = document.createElement('ul');
    sugerenciasContainer.id = 'suggestionsKit';
    sugerenciasContainer.className = 'list-group';
    sugerenciasContainer.style.maxHeight = '200px';  // Altura máxima del contenedor
    sugerenciasContainer.style.overflowY = 'auto';  // Agregar scroll si es necesario
    sugerenciasContainer.style.position = 'absolute';
    sugerenciasContainer.style.width = '60%';
    sugerenciasContainer.style.backgroundColor = 'white';
    sugerenciasContainer.style.zIndex = '1000';
    sugerenciasContainer.style.border = '1px solid #ccc';
    sugerenciasContainer.style.padding = '0';
    sugerenciasContainer.style.listStyleType = 'none';

    // Limpiar las sugerencias anteriores
    const oldSuggestions = document.getElementById('suggestionsKit');
    if (oldSuggestions) {
        oldSuggestions.remove();
    }

    if (resultados.length === 0) {
        return; // Si no hay resultados, no mostrar nada
    }

    resultados.forEach((producto, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.style.cursor = 'pointer';
        li.style.padding = '10px';
        li.textContent = producto.reference;
        li.setAttribute('data-id', producto._id);

        li.addEventListener('click', function() {
            agregarProductoKitATabla(producto);
        });

        sugerenciasContainer.appendChild(li);
    });

    // Asegúrate de que las sugerencias se inserten justo debajo del input
    const inputContainer = document.getElementById('productsKitSearch').parentElement;
    inputContainer.appendChild(sugerenciasContainer);
}

// Función para ocultar las sugerencias
function ocultarSugerenciasKit() {
    const oldSuggestions = document.getElementById('suggestionsKit');
    if (oldSuggestions) {
        oldSuggestions.remove();
    }
    productoKitIndex = -1;  // Reiniciar el índice
}

// Función para navegar entre sugerencias con el teclado
document.getElementById('productsKitSearch').addEventListener('keydown', function(event) {
    const sugerencias = document.querySelectorAll('#suggestionsKit li');
    if (sugerencias.length > 0) {
        if (event.key === 'ArrowDown') {
            productoKitIndex = (productoKitIndex + 1) % sugerencias.length;
            actualizarSugerenciaKitActiva(sugerencias);
            sugerencias[productoKitIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else if (event.key === 'ArrowUp') {
            productoKitIndex = (productoKitIndex - 1 + sugerencias.length) % sugerencias.length;
            actualizarSugerenciaKitActiva(sugerencias);
            sugerencias[productoKitIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else if (event.key === 'Enter') {
            event.preventDefault();
            if (productoKitIndex >= 0 && sugerencias.length > 0) {
                const productoId = sugerencias[productoKitIndex].getAttribute('data-id');
                const producto = productosKit.find(p => p._id == productoId);
                if (producto) {
                    agregarProductoKitATabla(producto);
                    ocultarSugerenciasKit();  // Eliminar las sugerencias
                }
            }
        }
    }
});

function actualizarSugerenciaKitActiva(sugerencias) {
    sugerencias.forEach((li, index) => {
        if (index === productoKitIndex) {
            li.style.backgroundColor = '#007bff';
            li.style.color = 'white';
        } else {
            li.style.backgroundColor = 'white';
            li.style.color = 'black';
        }
    });
}

// Función para agregar producto a la tabla kit
function agregarProductoKitATabla(producto) {
    const cantidad = parseInt(document.getElementById('productsKitAmount').value);
    const costoUnitario = producto.datosFinancieros.costo || 0;
    const costoTotal = cantidad * costoUnitario;

    // Asegurarse de que el producto tenga los datos correctos antes de agregar
    if (producto && producto.reference && producto._id) {
        // Evitar agregar el mismo producto dos veces
        if (!productosKitSeleccionados.some(p => p._id === producto._id)) {
            productosKitSeleccionados.push({
                ...producto,
                cantidad: cantidad,
                costoUnitario: costoUnitario,
                costoTotal: costoTotal,
                esVisible: true, // O falso según el caso
                esSumable: true  // O falso según el caso
            });
            actualizarTablaKit();
        }

        // Limpiar el input después de agregar
        document.getElementById('productsKitSearch').value = '';
        ocultarSugerenciasKit();
    } else {
        console.error('Producto inválido:', producto);
    }
}

// Función para eliminar producto de la tabla kit
function eliminarProductoDeTablaKit(idProducto) {
    productosKitSeleccionados = productosKitSeleccionados.filter(p => p._id !== idProducto);
    actualizarTablaKit();
}

// Función para actualizar la tabla kit
function actualizarTablaKit() {
    const tbody = document.querySelector('#providerTableKit tbody');
    tbody.innerHTML = '';  // Limpiar la tabla

    productosKitSeleccionados.forEach(producto => {
        if (producto && producto.reference && producto._id) { // Validación adicional para evitar productos inválidos
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${producto.reference}</td>
                <td>${producto.description || ''}</td>
                <td>${producto.cantidad}</td>
                <td><input type="checkbox" ${producto.esVisible ? 'checked' : ''}></td>
                <td><input type="checkbox" ${producto.esSumable ? 'checked' : ''}></td>
                <td>${producto.costoUnitario.toFixed(2)}</td>
                <td>${producto.costoTotal.toFixed(2)}</td>
                <td><button class="btn btn-danger btn-sm" onclick="eliminarProductoDeTablaKit('${producto._id}')">Eliminar</button></td>
            `;
            tbody.appendChild(tr);
        }
    });
}

// Agregar producto por botón "Agregar Producto"
document.getElementById('addProductKitBtn').addEventListener('click', function() {
    const searchValue = document.getElementById('productsKitSearch').value.toLowerCase().trim();
    const producto = productosKit.find(p => p.reference.toLowerCase() === searchValue);
    if (producto) {
        agregarProductoKitATabla(producto);
    }
});
