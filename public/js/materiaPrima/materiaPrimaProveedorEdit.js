let proveedoresEdit = [];
let proveedoresSeleccionadosEdit = [];
let selectedIndexEdit = -1;

document.addEventListener('DOMContentLoaded', () => {
    cargarProveedoresEdit();
    
    const inputEdit = document.getElementById('proveedorEdit');
    const listaProveedorEdit = document.getElementById('listaProveedorEdit');
    
    inputEdit.addEventListener('input', () => {
        mostrarSugerenciasEdit(inputEdit.value);
    });
    
    inputEdit.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            navigateSuggestionsEdit(1);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            navigateSuggestionsEdit(-1);
        } else if (event.key === 'Enter') {
            event.preventDefault();
            seleccionarSugerenciaEdit();
        }
    });

    listaProveedorEdit.addEventListener('click', (event) => {
        if (event.target.tagName === 'LI') {
            seleccionarProveedorEdit(event.target.dataset.id);
        }
    });

    document.getElementById('editAgregarProveedor').addEventListener('click', () => {
        proveedoresSeleccionadosEdit.forEach(id => {
            const proveedor = proveedoresEdit.find(p => p._id === id);
            agregarProveedorTablaEdit(proveedor);
        });
        proveedoresSeleccionadosEdit = [];
        inputEdit.value = '';
        listaProveedorEdit.style.display = 'none';
    });
});

function cargarProveedoresEdit() {
    fetch('/api/proveedor')
        .then(response => response.json())
        .then(data => {
            proveedoresEdit = data;
        })
        .catch(error => console.error('Error al cargar proveedores:', error));
}

function mostrarSugerenciasEdit(query) {
    const lista = proveedoresEdit
        .filter(p => p.nombre.toLowerCase().includes(query.toLowerCase()))
        .map(p => `<li class="list-group-item" data-id="${p._id}">${p.nombre}</li>`)
        .join('');
    const listaProveedorEdit = document.getElementById('listaProveedorEdit');
    listaProveedorEdit.innerHTML = lista;
    listaProveedorEdit.style.display = lista ? 'block' : 'none';
    selectedIndexEdit = -1;
}

function navigateSuggestionsEdit(direction) {
    const items = document.querySelectorAll('#listaProveedorEdit li');
    if (items.length === 0) return;
    if (selectedIndexEdit !== -1) {
        items[selectedIndexEdit].classList.remove('active');
    }
    selectedIndexEdit = (selectedIndexEdit + direction + items.length) % items.length;
    items[selectedIndexEdit].classList.add('active');
    items[selectedIndexEdit].scrollIntoView({ block: 'nearest' });
}

function seleccionarSugerenciaEdit() {
    const items = document.querySelectorAll('#listaProveedorEdit li');
    if (selectedIndexEdit !== -1 && items[selectedIndexEdit]) {
        seleccionarProveedorEdit(items[selectedIndexEdit].dataset.id);
    }
}

function seleccionarProveedorEdit(id) {
    // Verificar si el proveedor ya está en el array de seleccionados
    if (!proveedoresSeleccionadosEdit.includes(id)) {
        proveedoresSeleccionadosEdit.push(id);
    }
    
    const proveedor = proveedoresEdit.find(p => p._id === id);

    // Verificar si el proveedor ya está en la tabla
    const tbody = document.getElementById('editProveedores');
    const proveedorExistente = tbody.querySelector(`tr[data-id="${proveedor._id}"]`);
    
    if (!proveedorExistente) {
        agregarProveedorTablaEdit(proveedor);
    }

    // Limpiar el input y ocultar la lista de sugerencias
    document.getElementById('proveedorEdit').value = '';
    document.getElementById('listaProveedorEdit').style.display = 'none';
}

function agregarProveedorTablaEdit(proveedor) {
    const tbody = document.getElementById('editProveedores');

    // Verificar si el proveedor ya está en la tabla para evitar duplicados
    const proveedorExistente = tbody.querySelector(`tr[data-id="${proveedor._id}"]`);
    if (proveedorExistente) return; // Salir si el proveedor ya está en la tabla

    const row = document.createElement('tr');
    row.dataset.id = proveedor._id;
    row.innerHTML = `
        <td>${proveedor.nombre}</td>
        <td>
            <button class="btn btn-danger btn-sm eliminar-proveedor-edit">Eliminar</button>
        </td>
    `;
    tbody.appendChild(row);

    row.querySelector('.eliminar-proveedor-edit').addEventListener('click', () => {
        eliminarProveedorEdit(proveedor._id);
    });
}

function eliminarProveedorEdit(id) {
    proveedoresSeleccionadosEdit = proveedoresSeleccionadosEdit.filter(pId => pId !== id);
    const row = document.querySelector(`#editProveedores tr[data-id="${id}"]`);
    if (row) row.remove();
}

//agregar proveedor a tabla
function agregarProveedorATablaEdit(proveedor) {
    const tbody = document.getElementById('editProveedores');

    // Verificar si el proveedor ya está en la tabla para evitar duplicados
    const proveedorExistente = tbody.querySelector(`tr[data-id="${proveedor._id}"]`);
    if (proveedorExistente) return; // Salir si el proveedor ya está en la tabla

    // Verificar si el proveedor ya está en el array de seleccionados para evitar duplicados
    if (!proveedoresSeleccionadosEdit.includes(proveedor._id)) {
        proveedoresSeleccionadosEdit.push(proveedor._id);
    }

    const row = document.createElement('tr');
    row.dataset.id = proveedor._id;
    row.innerHTML = `
        <td>${proveedor.nombre}</td>
        <td>
            <button class="btn btn-danger btn-sm eliminar-proveedor-edit">Eliminar</button>
        </td>
    `;
    tbody.appendChild(row);

    row.querySelector('.eliminar-proveedor-edit').addEventListener('click', () => {
        eliminarProveedorEdit(proveedor._id);
    });
}


