

// 📌 JSON Global para almacenar el pedido
let pedidoData = {
    cliente: {},
    factura: null,
    entrega: {},
    productos: [],
    observaciones: ''
};

let cotizacion; // Variable global para almacenar los datos de la cotización

// 📌 Al cargar el DOM
document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const idCotizacion = params.get('id'); // Obtener ID de la cotización

    if (!idCotizacion) {
        console.error("❌ No se recibió el ID de la cotización.");
        return;
    }

    try {
        const response = await fetch(`/api/cotizaciones/${idCotizacion}`);
        if (!response.ok) {
            throw new Error("❌ No se pudo recuperar la cotización.");
        }

        cotizacion = await response.json();
        console.log("✅ Cotización Recuperada:", cotizacion);

        rellenarFormularioCliente(cotizacion.cliente);

    } catch (error) {
        console.error("❌ Error al cargar la cotización:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message,
        });
    }

    // 👉 Botón "Siguiente" en Cliente
    document.getElementById('btnSiguienteFacturacion').addEventListener('click', () => {
        if (validarInformacionCliente()) {
            guardarInformacionCliente();
            actualizarResumenCliente();
            document.getElementById('facturacion-tab').removeAttribute('disabled');
            document.getElementById('facturacion-tab').click();
        }
    });

    // 👉 Botones de Facturación
    document.getElementById('btnFacturaSi').addEventListener('click', () => {
        guardarInformacionFacturacion(true);
    });

    document.getElementById('btnFacturaNo').addEventListener('click', () => {
        guardarInformacionFacturacion(false);
    });

    // 👉 Botón "Siguiente" en Facturación
    document.getElementById('btnSiguienteEntrega').addEventListener('click', () => {
        if (pedidoData.factura !== null) {
            actualizarResumenFacturacion();
            document.getElementById('entrega-tab').removeAttribute('disabled');
            document.getElementById('entrega-tab').click();
        } else {
            Swal.fire({
                icon: 'warning',
                title: '¡Atención!',
                text: 'Debes seleccionar si el pedido requiere factura o no.',
            });
        }
    });

    // 👉 Evento para cambios en RFC
    document.getElementById('identificacionCliente').addEventListener('input', (event) => {
        const rfc = event.target.value.trim();
        actualizarOpcionesRegimen(rfc);
    });
});

/* ----------------------------------------- */
/*         FUNCIONES CLIENTE                 */
/* ----------------------------------------- */

/**
 * Rellena el formulario con la información del cliente.
 */
function rellenarFormularioCliente(cliente) {
    const clientData = cliente?.id?.clientData || {};
    const address = clientData?.address || {};

    // Información básica
    document.getElementById('nombreCliente').value = cliente.nombre || '';
    document.getElementById('identificacionCliente').value = clientData.identification || '';
    document.getElementById('telefonoPrincipalCliente').value = cliente.telefono || '';
    document.getElementById('correoCliente').value = cliente.correo || '';

    // Dirección
    document.getElementById('calleCliente').value = address.street || '';
    document.getElementById('numeroExteriorCliente').value = address.exteriorNumber || '';
    document.getElementById('numeroInteriorCliente').value = address.interiorNumber || '';
    document.getElementById('coloniaCliente').value = address.colony || '';
    document.getElementById('localidadCliente').value = address.locality || '';
    document.getElementById('municipioCliente').value = address.municipality || '';
    document.getElementById('estadoCliente').value = address.state || '';
    document.getElementById('codigoPostalCliente').value = address.zipCode || '';

    actualizarOpcionesRegimen(clientData.identification, clientData.regime);
}

/**
 * Valida que la información mínima del cliente esté completa.
 */
function validarInformacionCliente() {
    const calle = document.getElementById('calleCliente').value.trim();
    const colonia = document.getElementById('coloniaCliente').value.trim();
    const localidad = document.getElementById('localidadCliente').value.trim();
    const codigoPostal = document.getElementById('codigoPostalCliente').value.trim();

    const camposFaltantes = [];

    if (!calle) camposFaltantes.push('Calle');
    if (!colonia) camposFaltantes.push('Colonia');
    if (!localidad) camposFaltantes.push('Localidad');
    if (!codigoPostal) camposFaltantes.push('Código Postal');

    if (camposFaltantes.length > 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos faltantes',
            text: `Debes completar los siguientes campos:\n- ${camposFaltantes.join('\n- ')}`,
        });
        return false;
    }

    return true;
}

