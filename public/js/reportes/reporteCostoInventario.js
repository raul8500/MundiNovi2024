const selectOptions = [
    { url: '/api/sucursal', selectId: 'sucursalSelect' },
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


document.getElementById('crearReporte').addEventListener('click', async () => {
    try {
        // Obtener la sucursal seleccionada desde el select
        const idSucursal = document.getElementById('sucursalSelect').value;

        // Validar que se haya seleccionado una sucursal
        if (!idSucursal) {
            Swal.fire({
                title: 'Error',
                text: 'Por favor, seleccione una sucursal.',
                icon: 'warning',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        // Mostrar la pantalla de carga
        document.getElementById('loadingScreen').style.display = 'flex';
        
        // Realizar la solicitud GET al backend con el parámetro de sucursal
        const response = await fetch(`/api/reporteCostoInventario/${idSucursal}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Verificar si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error('Error al obtener los datos del Kardex');
        }

        // Obtener los datos en formato JSON
        const data = await response.json();

        // Llamar a la función para agregar los datos a la tabla
        agregarDatosATabla(data.productos, data);

        // Ocultar la pantalla de carga
        document.getElementById('loadingScreen').style.display = 'none';

        // Mostrar un mensaje de éxito
        Swal.fire({
            title: 'Reporte generado',
            text: 'El reporte ha sido generado con éxito.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });

    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'Error en la conexión con el servidor.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });

        // Ocultar la pantalla de carga en caso de error
        document.getElementById('loadingScreen').style.display = 'none';
    }
});

// Función para agregar los datos a la tabla
function agregarDatosATabla(productos, data) {
    const tbody = document.getElementById('datosCostoInventario');
    tbody.innerHTML = ''; // Limpiar la tabla antes de agregar los nuevos datos

    // Iterar sobre los productos y agregar cada fila a la tabla
    productos.forEach(producto => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${producto.cantidad}</td>
            <td>${producto.reference}</td>
            <td>${producto.nombre}</td>
            <td>${producto.costo}</td>
            <td>${producto.importe}</td>
        `;

        tbody.appendChild(tr);
    });

    document.getElementById('totalCostoInventario').innerHTML = `<strong>Total General: </strong> ${data.totalGeneral}`;
}

document.getElementById('imprimirReporte').addEventListener('click', async () => {
    try {
        // Obtener el contenido de la tabla
        const tablaHTML = document.getElementById('datosCostoInventario').innerHTML;

        // Obtener el nombre de la sucursal seleccionada
        const nombreSucursal = document.getElementById('sucursalSelect').options[document.getElementById('sucursalSelect').selectedIndex].text;

        // Obtener el total
        const totalGeneral = document.getElementById('totalCostoInventario').textContent || '0';

        // Crear un nuevo documento para la impresión
        const ventanaImpresion = window.open('', '', 'width=800,height=600');
        
        // Escribir el contenido de la tabla y los detalles en la ventana de impresión
        ventanaImpresion.document.write(`
            <html>
                <head>
                    <title>Reporte Costo Inventario</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { padding: 8px; text-align: left; border: 1px solid #ddd; }
                        th { background-color: #f2f2f2; }
                        h2 { text-align: center; }
                        .total { font-weight: bold; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <h2>Reporte Costo Inventario</h2>
                    <h4><strong>Sucursal: </strong>${nombreSucursal}</h4>
                    <div class="total">
                        <p><strong></strong>${totalGeneral}</p>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Cantidad</th>
                                <th>Referencia</th>
                                <th>Nombre</th>
                                <th>Costo</th>
                                <th>Importe</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tablaHTML}
                        </tbody>
                    </table>
                    <div class="total">
                        <p><strong></strong>${totalGeneral}</p>
                    </div>
                </body>
            </html>
        `);

        // Esperar a que el contenido se cargue y luego imprimir
        ventanaImpresion.document.close();  // Necesario para asegurarse de que el contenido esté listo
        ventanaImpresion.print();  // Iniciar la impresión

        // Cerrar la ventana de impresión después de imprimir (opcional)
        ventanaImpresion.close();

    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'Error al intentar imprimir el reporte.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
});
