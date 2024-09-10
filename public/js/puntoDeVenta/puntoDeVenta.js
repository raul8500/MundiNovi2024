let productos = []; // Variable global para almacenar los productos
let sucursalInfo = ''; // Variable global para almacenar la información de la sucursal
let indexSugerencia = -1; // Índice de la sugerencia actualmente seleccionada
let inputCantidad = document.getElementById('cantidad');
inputCantidad.value = ''
inputCantidad.focus()
const modalSelectUser = new mdb.Modal(document.getElementById('selectUserModal'));
let user = false


let esFactura = false;

//focus en el input de cantidad al inciar la pagina
document.addEventListener('DOMContentLoaded', () => {
    let inputCantidad = document.getElementById('cantidad');
    inputCantidad.value = '';
    inputCantidad.focus();
});

// Cargar la información de la sucursal
function cargarSucursal() {
    fetch('/api/sucursal/id/' + infoUser.sucursalId)
        .then(response => response.json())
        .then(data => {
            sucursalInfo = data;
            document.getElementById('nombreSucursal').textContent = sucursalInfo.nombre
        })
        .catch(error => console.error('Error al cargar sucursal:', error));
}

// Cargar los productos
function cargarProductos() {
    fetch('/api/productos/cobros/load')
        .then(response => response.json())
        .then(data => {
            productos = data;
            cargarSucursal();
        })
        .catch(error => console.error('Error al cargar productos:', error));
}

// Inicializar carga de productos
cargarProductos();


// Seleccionar un producto de la lista de sugerencias
function seleccionarProducto(producto) {
    document.getElementById('producto').value = producto.nombre;
    document.getElementById('sugerencias').innerHTML = ''; // Limpiar sugerencias después de seleccionar
    document.getElementById('producto').focus(); // Regresar al input de búsqueda
    indexSugerencia = -1; // Reiniciar el índice de sugerencia
}

// Manejo del input de búsqueda de productos
document.getElementById('producto').addEventListener('input', function () {
    const valorInput = this.value.toLowerCase();
    const contenedorSugerencias = document.getElementById('sugerencias');
    indexSugerencia = -1; // Restablecer el índice de la sugerencia

    if (valorInput === '') {
        contenedorSugerencias.innerHTML = ''; // Limpiar sugerencias si el input está vacío
        return; // Salir si el campo de búsqueda está vacío
    }

    // Asegúrate de que `productos` esté definido y sea un array
    if (!Array.isArray(productos)) {
        console.error('La variable "productos" no está definida o no es un array.');
        return;
    }

    const listaFiltrada = productos.filter(producto => {
        // Verifica y convierte `producto.nombre` y `producto.clave` a minúsculas si son cadenas
        const nombre = typeof producto.nombre === 'string' ? producto.nombre.toLowerCase() : '';
        const clave = typeof producto.clave === 'string' ? producto.clave.toLowerCase() : '';

        return nombre.includes(valorInput) || clave.includes(valorInput);
    });

    contenedorSugerencias.innerHTML = '';

    listaFiltrada.forEach((producto, index) => {
        const elementoSugerencia = document.createElement('div');
        elementoSugerencia.classList.add('sugerencia');
        // Mostrar tanto el nombre como la clave del producto
        elementoSugerencia.textContent = `${producto.nombre} (${producto.clave})`;
        elementoSugerencia.dataset.index = index;
        elementoSugerencia.addEventListener('click', function () {
            seleccionarProducto(producto);
        });
        contenedorSugerencias.appendChild(elementoSugerencia);
    });
});

