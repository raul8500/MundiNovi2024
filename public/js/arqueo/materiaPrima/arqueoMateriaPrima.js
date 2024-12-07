const productoInput = document.getElementById('productoInput');
const productosSugerencias = document.getElementById('productosSugerencias');
const tablaProductos = document.getElementById('tablaProductos').querySelector('tbody');

// Variable para almacenar todas las materias primas
let todasLasMateriasPrimas = [];
let indiceSeleccionado = -1; // Índice para las flechas de navegación

// Función para cargar todas las materias primas
async function cargarMateriasPrimas() {
    try {
        const response = await fetch('/api/materiasPrimas');
        if (!response.ok) throw new Error('Error al cargar las materias primas');

        const data = await response.json();
        if (!Array.isArray(data)) {
            throw new Error('La respuesta del servidor no contiene un arreglo de materias primas');
        }

        todasLasMateriasPrimas = data; // Asignar materias primas a la variable global
    } catch (error) {
        console.error('Error al cargar las materias primas:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar las materias primas. Intenta nuevamente.',
        });
    }
}

// Función para filtrar materias primas según el query
function filtrarMateriasPrimas(query) {
    if (!Array.isArray(todasLasMateriasPrimas)) return [];
    return todasLasMateriasPrimas.filter(
        (materiaPrima) =>
            materiaPrima.clave.toLowerCase().includes(query.toLowerCase()) ||
            (materiaPrima.nombre && materiaPrima.nombre.toLowerCase().includes(query.toLowerCase()))
    );
}

// Función para mostrar sugerencias
function mostrarSugerencias(materiasPrimas) {
    productosSugerencias.innerHTML = '';
    materiasPrimas.forEach((materiaPrima, index) => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = `list-group-item list-group-item-action ${indiceSeleccionado === index ? 'active' : ''}`;
        item.textContent = `${materiaPrima.clave} - ${materiaPrima.nombre}`;
        item.dataset.clave = materiaPrima.clave;
        item.dataset.nombre = materiaPrima.nombre;

        item.addEventListener('click', () => {
            agregarMateriaPrimaATabla(materiaPrima);
            productosSugerencias.innerHTML = ''; // Limpiar sugerencias
            productoInput.value = ''; // Limpiar el input
        });

        productosSugerencias.appendChild(item);
    });
}

// Función para agregar una materia prima a la tabla
function agregarMateriaPrimaATabla(materiaPrima) {
    const filaExistente = Array.from(tablaProductos.children).find(
        (row) => row.dataset.clave === materiaPrima.clave
    );

    if (filaExistente) {
        Swal.fire({
            icon: 'warning',
            title: 'Materia prima ya agregada',
            text: `La materia prima ${materiaPrima.nombre} ya está en la lista.`,
        });
        return;
    }

    const fila = document.createElement('tr');
    fila.dataset.clave = materiaPrima.clave;
    fila.innerHTML = `
        <td>${materiaPrima.clave}</td>
        <td>${materiaPrima.nombre}</td>
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

// Evento para buscar materias primas mientras se escribe
productoInput.addEventListener('input', () => {
    const query = productoInput.value.trim();
    if (query.length > 2) {
        const materiasPrimasFiltradas = filtrarMateriasPrimas(query);
        indiceSeleccionado = -1; // Reiniciar selección al escribir
        mostrarSugerencias(materiasPrimasFiltradas);
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
            clave: item.dataset.clave,
            nombre: item.dataset.nombre,
        })));
    } else if (e.key === 'ArrowUp') {
        // Mover hacia arriba
        e.preventDefault();
        indiceSeleccionado = (indiceSeleccionado - 1 + items.length) % items.length;
        mostrarSugerencias(Array.from(items).map((item) => ({
            clave: item.dataset.clave,
            nombre: item.dataset.nombre,
        })));
    } else if (e.key === 'Enter') {
        // Seleccionar materia prima
        e.preventDefault();
        if (indiceSeleccionado >= 0) {
            const materiaPrimaSeleccionada = {
                clave: items[indiceSeleccionado].dataset.clave,
                nombre: items[indiceSeleccionado].dataset.nombre,
            };
            agregarMateriaPrimaATabla(materiaPrimaSeleccionada);
            productosSugerencias.innerHTML = ''; // Limpiar sugerencias
            productoInput.value = ''; // Limpiar el input
        }
    }
});

// Cargar todas las materias primas al cargar la página
cargarMateriasPrimas();


document.getElementById('enviarArqueo').addEventListener('click', async () => {

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

        const clave = referenciaElem.textContent.trim();
        const descripcion = descripcionElem.textContent.trim();
        const existenciaFisica = parseInt(inputExistencia.value.trim(), 10);

        return {
            clave,
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
        sucursal: '66e1b4986dca15c1b8653494',
        encargado: infoUser._id,
        productos,
        tipo: 'Materia Prima'
    };

    console.log(payload)

    try {
        const response = await fetch('/api/inventario/materiaprima', {
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
