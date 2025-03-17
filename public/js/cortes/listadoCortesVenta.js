const btnCargarCortes = document.getElementById('btnCargarCortes')
const selectOptions = [
    { url: '/api/sucursal', selectId: 'sucursalId' },
];

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
            console.log(data)
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
    const sucursalId = document.getElementById('sucursalId').value;
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
    foliosTotales = []; // Limpiar la variable global antes de llenarla nuevamente

    cortes.forEach((item) => {
        // Si no existen las fechas, dejarlas en blanco
        const fechaInicial = item.fecha_inicial ? new Date(item.fecha_inicial).toLocaleString() : '';
        const fechaFinal = item.fecha_final ? new Date(item.fecha_final).toLocaleString() : '';
        const fechaRecepcion = item.fecha_recepcion ? new Date(item.fecha_recepcion).toLocaleString() : '';

        const username = item.usuario && item.usuario.username ? item.usuario.username : '';
        const usernameRecepcion = item.usuario_recepcion && item.usuario_recepcion.username ? item.usuario_recepcion.username : '';

        const totalVenta = item.total_ventas
        const totalEfectivo = item.finanzasTotales.T_efectivo || 0;

        let indicador = ''

        if (totalVenta >= item.indicadores.verde) {
            indicador = '<i class="fa-solid fa-circle fa-2xl" style="color: #77bb41;"></i>'; // Verde
        } else if (totalVenta >= item.indicadores.naranja) {
            indicador = '<i class="fa-solid fa-circle fa-2xl" style="color: #ff8c82;"></i>'; // Naranja
        } else if (totalVenta >= item.indicadores.rojo) {
            indicador = '<i class="fa-solid fa-circle fa-2xl" style="color: #e32400;"></i>'; // Rojo
        }

        // Mostrar cantidades de cortes parciales en forma de lista con su signo de peso
        let cantidadesCortesParciales = '';
        let totalCortesParciales = 0;
        if (item.cortesParciales && item.cortesParciales.length > 0) {
            cantidadesCortesParciales = item.cortesParciales.map(corte => {
                totalCortesParciales += corte.cantidad || 0;
                return `$${(corte.cantidad || 0).toFixed(2)}`;
            }).join('<br>');
        }

        // Mostrar corte final con signo de peso
        const corteFinal = item.corteFinal ? `$${(item.corteFinal.corte_total || 0).toFixed(2)}` : `$0.00`;

        // Sumar el total de los cortes
        // Verificar si los valores son números válidos y asignarles 0 si no lo son
        const totalCortesParcialesValid = isNaN(totalCortesParciales) ? 0 : totalCortesParciales;
        const corteFinalTotalValid = isNaN(item.corteFinal?.corte_total) ? 0 : item.corteFinal.corte_total;

        // Calcular el total de los cortes
        const totalCortes = totalCortesParcialesValid + corteFinalTotalValid;



        let totalVales = ''

        if(item.corteFinal && item.corteFinal.corte_total){
            totalVales = (totalEfectivo - totalCortes).toFixed(2)

        }else{
            totalVales = (0).toFixed(2)
        }


        resultadosCortes += `
        
                <tr class="table-warning">
                    <td class="text-center">${item.folio || ''}</td>
                    <td class="text-center">${fechaInicial}</td>
                    <td class="text-center">${fechaFinal}</td>
                    <td class="text-center">${username}</td>
                    <td class="text-center">
                        ${item.recepcion ? 
                            `<i class="fa-solid fa-check" style="color: green;"></i>` : 
                            `<i class="fa-solid fa-xmark" style="color: red;"></i>`
                        }
                    </td>
                    <td class="text-center">${usernameRecepcion}</td>
                    <td class="text-center">${fechaRecepcion}</td>
                    <td class="text-center">-</td>
                    <td class="text-center">-</td>
                    <td class="text-center">$${totalEfectivo.toFixed(2)}</td>
                    <td class="text-center">$${item.finanzasTotales.T_credito !== undefined ? item.finanzasTotales.T_credito : 0}</td>
                    <td class="text-center">$${item.finanzasTotales.T_debito !== undefined ? item.finanzasTotales.T_debito : 0}</td>
                    <td class="text-center">$${item.finanzasTotales.T_tarjetas !== undefined ? item.finanzasTotales.T_tarjetas : 0}</td>
                    <td class="text-center">$${item.finanzasTotales.T_transferencias !== undefined ? item.finanzasTotales.T_transferencias : 0}</td>
                    <td class="text-center">$${item.devolucionones !== undefined ? item.devolucionones : 0}</td>
                    <td class="text-center" style="color:green">
                        <strong>Parciales:</strong><br>
                        ${cantidadesCortesParciales}<br>
                        <strong>Final:</strong><br>
                        ${corteFinal}
                    </td>
                    <td class="text-center">$${item.egresos}</td>
                    <td class="text-center">${indicador}</td>
                    <td class="text-center" style="color: green; font-weight: bold;">$${totalVenta.toFixed(2)}</td>
                    <td class="text-center">$${totalCortes.toFixed(2)}</td> <!-- Total de los cortes -->
                    <td class="text-center">$${totalVales}</td>
                    <td class="text-center">${item.corteFinal.observaciones}</td>
                    <td class="text-center">
                        ${item.estado === true 
                            ? `<button data-id="${item._id}" type="button" class="btn btn-success btn-rounded btnRecibir corteFinal">
                                    Finalizado
                            </button>`
                            : `<button data-id="${item._id}" type="button" class="btn btn-warning btn-rounded btnRecibir corteFinal">
                                    Finalizar
                            </button>`
                        }

                        <!-- Los botones "Ver" y "Vales" permanecen iguales -->
                        <button data-id="${item._id}" type="button" class="btn btn-primary btn-rounded btnVer corteFinal">
                            Ver
                        </button>
                        <button data-id="${item._id}" type="button" class="btn btn-info btn-rounded btnVales corteFinal">
                            Vales
                        </button>
                    </td>

                </tr>`;
    });

    // Insertar el contenido generado en el cuerpo de la tabla
    tablaRecoleccionBody.innerHTML = resultadosCortes;
}