// Manejo de teclas en el input de búsqueda
document.getElementById('producto').addEventListener('keydown', function (event) {
    const sugerencias = document.querySelectorAll('#sugerencias .sugerencia');
    if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (indexSugerencia < sugerencias.length - 1) {
            indexSugerencia++;
            actualizarSugerencias();
        }
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (indexSugerencia > 0) {
            indexSugerencia--;
            actualizarSugerencias();
        }
    } else if (event.key === 'Enter') {
        event.preventDefault();
        if (indexSugerencia >= 0 && indexSugerencia < sugerencias.length) {
            const productoSeleccionado = productos.find(p => p.nombre === sugerencias[indexSugerencia].textContent.split(' (')[0]);
            if (productoSeleccionado) {
                seleccionarProducto(productoSeleccionado);
                agregarProducto(); // Asegúrate de que se llame a la función de agregar producto
            }
        }
    }
});

// Función para actualizar las sugerencias y el scroll
function actualizarSugerencias() {
    const sugerencias = document.querySelectorAll('#sugerencias .sugerencia');

    sugerencias.forEach((sugerencia, index) => {
        sugerencia.classList.toggle('seleccionado', index === indexSugerencia);
    });

    // Asegurarse de que la sugerencia seleccionada sea visible
    if (indexSugerencia >= 0 && indexSugerencia < sugerencias.length) {
        const contenedorSugerencias = document.getElementById('sugerencias');
        const elementoSeleccionado = sugerencias[indexSugerencia];
        
        // Ajustar el scroll para que el elemento seleccionado sea visible
        contenedorSugerencias.scrollTop = elementoSeleccionado.offsetTop - contenedorSugerencias.clientHeight / 2 + elementoSeleccionado.clientHeight / 2;
    }
}

// Seleccionar un producto de la lista de sugerencias
function seleccionarProducto(producto) {
    document.getElementById('producto').value = producto.nombre;
    document.getElementById('sugerencias').innerHTML = ''; // Limpiar sugerencias después de seleccionar
    document.getElementById('producto').focus(); // Regresar al input de búsqueda
}
//agregar producto
function agregarProducto() {
    const inputProducto = document.getElementById('producto');
    const inputCantidad = document.getElementById('cantidad');

    const productoSeleccionado = productos.find(p => p.nombre === inputProducto.value);
    const cantidad = parseInt(inputCantidad.value);

    if (!productoSeleccionado || cantidad <= 0) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, selecciona un producto válido y una cantidad mayor a 0.'
        });
        return;
    }

    // Verificar si el producto ya está en la tabla
    const filas = document.querySelectorAll('#productos tr');
    let productoExistente = false;

    filas.forEach(fila => {
        const nombreProducto = fila.children[0].textContent;
        if (nombreProducto === productoSeleccionado.nombre) {
            // Producto ya está en la tabla, actualizar cantidad
            const cantidadActual = parseInt(fila.querySelector('.cantidad').value);
            const nuevaCantidad = cantidadActual + cantidad;
            fila.querySelector('.cantidad').value = nuevaCantidad;

            // Disparar el evento de 'input' para actualizar el precio y total
            const inputEvent = new Event('input', { bubbles: true });
            fila.querySelector('.cantidad').dispatchEvent(inputEvent);

            productoExistente = true;
        }
    });

    // Si el producto no existe en la tabla, agregar una nueva fila
    if (!productoExistente) {
        // Seleccionar el precio basado en la cantidad
        let precio = parseFloat(productoSeleccionado.precio1); // Precio predeterminado para 1 artículo

        for (let i = 1; i <= 10; i++) {
            const rangoInicial = productoSeleccionado[`rangoInicial${i}`];
            const rangoFinal = productoSeleccionado[`rangoFinal${i}`];
            if (cantidad >= rangoInicial && cantidad <= rangoFinal) {
                precio = parseFloat(productoSeleccionado[`precio${i}`]) || precio;
                break;
            }
        }

        const total = cantidad * precio;
        const nuevaFila = document.createElement('tr');
        nuevaFila.innerHTML = `
            <td>${productoSeleccionado.nombre}</td>
            <td style="width: 250px;">
                <div style="display: flex; flex-wrap: wrap; font-size: 0.8rem; gap: 0;">
                    ${[...Array(4).keys()].map(i => `
                        ${productoSeleccionado[`rangoInicial${i + 1}`] !== undefined ? `
                            <div style="flex: 1 0 50%; padding: 0.2rem; box-sizing: border-box; border-bottom: 1px solid #ddd;">
                                Mas de ${productoSeleccionado[`rangoInicial${i + 1}`] === 0 ? 1 : productoSeleccionado[`rangoInicial${i + 1}`]} = 
                                <strong> ${productoSeleccionado[`precio${i + 1}`]} </strong>
                            </div>
                        ` : ''}`).join('')}
                </div>
            </td>

            <td><input type="number" class="form-control precio" value="${precio.toFixed(2)}" step="0.01"></td>
            <td><input type="number" class="form-control cantidad" value="${cantidad}" step="1"></td>
            <td class="total">$${total.toFixed(2)}</td>
            <td><button class="btn btn-warning btn-sm eliminarProducto">Eliminar</button></td>
        `;


        document.getElementById('productos').appendChild(nuevaFila);
    }

    // Actualizar el total de productos y el total de la venta
    actualizarResumenVenta();

    // Limpiar el input de búsqueda y la cantidad
    inputProducto.value = '';
    inputCantidad.value = '';
    inputCantidad.focus(); // Regresar al input de búsqueda
}

