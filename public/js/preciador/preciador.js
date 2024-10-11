let idSucursalProductosCambios = '';
let todosLosProductos = []; // Variable para almacenar todos los productos para la búsqueda
let selectedIndex = -1; // Índice para manejar la navegación por los resultados

// Verificar el token y obtener los productos desde el backend
verificarTokenYMostrar();

function verificarTokenYMostrar() {
    fetch(verifyToken)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            idSucursalProductosCambios = data.sucursalId;
            mostrarInfoProductos(idSucursalProductosCambios); // Llamar a la función para mostrar productos
            cargarTodosLosProductos();  // Cargar todos los productos para la búsqueda
        })
        .catch(error => console.log(error));
}

function mostrarInfoProductos(idSucursalProductosCambios) {
    fetch('/api/preciador/' + idSucursalProductosCambios)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const productos = data.productos; // Asegúrate de que la estructura devuelva 'productos'
            renderizarProductos(productos); // Pasar los productos al renderizador
        })
        .catch(error => console.log(error));
}

// Función para renderizar los productos en cards más pequeñas y con el color warning (naranja)
function renderizarProductos(productos) {
    const productosLista = document.getElementById('productos-lista');
    productosLista.innerHTML = ''; // Limpiar contenido previo

    if (!productos.length) {
        productosLista.innerHTML = '<p>No hay productos que hayan cambiado de precio.</p>';
        return;
    }

    productos.forEach(producto => {
        const card = `
            <div class="col-6 col-sm-4 col-md-2 mb-1">
                <div class="card bg-warning text-center text-dark" style="padding: 5px;">
                    <div class="card-body p-1">
                        <h6 class="card-title mb-0" style="font-size: 0.85rem;">${producto.reference}</h6>
                    </div>
                </div>
            </div>
        `;
        productosLista.innerHTML += card;
    });
}

// Cargar todos los productos para la búsqueda
function cargarTodosLosProductos() {
    fetch('/api/productos') // Ajusta la ruta según sea necesario
        .then(response => response.json())
        .then(data => {
            todosLosProductos = data.products;  // Ajustar si tu JSON contiene otra estructura
            inicializarFuse();  // Inicializar Fuse después de cargar los productos
        })
        .catch(error => console.error('Error al cargar productos:', error));
}

// Inicializar Fuse.js para la búsqueda
function inicializarFuse() {
    const options = {
        keys: ['reference']  // Ajusta según la estructura de tu JSON de productos
    };

    const fuse = new Fuse(todosLosProductos, options);
    const searchInput = document.getElementById('productoSearch');
    const suggestionsDiv = document.getElementById('suggestions');

    // Evento de búsqueda al escribir en el input
    searchInput.addEventListener('input', function () {
        const query = searchInput.value;
        const results = fuse.search(query);

        // Limpiar sugerencias anteriores
        suggestionsDiv.innerHTML = '';
        selectedIndex = -1;

        // Mostrar sugerencias
        if (query && results.length > 0) {
            results.forEach(result => {
                const item = result.item;
                const div = document.createElement('div');
                div.classList.add('suggestion-item');
                div.textContent = `${item.reference}`;  // Ajusta según los datos que estás mostrando
                div.addEventListener('click', () => seleccionarProducto(item));
                suggestionsDiv.appendChild(div);
            });
        }
    });

    // Manejo de navegación con teclado
    searchInput.addEventListener('keydown', function (e) {
        const suggestionItems = document.querySelectorAll('.suggestion-item');

        // Navegar hacia abajo con ArrowDown
        if (e.key === 'ArrowDown') {
            if (selectedIndex < suggestionItems.length - 1) {
                selectedIndex++;
                updateSelection(suggestionItems);
            }
        }

        // Navegar hacia arriba con ArrowUp
        if (e.key === 'ArrowUp') {
            if (selectedIndex > 0) {
                selectedIndex--;
                updateSelection(suggestionItems);
            }
        }

        // Seleccionar con Enter
        if (e.key === 'Enter') {
            if (selectedIndex >= 0 && suggestionItems[selectedIndex]) {
                suggestionItems[selectedIndex].click();
            }
        }
    });

    // Función para actualizar la selección visible
    function updateSelection(items) {
        // Quitar la selección anterior
        items.forEach((item, index) => {
            item.classList.remove('selected');
        });

        // Aplicar selección actual
        if (items[selectedIndex]) {
            items[selectedIndex].classList.add('selected');

            // Asegurar que el ítem seleccionado sea visible en el scroll
            items[selectedIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    }

    // Función para añadir el producto seleccionado al input
    function seleccionarProducto(item) {
        document.getElementById('productoSearch').value = item.reference;
        suggestionsDiv.innerHTML = ''; // Limpiar las sugerencias después de seleccionar
    }
}

// Función para añadir el producto y cantidad a la tabla
document.getElementById('agregarBtn').addEventListener('click', () => {
    const nombreProducto = document.getElementById('productoSearch').value;
    const cantidadImpresiones = document.getElementById('cantidadImpresiones').value;

    if (nombreProducto && cantidadImpresiones) {
        const tablaProductos = document.getElementById('productosSeleccionados').getElementsByTagName('tbody')[0];
        
        // Buscar el _id del producto basado en el nombre
        const productoSeleccionado = todosLosProductos.find(p => p.reference === nombreProducto);

        if (!productoSeleccionado) {
            alert('Producto no encontrado.');
            return;
        }

        // Crear nueva fila
        const row = tablaProductos.insertRow();
        row.setAttribute('data-id', productoSeleccionado._id);  // Almacenar el _id en un atributo data-id
        
        // Crear celdas
        const cellNombre = row.insertCell(0);
        const cellCantidad = row.insertCell(1);
        const cellAcciones = row.insertCell(2);
        
        // Añadir contenido a las celdas
        cellNombre.textContent = nombreProducto;
        cellCantidad.textContent = cantidadImpresiones;
        
        // Botón de eliminar
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.classList.add('btn', 'btn-danger', 'btn-sm');
        deleteBtn.addEventListener('click', () => row.remove());
        cellAcciones.appendChild(deleteBtn);
        
        // Limpiar los inputs
        document.getElementById('productoSearch').value = '';
        document.getElementById('cantidadImpresiones').value = '';
    } else {
        alert('Por favor, completa todos los campos.');
    }
});

// Función para manejar el botón de imprimir
document.getElementById('imprimirTablaBtn').addEventListener('click', () => {
    const tablaProductos = document.getElementById('productosSeleccionados').getElementsByTagName('tbody')[0];
    const filas = tablaProductos.getElementsByTagName('tr');
    
    const productosParaImprimir = [];

    for (let i = 0; i < filas.length; i++) {
        const idProducto = filas[i].getAttribute('data-id');
        const cantidad = filas[i].getElementsByTagName('td')[1].textContent;

        productosParaImprimir.push({
            _id: idProducto,
            cantidad: cantidad
        });
    }

    console.log('Productos a imprimir:', productosParaImprimir);
    
});
