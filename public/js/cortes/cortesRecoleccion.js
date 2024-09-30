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
    const url = `/api/cortesFinales?fechaInicio=${fechaInicioISO}&fechaFin=${fechaFinISO}&sucursalId=${sucursalId}`;

    return url;
}

function mostrarEnTabla(cortes) {
    console.log(cortes);
    let resultadosCortes = '';
    
    cortes.forEach((item) => {
        // Si no existen las fechas, dejarlas en blanco
        const fechaInicial = item.fecha_inicial ? new Date(item.fecha_inicial).toLocaleString() : '';
        const fechaFinal = item.fecha_final ? new Date(item.fecha_final).toLocaleString() : '';
        const username = item.usuario && item.usuario.username ? item.usuario.username : '';
        const totalVenta = item.total_tarjetas + item.monto_transferencias + (item.totalVentasEfectivoCortes || 0) + (item.totalVentaCorte || 0);
        const totalEfectivo = item.totalVentasEfectivoCortes || 0;

        // Agregar la fila del corte final
        resultadosCortes += `
                <tr class="table-warning">
                    <td class="text-center">${item.folio || ''}</td>
                    <td class="text-center">${fechaInicial}</td>
                    <td class="text-center">${fechaFinal}</td>
                    <td class="text-center">${username}</td>
                    <td class="text-center">0.0</td>
                    <td class="text-center">0.0</td>
                    <td class="text-center">0.0</td>
                    <td class="text-center">0.0</td>
                    <td class="text-center">${totalVenta}</td>
                    <td class="text-center">0.0</td>
                    <td class="text-center">${totalVenta}</td>
                    <td class="text-center">${totalEfectivo}</td>
                    <td class="text-center">0.0</td>                    
                    <td class="text-center">
                        <button id="${item._id}" type="button" class="btn btn-primary btn-rounded btnRecibir corteFinal">
                            <i class="fa-solid fa-hand-holding-dollar"></i>
                        </button>
                    </td>
                </tr>`;
        
        // Si el corte tiene cortes parciales, crear una tabla anidada
        if (item.cortesParciales && item.cortesParciales.length > 0) {
            resultadosCortes += `
                <tr>
                    <td colspan="14">
                        <table class="table table-bordered">
                            <thead>
                                <tr class="table-primary">
                                    <th class="text-center">Folio</th>
                                    <th class="text-center">Folio Padre</th>
                                    <th class="text-center">Fecha de Creación</th>
                                    <th class="text-center">Cantidad</th>
                                    <th class="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>`;

            // Iterar sobre los cortes parciales y generar las filas de la tabla anidada
            item.cortesParciales.forEach((corteParcial) => {
                const fechaCreacionParcial = corteParcial.fechaCreacion ? new Date(corteParcial.fechaCreacion).toLocaleString() : '';
                const cantidadParcial = corteParcial.cantidad || '';

                resultadosCortes += `
                    <tr>
                        <td class="text-center">${corteParcial.folio || ''}</td>
                        <td class="text-center">${item.folio || ''}</td>
                        <td class="text-center">${fechaCreacionParcial}</td>
                        <td class="text-center">${cantidadParcial}</td>
                        <td class="text-center">
                            <button id="${corteParcial._id}" type="button" class="btn btn-primary btn-rounded btnRecibir corteParcial">
                                <i class="fa-solid fa-hand-holding-dollar"></i>
                            </button>
                        </td>
                    </tr>`;
            });

            resultadosCortes += `
                            </tbody>
                        </table>
                    </td>
                </tr>`;
        }
    });

    // Insertar el contenido generado en el cuerpo de la tabla
    tablaRecoleccionBody.innerHTML = resultadosCortes;
}

on(document, 'click', '.btnRecibir', async e => {
    const button = e.target.closest('.btnRecibir');
    const id = button.getAttribute('id');

    // Obtener la fila que contiene el botón
    const row = button.closest('tr');

    // Recorrer las celdas de la fila para obtener sus valores
    const cells = row.querySelectorAll('td');
    const rowData = Array.from(cells).map(cell => cell.textContent.trim());

    // Obtener el folio
    const folio = rowData[0]; // El folio es el primer valor en la fila
    const esParcial = button.classList.contains('corteParcial') ? 'Sí' : 'No'; // Comprobar si el botón tiene la clase corteParcial

    // Crear una nueva fila en la tabla #tablaRecibirCortes
    const tablaRecibirCortes = document.getElementById('tablaRecibirCortes');
    const nuevaFila = document.createElement('tr');

    // Asignar el contenido de la nueva fila
    nuevaFila.innerHTML = `
        <td class="text-center">${folio}</td>
        <td class="text-center">${esParcial}</td>
        <td class="text-center">
            <button type="button" class="btn btn-danger btn-sm btnEliminarFila">X</button>
        </td>
    `;

    // Insertar la nueva fila en la tabla
    tablaRecibirCortes.appendChild(nuevaFila);

    // Ocultar el botón "Recibir" utilizando visibility
    button.style.visibility = 'hidden';

    // Agregar evento para eliminar la fila cuando se haga clic en el botón "X"
    nuevaFila.querySelector('.btnEliminarFila').addEventListener('click', function() {
        nuevaFila.remove(); // Elimina la fila

        // Mostrar de nuevo el botón "Recibir"
        button.style.visibility = 'visible';
    });
});