// Manejo de cambios en precios y cantidades
document.getElementById('productos').addEventListener('input', (event) => {
    if (event.target.classList.contains('cantidad') || event.target.classList.contains('precio')) {
        const fila = event.target.closest('tr');
        const cantidad = parseInt(fila.querySelector('.cantidad').value);
        const precioInput = fila.querySelector('.precio');
        let precio = parseFloat(precioInput.value);

        // Obtener el producto correspondiente basado en el nombre
        const productoNombre = fila.children[0].textContent;
        const producto = productos.find(p => p.nombre === productoNombre);

        if (producto) {
            // Actualizar el precio basado en el rango de la cantidad
            if (event.target.classList.contains('cantidad')) {
                for (let i = 1; i <= 10; i++) {
                    const rangoInicial = producto[`rangoInicial${i}`];
                    const rangoFinal = producto[`rangoFinal${i}`];
                    if (cantidad >= rangoInicial && cantidad <= rangoFinal) {
                        precio = parseFloat(producto[`precio${i}`]) || precio;
                        break;
                    }
                }
                precioInput.value = precio.toFixed(2);
            }

            // Calcular el total de la fila basado en la cantidad y el precio actualizado
            const total = cantidad * precio;
            fila.querySelector('.total').textContent = `$${total.toFixed(2)}`;
        }

        // Actualizar el resumen de la venta
        actualizarResumenVenta();
    }
});


// Manejo del clic en el botón de agregar producto
document.getElementById('agregarProducto').addEventListener('click', () => {
    agregarProducto();
});

// Manejo de teclas globales
document.addEventListener('keydown', (event) => {
    if (event.key === 'F4') {
        event.preventDefault(); // Evita el comportamiento por defecto de F4
        agregarProducto();
    } else if (event.key === 'F1') {
        event.preventDefault(); // Evita el comportamiento por defecto de F1
        completarVenta();
    } else if (event.key === 'F12') {
        event.preventDefault(); // Evita el comportamiento por defecto de F12
        confirmarCancelarVenta();
    }else if (event.key === 'F3') {
        event.preventDefault(); // Evita el comportamiento por defecto de F12
        facturarVenta()
    }
});

// Manejo del clic en el botón de completar venta
document.getElementById('completarVenta').addEventListener('click', () => {
    const modalPago = new mdb.Modal(document.getElementById('modalPago'));
    let totalVenta = parseFloat(document.getElementById('totalVenta').textContent)
    document.getElementById('totalAPagar').value = totalVenta
    verificarFactura()
    modalPago.show()
    //completarVenta();
});

