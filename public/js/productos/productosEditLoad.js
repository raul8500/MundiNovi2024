let productosLoadEdit;
let productosKitTotalesEdit = []; // Array para almacenar los productos añadidos al carrito
let indexSugerenciaEdit = -1;

// Cargar los productos
function cargarProductosEdit() {
    fetch('/api/productos')
        .then(response => response.json())
        .then(data => {
            productosLoadEdit = data.products;
        })
        .catch(error => console.error('Error al cargar productos:', error));
}

// Inicializar carga de productos
cargarProductosEdit();

// Seleccionar un producto de la lista de sugerencias
function seleccionarProductoEdit(producto) {
    document.getElementById('productoEdit').value = producto.name;
    document.getElementById('sugerenciasEdit').innerHTML = ''; // Limpiar sugerencias después de seleccionar
    document.getElementById('productoEdit').focus(); // Regresar al input de búsqueda
    indexSugerenciaEdit = -1; // Reiniciar el índice de sugerencia
}

// Manejo del input de búsqueda de productos
document.getElementById('productoEdit').addEventListener('input', function () {
    const valorInput = this.value.toLowerCase();
    const contenedorSugerencias = document.getElementById('sugerenciasEdit');
    indexSugerenciaEdit = -1; // Restablecer el índice de la sugerencia

    if (valorInput === '') {
        contenedorSugerencias.innerHTML = ''; // Limpiar sugerencias si el input está vacío
        return; // Salir si el campo de búsqueda está vacío
    }

    if (!Array.isArray(productosLoadEdit)) {
        console.error('La variable "productosLoadEdit" no está definida o no es un array.');
        return;
    }

    const listaFiltrada = productosLoadEdit.filter(producto => {
        const nombre = typeof producto.name === 'string' ? producto.name.toLowerCase() : '';
        const clave = typeof producto.reference === 'string' ? producto.reference.toLowerCase() : '';

        return nombre.includes(valorInput) || clave.includes(valorInput);
    });

    contenedorSugerencias.innerHTML = '';

    listaFiltrada.forEach((producto, index) => {
        const elementoSugerencia = document.createElement('div');
        elementoSugerencia.classList.add('sugerencia');
        elementoSugerencia.textContent = `${producto.name} (${producto.reference})`;
        elementoSugerencia.dataset.index = index;
        elementoSugerencia.addEventListener('click', function () {
            seleccionarProductoEdit(producto);
            agregarProductoEdit(); // Asegúrate de que se llame a la función de agregar producto
        });
        contenedorSugerencias.appendChild(elementoSugerencia);
    });
});

// Manejo de teclas en el input de búsqueda
document.getElementById('productoEdit').addEventListener('keydown', function (event) {
    const sugerencias = document.querySelectorAll('#sugerenciasEdit .sugerencia');
    if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (indexSugerenciaEdit < sugerencias.length - 1) {
            indexSugerenciaEdit++;
            actualizarSugerenciasEdit();
        }
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (indexSugerenciaEdit > 0) {
            indexSugerenciaEdit--;
            actualizarSugerenciasEdit();
        }
    } else if (event.key === 'Enter') {
        event.preventDefault();
        if (indexSugerenciaEdit >= 0 && indexSugerenciaEdit < sugerencias.length) {
            const productoSeleccionado = productosLoadEdit.find(p => p.name === sugerencias[indexSugerenciaEdit].textContent.split(' (')[0]);
            if (productoSeleccionado) {
                seleccionarProductoEdit(productoSeleccionado);
                agregarProductoEdit(); // Asegúrate de que se llame a la función de agregar producto
            }
        }
    }
});

// Función para actualizar las sugerencias y el scroll
function actualizarSugerenciasEdit() {
    const sugerencias = document.querySelectorAll('#sugerenciasEdit .sugerencia');

    sugerencias.forEach((sugerencia, index) => {
        sugerencia.classList.toggle('seleccionado', index === indexSugerenciaEdit);
    });

    if (indexSugerenciaEdit >= 0 && indexSugerenciaEdit < sugerencias.length) {
        const contenedorSugerencias = document.getElementById('sugerenciasEdit');
        const elementoSeleccionado = sugerencias[indexSugerenciaEdit];
        
        contenedorSugerencias.scrollTop = elementoSeleccionado.offsetTop - contenedorSugerencias.clientHeight / 2 + elementoSeleccionado.clientHeight / 2;
    }
}