/**
 * Guarda la información del cliente en el JSON.
 */
function guardarInformacionCliente() {
    pedidoData.cliente = {
        idCliente: cotizacion?.cliente?.id || null,
        nombre: document.getElementById('nombreCliente').value.trim(),
        identificacion: document.getElementById('identificacionCliente').value.trim(),
        regimen: document.getElementById('regimenCliente').value,
        telefonoPrincipal: document.getElementById('telefonoPrincipalCliente').value.trim(),
        telefonoContacto: document.getElementById('telefonoContactoCliente').value.trim(),
        correo: document.getElementById('correoCliente').value.trim(),
        direccion: {
            calle: document.getElementById('calleCliente').value.trim(),
            colonia: document.getElementById('coloniaCliente').value.trim(),
            localidad: document.getElementById('localidadCliente').value.trim(),
            estado: document.getElementById('estadoCliente').value.trim(),
            codigoPostal: document.getElementById('codigoPostalCliente').value.trim()
        }
    };

    console.log(pedidoData);
}

/**
 * Actualiza las opciones del régimen fiscal en función del RFC.
 */
/**
 * Actualiza las opciones del régimen fiscal en función del RFC.
 * @param {string} rfc - RFC del cliente.
 * @param {string} regimenActual - Régimen fiscal actual del cliente.
 */
function actualizarOpcionesRegimen(rfc, regimenActual = '') {
    const regimenSelect = document.getElementById('regimenCliente');
    regimenSelect.innerHTML = ''; // Limpiar opciones anteriores

    let opciones = [];

    if (!rfc) {
        opciones = [{ value: 'NO_REGIME', text: 'Sin régimen' }];
    } else if (rfc.length === 13) {
        opciones = [
            { value: 'NO_REGIME', text: 'Sin régimen' },
            { value: 'BUSINESS_ACTIVITIES_REGIME', text: 'Actividades Empresariales y Profesionales' },
            { value: 'FISCAL_INCORPORATION_REGIME', text: 'Incorporación Fiscal' },
            { value: 'LEASEHOLD_REGIME', text: 'Arrendamiento' },
            { value: 'REGIME_OF_THE_TECHNOLOGICAL_PLATFORMS_INCOME_ACTIVITIES', text: 'Plataformas Tecnológicas' },
            { value: 'SALARIED_REGIME', text: 'Sueldos y Salarios' },
            { value: 'REGIME_OF_TRUST', text: 'Régimen simplificado de confianza (RESICO)' },
            { value: 'SIMPLIFIED_REGIME', text: 'Sin obligaciones fiscales' },
            { value: 'DIVIDEND_INCOME', text: 'Ingresos por Dividendos' }
        ];
    } else {
        opciones = [
            { value: 'NO_REGIME', text: 'Sin régimen' },
            { value: 'GENERAL_REGIME_OF_MORAL_PEOPLE_LAW', text: 'General de Ley Personas Morales' },
            { value: 'REGIME_OF_MORAL_PEOPLE_NOT_PROFIT', text: 'Personas Morales sin Fines de Lucro' },
            { value: 'PRIMARY_SECTOR_REGIME', text: 'Agrícolas, Ganaderas, Silvícolas y Pesqueras' },
            { value: 'REGIME_OF_THE_COORDINATED', text: 'Coordinados' },
            { value: 'REGIME_OF_TRUST', text: 'Régimen simplificado de confianza (RESICO)' },
            { value: 'SOCIETIES_OPTIONAL_REGIME', text: 'Grupos de Sociedades' }
        ];
    }

    // Insertar opciones en el select
    opciones.forEach(opcion => {
        const option = document.createElement('option');
        option.value = opcion.value;
        option.textContent = opcion.text;
        regimenSelect.appendChild(option);
    });

    // Seleccionar el régimen actual después de agregar las opciones
    if (regimenActual) {
        const optionExists = Array.from(regimenSelect.options).some(option => option.value === regimenActual);
        if (optionExists) {
            regimenSelect.value = regimenActual;
        } else {
            console.warn(`El régimen "${regimenActual}" no coincide con ninguna opción disponible.`);
        }
    }
}