// Actualizar el resumen de la venta
function actualizarResumenVenta() {
    const filas = document.querySelectorAll('#productos tr');
    let totalProductos = 0;
    let totalVenta = 0;

    filas.forEach(fila => {
        const cantidad = parseInt(fila.querySelector('.cantidad').value);
        const total = parseFloat(fila.querySelector('.total').textContent.replace('$', ''));
        totalProductos += cantidad;
        totalVenta += total;
    });

    document.getElementById('totalProductos').textContent = totalProductos;
    document.getElementById('totalVenta').textContent = totalVenta.toFixed(2);
}

// Manejo del clic en el botón de eliminar producto
document.getElementById('productos').addEventListener('click', event => {
    if (event.target.classList.contains('eliminarProducto')) {
        event.target.closest('tr').remove();
        actualizarResumenVenta();
    }
});

//cancelar venta con click
document.getElementById('cancelarVenta').addEventListener('click', () => {
    confirmarCancelarVenta();
});

// Confirmar cancelar venta
function confirmarCancelarVenta() {
    Swal.fire({
        title: 'Cancelar Venta',
        text: '¿Deseas cancelar la venta?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'No, continuar'
    }).then(result => {
        if (result.isConfirmed) {
            // Limpiar la tabla y el resumen
            document.getElementById('productos').innerHTML = '';
            document.getElementById('totalProductos').textContent = '0';
            document.getElementById('totalVenta').textContent = '0.00';
            document.getElementById('ventaCliente').textContent = '';
            document.getElementById('ventaCliente').style.color = 'black'
            document.getElementById('btnCancelarCliente').style.visibility = 'hidden';
            document.getElementById('btnCancelarFactura').style.visibility = 'hidden';
            document.getElementById('monederoCliente').textContent = ''
            if(esFactura == true){
                facturarVenta()
            }
            limpiarCliente()
            clienteSeleccionado = []
            // Limpiar los campos de producto y cantidad
            document.getElementById('producto').value = '';
            let inputCantidad = document.getElementById('cantidad');
            inputCantidad.value = '';
            
            // Enfocar el campo de cantidad
            inputCantidad.focus();

            document.getElementById('selectFormaPago').value = 
            document.getElementsByClassName('importePago')[0].value = 0;
            ocument.getElementsByClassName('cambio')[0].value = 0;

        }
        inputCantidad.focus();
    });
}

function completarVenta() {
    const filas = document.querySelectorAll('#productos tr');
    if (filas.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No hay productos en la venta. Agrega productos antes de completar.'
        });
        return;
    }

    
    const productosVendidos = [];
    filas.forEach(fila => {
        const nombre = fila.children[0].textContent;
        const precio = parseFloat(fila.querySelector('.precio').value);
        const cantidad = parseInt(fila.querySelector('.cantidad').value);
        const total = cantidad * precio;

        productosVendidos.push({ nombre, cantidad, precio, total });
    });

    const venta = {
        sucursalId: sucursalInfo._id,
        fecha: new Date().toISOString(),
        direccion: sucursalInfo.datosTicket.direccion,
        productos: productosVendidos,
        totalVenta: parseFloat(document.getElementById('totalVenta').textContent),
        totalProductos: parseInt(document.getElementById('totalProductos').textContent)
    };

    // Enviar los datos al backend
    fetch('/api/ventas/crear', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(venta)
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Venta guardada exitosamente') {
                Swal.fire('Venta realizada con éxito!', '', 'success');
                imprimirTicket(venta); // Imprimir el ticket después de completar la venta
                cancelarVenta(); // Limpia la venta actual
            } else {
                Swal.fire('Error', 'Hubo un problema al completar la venta. Por favor, inténtalo de nuevo.', 'error');
            }
        })
        .catch(error => {
            console.error('Error al guardar la venta:', error);
            Swal.fire('Error', 'Hubo un problema al completar la venta. Por favor, inténtalo de nuevo.', 'error');
        });
        
}

