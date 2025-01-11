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
                        <button class="btn btn-sm btn-info btnImprimirTraspaso" data-id="${traspaso._id}">Imprimir</button>
                    </td>
                </tr>
            `;
            tbody.insertAdjacentHTML('beforeend', row);
        });

        // ✅ Asegúrate de agregar eventos a los nuevos botones
        agregarEventosImpresion();

    } catch (error) {
        console.error('❌ Error al cargar traspasos:', error);
        Swal.fire('❌ Error', 'No se pudieron cargar los traspasos.', 'error');
    }
}


// 📌 Evento para el botón de cargar traspasos
document.getElementById('btnCargarTraspasos').addEventListener('click', cargarTraspasos);

// 📌 Función para obtener y mostrar un traspaso para imprimir
async function imprimirTraspaso(id) {
    try {
        const response = await fetch(`/api/traspasos/${id}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener los datos del traspaso');
        }

        const traspaso = data.traspaso;

        // ✅ Generar contenido HTML imprimible
        const contenidoImprimible = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="text-align: center;">TRASPASO ENTRE ALMACÉNES</h2>
                <hr>
                <p><strong>Folio:</strong> ${traspaso.folio}</p>
                <p><strong>Sucursal Origen:</strong> ${traspaso.sucursalOrigen.nombre}</p>
                <p><strong>Sucursal Destino:</strong> ${traspaso.sucursalDestino.nombre}</p>
                <p><strong>Usuario Origen:</strong> ${traspaso.usuarioOrigen.name} (@${traspaso.usuarioOrigen.username})</p>
                <p><strong>Usuario Destino:</strong> ${traspaso.usuarioDestino.name} (@${traspaso.usuarioDestino.username})</p>
                <p><strong>Fecha:</strong> ${new Date(traspaso.fecha).toLocaleDateString()}</p>
                <p><strong>Observaciones:</strong> ${traspaso.observaciones || 'Ninguna'}</p>
                <hr>
                <h4>Productos Traspasados</h4>
                <table border="1" cellpadding="5" cellspacing="0" style="width: 100%; border-collapse: collapse; text-align: left;">
                    <thead>
                        <tr>
                            <th>Referencia</th>
                            <th>Nombre</th>
                            <th>Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${traspaso.productos.map(producto => `
                            <tr>
                                <td>${producto.reference}</td>
                                <td>${producto.name}</td>
                                <td>${producto.cantidad}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <hr>
            </div>
        `;

        // ✅ Crear una ventana emergente para imprimir
        const ventanaImpresion = window.open('', '_blank');
        ventanaImpresion.document.write(`
            <html>
                <head>
                    <title>Imprimir Traspaso</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
                        h2 { margin-bottom: 10px; }
                        table { margin-top: 20px; }
                        table th, table td { text-align: left; }
                    </style>
                </head>
                <body>
                    ${contenidoImprimible}
                </body>
            </html>
        `);
        ventanaImpresion.document.close();
        ventanaImpresion.print();
        ventanaImpresion.close();

    } catch (error) {
        console.error('❌ Error al imprimir el traspaso:', error);
        Swal.fire('❌ Error', 'No se pudo imprimir el traspaso.', 'error');
    }
}

// 📌 Evento para el botón de impresión
function agregarEventosImpresion() {
    document.querySelectorAll('.btnImprimirTraspaso').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            imprimirTraspaso(id);
        });
    });
}

// 📌 Llamar a esta función después de cargar los datos
document.addEventListener('DOMContentLoaded', () => {
    agregarEventosImpresion();
});
