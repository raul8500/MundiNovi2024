let productosComplementarios = [];  // Lista de productos complementarios seleccionados

// Función para agregar el producto complementario
function agregarProductoComplementario(producto) {
    if (producto && producto.trim() !== '') {
        // Evitar agregar el mismo producto dos veces
        if (!productosComplementarios.includes(producto)) {
            productosComplementarios.push(producto);
            actualizarTablaComplementaria();
        }
        
        // Limpiar el input después de agregar
        document.getElementById('productsComplement').value = '';
    } else {
        console.error('Producto inválido:', producto);
    }
}

// Función para eliminar producto de la tabla complementaria
function eliminarProductoComplementario(producto) {
    productosComplementarios = productosComplementarios.filter(p => p !== producto);
    actualizarTablaComplementaria();
}

// Función para actualizar la tabla complementaria
function actualizarTablaComplementaria() {
    const tbody = document.querySelector('#providerTableComplementProducts tbody');
    tbody.innerHTML = '';  // Limpiar la tabla

    productosComplementarios.forEach(producto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${producto}</td>
            <td><button class="btn btn-danger btn-sm" onclick="eliminarProductoComplementario('${producto}')">Eliminar</button></td>
        `;
        tbody.appendChild(tr);
    });
}

// Agregar producto por botón "Agregar Producto"
document.getElementById('addProductComplementBtn').addEventListener('click', function(event) {
    event.preventDefault();  // Prevenir el comportamiento por defecto
    const searchValue = document.getElementById('productsComplement').value.trim();
    agregarProductoComplementario(searchValue);
});

// También permitir agregar productos al presionar "Enter"
document.getElementById('productsComplement').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();  // Prevenir el comportamiento por defecto
        const searchValue = this.value.trim();
        agregarProductoComplementario(searchValue);
    }
});
