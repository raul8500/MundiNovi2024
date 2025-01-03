// Función para obtener los parámetros de la URL

// 📌 Variable global para almacenar los productos cargados
let productos = [];
let indiceSeleccionado = -1;



function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        sucursalOrigen: params.get('sucursalOrigen'),
        sucursalDestino: params.get('sucursalDestino'),
        fechaInicial: params.get('fechaInicial'),
        fechaFinal: params.get('fechaFinal')
    };
}

// Usar los parámetros
document.addEventListener('DOMContentLoaded', () => {
    const { sucursalOrigen, sucursalDestino , fechaInicial, fechaFinal } = getQueryParams();

    console.log('Sucursal O:', sucursalOrigen);
        console.log('Sucursal D:', sucursalDestino);
    console.log('Fecha Inicial:', fechaInicial);
    console.log('Fecha Final:', fechaFinal);

    document.getElementById('fechaInicio'). value = fechaInicial
    document.getElementById('fechaFinal'). value = fechaFinal
    cargarUsuarios(sucursalOrigen, sucursalDestino)
    obtenerVentasPorSucursalYFechas(sucursalOrigen, sucursalDestino, fechaInicial, fechaFinal )
});

function cargarUsuarios(sucursalOrigen, sucursalDestino) {
    fetch(`/api/auth/users/sucursales/${sucursalOrigen}/${sucursalDestino}`)
        .then((response) => response.json())
        .then((data) => {
            if (!data.success) {
                console.error('Error al obtener datos:', data.message);
                return;
            }

            const [origen, destino] = data.data;

            // Obtener elementos del DOM
            const sucursalOrigenSelect = document.getElementById('sucursalOrigen');
            const sucursalDestinoSelect = document.getElementById('sucursalDestino');
            const usuarioOrigenSelect = document.getElementById('usuarioOrigen');
            const usuarioDestinoSelect = document.getElementById('usuarioDestino');

            // Limpiar selects
            usuarioOrigenSelect.innerHTML = '<option value="">Seleccione un usuario</option>';
            usuarioDestinoSelect.innerHTML = '<option value="">Seleccione un usuario</option>';

            // Llenar selects de Sucursal
            const opcionOrigen = document.createElement('option');
            opcionOrigen.value = origen.sucursal._id;
            opcionOrigen.textContent = origen.sucursal.nombre;
            sucursalOrigenSelect.appendChild(opcionOrigen);

            const opcionDestino = document.createElement('option');
            opcionDestino.value = destino.sucursal._id;
            opcionDestino.textContent = destino.sucursal.nombre;
            sucursalDestinoSelect.appendChild(opcionDestino);

            // Llenar selects de Usuarios Origen
            origen.usuarios.forEach(usuario => {
                const option = document.createElement('option');
                option.value = usuario._id;
                option.textContent = `${usuario.name} (@${usuario.username})`;
                usuarioOrigenSelect.appendChild(option);
            });

            // Llenar selects de Usuarios Destino
            destino.usuarios.forEach(usuario => {
                const option = document.createElement('option');
                option.value = usuario._id;
                option.textContent = `${usuario.name} (@${usuario.username})`;
                usuarioDestinoSelect.appendChild(option);
            });

        })
        .catch((error) => {
            console.error('Error al cargar los datos:', error);
        });
}

