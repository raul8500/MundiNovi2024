const btnCargarCortes = document.getElementById('btnCargarCortes')
const selectOptions = [
    { url: '/api/sucursal', selectId: 'sucursal' },
];

let tablaRecoleccionBody = document.getElementById('tablaRecoleccionBody')

loadSelectOptions(selectOptions);


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

btnCargarCortes.addEventListener('click', () => {
    let url = getFormValuesAndBuildUrl()

    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(async response => {
        if (response.status === 200) {
            const data = await response.json();
            mostrarEnTabla(data)
        } else {
            throw new Error('Error inesperado en la respuesta del servidor.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al realizar el corte. Por favor, inténtalo de nuevo.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    });


});

function getFormValuesAndBuildUrl() {
    // Obtener los valores de los campos
    const sucursalId = document.getElementById('sucursal').value;
    const fechaInicial = document.getElementById('fechaInicial').value;
    const fechaFinal = document.getElementById('fechaFinal').value;

    // Convertir fechas a objetos Date
    const fechaInicioDate = new Date(fechaInicial);
    const fechaFinDate = new Date(fechaFinal);

    // Ajustar las horas para que el rango sea completo
    const fechaInicioISO = new Date(fechaInicioDate.setHours(0, 0, 0, 0)).toISOString(); // 00:00:00
    const fechaFinISO = new Date(fechaFinDate.setHours(23, 59, 59, 999)).toISOString();  // 23:59:59

    // Construir la URL con los parámetros
    const url = `http://localhost:3000/api/cortesFinales?fechaInicio=${fechaInicioISO}&fechaFin=${fechaFinISO}&sucursalId=${sucursalId}`;

    return url;
}


function mostrarEnTabla(cortes){
    console.log(cortes)
    let resultadosCortes = '';
    cortes.forEach((item) => {
        resultadosCortes += `
                <tr class="table-danger">
                    <td class="text-center">${item.folio}</td>
                    <td colspan="2"  class="text-center">${new Date(item.fecha_inicial).toLocaleString()}</td>
                    <td class="text-center">${item.usuario.username}</td>
                    <td class="text-center">0.0</td>
                    <td class="text-center">0.0</td>
                    <td class="text-center">0.0</td>
                    <td class="text-center">0.0</td>
                    <td class="text-center">${item.total_tarjetas+ item.monto_transferencias + item.totalVentasEfectivoCortes + item.totalVentaCorte}</td>
                    <td class="text-center">0.0</td>
                    <td class="text-center">${item.total_tarjetas+ item.monto_transferencias + item.totalVentasEfectivoCortes + item.totalVentaCorte}</td>
                    <td class="text-center">${item.totalVentasEfectivoCortes}</td>
                    <td class="text-center">0.0</td>                    
                    <td class="text-center">
                    
                        <button id="${
                          item._id
                        }" type="button" class="btn btn-primary btn-rounded btnRecibir">
                            <i class="fa-solid fa-hand-holding-dollar"></i>
                        </button>
    
                    </td>
                </tr>`;
    });

    tablaRecoleccionBody.innerHTML = resultadosCortes;

}

