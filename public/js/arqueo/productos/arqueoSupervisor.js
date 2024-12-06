const selectOptions = [
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


const productoInput = document.getElementById('productoInput');
const productosSugerencias = document.getElementById('productosSugerencias');
const tablaProductos = document.getElementById('tablaProductos').querySelector('tbody');

// Variable para almacenar todos los productos
let todosLosProductos = [];
let indiceSeleccionado = -1; // Índice para las flechas de navegación

// Función para cargar todos los productos
async function cargarProductos() {
    try {
        const response = await fetch('/api/productos');
        if (!response.ok) throw new Error('Error al cargar los productos');

        const data = await response.json();
        if (!Array.isArray(data.products)) {
            throw new Error('La respuesta del servidor no contiene un arreglo de productos');
        }

        todosLosProductos = data.products; // Asignar productos a la variable global
    } catch (error) {
        console.error('Error al cargar los productos:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los productos. Intenta nuevamente.',
        });
    }
}

// Función para filtrar productos según el query
function filtrarProductos(query) {
    if (!Array.isArray(todosLosProductos)) return [];
    return todosLosProductos.filter(
        (producto) =>
            producto.reference.toLowerCase().includes(query.toLowerCase()) ||
            (producto.name && producto.name.toLowerCase().includes(query.toLowerCase()))
    );
}

// Función para mostrar sugerencias
function mostrarSugerencias(productos) {
    productosSugerencias.innerHTML = '';
    productos.forEach((producto, index) => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = `list-group-item list-group-item-action ${indiceSeleccionado === index ? 'active' : ''}`;
        item.textContent = `${producto.reference} - ${producto.name}`;
        item.dataset.reference = producto.reference;
        item.dataset.name = producto.name;

        item.addEventListener('click', () => {
            agregarProductoATabla(producto);
            productosSugerencias.innerHTML = ''; // Limpiar sugerencias
            productoInput.value = ''; // Limpiar el input
        });

        productosSugerencias.appendChild(item);
    });
}

// Función para agregar un producto a la tabla
function agregarProductoATabla(producto) {
    const filaExistente = Array.from(tablaProductos.children).find(
        (row) => row.dataset.reference === producto.reference
    );

    if (filaExistente) {
        Swal.fire({
            icon: 'warning',
            title: 'Producto ya agregado',
            text: `El producto ${producto.name} ya está en la lista.`,
        });
        return;
    }

    const fila = document.createElement('tr');
    fila.dataset.reference = producto.reference;
    fila.innerHTML = `
        <td>${producto.reference}</td>
        <td>${producto.name}</td>
        <td>
            <input type="number" class="form-control form-control-sm cantidad-fisica" placeholder="Cantidad física" min="0">
        </td>
        <td>
            <button type="button" class="btn btn-danger btn-sm btn-eliminar">
                <i class="fas fa-trash-alt"></i>
            </button>
        </td>
    `;

    // Evento para eliminar la fila
    fila.querySelector('.btn-eliminar').addEventListener('click', () => {
        fila.remove();
    });

    // Agregar fila a la tabla
    tablaProductos.appendChild(fila);

    // Hacer foco en el input de cantidad física
    const inputCantidad = fila.querySelector('.cantidad-fisica');
    inputCantidad.focus();

    // Volver al buscador tras ingresar cantidad y presionar Enter
    inputCantidad.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            productoInput.focus();
        }
    });
}

// Evento para buscar productos mientras se escribe
productoInput.addEventListener('input', () => {
    const query = productoInput.value.trim();
    if (query.length > 2) {
        const productosFiltrados = filtrarProductos(query);
        indiceSeleccionado = -1; // Reiniciar selección al escribir
        mostrarSugerencias(productosFiltrados);
    } else {
        productosSugerencias.innerHTML = '';
    }
});

// Manejar teclas para navegación y selección
productoInput.addEventListener('keydown', (e) => {
    const items = productosSugerencias.querySelectorAll('.list-group-item');

    if (items.length === 0) return;

    if (e.key === 'ArrowDown') {
        // Mover hacia abajo
        e.preventDefault();
        indiceSeleccionado = (indiceSeleccionado + 1) % items.length;
        mostrarSugerencias(Array.from(items).map((item) => ({
            reference: item.dataset.reference,
            name: item.dataset.name,
        })));
    } else if (e.key === 'ArrowUp') {
        // Mover hacia arriba
        e.preventDefault();
        indiceSeleccionado = (indiceSeleccionado - 1 + items.length) % items.length;
        mostrarSugerencias(Array.from(items).map((item) => ({
            reference: item.dataset.reference,
            name: item.dataset.name,
        })));
    } else if (e.key === 'Enter') {
        // Seleccionar producto
        e.preventDefault();
        if (indiceSeleccionado >= 0) {
            const productoSeleccionado = {
                reference: items[indiceSeleccionado].dataset.reference,
                name: items[indiceSeleccionado].dataset.name,
            };
            agregarProductoATabla(productoSeleccionado);
            productosSugerencias.innerHTML = ''; // Limpiar sugerencias
            productoInput.value = ''; // Limpiar el input
        }
    }
});

// Cargar todos los productos al cargar la página
cargarProductos();

document.getElementById('enviarArqueo').addEventListener('click', async () => {
    const sucursalId = document.getElementById('sucursalSelect').value;

    if (!sucursalId) {
        Swal.fire({
            icon: 'warning',
            title: 'Falta información',
            text: 'Por favor, selecciona una sucursal antes de enviar el arqueo.',
        });
        return;
    }

    const filas = Array.from(document.getElementById('tablaProductos').querySelectorAll('tr'));
    const productos = filas.map((fila) => {
        const referenciaElem = fila.querySelector('td:nth-child(1)');
        const descripcionElem = fila.querySelector('td:nth-child(2)');
        const inputExistencia = fila.querySelector('input.cantidad-fisica');

        // Valida que los elementos existan
        if (!referenciaElem || !descripcionElem || !inputExistencia) {
            console.warn('Fila inválida detectada:', fila);
            return null; // Ignorar filas inválidas
        }

        const referencia = referenciaElem.textContent.trim();
        const descripcion = descripcionElem.textContent.trim();
        const existenciaFisica = parseInt(inputExistencia.value.trim(), 10);

        return {
            referencia,
            descripcion,
            existenciaFisica: isNaN(existenciaFisica) ? 0 : existenciaFisica,
        };
    }).filter((producto) => producto !== null); // Eliminar filas inválidas

    // Validar que haya productos
    if (productos.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Sin productos',
            text: 'Por favor, agrega al menos un producto al arqueo.',
        });
        return;
    }

    const payload = {
        sucursal: sucursalId,
        encargado: infoUser._id, // Asume que tienes el ID del usuario en una variable `infoUser`
        productos,
    };

    try {
        const response = await fetch('/api/inventario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const error = await response.json();
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'No se pudo enviar el arqueo. Intenta nuevamente.',
            });
            return;
        }

        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'El arqueo fue enviado exitosamente.',
        });

        // Limpiar el formulario después de enviar
        document.getElementById('arqueoForm').reset();
        document.getElementById('tablaProductos').innerHTML = '';
    } catch (error) {
        console.error('Error al enviar el arqueo:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'No se pudo conectar con el servidor. Intenta nuevamente.',
        });
    }
});
