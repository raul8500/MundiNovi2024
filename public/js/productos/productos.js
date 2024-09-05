
const esKitCheckbox = document.getElementById('esKit');
const esProductoCheckbox = document.getElementById('esGrupo');
const productoKitVisibility = document.getElementById('productoKitVisibility');
const productoGrupoVisibility = document.getElementById('productoGrupoVisibility');

const selectOptions = [
    { url: '/api/grupos', selectId: 'grupo' },
    { url: '/api/marca', selectId: 'marca' },
    { url: '/api/linea', selectId: 'linea' },
    { url: '/api/departamento', selectId: 'departamento' }
];


async function loadSelectOptions(options) {
    try {
        // Función para cargar opciones en un select específico
        const loadOptions = async (url, selectId) => {
            const select = document.getElementById(selectId);

            // Realiza una solicitud GET a la API
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error al obtener los datos de ${selectId}`);
            }

            // Convierte la respuesta en JSON
            const data = await response.json();

            // Limpia las opciones existentes
            select.innerHTML = '';

            // Agrega una opción predeterminada (opcional)
            const defaultOption = document.createElement('option');
            defaultOption.textContent = `Selecciona un ${selectId}`;
            defaultOption.value = '';
            select.appendChild(defaultOption);

            // Agrega una opción para cada ítem
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item._id; // Usa el id del item como valor
                option.textContent = item.nombre; // Usa el nombre del item como texto
                select.appendChild(option);
            });
        };

        // Recorre las opciones y carga cada select
        for (const option of options) {
            await loadOptions(option.url, option.selectId);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

loadSelectOptions(selectOptions);



function updatePillsVisibility() {
    if (esKitCheckbox.checked) {
        productoKitVisibility.style.visibility = 'visible';
    } else {
        productoKitVisibility.style.visibility = 'hidden';
    }

    if (esProductoCheckbox.checked) {
        productoGrupoVisibility.style.visibility = 'visible';
    } else {
        productoGrupoVisibility.style.visibility = 'hidden';
    }
}

esKitCheckbox.addEventListener('click', updatePillsVisibility);
esProductoCheckbox.addEventListener('click', updatePillsVisibility);

updatePillsVisibility();


let productosLoad;
let productosKitTotales = []; // Array para almacenar los productos añadidos al carrito
let indexSugerencia = -1;

// Cargar los productos
function cargarProductos() {
    fetch('/api/productos')
        .then(response => response.json())
        .then(data => {
            productosLoad = data.products;
        })
        .catch(error => console.error('Error al cargar productos:', error));
}

// Inicializar carga de productos
cargarProductos();

// Seleccionar un producto de la lista de sugerencias
function seleccionarProducto(producto) {
    document.getElementById('producto').value = producto.name;
    document.getElementById('sugerencias').innerHTML = ''; // Limpiar sugerencias después de seleccionar
    document.getElementById('producto').focus(); // Regresar al input de búsqueda
    indexSugerencia = -1; // Reiniciar el índice de sugerencia
}

// Manejo del input de búsqueda de productos
document.getElementById('producto').addEventListener('input', function () {
    const valorInput = this.value.toLowerCase();
    const contenedorSugerencias = document.getElementById('sugerencias');
    indexSugerencia = -1; // Restablecer el índice de la sugerencia

    if (valorInput === '') {
        contenedorSugerencias.innerHTML = ''; // Limpiar sugerencias si el input está vacío
        return; // Salir si el campo de búsqueda está vacío
    }

    if (!Array.isArray(productosLoad)) {
        console.error('La variable "productosLoad" no está definida o no es un array.');
        return;
    }

    const listaFiltrada = productosLoad.filter(producto => {
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
            seleccionarProducto(producto);
            agregarProducto(); // Asegúrate de que se llame a la función de agregar producto
        });
        contenedorSugerencias.appendChild(elementoSugerencia);
    });
});

// Manejo de teclas en el input de búsqueda
document.getElementById('producto').addEventListener('keydown', function (event) {
    const sugerencias = document.querySelectorAll('#sugerencias .sugerencia');
    if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (indexSugerencia < sugerencias.length - 1) {
            indexSugerencia++;
            actualizarSugerencias();
        }
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (indexSugerencia > 0) {
            indexSugerencia--;
            actualizarSugerencias();
        }
    } else if (event.key === 'Enter') {
        event.preventDefault();
        if (indexSugerencia >= 0 && indexSugerencia < sugerencias.length) {
            const productoSeleccionado = productosLoad.find(p => p.name === sugerencias[indexSugerencia].textContent.split(' (')[0]);
            if (productoSeleccionado) {
                seleccionarProducto(productoSeleccionado);
                agregarProducto(); // Asegúrate de que se llame a la función de agregar producto
            }
        }
    }
});

// Función para actualizar las sugerencias y el scroll
function actualizarSugerencias() {
    const sugerencias = document.querySelectorAll('#sugerencias .sugerencia');

    sugerencias.forEach((sugerencia, index) => {
        sugerencia.classList.toggle('seleccionado', index === indexSugerencia);
    });

    if (indexSugerencia >= 0 && indexSugerencia < sugerencias.length) {
        const contenedorSugerencias = document.getElementById('sugerencias');
        const elementoSeleccionado = sugerencias[indexSugerencia];
        
        contenedorSugerencias.scrollTop = elementoSeleccionado.offsetTop - contenedorSugerencias.clientHeight / 2 + elementoSeleccionado.clientHeight / 2;
    }
}

// Función para agregar el producto a la tabla y al array de productosKitTotales
function agregarProducto() {
    const inputProducto = document.getElementById('producto');
    const inputCantidad = document.getElementById('cantidad');

    const productoSeleccionado = productosLoad.find(p => p.name === inputProducto.value);
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
    const filas = document.querySelectorAll('#productos tr');
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

            // Actualizar el producto en el array productosKitTotales
            const productoIndex = productosKitTotales.findIndex(p => p.name === productoSeleccionado.name);
            if (productoIndex !== -1) {
                productosKitTotales[productoIndex].cantidad = nuevaCantidad;
                productosKitTotales[productoIndex].total = nuevaCantidad * parseFloat(fila.querySelector('.precio').value);
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
            <td><button class="btn btn-warning btn-sm eliminarProducto">Eliminar</button></td>
        `;
        document.getElementById('productos').appendChild(nuevaFila);

        // Añadir el producto al array productosKitTotales
        productosKitTotales.push({
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
document.getElementById('productos').addEventListener('input', (event) => {
    if (event.target.classList.contains('cantidad') || event.target.classList.contains('precio')) {
        const fila = event.target.closest('tr');
        const cantidad = parseInt(fila.querySelector('.cantidad').value);
        const precioInput = fila.querySelector('.precio');
        let precio = parseFloat(precioInput.value);

        const productoNombre = fila.children[0].textContent;
        const producto = productosLoad.find(p => p.name === productoNombre);

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

        // Actualizar el producto en el array productosKitTotales
        const productoIndex = productosKitTotales.findIndex(p => p.name === productoNombre);
        if (productoIndex !== -1) {
            productosKitTotales[productoIndex].cantidad = cantidad;
            productosKitTotales[productoIndex].precio = precio;
            productosKitTotales[productoIndex].total = total;
        }

        actualizarTotales();
    }
});

// Manejo de eliminación de productos
document.getElementById('productos').addEventListener('click', (event) => {
    if (event.target.classList.contains('eliminarProducto')) {
        const fila = event.target.closest('tr');
        const productoNombre = fila.children[0].textContent;

        // Eliminar el producto de la tabla y del array productosKitTotales
        fila.remove();
        productosKitTotales = productosKitTotales.filter(p => p.name !== productoNombre);

        // Actualizar los totales después de eliminar
        actualizarTotales();
    }
});

// Actualizar el total de todos los productos
function actualizarTotales() {
    const filas = document.querySelectorAll('#productos tr');
    let total = 0;

    filas.forEach(fila => {
        const totalFila = parseFloat(fila.querySelector('.total').textContent.replace('$', '')) || 0;
        total += totalFila;
    });

}
