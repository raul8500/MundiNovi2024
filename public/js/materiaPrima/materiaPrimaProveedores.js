let proveedores = [];
let proveedoresSeleccionados = [];
let selectedIndex = -1;

document.addEventListener('DOMContentLoaded', () => {
    cargarProveedores();
    
    const input = document.getElementById('producto');
    const listaProveedor = document.getElementById('listaProveedor');
    
    input.addEventListener('input', () => {
        mostrarSugerencias(input.value);
    });
    
    input.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            navigateSuggestions(1);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            navigateSuggestions(-1);
        } else if (event.key === 'Enter') {
            event.preventDefault();
            seleccionarSugerencia();
        }
    });

    listaProveedor.addEventListener('click', (event) => {
        if (event.target.tagName === 'LI') {
            seleccionarProveedor(event.target.dataset.id);
        }
    });

    document.getElementById('agregarProveedor').addEventListener('click', () => {
        proveedoresSeleccionados.forEach(id => {
            const proveedor = proveedores.find(p => p._id === id);
            agregarProveedorTabla(proveedor);
        });
        proveedoresSeleccionados = [];
        input.value = '';
        listaProveedor.style.display = 'none';
    });
});

function cargarProveedores() {
    fetch('/api/proveedor')
        .then(response => response.json())
        .then(data => {
            proveedores = data;
        })
        .catch(error => console.error('Error al cargar proveedores:', error));
}

function mostrarSugerencias(query) {
    const lista = proveedores
        .filter(p => p.nombre.toLowerCase().includes(query.toLowerCase()))
        .map(p => `<li class="list-group-item" data-id="${p._id}">${p.nombre}</li>`)
        .join('');
    const listaProveedor = document.getElementById('listaProveedor');
    listaProveedor.innerHTML = lista;
    listaProveedor.style.display = lista ? 'block' : 'none';
    selectedIndex = -1;
}

function navigateSuggestions(direction) {
    const items = document.querySelectorAll('#listaProveedor li');
    if (items.length === 0) return;
    if (selectedIndex !== -1) {
        items[selectedIndex].classList.remove('active');
    }
    selectedIndex = (selectedIndex + direction + items.length) % items.length;
    items[selectedIndex].classList.add('active');
    items[selectedIndex].scrollIntoView({ block: 'nearest' });
}

function seleccionarSugerencia() {
    const items = document.querySelectorAll('#listaProveedor li');
    if (selectedIndex !== -1 && items[selectedIndex]) {
        seleccionarProveedor(items[selectedIndex].dataset.id);
    }
}

function seleccionarProveedor(id) {
    // Verificar si el proveedor ya está en el array de seleccionados
    if (!proveedoresSeleccionados.includes(id)) {
        proveedoresSeleccionados.push(id);
    }
    
    const proveedor = proveedores.find(p => p._id === id);

    // Verificar si el proveedor ya está en la tabla
    const tbody = document.getElementById('proveedores');
    const proveedorExistente = tbody.querySelector(`tr[data-id="${proveedor._id}"]`);
    
    if (!proveedorExistente) {
        agregarProveedorTabla(proveedor);
    }

    // Limpiar el input y ocultar la lista de sugerencias
    document.getElementById('producto').value = '';
    document.getElementById('listaProveedor').style.display = 'none';
}

function agregarProveedorTabla(proveedor) {
    const tbody = document.getElementById('proveedores');

    // Verificar si el proveedor ya está en la tabla para evitar duplicados
    const proveedorExistente = tbody.querySelector(`tr[data-id="${proveedor._id}"]`);
    if (proveedorExistente) return; // Salir si el proveedor ya está en la tabla

    const row = document.createElement('tr');
    row.dataset.id = proveedor._id;
    row.innerHTML = `
        <td>${proveedor.nombre}</td>
        <td>
            <button class="btn btn-danger btn-sm eliminar-proveedor">Eliminar</button>
        </td>
    `;
    tbody.appendChild(row);

    row.querySelector('.eliminar-proveedor').addEventListener('click', () => {
        eliminarProveedor(proveedor._id);
    });
}

function eliminarProveedor(id) {
    proveedoresSeleccionados = proveedoresSeleccionados.filter(pId => pId !== id);
    const row = document.querySelector(`#proveedores tr[data-id="${id}"]`);
    if (row) row.remove();
}
