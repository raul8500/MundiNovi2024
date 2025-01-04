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

// 📌 Parámetros para cargar sucursales usando tu función
const selectOptions = [
    { url: '/api/sucursal', selectId: 'sucursalSelect' }
];

// ✅ Cargar sucursales al inicio
loadSelectOptions(selectOptions);

// 📌 Función para cargar traspasos por rango de fechas
async function cargarTraspasos() {
    const sucursalId = document.getElementById('sucursalSelect').value;
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;

    // ✅ Validaciones
    if (!sucursalId) {
        return Swal.fire('⚠️ Error', 'Debe seleccionar una sucursal.', 'warning');
    }

    if (!fechaInicio || !fechaFin) {
        return Swal.fire('⚠️ Error', 'Debe seleccionar un rango de fechas.', 'warning');
    }

    try {
        const response = await fetch(`/api/traspasos/fechas/${fechaInicio}/${fechaFin}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener los traspasos');
        }

        const tbody = document.getElementById('tbodyTraspasos');
        tbody.innerHTML = '';

        data.traspasos.forEach(traspaso => {
            // Calcular el total de artículos por traspaso
            const totalArticulos = traspaso.productos.reduce((acc, prod) => acc + prod.cantidad, 0);

            const row = `
                <tr>
                    <td>${traspaso.folio}</td>
                    <td>${traspaso.sucursalOrigen.nombre}</td>
                    <td>${traspaso.sucursalDestino.nombre}</td>
                    <td>${traspaso.usuarioOrigen.name} (@${traspaso.usuarioOrigen.username})</td>
                    <td>${traspaso.usuarioDestino.name} (@${traspaso.usuarioDestino.username})</td>
                    <td>${new Date(traspaso.fecha).toLocaleDateString()}</td>
                    <td>${traspaso.estado}</td>
                    <td>${totalArticulos}</td>
                    <td>
                        <button class="btn btn-sm btn-info" onclick="">Imprimir</button>
                    </td>
                </tr>
            `;
            tbody.insertAdjacentHTML('beforeend', row);
        });

    } catch (error) {
        console.error('❌ Error al cargar traspasos:', error);
        Swal.fire('❌ Error', 'No se pudieron cargar los traspasos.', 'error');
    }
}



// 📌 Evento para el botón de cargar traspasos
document.getElementById('btnCargarTraspasos').addEventListener('click', cargarTraspasos);


