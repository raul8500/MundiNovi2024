// 🛠️ Variables globales
let pedidos = [];

/**
 * 📥 Cargar opciones de sucursales
 */
const selectOptions = [{ url: '/api/sucursal', selectId: 'filtroSucursal' }];

async function loadSelectOptions(options) {
    try {
        const loadOptions = async (url, selectId) => {
            const select = document.getElementById(selectId);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error al obtener los datos de ${selectId}`);
            }
            const data = await response.json();

            select.innerHTML = '<option value="">Selecciona una sucursal</option>';
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item._id;
                option.textContent = item.nombre;
                select.appendChild(option);
            });
        };

        for (const option of options) {
            await loadOptions(option.url, option.selectId);
        }
    } catch (error) {
        console.error('❌ Error al cargar sucursales:', error);
    }
}


/**
 * 📋 Renderizar Tabla de Pedidos
 * @param {Array} pedidos - Lista de pedidos.
 */
function renderizarTablaPedidos(pedidos) {
    const tbody = document.getElementById('tablaPedidos').querySelector('tbody');
    tbody.innerHTML = '';

    if (pedidos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center">No se encontraron pedidos.</td></tr>`;
        return;
    }

    pedidos.forEach(pedido => {
        const row = `
            <tr>
                <td>${pedido._id || 'N/A'}</td>
                <td>${pedido.cliente?.nombre || 'N/A'}</td>
                <td>${pedido.usuario?.name || 'N/A'}</td>
                <td>${pedido.estado || 'Pendiente'}</td>
                <td>${pedido.entrega?.fecha || 'N/A'}</td>
                <td>$${pedido.total?.toFixed(2) || '0.00'}</td>
                <td>
                    <div class="btn-group" role="group" aria-label="Acciones">
                        <button class="btn btn-sm btn-outline-primary" onclick="imprimirPedido('${pedido._id}')">🖨️ Imprimir</button>
                        <button class="btn btn-sm btn-outline-success" onclick="recibirPedido('${pedido._id}')">📦 Recibir</button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="generarCodigosBarras('${pedido._id}')">📊 Códigos</button>
                        <button class="btn btn-sm btn-outline-info" onclick="verDetallesPedido('${pedido._id}')">🔍 Ver</button>
                        <button class="btn btn-sm btn-outline-danger" onclick="eliminarPedido('${pedido._id}')">🗑️ Eliminar</button>
                    </div>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

/**
 * 📋 Renderizar Tabla de Pedidos
 * @param {Array} pedidos - Lista de pedidos.
 */
function renderizarTablaPedidos(pedidos) {
    const tbody = document.getElementById('tablaPedidos').querySelector('tbody');
    tbody.innerHTML = '';

    if (pedidos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center">No se encontraron pedidos.</td></tr>`;
        return;
    }

    pedidos.forEach(pedido => {
        const row = `
            <tr>
                <td>${pedido._id || 'N/A'}</td>
                <td>${pedido.cliente?.nombre || 'N/A'}</td>
                <td>${pedido.usuario?.name || 'N/A'}</td>
                <td>${pedido.estado || 'Pendiente'}</td>
                <td>${formatearFecha(pedido.entrega?.fecha)}</td>
                <td>$${pedido.total?.toFixed(2) || '0.00'}</td>
                <td>
                    <button class="btn btn-sm btn-success" onclick="recibirPedido('${pedido._id}')">📥 Recibir</button>
                    <button class="btn btn-sm btn-primary" onclick="imprimirPedido('${pedido._id}')">🖨️ Imprimir</button>
                    <button class="btn btn-sm btn-warning" onclick="generarCodigosBarras('${pedido._id}')">🏷️ Códigos</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}



/**
 * 🕵️‍♂️ Buscar Pedidos
 */
async function buscarPedidos() {
    const sucursalId = document.getElementById('filtroSucursal').value.trim();
    const fechaEntrega = document.getElementById('filtroFecha').value.trim();
    const folio = document.getElementById('filtroFolio').value.trim();

    if (!sucursalId || !fechaEntrega) {
        Swal.fire({
            icon: 'warning',
            title: '¡Atención!',
            text: 'Debes seleccionar una sucursal y una fecha de entrega.',
        });
        return;
    }

    try {
        let url = `/api/pedidos/filtrar/${sucursalId}/${fechaEntrega}`;
        if (folio) {
            url += `?folio=${folio}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('Error al buscar pedidos');

        const data = await response.json();
        pedidos = data.data || [];
        actualizarResumen(pedidos);
        renderizarTablaPedidos(pedidos);

        console.log('✅ Pedidos cargados:', pedidos);
    } catch (error) {
        console.error('❌ Error al buscar pedidos:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al buscar los pedidos.',
        });
    }
}

// 🔍 Evento para el botón de búsqueda
document.getElementById('btnBuscarPedidos').addEventListener('click', buscarPedidos);

// 🛠️ Inicializar
document.addEventListener('DOMContentLoaded', () => {
    loadSelectOptions(selectOptions);
});

/**
 * 📊 Actualizar Resumen de Pedidos
 * @param {Array} pedidos - Lista de pedidos.
 */
function actualizarResumen(pedidos) {
    const totalPedidos = pedidos.length;
    const importeTotal = pedidos.reduce((acc, pedido) => acc + (pedido.total || 0), 0);

    // Actualizar los elementos en el DOM
    document.getElementById('resumenTotalPedidos').textContent = totalPedidos;
    document.getElementById('resumenImporteTotal').textContent = `$${importeTotal.toFixed(2)}`;
}


/**
 * 📅 Formatear Fecha
 * @param {string} fechaISO - Fecha en formato ISO (ej. 2024-12-21T00:00:00.000Z)
 * @returns {string} - Fecha en formato "Día-Mes-Año"
 */
function formatearFecha(fechaISO) {
    if (!fechaISO) return 'N/A';
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getUTCDate()).padStart(2, '0');
    const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const anio = fecha.getUTCFullYear();

    return `${dia}-${mes}-${anio}`;
}
