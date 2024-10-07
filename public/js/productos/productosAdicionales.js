let productos = [];  // Lista de todos los productos
let productosSeleccionados = []; // Lista de productos seleccionados para la tabla
let productoIndex = -1;  // Índice para la navegación de recomendaciones

// Cargar todos los productos al inicio
function cargarProductos() {
    fetch('/api/productos')
        .then(response => response.json())
        .then(data => {
            productos = data.products; // Almacenar productos para búsquedas
        })
        .catch(error => console.error('Error al cargar productos:', error));
}

cargarProductos();  // Llamar al cargar la página

// Buscar productos según lo que el usuario escriba en el input
document.getElementById('productsSearch').addEventListener('input', function() {
    const query = this.value.toLowerCase().trim();

    // Solo mostrar sugerencias si hay algo en el input
    if (query.length === 0) {
        ocultarSugerencias();
        return;
    }

    const resultados = productos.filter(producto => producto.reference && producto.reference.toLowerCase().includes(query));
    mostrarSugerencias(resultados);
});

// Mostrar las sugerencias debajo del input
function mostrarSugerencias(resultados) {
    const sugerenciasContainer = document.createElement('ul');
    sugerenciasContainer.id = 'suggestions';
    sugerenciasContainer.className = 'list-group';

    // Limpiar las sugerencias anteriores
    const oldSuggestions = document.getElementById('suggestions');
    if (oldSuggestions) {
        oldSuggestions.remove();
    }

    if (resultados.length === 0) {
        return; // Si no hay resultados, no mostrar nada
    }

    resultados.forEach((producto, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = producto.reference;
        li.setAttribute('data-id', producto._id);

        li.addEventListener('click', function() {
            agregarProductoAlaTabla(producto);
        });

        sugerenciasContainer.appendChild(li);
    });

    document.getElementById('search-product-form').appendChild(sugerenciasContainer);
}

// Función para ocultar las sugerencias
function ocultarSugerencias() {
    const oldSuggestions = document.getElementById('suggestions');
    if (oldSuggestions) {
        oldSuggestions.remove();
    }
    productoIndex = -1;  // Reiniciar el índice
}

// Función para navegar entre sugerencias con el teclado
document.getElementById('productsSearch').addEventListener('keydown', function(event) {
    const sugerencias = document.querySelectorAll('#suggestions li');
    if (sugerencias.length > 0) {
        if (event.key === 'ArrowDown') {
            productoIndex = (productoIndex + 1) % sugerencias.length;
            actualizarSugerenciaActiva(sugerencias);
            sugerencias[productoIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else if (event.key === 'ArrowUp') {
            productoIndex = (productoIndex - 1 + sugerencias.length) % sugerencias.length;
            actualizarSugerenciaActiva(sugerencias);
            sugerencias[productoIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else if (event.key === 'Enter') {
            event.preventDefault();
            if (productoIndex >= 0 && sugerencias.length > 0) {
                const productoId = sugerencias[productoIndex].getAttribute('data-id');
                const producto = productos.find(p => p._id == productoId);
                if (producto) {
                    agregarProductoAlaTabla(producto);
                    ocultarSugerencias();  // Eliminar las sugerencias
                }
            }
        }
    }
});

function actualizarSugerenciaActiva(sugerencias) {
    sugerencias.forEach((li, index) => {
        if (index === productoIndex) {
            li.classList.add('active');
        } else {
            li.classList.remove('active');
        }
    });
}

// Función para agregar producto a la tabla
function agregarProductoAlaTabla(producto) {
    // Asegurarse de que el producto tenga los datos correctos antes de agregar
    if (producto && producto.reference && producto._id) {
        // Evitar agregar el mismo producto dos veces
        if (!productosSeleccionados.some(p => p._id === producto._id)) {
            productosSeleccionados.push(producto);
            actualizarTabla();
        }

        // Limpiar el input después de agregar
        document.getElementById('productsSearch').value = '';
        ocultarSugerencias();
    } else {
        console.error('Producto inválido:', producto);
    }
}

// Función para eliminar producto de la tabla
function eliminarProductoDeTabla(idProducto) {
    productosSeleccionados = productosSeleccionados.filter(p => p._id !== idProducto);
    actualizarTabla();
}

// Función para actualizar la tabla
function actualizarTabla() {
    const tbody = document.querySelector('#providerTableProductAditional tbody');
    tbody.innerHTML = '';  // Limpiar la tabla

    productosSeleccionados.forEach(producto => {
        if (producto && producto.reference && producto._id) { // Validación adicional para evitar productos inválidos
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${producto.reference}</td>
                <td><button class="btn btn-danger btn-sm" onclick="eliminarProductoDeTabla('${producto._id}')">Eliminar</button></td>
            `;
            tbody.appendChild(tr);
        }
    });
}

// Agregar producto por botón "Agregar Producto"
document.getElementById('addProductBtn').addEventListener('click', function() {
    const searchValue = document.getElementById('productsSearch').value.toLowerCase().trim();
    const producto = productos.find(p => p.reference.toLowerCase() === searchValue);
    if (producto) {
        agregarProductoAlaTabla(producto);
    }
});