function imprimirTicket(venta) {
    const ticketWidth = 32; // Ancho máximo del ticket en caracteres
    const separator = '-'.repeat(ticketWidth);

    function formatLine(text, width, rightAlign = false) {
        // Ajustar el texto con alineación a la izquierda o derecha
        if (rightAlign) {
            return text.padStart(width);
        } else {
            return text.padEnd(width);
        }
    }

    function wrapText(text, width) {
        const lines = [];
        for (let i = 0; i < text.length; i += width) {
            lines.push(text.substring(i, i + width));
        }
        return lines;
    }

    function formatProductos(productos) {
        return `
            <ul style="list-style: none; padding: 0; margin: 0;">
                ${productos.map(p => `
                    <li style="word-break: break-word; padding-bottom: 5px;">
                        ${p.nombre || 'Nombre no disponible'} - Cantidad: ${p.cantidad} - Precio: ${p.precio} - Importe: $${p.total.toFixed(2)}
                    </li>
                `).join('')}
            </ul>
        `;
    }

    const ticketContent = `
        <div style="width: 55mm; padding: 10px; font-size: 12px;">
            <h2>Mundi Novi</h2>
            <p>JESUS MARIA AGUIRRE VEGA</p>
            <p>REGIMEN ACTIVIDAD EMPRESARIAL</p>
            <p>AUVJ750221RB8</p>
            <Br>
            <p>Venta No: ${Math.floor(Math.random() * 90000) + 10000}</p>
            <p>Fecha: ${new Date(venta.fecha).toLocaleDateString()}</p>
            <p>Sucursal: ${sucursalInfo.nombre}</p>
            <p>Dirección: ${wrapText(venta.direccion, ticketWidth).join('<br>')}</p>
            <hr style="border: 1px solid black;">
            Productos:
            ${formatProductos(venta.productos)}
            <hr style="border: 1px solid black;">
            <p>Total productos: ${formatLine(venta.totalProductos.toString(), ticketWidth, true)}</p>
            <p>Total venta: ${formatLine(`$${venta.totalVenta.toFixed(2)}`, ticketWidth, true)}</p>
            <hr style="border: 1px solid black;">
            <p>¡Gracias por su compra!</p>
        </div>
    `;

    const printWindow = window.open('', '', 'width=320,height=500');
    printWindow.document.write('<html><head><title>Impresión de Venta</title>');
    printWindow.document.write('<style>body { font-family: Arial, sans-serif; }</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(ticketContent);
    printWindow.document.write('</body></html>');

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
}
function facturarVenta() {
    var btnFacturar = document.getElementById('btnFacturar');

    // Verifica si el botón tiene la clase 'btn-success'
    if (btnFacturar.classList.contains('btn-success')) {
        esFactura = false;
        
        // Si tiene 'btn-success', la cambia a 'btn-primary'
        btnFacturar.classList.remove('btn-success');
        btnFacturar.classList.add('btn-primary');
        var facturaResumenVenta = document.getElementById('facturaResumenVenta')
        facturaResumenVenta.textContent = ''
        facturaResumenVenta.style.color = 'black'
        document.getElementById('btnCancelarFactura').style.visibility = 'hidden';
    } else {
        esFactura = true
        // Si no tiene 'btn-success', la cambia a 'btn-success'
        btnFacturar.classList.remove('btn-primary');
        btnFacturar.classList.add('btn-success');
        var facturaResumenVenta = document.getElementById('facturaResumenVenta')
        facturaResumenVenta.textContent = 'Con Factura'
        facturaResumenVenta.style.color = 'green'
        modalSelectUser.show()
    }
    

}
// Manejo del clic en el botón de facturar
document.getElementById('btnFacturar').addEventListener('click', () => {
    user = false;
    modalSelectUser.show()
});

// Manejo del clic en el botón de seleccionar usuario
document.getElementById('btnSeleccionarUsuario').addEventListener('click', () => {
    user = true;
    modalSelectUser.show()
});






  // Agregar forma de pago adicional
document.getElementById('btnAgregarFormaPago').addEventListener('click', function () {
    const formasDePagoContainer = document.getElementById('formasDePago');

    // Crear un nuevo contenedor de forma de pago
    const nuevaFormaDePago = document.createElement('div');
    nuevaFormaDePago.classList.add('row', 'mb-3', 'formaDePago');
    nuevaFormaDePago.innerHTML = `
        <div class="col-md-5">
        <label for="formaPago" class="form-label">Forma de Pago</label>
        <select class="form-select formaPago">
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
        </select>
        </div>
        <div class="col-md-4">
        <label for="importePago" class="form-label">Importe</label>
        <input type="number" class="form-control importePago" placeholder="0.00" />
        </div>
        <div class="col-md-2">
        <label for="cambio" class="form-label">Cambio</label>
        <input type="text" class="form-control cambio" value="0.00" readonly />
        </div>
        <div class="col-md-1 d-flex align-items-end">
        <button type="button" class="btn btn-danger btn-sm eliminarFormaPago"><i class="fa-solid fa-trash"></i></button>
        </div>
        <div class="col-md-12 mb-3 cuentaBancaria" style="display: none;">
        <label for="digitosCuenta" class="form-label">Últimos 4 dígitos de la cuenta bancaria</label>
        <input type="text" class="form-control digitosCuenta" maxlength="4" placeholder="0000" />
        </div>
    `;
    formasDePagoContainer.appendChild(nuevaFormaDePago);

    // Habilitar la eliminación de las nuevas formas de pago
    activarBotonesEliminar();
    activarCalculoCambio();
    //activarFormaPagoTransferencia(); // Activar select de "Forma de Pago"
});

//verificar si es factura y cargar los CFDI
function verificarFactura() {
    const facturaResumenVenta = document.getElementById('facturaResumenVenta').textContent.trim();
    const usoCFDIContainer = document.getElementById('usoCFDIContainer');

    if (facturaResumenVenta === '') {
        usoCFDIContainer.style.display = 'none';
    } else {
        usoCFDIContainer.style.display = 'block';
    }
}

// Función para activar los botones de eliminar
function activarBotonesEliminar() {
const botonesEliminar = document.querySelectorAll('.eliminarFormaPago');

botonesEliminar.forEach(function (boton) {
    boton.addEventListener('click', function () {
    const formaDePago = boton.closest('.formaDePago');
    formaDePago.remove();
    calcularCambio(); // Recalcular el cambio al eliminar una forma de pago
    });
});
}
// Activar el cálculo de cambio cuando se ingrese un importe
function activarCalculoCambio() {
const inputsImporte = document.querySelectorAll('.importePago');

inputsImporte.forEach(function (input) {
    input.addEventListener('input', function () {
    calcularCambio();
    });
});
}

// Función para calcular el cambio
function calcularCambio() {
const totalAPagar = parseFloat(document.getElementById('totalAPagar').value) || 0;
const inputsImporte = document.querySelectorAll('.importePago');
let totalPagado = 0;

// Sumar todos los importes ingresados
inputsImporte.forEach(function (input) {
    totalPagado += parseFloat(input.value) || 0;
});

// Calcular el cambio
const cambio = totalPagado - totalAPagar;

// Actualizar el valor de cambio en todos los campos de "Cambio"
const inputsCambio = document.querySelectorAll('.cambio');
inputsCambio.forEach(function (input) {
    input.value = cambio.toFixed(2);
});
}

// Activar la opción de ingresar los últimos 4 dígitos de la cuenta bancaria para transferencias
function activarFormaPagoTransferencia() {
const selectsFormaPago = document.querySelectorAll('.formaPago');

selectsFormaPago.forEach(function (select) {
    select.addEventListener('change', function () {
    const cuentaBancariaContainer = this.closest('.formaDePago').querySelector('.cuentaBancaria');
    if (this.value === 'transferencia') {
        cuentaBancariaContainer.style.display = 'block';
    } else {
        cuentaBancariaContainer.style.display = 'none';
    }
    });
});
}

// Activar el cálculo de cambio y select de "Forma de Pago" para la forma de pago inicial
activarCalculoCambio();
activarBotonesEliminar();
//activarFormaPagoTransferencia();