// Función para agregar el producto a la tabla y al array de productosKitTotalesEdit
function agregarProductoEdit() {
    const inputProducto = document.getElementById('productoEdit');
    const inputCantidad = document.getElementById('cantidadEdit');

    const productoSeleccionado = productosLoadEdit.find(p => p.name === inputProducto.value);
    const cantidad = parseInt(inputCantidad.value);

    if (!productoSeleccionado || cantidad <= 0) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, selecciona un producto válido y una cantidad mayor a 0.'
        });
        return;
    }

    // Verificar si el producto ya está en la tabla
    const filas = document.querySelectorAll('#productosEdit tr');
    let productoExistente = false;

    filas.forEach(fila => {
        const nombreProducto = fila.children[0].textContent;
        if (nombreProducto === productoSeleccionado.name) {
            // Producto ya está en la tabla, actualizar cantidad
            const cantidadActual = parseInt(fila.querySelector('.cantidad').value);
            const nuevaCantidad = cantidadActual + cantidad;
            fila.querySelector('.cantidad').value = nuevaCantidad;

            // Disparar el evento de 'input' para actualizar el precio y total
            const inputEvent = new Event('input', { bubbles: true });
            fila.querySelector('.cantidad').dispatchEvent(inputEvent);

            // Actualizar el producto en el array productosKitTotalesEdit
            const productoIndex = productosKitTotalesEdit.findIndex(p => p.name === productoSeleccionado.name);
            if (productoIndex !== -1) {
                productosKitTotalesEdit[productoIndex].cantidad = nuevaCantidad;
                productosKitTotalesEdit[productoIndex].total = nuevaCantidad * parseFloat(fila.querySelector('.precio').value);
            }

            productoExistente = true;
        }
    });

    // Si el producto no existe en la tabla, agregar una nueva fila
    if (!productoExistente) {
        // Seleccionar el precio basado en la cantidad
        let precio = parseFloat(productoSeleccionado.datosFinancieros.precio1); // Precio predeterminado para 1 artículo
        for (let i = 10; i >= 1; i--) {
            if (cantidad >= i) {
                precio = parseFloat(productoSeleccionado.datosFinancieros[`precio${i}`]) || precio;
                break;
            }
        }

        const total = cantidad * precio;

        const nuevaFila = document.createElement('tr');
        nuevaFila.innerHTML = `
            <td>${productoSeleccionado.name}</td>
            <td><input type="number" class="form-control precio" value="${precio.toFixed(2)}" step="0.01"></td>
            <td><input type="number" class="form-control cantidad" value="${cantidad}" step="1"></td>
            <td class="total">$${total.toFixed(2)}</td>
            <td><button class="btn btn-warning btn-sm eliminarProductoEdit">Eliminar</button></td>
        `;
        document.getElementById('productosEdit').appendChild(nuevaFila);

        // Añadir el producto al array productosKitTotalesEdit
        productosKitTotalesEdit.push({
            name: productoSeleccionado.name,
            clave: productoSeleccionado.clave,
            cantidad: cantidad,
            precio: precio,
            total: total
        });
    }

    // Limpiar el input de búsqueda y la cantidad
    inputProducto.value = '';
    inputCantidad.value = '';
    inputCantidad.focus(); // Regresar al input de búsqueda
}

// Manejo de cambios en precios y cantidades
document.getElementById('productosEdit').addEventListener('input', (event) => {
    if (event.target.classList.contains('cantidad') || event.target.classList.contains('precio')) {
        const fila = event.target.closest('tr');
        const cantidad = parseInt(fila.querySelector('.cantidad').value);
        const precioInput = fila.querySelector('.precio');
        let precio = parseFloat(precioInput.value);

        const productoNombre = fila.children[0].textContent;
        const producto = productosLoadEdit.find(p => p.name === productoNombre);

        if (producto) {
            if (event.target.classList.contains('cantidad')) {
                if (cantidad >= 10) {
                    precio = parseFloat(producto.datosFinancieros.precio10) || precio;
                } else if (cantidad >= 5) {
                    precio = parseFloat(producto.datosFinancieros.precio5) || precio;
                } else if (cantidad >= 1) {
                    precio = parseFloat(producto.datosFinancieros.precio1) || precio;
                }
                precioInput.value = precio.toFixed(2);
            }
        }

        const total = cantidad * precio;
        fila.querySelector('.total').textContent = `$${total.toFixed(2)}`;

        // Actualizar el producto en el array productosKitTotalesEdit
        const productoIndex = productosKitTotalesEdit.findIndex(p => p.name === productoNombre);
        if (productoIndex !== -1) {
            productosKitTotalesEdit[productoIndex].cantidad = cantidad;
            productosKitTotalesEdit[productoIndex].precio = precio;
            productosKitTotalesEdit[productoIndex].total = total;
        }
    }
});

// Manejo del botón de eliminar producto
document.getElementById('productosEdit').addEventListener('click', (event) => {
    if (event.target.classList.contains('eliminarProductoEdit')) {
        const fila = event.target.closest('tr');
        const nombreProducto = fila.children[0].textContent;

        // Eliminar el producto del array productosKitTotalesEdit
        productosKitTotalesEdit = productosKitTotalesEdit.filter(p => p.name !== nombreProducto);

        // Eliminar la fila de la tabla
        fila.remove();
    }
});
