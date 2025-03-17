const btnCargarCortes = document.getElementById('btnCargarCortes')
const selectOptions = [
    { url: '/api/sucursal', selectId: 'sucursal' },
];
let foliosTotales = []; // Variable global para almacenar los folios


let tablaRecoleccionBody = document.getElementById('tablaRecoleccionBody')

loadSelectOptions(selectOptions);

let recolector = ''

verificarTokenYMostrar2();

function verificarTokenYMostrar2() {
    fetch(verifyToken)
        .then(response => response.json())
        .then(data => {
            recolector = data;
        })
        .catch(error => console.log(error));
}


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
            buscarFolio.focus()
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
    foliosTotales = []; // Limpiar la variable global antes de llenarla nuevamente

    cortes.forEach((item) => {
        // Si no existen las fechas, dejarlas en blanco
        const fechaInicial = item.fecha_inicial ? new Date(item.fecha_inicial).toLocaleString() : '';
        const fechaFinal = item.fecha_final ? new Date(item.fecha_final).toLocaleString() : '';
        const username = item.usuario && item.usuario.username ? item.usuario.username : '';
        const totalVenta = item.total_ventas
        const totalEfectivo = item.finanzasTotales.T_efectivo || 0;

        // Agregar el folio general a la variable global
        if (item.folio) {
            foliosTotales.push(item.folio);
        }

        // Agregar la fila del corte final
        resultadosCortes += `
                <tr class="table-warning">
                    <td class="text-center">${item.folio || ''}</td>
                    <td class="text-center">${fechaInicial}</td>
                    <td class="text-center">${fechaFinal}</td>
                    <td class="text-center">${username}</td>
                    <td class="text-center">0.0</td>
                    <td class="text-center">$${item.finanzasTotales.T_credito !== undefined ? item.finanzasTotales.T_credito : 0}</td>
                    <td class="text-center">$${item.finanzasTotales.T_debito !== undefined ? item.finanzasTotales.T_debito : 0}</td>
                    <td class="text-center">$${item.finanzasTotales.T_transferencias !== undefined ? item.finanzasTotales.T_transferencias : 0}</td>
                    <td class="text-center">$${item.egresos}</td>
                    <td class="text-center">$${totalEfectivo}</td>
                    <td class="text-center">0.0</td>
                    <td class="text-center">$${totalVenta}</td>
                    <td class="text-center">$${item.totalVentasEfectivoSinCortes}</td>
                    <td class="text-center">0.0</td>                    
                    <td class="text-center">
                        ${item.recepcion ? 
                            `<i class="fa-solid fa-check" style="color: green;"></i>` : 
                            `<button id="${item._id}" type="button" class="btn btn-primary btn-rounded btnRecibir corteFinal">
                                <i class="fa-solid fa-hand-holding-dollar"></i>
                            </button>`}
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

                // Agregar el folio parcial a la variable global
                if (corteParcial.folio) {
                    foliosTotales.push(corteParcial.folio);
                }

                resultadosCortes += `
                    <tr>
                        <td class="text-center">${corteParcial.folio || ''}</td>
                        <td class="text-center">${item.folio || ''}</td>
                        <td class="text-center">${fechaCreacionParcial}</td>
                        <td class="text-center">$${cantidadParcial}</td>
                        <td class="text-center">
                            ${corteParcial.recibido ? 
                                `<i class="fa-solid fa-check" style="color: green;"></i>` : 
                                `<button id="${corteParcial._id}" type="button" class="btn btn-primary btn-rounded btnRecibir corteParcial">
                                    <i class="fa-solid fa-hand-holding-dollar"></i>
                                </button>`}
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

    // Mostrar los folios almacenados en la variable global
    console.log("Folios Totales:", foliosTotales);
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

function aplicarLogicaRecibir(button) {
    const id = button.getAttribute('id');

    // Obtener la fila que contiene el botón
    const row = button.closest('tr');

    // Recorrer las celdas de la fila para obtener sus valores
    const cells = row.querySelectorAll('td');
    const rowData = Array.from(cells).map(cell => cell.textContent.trim());

    // Obtener el folio
    const folio = rowData[0]; // El folio es el primer valor en la fila
    const esParcial = button.classList.contains('corteParcial') ? 'Sí' : 'No'; // Comprobar si el botón tiene la clase corteParcial

    // Verificar si el folio ya está en la tabla de recibir cortes
    const tablaRecibirCortes = document.getElementById('tablaRecibirCortes');
    const existeFolioEnTabla = Array.from(tablaRecibirCortes.querySelectorAll('tr td:first-child'))
                                  .some(td => td.textContent.trim() === folio);

    if (!existeFolioEnTabla) {
        // Crear una nueva fila en la tabla #tablaRecibirCortes
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
    } else {
        console.log(`El folio ${folio} ya ha sido añadido a la tabla de recibir cortes.`);
    }
}

document.getElementById('btnEnviarCortes').addEventListener('click', async () => {
    const tablaRecibirCortes = document.getElementById('tablaRecibirCortes');
    const filas = tablaRecibirCortes.querySelectorAll('tr');

    // Arrays para almacenar los folios generales y parciales
    const foliosGenerales = [];
    const foliosParciales = [];

    // Recorrer todas las filas y separar los folios en generales y parciales
    filas.forEach(fila => {
        const folio = fila.cells[0].textContent.trim();
        const esParcial = fila.cells[1].textContent.trim() === 'Sí'; // "Sí" si es parcial, "No" si es general

        if (esParcial) {
            foliosParciales.push(folio);
        } else {
            foliosGenerales.push(folio);
        }
    });

    // Confirmación con SweetAlert2
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: `Vas a hacer la recepción de ${foliosGenerales.length} cortes generales y ${foliosParciales.length} cortes parciales.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
        // Enviar los datos al backend si se confirma
        try {
            const response = await fetch('/api/recepcion/cortes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ foliosGenerales, foliosParciales, recolector }), // Enviar arrays de folios generales y parciales
            });

            if (response.ok) {
                // Mostrar un mensaje de éxito
                Swal.fire({
                    title: 'Éxito',
                    text: 'Los cortes han sido actualizados exitosamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
                location.reload();
            } else {
                throw new Error('Error al actualizar los cortes.');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al actualizar los cortes. Por favor, inténtalo de nuevo.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    } else {
        Swal.fire({
            title: 'Cancelado',
            text: 'La recepción de los cortes ha sido cancelada.',
            icon: 'info',
            confirmButtonText: 'Aceptar'
        });
    }
});

document.getElementById('buscarFolio').addEventListener('input', () => {
    const folioBuscado = document.getElementById('buscarFolio').value.trim();

    if (folioBuscado !== "") {
        const filas = document.querySelectorAll('#tablaRecoleccionBody tr');
        const tablaRecibirCortes = document.getElementById('tablaRecibirCortes');

        let folioEncontrado = false;
        let folioYaAgregado = false;

        // Verificar si el folio ya está en la tabla de recibir cortes
        const foliosEnTabla = Array.from(tablaRecibirCortes.querySelectorAll('tr td:first-child')).map(td => td.textContent.trim());

        if (foliosEnTabla.includes(folioBuscado)) {
            folioYaAgregado = true;
        } else {
            // Buscar en las filas si el folio coincide
            filas.forEach(fila => {
                const celdaFolio = fila.querySelector('td:first-child');
                if (celdaFolio && celdaFolio.textContent.trim() === folioBuscado) {
                    const button = fila.querySelector('.btnRecibir');
                    if (button && button.style.visibility !== 'hidden') {
                        aplicarLogicaRecibir(button);
                        folioEncontrado = true;
                    }
                }
            });
        }

        // Limpia el input si el folio ya está agregado o si fue encontrado y procesado
        if (folioYaAgregado || folioEncontrado) {
            document.getElementById('buscarFolio').value = ""; // Limpia el input
        }
    }
});












