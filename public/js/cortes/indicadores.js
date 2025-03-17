// Lógica para abrir el modal y cargar los datos de las sucursales
document.getElementById('abrirIndicadoresModal').addEventListener('click', async function() {
    // Abrir el modal
    const modal = new bootstrap.Modal(document.getElementById('indicadoresModal'));
    modal.show();

    // Cargar las sucursales desde el backend
    const sucursales = await obtenerSucursales();

    // Llenar el selector de sucursales con las opciones
    const sucursalSelect = document.getElementById('sucursalSelect');
    sucursales.forEach(sucursal => {
        const option = document.createElement('option');
        option.value = sucursal._id;
        option.textContent = `${sucursal.nombre}`;
        sucursalSelect.appendChild(option);
    });

    // Cargar los indicadores en la tabla usando DataTables
    cargarIndicadores();
});

// Función para obtener las sucursales desde el backend
async function obtenerSucursales() {
    try {
        const response = await fetch('api/sucursal');
        if (!response.ok) {
            throw new Error('Error al obtener las sucursales');
        }
        const sucursales = await response.json();
        return sucursales;
    } catch (error) {
        console.error(error);
    }
}

// Función para cargar los indicadores en la tabla
async function cargarIndicadores() {
    try {
        const response = await fetch('/api/indicadores');
        if (!response.ok) {
            throw new Error('Error al obtener los indicadores');
        }
        const indicadores = await response.json();

        // Limpiar el cuerpo de la tabla antes de llenarla
        const tableBody = document.querySelector('#indicadoresTable tbody');
        tableBody.innerHTML = '';

        // Llenar la tabla con los datos de los indicadores
        indicadores.forEach(indicador => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${indicador.nombre}</td>
                <td>${indicador.verde}</td>
                <td>${indicador.naranja}</td>
                <td>${indicador.rojo}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarIndicador('${indicador.sucursalId}')">Editar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Inicializar DataTable
        $('#indicadoresTable').DataTable();
    } catch (error) {
        console.error(error);
    }
}

// Función para editar un indicador
function editarIndicador(sucursalId) {
    // Aquí puedes cargar los datos del indicador para editarlo en el formulario
    const sucursalSelect = document.getElementById('sucursalSelect');
    sucursalSelect.value = sucursalId;
    
    // Lógica para cargar los datos del indicador en el formulario, si existe
    // En este ejemplo, puedes enviar una solicitud al backend para obtener el indicador y prellenar los campos.
    // Pero eso dependerá de tu implementación.
}

// Lógica para guardar los indicadores
document.getElementById('guardarIndicador').addEventListener('click', async function() {
    const sucursalId = document.getElementById('sucursalSelect').value;
    const verde = document.getElementById('verde').value;
    const naranja = document.getElementById('naranja').value;
    const rojo = document.getElementById('rojo').value;

    // Validar que todos los campos estén llenos
    if (!sucursalId || !verde || !naranja || !rojo) {
        // Mostrar alerta de error con SweetAlert2
        Swal.fire({
            icon: 'error',
            title: 'Campos incompletos',
            text: 'Por favor complete todos los campos.'
        });
        return;
    }

    // Enviar los datos al backend para crear o actualizar el indicador
    try {
        const response = await fetch('/api/indicadores/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sucursalId,
                verde,
                naranja,
                rojo,
            }),
        });

        if (!response.ok) {
            throw new Error('Error al guardar los indicadores');
        }

        // Cerrar el modal si la operación fue exitosa
        const modal = bootstrap.Modal.getInstance(document.getElementById('indicadoresModal'));
        modal.hide();

        // Mostrar mensaje de éxito con SweetAlert2
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Indicadores actualizados correctamente',
        }).then(() => {
            // Refrescar la página después de mostrar el mensaje de éxito
            location.reload();
        });
    } catch (error) {
        console.error(error);

        // Mostrar mensaje de error con SweetAlert2
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al guardar los indicadores',
        });
    }
});
