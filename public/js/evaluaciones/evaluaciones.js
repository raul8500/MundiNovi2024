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

const apiParametrosUrl = '/api/parametros'; // Endpoint para obtener los parámetros activos

async function cargarParametros() {
    try {
        // Realizar solicitud para obtener los parámetros
        const response = await fetch(apiParametrosUrl);
        if (!response.ok) {
            throw new Error('Error al obtener los parámetros');
        }

        const parametros = await response.json();
        const contenedorParametros = document.getElementById('parametrosEvaluacion');
        contenedorParametros.innerHTML = ''; // Limpiar cualquier contenido anterior

        // Generar dinámicamente los campos de calificación para cada parámetro
        parametros.forEach(parametro => {
            const row = document.createElement('div');
            row.classList.add('row', 'mb-3');
            row.innerHTML = `
                <div class="col-md-6">
                    <label for="${parametro.nombre}" class="form-label">${parametro.nombre}</label>
                    <select id="${parametro.nombre}" class="form-select" data-parametro="${parametro.nombre}">
                        <option value="0" selected>0</option>
                        <option value="5">5</option>
                        <option value="10">10</option>
                    </select>
                </div>
            `;
            contenedorParametros.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar los parámetros:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los parámetros. Intente más tarde.',
        });
    }
}

// Llamar a la función para cargar parámetros al iniciar
cargarParametros();


function validarFormulario() {
    const sucursalId = document.getElementById('sucursalSelect').value;

    if (!sucursalId) {
        Swal.fire({
            icon: 'warning',
            title: 'Falta información',
            text: 'Por favor, seleccione un ID de sucursal.'
        });
        return false;
    }

    return true; // Validación exitosa
}

document.getElementById('submitEvaluacion').addEventListener('click', async () => {
    // Validar formulario antes de enviar
    if (!validarFormulario()) {
        return;
    }

    // Obtener los valores del formulario
    const sucursalId = document.getElementById('sucursalSelect').value;
    const evaluadorId = infoUser._id; // Suponiendo que tienes infoUser con el evaluador logueado

    // Construir el array de calificaciones dinámicamente
    const calificaciones = [];
    document.querySelectorAll('#parametrosEvaluacion select').forEach(select => {
        calificaciones.push({
            titulo: select.dataset.parametro, // Usar el atributo data-parametro para obtener el nombre
            calificacion: parseInt(select.value)
        });
    });

    // Crear el objeto de evaluación
    const data = {
        sucursalId,
        evaluadorId,
        fechaHora: new Date().toISOString(),
        calificaciones
    };

    try {
        // Realizar la solicitud POST al backend
        const response = await fetch('/api/evaluaciones', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Evaluación guardada exitosamente.'
            });
            document.getElementById('evaluacionForm').reset(); // Limpiar el formulario
            cargarParametros(); // Recargar los parámetros si es necesario
        } else {
            const error = await response.json();
            Swal.fire({
                icon: 'error',
                title: 'Error al guardar',
                text: error.message || 'Hubo un problema al guardar la evaluación.'
            });
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'No se pudo conectar con el servidor. Intente nuevamente más tarde.'
        });
    }
});