// 📌 Función principal para obtener ventas
async function obtenerVentasPorSucursalYFechas(sucursalOrigenId, sucursalDestinoId, fechaInicio, fechaFinal) {
    try {
        const response = await fetch(`/api/traspasos/${sucursalOrigenId}/${sucursalDestinoId}/${fechaInicio}/${fechaFinal}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener ventas');
        }

        console.log('✅ Datos de ventas recibidos:', data);

        // Asignar productos a la variable global
        productos = data.ventas || [];
        // Llamar a la función para llenar la tabla
        llenarTablaProductosTraspaso(data.ventas);

    } catch (error) {
        console.error('❌ Error al obtener ventas:', error);
    }
}

// 📌 Función para llenar la tabla productosTraspaso
function llenarTablaProductosTraspaso(productos) {
    const tablaBody = document.getElementById('productosTraspaso');
    tablaBody.innerHTML = ''; // Limpiar la tabla antes de llenarla

    // ✅ Agregar fila de totales al inicio
    const filaTotales = `
        <tr class="table fw-bold">
            <td colspan="5" class="text-end">Totales:</td>
            <td id="totalVentaPeriodo">0</td>
            <td colspan="5"></td>
            <td id="totalVolumen">0</td>
            <td id="totalPeso">0</td>
            <td colspan="3"></td>
            <td>
                <button id="btnVaciarListado" class="btn btn-sm btn-danger btnVaciarListado">Vaciar Listado</button>
            </td>
        </tr>
    `;
    tablaBody.insertAdjacentHTML('afterbegin', filaTotales);

    // ✅ Llenar la tabla con productos
    let totalVentaPeriodo = 0;
    let totalVolumen = 0;
    let totalPeso = 0;

    productos.forEach((producto) => {
        const cantidadVendidaOrigen = producto.cantidadVendidaOrigen;
        const volumen = parseFloat(producto.volumen) || 0;
        const peso = parseFloat(producto.peso) || 0;

        totalVentaPeriodo += cantidadVendidaOrigen;
        totalVolumen += volumen;
        totalPeso += peso;
    });

    productos.forEach((producto) => {
        const cantidadVendidaOrigen = producto.cantidadVendidaOrigen;
        const cantidadVendida = producto.cantidadVendidaOrigen + producto.cantidadVendidaDestino;
        const volumen = parseFloat(producto.volumen) || 0;
        const peso = parseFloat(producto.peso) || 0;

        // Calcular participación
        const participacion = totalVentaPeriodo > 0 
            ? ((cantidadVendida / totalVentaPeriodo) * 100).toFixed(2) 
            : '0';

        const nuevaCantidad = producto.stockMaximoOrigen - producto.existenciaDestino;
        const esInvalido = nuevaCantidad > producto.existenciaOrigen ? 'is-invalid' : '';

        const fila = `
            <tr>
                <td>${producto.reference}</td>
                <td>${producto.name}</td>
                <td>${producto.presentacion || '-'}</td>
                <td>${producto.existenciaOrigen}</td>
                <td>${producto.existenciaDestino}</td>
                <td>${cantidadVendidaOrigen}</td>
                <td class="ventaDiaria">0</td>
                <td class="stockMinimoSugerido">0</td>
                <td class="stockMaximoSugerido">0</td>
                <td>
                    <input type="number" class="form-control form-control-sm stockMinimo" value="${producto.stockMinimoOrigen}" min="0" data-reference="${producto.reference}">
                </td>
                <td>
                    <input type="number" class="form-control form-control-sm stockMaximo" value="${producto.stockMaximoOrigen}" min="0" data-reference="${producto.reference}">
                </td>
                <td>${volumen}</td>
                <td>${peso}</td>
                <td class="participacionVenta">${participacion}%</td>
                <td>0</td>
                <td>
                    <input type="number" class="form-control form-control-sm cantidad ${esInvalido}" value="${nuevaCantidad}" min="0" data-reference="${producto.reference}">
                </td>
                <td>
                    <button class="btn btn-sm btn-danger btnEliminarProducto" data-reference="${producto.reference}">Eliminar</button>
                </td>
            </tr>
        `;
        tablaBody.insertAdjacentHTML('beforeend', fila);
    });

    // ✅ Actualizar totales en la fila de totales
    document.getElementById('totalVentaPeriodo').textContent = totalVentaPeriodo;
    document.getElementById('totalVolumen').textContent = totalVolumen.toFixed(2);
    document.getElementById('totalPeso').textContent = totalPeso.toFixed(2);

    // ✅ Eventos para cálculos dinámicos
    document.getElementById('periodoDias').addEventListener('input', actualizarVentaDiaria);
    document.getElementById('diasProtegerMin').addEventListener('input', actualizarStockSugerido);
    document.getElementById('diasProtegerFinal').addEventListener('input', actualizarStockSugerido);

    document.querySelectorAll('.stockMaximo').forEach(input => {
        input.addEventListener('input', actualizarCantidadPorStockMaximo);
    });

    console.log('✅ Totales calculados correctamente:', {
        totalVentaPeriodo,
        totalVolumen,
        totalPeso
    });
}

// 📌 Función para actualizar Venta Diaria
function actualizarVentaDiaria() {
    const periodoDias = parseFloat(document.getElementById('periodoDias').value) || 1;

    document.querySelectorAll('#productosTraspaso tr').forEach((fila) => {
        const celdaCantidadOrigen = fila.querySelector('td:nth-child(6)');
        const celdaVentaDiaria = fila.querySelector('.ventaDiaria');

        if (celdaCantidadOrigen && celdaVentaDiaria) {
            const cantidadOrigen = parseFloat(celdaCantidadOrigen.textContent) || 0;
            const ventaDiaria = (cantidadOrigen / periodoDias).toFixed(2);
            celdaVentaDiaria.textContent = ventaDiaria;
        }
    });

    actualizarStockSugerido();
}

// 📌 Función para actualizar Stock Sugerido
function actualizarStockSugerido() {
    const diasProtegerMin = parseFloat(document.getElementById('diasProtegerMin').value) || 1;
    const diasProtegerFinal = parseFloat(document.getElementById('diasProtegerFinal').value) || 1;

    document.querySelectorAll('#productosTraspaso tr').forEach((fila) => {
        const celdaVentaDiaria = fila.querySelector('.ventaDiaria');
        const celdaStockMinimoSugerido = fila.querySelector('.stockMinimoSugerido');
        const celdaStockMaximoSugerido = fila.querySelector('.stockMaximoSugerido');

        if (celdaVentaDiaria && celdaStockMinimoSugerido && celdaStockMaximoSugerido) {
            const ventaDiaria = parseFloat(celdaVentaDiaria.textContent) || 0;
            celdaStockMinimoSugerido.textContent = (ventaDiaria * diasProtegerMin).toFixed(2);
            celdaStockMaximoSugerido.textContent = (ventaDiaria * diasProtegerFinal).toFixed(2);
        }
    });
}

// 📌 Actualizar Cantidad al modificar Stock Máximo
function actualizarCantidadPorStockMaximo(event) {
    const inputStockMaximo = event.target;
    const fila = inputStockMaximo.closest('tr');

    const stockMaximo = parseFloat(inputStockMaximo.value) || 0;
    const existenciaDestino = parseFloat(fila.querySelector('td:nth-child(5)').textContent) || 0;
    const existenciaOrigen = parseFloat(fila.querySelector('td:nth-child(4)').textContent) || 0;

    const nuevaCantidad = stockMaximo - existenciaDestino;
    const inputCantidad = fila.querySelector('.cantidad');

    inputCantidad.value = nuevaCantidad;
    inputCantidad.classList.toggle('is-invalid', nuevaCantidad > existenciaOrigen);

    // Recalcular totales y participación
    recalcularTotales();
}



// 📌 Recalcular los totales de la tabla
function recalcularTotales() {
    let totalVentaPeriodo = 0;
    let totalVolumen = 0;
    let totalPeso = 0;

    // Calcular totales
    document.querySelectorAll('#productosTraspaso tr').forEach((fila, index) => {
        if (index === 0) return; // Saltar la fila de totales

        const cantidad = parseFloat(fila.querySelector('td:nth-child(6)').textContent) || 0;
        const volumen = parseFloat(fila.querySelector('td:nth-child(12)').textContent) || 0;
        const peso = parseFloat(fila.querySelector('td:nth-child(13)').textContent) || 0;

        totalVentaPeriodo += cantidad;
        totalVolumen += volumen;
        totalPeso += peso;
    });

    // Actualizar totales en la fila de totales
    document.getElementById('totalVentaPeriodo').textContent = totalVentaPeriodo.toFixed(2);
    document.getElementById('totalVolumen').textContent = totalVolumen.toFixed(2);
    document.getElementById('totalPeso').textContent = totalPeso.toFixed(2);

    // Actualizar participación para cada producto
    document.querySelectorAll('#productosTraspaso tr').forEach((fila, index) => {
        if (index === 0) return; // Saltar la fila de totales

        const cantidad = parseFloat(fila.querySelector('td:nth-child(6)').textContent) || 0;
        const celdaParticipacion = fila.querySelector('.participacionVenta');

        const participacion = totalVentaPeriodo > 0
            ? ((cantidad / totalVentaPeriodo) * 100).toFixed(2)
            : '0';

        celdaParticipacion.textContent = `${participacion}%`;
    });

    console.log('✅ Totales y participaciones recalculados:', {
        totalVentaPeriodo,
        totalVolumen,
        totalPeso
    });
}



// 📌 Función para eliminar un producto de la tabla (Optimizada)
function eliminarProductoDeTabla(event) {
    const botonEliminar = event.target;

    // Encontrar la fila más cercana al botón y eliminarla directamente
    const fila = botonEliminar.closest('tr');
    if (fila) {
        fila.remove();
    }

    // Usar debounce para evitar múltiples recálculos rápidos
    clearTimeout(window.timeoutRecalcularTotales);
    window.timeoutRecalcularTotales = setTimeout(recalcularTotales, 200);
}

// 📌 Evento Delegado para los Botones de Eliminar
document.getElementById('productosTraspaso').addEventListener('click', (event) => {
    if (event.target.classList.contains('btnEliminarProducto')) {
        eliminarProductoDeTabla(event);
    }
});


// 📌 Delegación de eventos para vaciar listado
on(document, 'click', '.btnVaciarListado', async e => {
    console.log('🧹 Vaciar Listado iniciado');

    const tablaBody = document.getElementById('productosTraspaso');

    if (!tablaBody) {
        console.error('❌ No se encontró el cuerpo de la tabla #productosTraspaso');
        return;
    }

    // Eliminar todas las filas excepto la fila de totales
    Array.from(tablaBody.querySelectorAll('tr')).forEach((fila, index) => {
        if (index !== 0) { // La fila 0 es la fila de totales
            fila.remove();
        }
    });

    // Restablecer los totales a cero
    document.getElementById('totalVentaPeriodo').textContent = '0';
    document.getElementById('totalVolumen').textContent = '0.00';
    document.getElementById('totalPeso').textContent = '0.00';

    console.log('✅ Listado vaciado correctamente.');
});




//agregado de productos.

// 📌 Buscar productos en tiempo real
document.getElementById('codigoProducto').addEventListener('input', (e) => {
    const termino = e.target.value.toLowerCase();
    const sugerenciasContainer = document.getElementById('sugerenciasProductos');
    sugerenciasContainer.innerHTML = '';
    indiceSeleccionado = -1;

    if (termino === '') return;

    const resultados = productos.filter(producto =>
        producto.reference.toLowerCase().includes(termino) ||
        producto.name.toLowerCase().includes(termino)
    );

    resultados.slice(0, 5).forEach((producto, index) => {
        const item = document.createElement('div');
        item.classList.add('list-group-item', 'list-group-item-action');
        item.textContent = `${producto.reference} - ${producto.name}`;
        item.dataset.index = index;

        item.addEventListener('click', () => agregarProductoATabla(producto));

        sugerenciasContainer.appendChild(item);
    });
});

// 📌 Navegación con teclas ↑ ↓ y Enter
document.getElementById('codigoProducto').addEventListener('keydown', (e) => {
    const sugerencias = document.querySelectorAll('#sugerenciasProductos .list-group-item');

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        indiceSeleccionado = (indiceSeleccionado + 1) % sugerencias.length;
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        indiceSeleccionado = (indiceSeleccionado - 1 + sugerencias.length) % sugerencias.length;
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (indiceSeleccionado >= 0 && sugerencias[indiceSeleccionado]) {
            sugerencias[indiceSeleccionado].click();
        } else {
            // Buscar coincidencia exacta y agregar
            agregarProductoPorCodigo();
        }
    }

    sugerencias.forEach((sug, i) => {
        if (i === indiceSeleccionado) {
            sug.classList.add('active');
        } else {
            sug.classList.remove('active');
        }
    });
});

// 📌 Botón para agregar producto
document.getElementById('btnAgregarProducto').addEventListener('click', () => {
    const codigo = document.getElementById('codigoProducto').value.trim().toLowerCase();
    const cantidad = parseInt(document.getElementById('cantidad').value, 10) || 1;

    if (!codigo) {
        console.warn('⚠️ Debes ingresar un código de producto.');
        return;
    }

    const producto = productos.find(p =>
        p.reference.toLowerCase() === codigo ||
        p.name.toLowerCase() === codigo
    );

    if (producto) {
        agregarProductoATabla(producto, cantidad);
    } else {
        console.warn('❌ Producto no encontrado.');
    }
});


// 📌 Función para agregar producto a la tabla
function agregarProductoATabla(producto, cantidad = 1) {
    const tablaBody = document.getElementById('productosTraspaso');

    // ✅ Calcular valores necesarios
    const cantidadVendidaOrigen = producto.cantidadVendidaOrigen || 0;
    const ventaDiaria = (cantidadVendidaOrigen / (parseFloat(document.getElementById('periodoDias').value) || 1)).toFixed(2);
    const stockMinimoSugerido = (ventaDiaria * (parseFloat(document.getElementById('diasProtegerMin').value) || 1)).toFixed(2);
    const stockMaximoSugerido = (ventaDiaria * (parseFloat(document.getElementById('diasProtegerFinal').value) || 1)).toFixed(2);
    const volumen = producto.volumen || 0;
    const peso = producto.peso || 0;
    const participacion = cantidadVendidaOrigen > 0 
        ? ((cantidad / cantidadVendidaOrigen) * 100).toFixed(2) 
        : '0';

    const nuevaCantidad = producto.stockMaximoOrigen - producto.existenciaDestino;
    const esInvalido = nuevaCantidad > producto.existenciaOrigen ? 'is-invalid' : '';

    // ✅ Insertar la fila en la tabla
    const fila = `
        <tr>
            <td>${producto.reference}</td>
            <td>${producto.name}</td>
            <td>${producto.presentacion || '-'}</td>
            <td>${producto.existenciaOrigen}</td>
            <td>${producto.existenciaDestino}</td>
            <td>${cantidadVendidaOrigen}</td>
            <td class="ventaDiaria">${ventaDiaria}</td>
            <td class="stockMinimoSugerido">${stockMinimoSugerido}</td>
            <td class="stockMaximoSugerido">${stockMaximoSugerido}</td>
            <td>
                <input type="number" class="form-control form-control-sm stockMinimo" value="${producto.stockMinimoOrigen}" min="0" data-reference="${producto.reference}">
            </td>
            <td>
                <input type="number" class="form-control form-control-sm stockMaximo" value="${producto.stockMaximoOrigen}" min="0" data-reference="${producto.reference}">
            </td>
            <td>${volumen}</td>
            <td>${peso}</td>
            <td class="participacionVenta">${participacion}%</td>
            <td>0</td>
            <td>
                <input type="number" class="form-control form-control-sm cantidad ${esInvalido}" value="${nuevaCantidad}" min="0" data-reference="${producto.reference}">
            </td>
            <td>
                <button class="btn btn-sm btn-danger btnEliminarProducto" data-reference="${producto.reference}">Eliminar</button>
            </td>
        </tr>
    `;

    // ✅ Después de agregar la fila a la tabla
    tablaBody.insertAdjacentHTML('beforeend', fila);

    // Asignar evento dinámico para stock máximo
    const ultimaFila = tablaBody.lastElementChild;
    const inputStockMaximo = ultimaFila.querySelector('.stockMaximo');
    const inputCantidad = ultimaFila.querySelector('.cantidad');

    inputStockMaximo.addEventListener('input', actualizarCantidadPorStockMaximo);
    inputCantidad.addEventListener('input', validarCantidadManual);



    // ✅ Limpiar los inputs después de agregar
    document.getElementById('codigoProducto').value = '';
    document.getElementById('cantidad').value = '1';
    document.getElementById('sugerenciasProductos').innerHTML = '';
    indiceSeleccionado = -1;

    // ✅ Recalcular totales
    recalcularTotales();

    console.log(`✅ Producto agregado: ${producto.name} con cantidad ${cantidad}`);
}

// 📌 Validar cantidad al modificar manualmente
function validarCantidadManual(event) {
    const inputCantidad = event.target;
    const fila = inputCantidad.closest('tr');

    const cantidad = parseFloat(inputCantidad.value) || 0;
    const existenciaOrigen = parseFloat(fila.querySelector('td:nth-child(4)').textContent) || 0;

    // Validar si la cantidad supera la existencia origen
    const esInvalido = cantidad > existenciaOrigen;

    inputCantidad.classList.toggle('is-invalid', esInvalido);

    if (!esInvalido) {
        // Si es válido, recalcular totales y participación
        recalcularTotales();
    }

    console.log(`🔄 Validación de cantidad: ${cantidad} (Stock Origen: ${existenciaOrigen})`);
}

// 📌 Evento delegado para validar cantidad manualmente
document.getElementById('productosTraspaso').addEventListener('input', (event) => {
    if (event.target.classList.contains('cantidad')) {
        validarCantidadManual(event);
    }
});

// 📌 Función para realizar el traspaso con confirmación
async function realizarTraspaso() {
    // ✅ Validar selección de sucursales y usuarios
    const sucursalOrigen = document.getElementById('sucursalOrigen').value;
    const sucursalDestino = document.getElementById('sucursalDestino').value;
    const usuarioOrigen = document.getElementById('usuarioOrigen').value;
    const usuarioDestino = document.getElementById('usuarioDestino').value;
    const observaciones = document.getElementById('observaciones').value;

    if (!sucursalOrigen || !sucursalDestino) {
        Swal.fire('⚠️ Error', 'Debes seleccionar ambas sucursales.', 'warning');
        return;
    }

    if (sucursalOrigen === sucursalDestino) {
        Swal.fire('⚠️ Error', 'Las sucursales de origen y destino no pueden ser iguales.', 'warning');
        return;
    }

    if (!usuarioOrigen || !usuarioDestino) {
        Swal.fire('⚠️ Error', 'Debes seleccionar ambos usuarios responsables.', 'warning');
        return;
    }

    // ✅ Validar productos en la tabla
    const productos = [];
    let errores = false;

    document.querySelectorAll('#productosTraspaso tr').forEach((fila, index) => {
        if (index === 0) return;

        const referencia = fila.querySelector('td:nth-child(1)').textContent;
        const nombre = fila.querySelector('td:nth-child(2)').textContent;
        const presentacion = fila.querySelector('td:nth-child(3)').textContent;
        const cantidad = parseFloat(fila.querySelector('.cantidad').value) || 0;
        const existenciaOrigen = parseFloat(fila.querySelector('td:nth-child(4)').textContent) || 0;
        const existenciaDestino = parseFloat(fila.querySelector('td:nth-child(5)').textContent) || 0;
        const stockMinimo = parseFloat(fila.querySelector('.stockMinimo').value) || 0;
        const stockMaximo = parseFloat(fila.querySelector('.stockMaximo').value) || 0;
        const volumen = parseFloat(fila.querySelector('td:nth-child(12)').textContent) || 0;
        const peso = parseFloat(fila.querySelector('td:nth-child(13)').textContent) || 0;

        if (cantidad > existenciaOrigen || cantidad <= 0) {
            fila.querySelector('.cantidad').classList.add('is-invalid');
            errores = true;
        } else {
            fila.querySelector('.cantidad').classList.remove('is-invalid');
        }

        productos.push({
            reference: referencia,
            name: nombre,
            presentacion,
            cantidad,
            existenciaOrigen,
            existenciaDestino,
            stockMinimo,
            stockMaximo,
            volumen,
            peso
        });
    });

    if (errores) {
        Swal.fire('⚠️ Error', 'Hay errores en las cantidades de algunos productos. Revisa los campos en rojo.', 'error');
        return;
    }

    if (productos.length === 0) {
        Swal.fire('⚠️ Error', 'No hay productos para traspasar.', 'warning');
        return;
    }

    // ✅ Mostrar confirmación con SweetAlert2
    const confirmacion = await Swal.fire({
        title: '¿Estás seguro de realizar el traspaso?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, realizar traspaso',
        cancelButtonText: 'Cancelar'
    });

    if (!confirmacion.isConfirmed) {
        Swal.fire('❌ Cancelado', 'El traspaso ha sido cancelado.', 'info');
        return;
    }

    try {
        // ✅ Enviar datos al backend
        const response = await fetch('/api/traspasos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sucursalOrigen,
                sucursalDestino,
                usuarioOrigen,
                usuarioDestino,
                observaciones,
                productos
            })
        });

        const result = await response.json();

        // ✅ Llamada a imprimirTraspaso después de un traspaso exitoso
    if (response.ok) {
        Swal.fire('✅ Éxito', 'El traspaso se ha realizado correctamente.', 'success');

        imprimirTraspaso({
            sucursalOrigen: {
                nombre: document.getElementById('sucursalOrigen').options[document.getElementById('sucursalOrigen').selectedIndex].text
            },
            sucursalDestino: {
                nombre: document.getElementById('sucursalDestino').options[document.getElementById('sucursalDestino').selectedIndex].text
            },
            usuarioOrigen: {
                nombre: document.getElementById('usuarioOrigen').options[document.getElementById('usuarioOrigen').selectedIndex].text.split(' ')[0],
                username: document.getElementById('usuarioOrigen').options[document.getElementById('usuarioOrigen').selectedIndex].text.split('@')[1]
            },
            usuarioDestino: {
                nombre: document.getElementById('usuarioDestino').options[document.getElementById('usuarioDestino').selectedIndex].text.split(' ')[0],
                username: document.getElementById('usuarioDestino').options[document.getElementById('usuarioDestino').selectedIndex].text.split('@')[1]
            },
            observaciones,
            fecha: new Date(),
            productos
        });

        window.location.href = '/reporteFaltantes';

    }else {
            throw new Error(result.message || 'Error al realizar el traspaso');
        }
    } catch (error) {
        console.error('❌ Error en el traspaso:', error);
        Swal.fire('❌ Error', 'Error al realizar el traspaso. Revisa la consola para más detalles.', 'error');
    }
}

// 📌 Evento para el botón de realizar traspaso
document.getElementById('btnRealizarTraspaso').addEventListener('click', realizarTraspaso);

// 📌 Función para imprimir el comprobante de traspaso
function imprimirTraspaso(data) {
    const ventanaImpresion = window.open('', '_blank');

    const contenido = `
    <html>
    <head>
        <title>Comprobante de Traspaso</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1, h3 { text-align: center; }
            .info { margin-bottom: 20px; }
            .info p { margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            table, th, td { border: 1px solid black; }
            th, td { padding: 8px; text-align: center; }
            th { background-color: #f2f2f2; }
            .footer { margin-top: 20px; text-align: center; }
        </style>
    </head>
    <body>
        <h1>Comprobante de Traspaso</h1>
        <div class="info">
            <h3>Información General</h3>
            <p><strong>Sucursal Origen:</strong> ${data.sucursalOrigen.nombre}</p>
            <p><strong>Sucursal Destino:</strong> ${data.sucursalDestino.nombre}</p>
            <p><strong>Usuario Origen:</strong> ${data.usuarioOrigen.nombre} (@${data.usuarioOrigen.username})</p>
            <p><strong>Usuario Destino:</strong> ${data.usuarioDestino.nombre} (@${data.usuarioDestino.username})</p>
            <p><strong>Fecha:</strong> ${new Date(data.fecha).toLocaleString()}</p>
            <p><strong>Observaciones:</strong> ${data.observaciones || 'N/A'}</p>
        </div>

        <h3>Productos Traspasados</h3>
        <table>
            <thead>
                <tr>
                    <th>Referencia</th>
                    <th>Nombre</th>
                    <th>Presentación</th>
                    <th>Cantidad</th>
                    <th>Existencia Origen</th>
                    <th>Existencia Destino</th>
                    <th>Stock Mínimo</th>
                    <th>Stock Máximo</th>
                    <th>Volumen</th>
                    <th>Peso</th>
                </tr>
            </thead>
            <tbody>
                ${data.productos.map(producto => `
                    <tr>
                        <td>${producto.reference}</td>
                        <td>${producto.name}</td>
                        <td>${producto.presentacion || '-'}</td>
                        <td>${producto.cantidad}</td>
                        <td>${producto.existenciaOrigen}</td>
                        <td>${producto.existenciaDestino}</td>
                        <td>${producto.stockMinimo}</td>
                        <td>${producto.stockMaximo}</td>
                        <td>${producto.volumen}</td>
                        <td>${producto.peso}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="footer">
            <p><strong>¡Gracias por usar nuestro sistema de traspasos!</strong></p>
        </div>
    </body>
    </html>
    `;

    // ✅ Escribir contenido en la nueva ventana
    ventanaImpresion.document.write(contenido);
    ventanaImpresion.document.close();

    // ✅ Imprimir automáticamente
    ventanaImpresion.onload = () => {
        ventanaImpresion.print();
        ventanaImpresion.close();
    };
}


