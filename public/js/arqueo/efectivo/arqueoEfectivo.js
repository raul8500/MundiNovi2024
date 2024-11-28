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


document.getElementById('arqueoForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const sucursal = document.getElementById('sucursalSelect').value;
    const efectivoEnCaja = document.getElementById('efectivoInput').value;

    // Validación previa
    if (!sucursal || efectivoEnCaja === '' || efectivoEnCaja < 0) {
        Swal.fire('Advertencia', 'Sucursal y efectivo en caja son obligatorios y deben ser válidos.', 'warning');
        return;
    }

    const body = {
        sucursal,
        efectivoEnCaja: Number(efectivoEnCaja),
        userId: infoUser._id
    };

    // Realizar la solicitud
    fetch('/api/arqueo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then((errorData) => {
                    throw new Error(errorData.error || 'Error al crear el arqueo.');
                });
            }
        })
        .then((data) => {
            Swal.fire('Éxito', `Arqueo creado exitosamente con ID: ${data.arqueo._id}`, 'success');
            document.getElementById('arqueoForm').reset(); // Limpia el formulario
        })
        .catch((error) => {
            Swal.fire('Error', error.message, 'error');
            console.error('Error al registrar acción:', error);
        });
});

