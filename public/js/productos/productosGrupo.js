let productosGrupo = [];  // Lista de todos los productos grupo
let productosGrupoSeleccionados = []; // Lista de productos seleccionados para la tabla grupo
let productoGrupoIndex = -1;  // Índice para la navegación de recomendaciones

// Cargar todos los productos al inicio
function cargarProductosGrupo() {
    fetch('/api/productos')
        .then(response => response.json())
        .then(data => {
            productosGrupo = data.products; // Almacenar productos para búsquedas
        })
        .catch(error => console.error('Error al cargar productos grupo:', error));
}

cargarProductosGrupo();  // Llamar al cargar la página

// Buscar productos según lo que el usuario escriba en el input
document.getElementById('productsGroupSearch').addEventListener('input', function() {
    const query = this.value.toLowerCase().trim();

    // Solo mostrar sugerencias si hay algo en el input
    if (query.length === 0) {
        ocultarSugerenciasGrupo();
        return;
    }

    const resultados = productosGrupo.filter(producto => producto.reference && producto.reference.toLowerCase().includes(query));
    mostrarSugerenciasGrupo(resultados);
});

// Mostrar las sugerencias debajo del input
function mostrarSugerenciasGrupo(resultados) {
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
            agregarProductoGrupoATabla(producto);
        });

        sugerenciasContainer.appendChild(li);
    });

    // Insertar sugerencias justo debajo del input
    const input = document.getElementById('productsGroupSearch');
    input.parentElement.appendChild(sugerenciasContainer);
}

// Función para ocultar las sugerencias
function ocultarSugerenciasGrupo() {
    const oldSuggestions = document.getElementById('suggestions');
    if (oldSuggestions) {
        oldSuggestions.remove();
    }
    productoGrupoIndex = -1;  // Reiniciar el índice
}

// Función para navegar entre sugerencias con el teclado
document.getElementById('productsGroupSearch').addEventListener('keydown', function(event) {
    const sugerencias = document.querySelectorAll('#suggestions li');
    if (sugerencias.length > 0) {
        if (event.key === 'ArrowDown') {
            productoGrupoIndex = (productoGrupoIndex + 1) % sugerencias.length;
            actualizarSugerenciaGrupoActiva(sugerencias);
            sugerencias[productoGrupoIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else if (event.key === 'ArrowUp') {
            productoGrupoIndex = (productoGrupoIndex - 1 + sugerencias.length) % sugerencias.length;
            actualizarSugerenciaGrupoActiva(sugerencias);
            sugerencias[productoGrupoIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else if (event.key === 'Enter') {
            event.preventDefault();
            if (productoGrupoIndex >= 0 && sugerencias.length > 0) {
                const productoId = sugerencias[productoGrupoIndex].getAttribute('data-id');
                const producto = productosGrupo.find(p => p._id == productoId);
                if (producto) {
                    agregarProductoGrupoATabla(producto);
                    ocultarSugerenciasGrupo();  // Eliminar las sugerencias
                }
            }
        }
    }
});

function actualizarSugerenciaGrupoActiva(sugerencias) {
    sugerencias.forEach((li, index) => {
        if (index === productoGrupoIndex) {
            li.classList.add('active');
        } else {
            li.classList.remove('active');
        }
    });
}

// Función para agregar producto a la tabla grupo
function agregarProductoGrupoATabla(producto) {
    // Asegurarse de que el producto tenga los datos correctos antes de agregar
    if (producto && producto.reference && producto._id) {
        // Evitar agregar el mismo producto dos veces
        if (!productosGrupoSeleccionados.some(p => p._id === producto._id)) {
            productosGrupoSeleccionados.push(producto);
            actualizarTablaGrupo();
        }

        // Limpiar el input después de agregar
        document.getElementById('productsGroupSearch').value = '';
        ocultarSugerenciasGrupo();
    } else {
        console.error('Producto inválido:', producto);
    }
}

// Función para eliminar producto de la tabla grupo
function eliminarProductoDeTablaGrupo(idProducto) {
    productosGrupoSeleccionados = productosGrupoSeleccionados.filter(p => p._id !== idProducto);
    actualizarTablaGrupo();
}

// Función para actualizar la tabla grupo
function actualizarTablaGrupo() {
    const tbody = document.querySelector('#providerTableGroup tbody');
    tbody.innerHTML = '';  // Limpiar la tabla

    productosGrupoSeleccionados.forEach(producto => {
        if (producto && producto.reference && producto._id) { // Validación adicional para evitar productos inválidos
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${producto.reference}</td>
                <td><button class="btn btn-danger btn-sm" onclick="eliminarProductoDeTablaGrupo('${producto._id}')">Eliminar</button></td>
            `;
            tbody.appendChild(tr);
        }
    });
}

// Agregar producto por botón "Agregar Producto"
document.getElementById('addProductGroupBtn').addEventListener('click', function() {
    const searchValue = document.getElementById('productsGroupSearch').value.toLowerCase().trim();
    const producto = productosGrupo.find(p => p.reference.toLowerCase() === searchValue);
    if (producto) {
        agregarProductoGrupoATabla(producto);
    }
});
