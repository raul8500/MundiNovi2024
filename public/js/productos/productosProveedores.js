let proveedores = [];
cargarProductos();

function cargarProductos() {
    fetch('/api/proveedor')
        .then(response => response.json())
        .then(data => {
            proveedores = data;
            console.log(proveedores);
            inicializarFuse();  // Inicializa Fuse después de cargar los datos
        })
        .catch(error => console.error('Error al cargar productos:', error));
}

function inicializarFuse() {
    const options2 = {
        keys: ['nombre']  // Ajusta según la estructura de tu JSON de proveedores
    };

    const fuse = new Fuse(proveedores, options2);
    const searchInput = document.getElementById('providerSearch');
    const suggestionsDiv = document.getElementById('suggestions');
    const selectedTable = document.getElementById('providerTable').getElementsByTagName('tbody')[0];

    let selectedIndex = -1; // Para navegar por los resultados

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
                div.textContent = `${item.nombre}`;  // Ajusta según los datos que estás mostrando
                div.addEventListener('click', () => addToTable(item));
                suggestionsDiv.appendChild(div);
            });
        }
    });

    // Evento para manejar navegación con teclado
    searchInput.addEventListener('keydown', function (e) {
        const suggestionItems = document.querySelectorAll('.suggestion-item');

        // Navegar hacia abajo
        if (e.key === 'ArrowDown') {
            if (selectedIndex < suggestionItems.length - 1) {
                selectedIndex++;
                updateSelection(suggestionItems);
            }
        }

        // Navegar hacia arriba
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

    // Función para añadir el proveedor seleccionado a la tabla
    function addToTable(item) {
        // Crear fila
        const row = selectedTable.insertRow();
        row.setAttribute('data-id', item._id);  // Almacenar el _id en un atributo data-id

        // Crear celdas para Nombre y Acciones
        const cell0 = row.insertCell(0);
        const cell1 = row.insertCell(1);

        cell0.textContent = item.nombre;

        // Botón para eliminar la fila
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.addEventListener('click', () => row.remove());
        cell1.appendChild(deleteBtn);

        // Limpiar las sugerencias e input después de seleccionar
        searchInput.value = '';
        suggestionsDiv.innerHTML = '';
    }
}
// Función para obtener los proveedores que están en la tabla
function obtenerProveedoresSeleccionados() {
    const filasProveedores = document.querySelectorAll('#providerTable tbody tr');
    const proveedoresSeleccionados = [];

    filasProveedores.forEach(fila => {
        const proveedorId = fila.getAttribute('data-id');  // Extrae el _id desde el atributo data-id
        if (proveedorId) {
            proveedoresSeleccionados.push(proveedorId);
        }
    });

    return proveedoresSeleccionados;
}
