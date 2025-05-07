document.getElementById('crearReporte').addEventListener('click', async () => {
    const idTienda = document.getElementById('tienda').value;
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;

    if (!idTienda || !fechaInicio || !fechaFin) {
        return alert('Selecciona la tienda y el rango de fechas');
    }

    try {
        const response = await fetch(`/api/flujoEfectivo?idTienda=${idTienda}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
        const data = await response.json();

        const tbody = document.querySelector('table tbody');
        tbody.innerHTML = '';

        let totalIngresosEf = 0;
        let totalBancos = 0;
        let totalEgresos = 0;

        data.flujos.forEach(flujo => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${flujo.sucursal?.nombre || 'N/A'}</td>
                <td>${flujo.efectivoInicial.toFixed(2)}</td>
                <td>${flujo.ingresosEfectivo.toFixed(2)}</td>
                <td>${flujo.ingresosBanco.toFixed(2)}</td>
                <td>${flujo.egresosEfectivo.toFixed(2)}</td>
                <td>${flujo.efectivoFinal.toFixed(2)}</td>
                <td>${flujo.tipo || '-'}</td>
                <td>${flujo.observaciones || ''}</td>
                <td>${new Date(flujo.fecha).toLocaleDateString()}</td>
            `;
            tbody.appendChild(row);

            totalIngresosEf += flujo.ingresosEfectivo;
            totalBancos += flujo.ingresosBanco;
            totalEgresos += flujo.egresosEfectivo;
        });

        document.getElementById('totalIngresosEf').textContent = totalIngresosEf.toFixed(2);
        document.getElementById('totalBancos').textContent = totalBancos.toFixed(2);
        document.getElementById('totalEgresos').textContent = totalEgresos.toFixed(2);
    } catch (error) {
        console.error('Error al cargar flujos:', error);
    }
});


const selectOptions = [
    { url: '/api/franquicia/', selectId: 'tienda' },
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
            defaultOption.textContent = `Selecciona una tienda`;
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

