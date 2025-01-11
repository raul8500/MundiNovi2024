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
                    <td>${new Date(traspaso.fecha).toLocaleDateString()}</td>
                    <td>${traspaso.sucursalOrigen.nombre}</td>
                    <td>${traspaso.usuarioOrigen.name} (@${traspaso.usuarioOrigen.username})</td>
                    <td>${traspaso.sucursalDestino.nombre}</td>
                    <td>
                        <button class="btn btn-sm btn-info btnImprimirTraspaso" data-id="${traspaso._id}">Imprimir</button>
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

// ✅ Evento delegado para los botones de impresión en la tabla
document.getElementById('tbodyTraspasos').addEventListener('click', async (event) => {
    if (event.target.classList.contains('btnImprimirTraspaso')) {
        const traspasoId = event.target.dataset.id;

        if (!traspasoId) {
            return Swal.fire('⚠️ Error', 'ID de traspaso no válido.', 'warning');
        }

        try {
            // ✅ Mostrar alerta de carga
            Swal.fire({
                title: 'Generando PDF...',
                text: 'Por favor, espera un momento.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // ✅ Realizar la solicitud al backend para obtener el PDF
            const response = await fetch(`/api/traspasos/${traspasoId}`, {
                method: 'POST'
            });

            if (!response.ok) {
                throw new Error('Error al generar el PDF.');
            }

            // ✅ Descargar el PDF
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `traspaso_${traspasoId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);

            // ✅ Cerrar alerta
            Swal.close();

        } catch (error) {
            console.error('❌ Error al imprimir el traspaso:', error);
            Swal.fire('❌ Error', 'No se pudo generar el PDF del traspaso.', 'error');
        }
    }
});