/* ----------------------------------------- */
/*         FUNCIONES RESUMEN                 */
/* ----------------------------------------- */
function actualizarResumenCliente() {
    document.getElementById('resumenCliente').textContent = pedidoData.cliente.nombre || 'No definido';
}

function actualizarResumenFacturacion() {
    document.getElementById('resumenFacturacion').textContent = 
        pedidoData.factura ? 'Sí' : 'No';
}

/**
 * Guarda la información de facturación en el JSON global.
 * @param {boolean} factura - Indica si el pedido requiere factura.
 */
function guardarInformacionFacturacion(factura) {
    pedidoData.factura = factura;

    // Actualizar el resumen de facturación
    actualizarResumenFacturacion();

    // Habilitar el botón "Siguiente" en la pestaña de facturación
    document.getElementById('btnSiguienteEntrega').removeAttribute('disabled');

    console.log('✅ Información de Facturación Actualizada:', pedidoData);
}



//Entrega

//Cargar sucursal

const selectOptions = [
    { url: '/api/sucursal', selectId: 'sucursal' },

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


/**
 * Guarda la información de entrega (fecha y sucursal) en el JSON global.
 */
function guardarInformacionEntrega() {
    const fechaEntrega = document.getElementById('fechaEntrega').value.trim();
    const sucursalSelect = document.getElementById('sucursal');
    const sucursalId = sucursalSelect.value;
    const sucursalNombre = sucursalSelect.options[sucursalSelect.selectedIndex]?.text || 'No definida';

    if (!fechaEntrega || !sucursalId) {
        Swal.fire({
            icon: 'warning',
            title: '¡Atención!',
            text: 'Debes seleccionar una fecha de entrega y una sucursal válida.',
        });
        return;
    }

    // Guardar en el JSON global
    pedidoData.entrega = {
        fecha: fechaEntrega,
        sucursal: {
            id: sucursalId,
            nombre: sucursalNombre
        }
    };

    // Actualizar el resumen
    actualizarResumenEntrega();

    console.log('✅ Información de Entrega Guardada:', pedidoData.entrega);
}

/**
 * Actualiza el resumen de entrega en la interfaz.
 */
function actualizarResumenEntrega() {
    document.getElementById('resumenFechaEntrega').textContent = pedidoData.entrega.fecha || 'No definida';
    document.getElementById('resumenSucursal').textContent = pedidoData.entrega.sucursal?.nombre || 'No definida';
}


// 👉 Botón "Siguiente" en Entrega
document.getElementById('btnSiguienteProductos').addEventListener('click', () => {
    guardarInformacionEntrega();
    document.getElementById('productos-tab').removeAttribute('disabled');
    document.getElementById('productos-tab').click();
});

//Productos




function cargarProductosDesdeCotizacion() {
    if (cotizacion?.productos) {
        productosSeleccionados = cotizacion.productos.map(producto => ({
            id: producto.id,
            reference: producto.reference,
            nombre: producto.nombre,
            cantidad: producto.cantidad,
            precio: producto.precio,
            total: producto.cantidad * producto.precio,
            datosFinancieros: producto.datosFinancieros || {}
        }));
        actualizarTablaProductos();
        actualizarResumenProductos();
    } else {
        console.warn('⚠️ No hay productos en la cotización.');
    }
}

async function cargarTodosLosProductos() {
    try {
        const response = await fetch('/api/productos');
        if (!response.ok) {
            throw new Error('❌ Error al recuperar los productos desde la base de datos.');
        }
        const data = await response.json();
        productos = data.products || [];
        console.log('✅ Productos cargados:', productos);
    } catch (error) {
        console.error('❌ Error al cargar los productos:', error);
    }
}

cargarTodosLosProductos ()
/**
 * Busca productos usando Fuse.js y muestra sugerencias.
 * @param {string} query - Texto de búsqueda.
 */
function buscarProducto(query) {
    const options = {
        keys: ['reference', 'name'],
        threshold: 0.4
    };

    const fuse = new Fuse(productos, options);
    return fuse.search(query).map(result => result.item);
}

document.getElementById('buscarProducto').addEventListener('input', (e) => {
    const query = e.target.value.trim();
    const sugerenciasContainer = document.getElementById('sugerenciasProducto');
    sugerenciasContainer.innerHTML = '';

    if (query.length > 0) {
        const sugerencias = buscarProducto(query);

        sugerencias.forEach((producto) => {
            const item = document.createElement('button');
            item.className = 'list-group-item list-group-item-action';
            item.textContent = `${producto.name} - ${producto.reference}`;
            item.addEventListener('click', () => {
                agregarProductoATabla(producto._id);
                sugerenciasContainer.innerHTML = '';
                document.getElementById('buscarProducto').value = '';
            });
            sugerenciasContainer.appendChild(item);
        });
    }
});



/**
 * Agrega un producto seleccionado a la tabla con una cantidad específica.
 * @param {string} id - ID del producto.
 */
function agregarProductoATabla(id) {
    const cantidadInput = document.getElementById('cantidadProducto');
    let cantidad = parseInt(cantidadInput.value, 10);

    if (isNaN(cantidad) || cantidad <= 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Cantidad inválida',
            text: 'Por favor, ingresa una cantidad válida mayor a 0.',
        });
        return;
    }

    const producto = productos.find(p => p._id === id);
    if (producto) {
        const existente = productosSeleccionados.find(p => p.id === id);

        if (existente) {
            existente.cantidad += cantidad;
            existente.precio = obtenerPrecioPorCantidad(producto.datosFinancieros, existente.cantidad);
            existente.total = existente.cantidad * existente.precio;
        } else {
            const precio = obtenerPrecioPorCantidad(producto.datosFinancieros, cantidad);
            productosSeleccionados.push({
                id: producto._id,
                reference: producto.reference,
                nombre: producto.name,
                cantidad: cantidad,
                precio: precio,
                total: cantidad * precio,
                datosFinancieros: producto.datosFinancieros || {}
            });
        }

        actualizarTablaProductos();
        actualizarResumenProductos();
        cantidadInput.value = 1; // Reiniciar cantidad
        document.getElementById('buscarProducto').value = ''; // Limpiar búsqueda
        document.getElementById('sugerenciasProducto').innerHTML = '';
    } else {
        console.warn('⚠️ Producto no encontrado.');
    }
}


