const selectOptions = [
    { url: '/api/sucursal', selectId: 'sucursal' },
    {url: '/api/sucursal', selectId: 'sucursalSelect'}
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
            defaultOption.textContent = `Selecciona una sucursal`;
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



let productos = [];
let productoSeleccionado = null;
let elementoSeleccionado = null; // Para controlar el elemento actualmente seleccionado en la lista

// Cargar los productos
function cargarProductos() {
    fetch('/api/productos')
        .then(response => response.json())
        .then(data => {
            productos = data.products;
        })
        .catch(error => console.error('Error al cargar productos:', error));
}

cargarProductos();

const inputBusqueda = document.getElementById('busquedaProductosKardex');
const listaProductos = document.getElementById('productosLista');

if (inputBusqueda && listaProductos) {
    // Manejar la entrada del usuario
    inputBusqueda.addEventListener('input', () => {
        const searchText = inputBusqueda.value.toLowerCase();
        const productosFiltrados = productos.filter(producto => {
            const name = producto.name ? producto.name.toLowerCase() : '';
            const codigoBarras = producto.codigoBarras ? producto.codigoBarras : '';
            const reference = producto.reference ? producto.reference.toLowerCase() : '';

            return name.includes(searchText) || 
                   codigoBarras.includes(searchText) || 
                   reference.includes(searchText);
        });

        mostrarProductosEnLista(productosFiltrados);
    });

    function mostrarProductosEnLista(productos) {
        if (listaProductos) {
            listaProductos.innerHTML = '';

            productos.forEach((producto, index) => {
                const item = document.createElement('li');
                item.textContent = `${producto.name} (${producto.reference})`;
                item.dataset.id = producto._id; // Guarda el ID del producto en un atributo de datos
                item.tabIndex = 0; // Permite que el elemento sea enfocable con el teclado

                item.addEventListener('click', () => seleccionarProducto(producto._id));
                listaProductos.appendChild(item);

                // Si es el primer elemento, seleccionarlo por defecto
                if (index === 0) {
                    elementoSeleccionado = item;
                    item.classList.add('selected');
                }
            });

            // Mostrar la lista si hay productos, ocultarla si no
            listaProductos.style.display = productos.length > 0 ? 'block' : 'none';
        }
    }

    function seleccionarProducto(productoId) {
        productoSeleccionado = productos.find(p => p._id === productoId);

        if (productoSeleccionado) {
            console.log('Producto seleccionado:', productoSeleccionado);

            // Muestra el nombre del producto en el input
            inputBusqueda.value = `${productoSeleccionado.name} (${productoSeleccionado.reference})`;

            // Limpia la lista y oculta el scroll
            listaProductos.innerHTML = '';
            listaProductos.style.display = 'none';
            elementoSeleccionado = null;
        }
    }

    // Manejar la selección con Enter
    inputBusqueda.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            if (elementoSeleccionado) {
                seleccionarProducto(elementoSeleccionado.dataset.id);
            }
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            moverSeleccion('down');
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            moverSeleccion('up');
        }
    });

    function moverSeleccion(direccion) {
        if (direccion === 'down') {
            if (elementoSeleccionado) {
                const siguienteElemento = elementoSeleccionado.nextElementSibling;
                if (siguienteElemento) {
                    actualizarSeleccion(siguienteElemento);
                }
            } else {
                const primerElemento = listaProductos.querySelector('li');
                if (primerElemento) {
                    actualizarSeleccion(primerElemento);
                }
            }
        } else if (direccion === 'up') {
            if (elementoSeleccionado) {
                const elementoAnterior = elementoSeleccionado.previousElementSibling;
                if (elementoAnterior) {
                    actualizarSeleccion(elementoAnterior);
                }
            }
        }
    }

    function actualizarSeleccion(nuevoElemento) {
        if (elementoSeleccionado) {
            elementoSeleccionado.classList.remove('selected');
        }
        nuevoElemento.classList.add('selected');
        elementoSeleccionado = nuevoElemento;
        nuevoElemento.scrollIntoView({ block: 'nearest' }); // Asegura que el elemento seleccionado sea visible
    }

    // Ocultar la lista cuando el input se vacíe
    inputBusqueda.addEventListener('blur', () => {
        setTimeout(() => {
            listaProductos.style.display = 'none';
        }, 100); // Tiempo para permitir la selección del elemento antes de ocultar
    });

    // Mostrar la lista cuando el input recibe foco
    inputBusqueda.addEventListener('focus', () => {
        if (inputBusqueda.value.length > 0) {
            listaProductos.style.display = 'block';
        }
    });
}