$(document).on('click', '.btnRecibir', function () {
    // Obtener la fila donde se hizo clic en el botón
    const row = $(this).closest('tr');
    // Obtener el valor de la columna 21 (la columna con el índice 20)
    const valorColumna21 = row.find('td').eq(20).text();
    // Eliminar el signo de dólar y convertir a número
    const vales = parseFloat(valorColumna21.replace('$', '').replace(',', '').trim());

    // Obtener el ID del botón
    const id = $(this).data('id');

    // Llamar a la función para finalizar el corte
    finalizarCorte(id, vales);

});

// Lógica para finalizar el corte
async function finalizarCorte(idCorte, totalVales) {
    try {
        // Enviar la solicitud al backend para finalizar el corte
        const response = await fetch('/api/cortes/finalizar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: idCorte,  // El id del corte que se va a finalizar
                totalVales: totalVales,  // El total de vales
            }),
        });

        if (!response.ok) {
            throw new Error('Error al finalizar el corte');
        }

        const data = await response.json();
        console.log(data.message);  // Mensaje de éxito

        // Puedes actualizar la interfaz de usuario, por ejemplo, ocultando el botón de finalizar
        Swal.fire({
            icon: 'success',
            title: 'Corte Finalizado',
            text: data.message,
        }).then(() => {
            // Puedes recargar la página o actualizar la tabla con los datos nuevos
            location.reload();
        });

    } catch (error) {
        console.error('Error al finalizar el corte:', error);

        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al finalizar el corte.',
        });
    }
}
$(document).on('click', '.btnVer', async function () {
    const id = $(this).data('id');  // Obtener el ID del corte desde el botón

    try {
        // Hacer la petición GET al backend para obtener los detalles del corte
        const response = await fetch(`/api/cortesFinales/${id}`);

        if (!response.ok) {
            throw new Error('No se pudo obtener el corte');
        }

        const corteFinal = await response.json();

        // Formatear la fecha
        const fechaInicial = new Date(corteFinal.fecha_inicial);
        const fechaFinalFormatted = fechaInicial.toLocaleString('es-ES', {
            weekday: 'long', // Día de la semana
            year: 'numeric', // Año completo
            month: 'long', // Nombre completo del mes
            day: 'numeric', // Día del mes
            hour: 'numeric', // Hora
            minute: 'numeric', // Minutos
            second: 'numeric', // Segundos
            hour12: false // Formato de 24 horas
        });

        // Mostrar los detalles del corte final en el modal
        console.log(corteFinal);  // Muestra los datos del corte final en la consola

        // Insertar los detalles en el modal
        $('#sucursal').text(corteFinal.sucursal.nombre || 'N/A');
        $('#folioCorte').text(corteFinal.folio || 'N/A');
        $('#fechaInicialCorte').text(fechaFinalFormatted || 'N/A');
        $('#usuario').text(corteFinal.usuario.username || 'N/A');

        $('#totalVentasCorte').text(corteFinal.total_ventas || '0.00');
        $('#estadoCorte').text(corteFinal.finalizado ? 'Finalizado' : 'Pendiente');
        $('#totalValesCorte').text(corteFinal.totalVales || '0.00');

        // Mostrar el modal con los detalles del corte
        const modal = new bootstrap.Modal(document.getElementById('corteFinalModal'));
        modal.show();

    } catch (error) {
        console.error('Error al obtener el corte:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al cargar los detalles del corte.',
        });
    }
});