/**
 * Actualiza la tabla de productos seleccionados.
 */
function actualizarTablaProductos() {
    const tbody = document.getElementById('tablaProductos');
    tbody.innerHTML = productosSeleccionados
        .map(p => {
            const descripcionRangos = construirDescripcionRangos(p.datosFinancieros);
            return `
                <tr>
                    <td>${p.reference}</td>
                    <td>
                        <input type="text" value="${p.nombre}" 
                            onchange="actualizarNombreProducto('${p.id}', this.value)"
                            style="width: 100%;" />
                    </td>
                    <td>
                        <input type="number" value="${p.cantidad}" min="1" 
                            onchange="actualizarCantidadProducto('${p.id}', this.value)"
                            style="width: 75px;" />
                    </td>
                    <td>$${p.precio.toFixed(2)}</td>
                    <td>$${p.total.toFixed(2)}</td>
                    <td>${descripcionRangos}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="eliminarProducto('${p.id}')">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        })
        .join('');
}



function actualizarResumenProductos() {
    const total = productosSeleccionados.reduce((acc, p) => acc + p.total, 0);
    document.getElementById('resumenTotal').textContent = `$${total.toFixed(2)}`;
}



/**
 * Guarda la información de los productos en el JSON global.
 */
function guardarInformacionProductos() {
    pedidoData.productos = productosSeleccionados.map(producto => ({
        id: producto.id,
        reference: producto.reference,
        nombre: producto.nombre,
        cantidad: producto.cantidad,
        precio: producto.precio,
        total: producto.total
    }));

    console.log('✅ Información de Productos Guardada:', pedidoData.productos);
}

// 👉 Botón "Siguiente" en Productos
/**
 * Guarda la información de los productos en el JSON global y habilita el botón "Crear Pedido".
 */
document.getElementById('btnSiguienteObservaciones').addEventListener('click', () => {
    // Guardar productos en el JSON
    guardarInformacionProductos();

    // Activar el botón "Crear Pedido"
    document.getElementById('btnCrearPedido').removeAttribute('disabled');

    console.log('✅ Botón "Crear Pedido" habilitado después de productos.');
    document.getElementById('observaciones-tab').removeAttribute('disabled');
    document.getElementById('observaciones-tab').click();
});



/**
 * Carga los productos existentes desde la cotización y los agrega a la tabla.
 */
function cargarProductosDesdeCotizacion() {
    if (!cotizacion?.productos || cotizacion.productos.length === 0) {
        console.warn('⚠️ No hay productos en la cotización.');
        return;
    }

    productosSeleccionados = cotizacion.productos.map(producto => ({
        id: producto.id._id,
        reference: producto.id.reference || producto.reference,
        nombre: producto.nombre || producto.id.name || 'Sin nombre',
        cantidad: producto.cantidad,
        precio: obtenerPrecioPorCantidad(producto.id.datosFinancieros, producto.cantidad),
        total: producto.cantidad * obtenerPrecioPorCantidad(producto.id.datosFinancieros, producto.cantidad),
        datosFinancieros: producto.id.datosFinancieros || {}
    }));

    actualizarTablaProductos();
    actualizarResumenProductos();

    console.log('✅ Productos cargados desde la cotización:', productosSeleccionados);
}



// Llamar al cambiar a la pestaña de productos
document.getElementById('productos-tab').addEventListener('click', cargarProductosDesdeCotizacion);


document.getElementById('productos-tab').addEventListener('click', () => {
    cargarProductosDesdeCotizacion();
});


/**
 * Actualiza la cantidad y el precio de un producto seleccionado.
 * @param {string} id - ID del producto.
 * @param {number} cantidad - Nueva cantidad seleccionada.
 */
function actualizarCantidadProducto(id, cantidad) {
    const producto = productosSeleccionados.find(p => p.id === id);
    const productoBase = productos.find(p => p._id === id);

    if (producto && productoBase) {
        cantidad = parseInt(cantidad, 10);
        if (!isNaN(cantidad) && cantidad > 0) {
            producto.precio = obtenerPrecioPorCantidad(productoBase.datosFinancieros, cantidad);
            producto.cantidad = cantidad;
            producto.total = producto.cantidad * producto.precio;

            actualizarTablaProductos();
            actualizarResumenProductos();

            console.log(`✅ Producto actualizado: ${producto.nombre}, Cantidad: ${cantidad}, Precio: ${producto.precio}`);
        } else {
            console.warn('⚠️ La cantidad debe ser un número positivo.');
        }
    } else {
        console.error('❌ Producto no encontrado en la lista seleccionada o en la base de datos.');
    }
}


/**
 * Obtiene el precio de un producto según la cantidad seleccionada.
 * @param {Object} datosFinancieros - Datos financieros del producto.
 * @param {number} cantidad - Cantidad seleccionada.
 * @returns {number} - Precio correspondiente al rango.
 */
function obtenerPrecioPorCantidad(datosFinancieros, cantidad) {
    for (let i = 1; i <= 10; i++) {
        const rangoInicial = datosFinancieros[`rangoInicial${i}`];
        const rangoFinal = datosFinancieros[`rangoFinal${i}`];
        const precio = datosFinancieros[`precio${i}`];

        if (rangoInicial !== undefined && rangoFinal !== undefined && precio !== undefined) {
            if (cantidad >= rangoInicial && cantidad <= rangoFinal) {
                return precio; // Precio dentro del rango
            }
        }
    }
    return datosFinancieros.precio1 || 0; // Precio por defecto si no coincide ningún rango
}

/**
 * Construye una descripción de los rangos de precios.
 * @param {Object} datosFinancieros - Datos financieros del producto.
 * @returns {string} - Descripción de los rangos de precios.
 */
function construirDescripcionRangos(datosFinancieros) {
    let descripcion = "";
    let ultimoPrecioValido = null; // Almacena el último precio válido
    let lineaActual = ""; // Controla la línea actual

    for (let i = 1; i <= 4; i++) {
        const rangoInicial = datosFinancieros[`rangoInicial${i}`];
        const rangoFinal = datosFinancieros[`rangoFinal${i}`];
        const precio = datosFinancieros[`precio${i}`];

        // Si el precio es válido, lo almacenamos como último precio
        if (precio !== undefined && precio !== null) {
            ultimoPrecioValido = precio;
        }

        // Usamos el último precio válido si el actual es nulo
        if (rangoInicial !== undefined && rangoFinal !== undefined) {
            lineaActual += `De ${rangoInicial} a ${rangoFinal} = $${ultimoPrecioValido || 0} | `;
        }

        // Dividir en dos líneas después de cada dos rangos
        if (i % 2 === 0 || i === 4) {
            descripcion += `<span style="font-size: smaller;">${lineaActual.trimEnd().replace(/\|$/, "")}</span><br>`;
            lineaActual = ""; // Reiniciar para la siguiente línea
        }
    }

    return descripcion || "<span style='font-size: smaller;'>Sin rangos disponibles</span>";
}


/**
 * Elimina un producto de la lista de seleccionados.
 * @param {string} id - ID del producto.
 */
function eliminarProducto(id) {
    productosSeleccionados = productosSeleccionados.filter(p => p.id !== id);
    actualizarTablaProductos();
    actualizarResumenProductos();
    console.log(`🗑️ Producto eliminado: ${id}`);
}

/**
 * Actualiza el nombre de un producto seleccionado.
 * @param {string} id - ID del producto.
 * @param {string} nuevoNombre - Nuevo nombre ingresado por el usuario.
 */
function actualizarNombreProducto(id, nuevoNombre) {
    const producto = productosSeleccionados.find(p => p.id === id);

    if (producto) {
        if (nuevoNombre.trim() !== '') {
            producto.nombre = nuevoNombre.trim();
            console.log(`✅ Nombre actualizado: ${producto.nombre}`);
        } else {
            console.warn('⚠️ El nombre no puede estar vacío.');
        }
    } else {
        console.error('❌ Producto no encontrado.');
    }
}


function guardarInformacionObservaciones() {
    const observaciones = document.getElementById('observacionesPedido').value.trim();
    pedidoData.observaciones = observaciones || '';

    console.log('✅ Información de Observaciones Guardada:', pedidoData.observaciones);
}

/**
 * Envía el pedido al backend.
 */
async function enviarPedido() {
    try {
        // Verificar si hay una cotización cargada
        if (!cotizacion || !cotizacion._id) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No hay una cotización válida para este pedido.'
            });
            return;
        }

        // Añadir el ID de la cotización al JSON global
        pedidoData.cotizacionId = cotizacion._id;

        // Validar si todos los campos necesarios están completos
        if (!pedidoData.cliente || !pedidoData.entrega || !pedidoData.productos.length) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, completa toda la información antes de crear el pedido.'
            });
            return;
        }
        console.log(pedidoData)

        // Enviar el JSON al backend
        const response = await fetch('/api/pedidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedidoData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al crear el pedido.');
        }

        Swal.fire({
            icon: 'success',
            title: 'Pedido Creado',
            text: 'El pedido se ha creado exitosamente y la cotización ha sido eliminada.'
        }).then(() => {
            window.location.href = '/cotizacionesAdmin'; // Redirige a la lista de pedidos
        });

    } catch (error) {
        console.error('❌ Error al crear el pedido:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message
        });
    }
}


// 👉 Evento para el botón "Crear Pedido"
document.getElementById('btnCrearPedido').addEventListener('click', enviarPedido);
