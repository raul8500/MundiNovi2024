document.addEventListener('DOMContentLoaded', () => {
    cargarZonas();

    document.getElementById('zonaClienteForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const zonaId = document.getElementById('zonaId').value;
        const zona = {
            clave: document.getElementById('clave').value,
            nombre: document.getElementById('nombre').value,
            descripcion: document.getElementById('descripcion').value
        };

        const method = zonaId ? 'PUT' : 'POST';
        const endpoint = zonaId ? `/api/zonaclientes/${zonaId}` : '/api/zonaclientes';

        const response = await fetch(endpoint, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(zona)
        });

        if (response.ok) {
            alert(`Zona ${zonaId ? 'actualizada' : 'creada'} exitosamente`);
            document.getElementById('zonaClienteForm').reset();
            document.getElementById('zonaId').value = '';
            cargarZonas();
        }
    });
});

async function cargarZonas() {
    const response = await fetch('/api/zonaclientes');
    const zonas = await response.json();
    const lista = document.getElementById('zonasList');
    lista.innerHTML = '';

    zonas.forEach(zona => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            ${zona.nombre} - ${zona.clave}
            <div>
                <button class="btn btn-sm btn-warning" onclick="editarZona('${zona._id}', '${zona.clave}', '${zona.nombre}', '${zona.descripcion}')">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarZona('${zona._id}')">Eliminar</button>
            </div>
        `;
        lista.appendChild(li);
    });
}

function editarZona(id, clave, nombre, descripcion) {
    document.getElementById('zonaId').value = id;
    document.getElementById('clave').value = clave;
    document.getElementById('nombre').value = nombre;
    document.getElementById('descripcion').value = descripcion;
}

async function eliminarZona(id) {
    if (confirm('¿Estás seguro de eliminar esta zona?')) {
        const response = await fetch(`/api/zonaclientes/${id}`, { method: 'DELETE' });
        if (response.ok) {
            alert('Zona eliminada exitosamente');
            cargarZonas();
        }
    }
}