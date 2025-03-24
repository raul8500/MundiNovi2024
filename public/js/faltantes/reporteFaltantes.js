const selectOptions = [
    { url: '/api/sucursal', selectId: 'sucursalOrigen' },
    {url: '/api/sucursal', selectId: 'sucursalDestino'}
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


document.getElementById('btnObtenerFaltantes').addEventListener('click', () => {
    let sucursalOrigen = document.getElementById("sucursalOrigen").value
    let sucursalDestino = document.getElementById("sucursalDestino").value
    fetchFaltantes(sucursalOrigen,sucursalDestino)
});

async function fetchFaltantes(sucursalOrigen, sucursalDestino) {
    try {
        const response = await fetch('/api/faltantes/'+sucursalOrigen+"/"+sucursalDestino);
        if (!response.ok) {
            throw new Error('Error al recuperar los clientes');
        }
        const data = await response.json();
        
        cargarDatosTabla(data.data)

    } catch (error) {
        console.error('Error:', error);
    }
}

const cargarDatosTabla = (data) => {
    let contenedorFaltantes = document.getElementById('contenedorFaltantes')
    let resultados = '';

    data.forEach((item) => {
    resultados += `
            <tr>
                <td class="text-center">${item.clave}</td>
                <td class="text-center">${item.nombre}</td>
                <td class="text-center">${item.existenciaOrigen}</td>
                <td class="text-center">${item.existenciaDestino}</td>
                <td class="text-center">${item.stockMinimo}</td>
                <td class="text-center">${item.stockMaximo}</td>
                <td class="text-center">${item.presentacion}</td>
                <td class="text-center">${item.stockMaximo - (item.existenciaOrigen)}</td>
            </tr>`;
    });

    contenedorFaltantes.innerHTML = resultados;
    document.getElementById('btnConvertirTraspaso').style.visibility = 'visible';
};

document.getElementById('btnConvertirTraspaso').addEventListener('click', () => {
    const modalFechasTraspaso = new mdb.Modal(document.getElementById('modalFechasTraspaso'));
    modalFechasTraspaso.show()
});

document.getElementById('btnContinuar').addEventListener('click', () => {
    const sucursalOrigen = document.getElementById('sucursalOrigen').value;
    const sucursalDestino = document.getElementById('sucursalDestino').value;
    const fechaInicial = document.getElementById('fechaInicial').value;
    const fechaFinal = document.getElementById('fechaFinal').value;

    // Validar que los campos no estén vacíos
    if (!sucursalOrigen|| !sucursalDestino || !fechaInicial || !fechaFinal) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    // Redirigir a la página con los parámetros en la URL
    window.location.href = `/traspasoProductos?sucursalOrigen=${encodeURIComponent(sucursalOrigen)}&sucursalDestino=${encodeURIComponent(sucursalDestino)}&fechaInicial=${encodeURIComponent(fechaInicial)}&fechaFinal=${encodeURIComponent(fechaFinal)}`;
});
