let productos = []; // Variable global para almacenar los productos
let sucursalInfo = ''; // Variable global para almacenar la información de la sucursal
let indexSugerencia = -1; // Índice de la sugerencia actualmente seleccionada
let inputCantidad = document.getElementById('cantidad');
inputCantidad.value = ''
inputCantidad.focus()
const modalSelectUser = new mdb.Modal(document.getElementById('selectUserModal'));
const modalPago = new mdb.Modal(document.getElementById('modalPago'));
let user = false


let esFactura = false;

//focus en el input de cantidad al inciar la pagina
document.addEventListener('DOMContentLoaded', () => {
    let producto = document.getElementById('producto')
    let inputCantidad = document.getElementById('cantidad');
    inputCantidad.value = 1;
    producto.focus();
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
    fetch('/api/productos')
        .then(response => response.json())
        .then(data => {
            productos = data.products;
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

    // Buscar productos que coincidan con el nombre, referencia o código de barras
    const listaFiltrada = productos.filter(producto => {
        const nombre = typeof producto.name === 'string' ? producto.name.toLowerCase() : '';
        const clave = typeof producto.reference === 'string' ? producto.reference.toLowerCase() : '';
        const codigoBarra = typeof producto.codigoBarra === 'string' ? producto.codigoBarra.toLowerCase() : '';

        return nombre.includes(valorInput) || clave.includes(valorInput) || codigoBarra.includes(valorInput);
    });

    contenedorSugerencias.innerHTML = '';

    // Si hay una coincidencia exacta con el código de barras, agregar el producto automáticamente
    const productoCoincidencia = productos.find(producto => producto.codigoBarra === valorInput);
    if (productoCoincidencia) {
        seleccionarProducto(productoCoincidencia);
        agregarProducto();
        return; // Salir ya que el producto se ha agregado
    }

    // Mostrar las sugerencias si no hay coincidencia exacta con el código de barras
    listaFiltrada.forEach((producto, index) => {
        const elementoSugerencia = document.createElement('div');
        elementoSugerencia.classList.add('sugerencia');
        // Mostrar tanto el nombre como la clave del producto
        elementoSugerencia.textContent = `${producto.name} (${producto.reference})`;
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
            const productoSeleccionado = productos.find(p => p.name === sugerencias[indexSugerencia].textContent.split(' (')[0]);
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
    document.getElementById('producto').value = producto.name;
    document.getElementById('sugerencias').innerHTML = ''; // Limpiar sugerencias después de seleccionar
    document.getElementById('producto').focus(); // Regresar al input de búsqueda
}

let productosEnVenta = []; // Arreglo para almacenar productos seleccionados

function agregarProducto() {
    const inputProducto = document.getElementById('producto');
    const inputCantidad = document.getElementById('cantidad');

    const productoSeleccionado = productos.find(p => p.name === inputProducto.value);
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
        if (nombreProducto === productoSeleccionado.name) {
            // Producto ya está en la tabla, actualizar cantidad
            const cantidadActual = parseInt(fila.querySelector('.cantidad').value);
            const nuevaCantidad = cantidadActual + cantidad;
            fila.querySelector('.cantidad').value = nuevaCantidad;

            // Recalcular el precio basado en la nueva cantidad total
            let nuevoPrecio = productoSeleccionado.datosFinancieros.precio1;
            for (let i = 1; i <= 10; i++) {
                const rangoInicial = productoSeleccionado.datosFinancieros[`rangoInicial${i}`];
                const rangoFinal = productoSeleccionado.datosFinancieros[`rangoFinal${i}`];
                if (nuevaCantidad >= rangoInicial && nuevaCantidad <= rangoFinal) {
                    nuevoPrecio = productoSeleccionado.datosFinancieros[`precio${i}`] || nuevoPrecio;
                    break;
                }
            }

            // Calcular el total con el precio normal (precio1)
            const totalSinRangos = nuevaCantidad * productoSeleccionado.datosFinancieros.precio1;

            // Actualizar el total de la fila
            const nuevoTotal = nuevaCantidad * nuevoPrecio;
            fila.querySelector('.precio').value = nuevoPrecio.toFixed(2);
            fila.querySelector('.total').textContent = `$${nuevoTotal.toFixed(2)}`;

            // Actualizar el objeto en el arreglo productosEnVenta
            const index = productosEnVenta.findIndex(p => p.nombre === productoSeleccionado.name);
            if (index !== -1) {
                productosEnVenta[index].cantidad = nuevaCantidad;
                productosEnVenta[index].precio = nuevoPrecio;
                productosEnVenta[index].total = nuevoTotal;
                productosEnVenta[index].totalSinRangos = totalSinRangos;
            }

            productoExistente = true;
        }
    });

    // Si el producto no existe en la tabla, agregar una nueva fila
    if (!productoExistente) {
        let precio = parseFloat(productoSeleccionado.datosFinancieros.precio1); // Precio predeterminado

        for (let i = 1; i <= 10; i++) {
            const rangoInicial = productoSeleccionado.datosFinancieros[`rangoInicial${i}`];
            const rangoFinal = productoSeleccionado.datosFinancieros[`rangoFinal${i}`];
            if (cantidad >= rangoInicial && cantidad <= rangoFinal) {
                precio = parseFloat(productoSeleccionado.datosFinancieros[`precio${i}`]) || precio;
                break;
            }
        }

        const total = cantidad * precio;
        const totalSinRangos = cantidad * productoSeleccionado.datosFinancieros.precio1; // Calculo con precio1

        const nuevaFila = document.createElement('tr');
        nuevaFila.innerHTML = `
            <td>${productoSeleccionado.name}</td>
            <td style="width: 250px;">
                <div style="display: flex; flex-wrap: wrap; font-size: 0.8rem; gap: 0;">
                    ${[...Array(4).keys()].map(i => ` 
                        ${productoSeleccionado.datosFinancieros[`rangoInicial${i + 1}`] !== undefined ? `
                            <div style="flex: 1 0 50%; padding: 0.2rem; box-sizing: border-box; border-bottom: 1px solid #ddd;">
                                Más de ${productoSeleccionado.datosFinancieros[`rangoInicial${i + 1}`] === 0 ? 1 : productoSeleccionado.datosFinancieros[`rangoInicial${i + 1}`]} = 
                                <strong>${productoSeleccionado.datosFinancieros[`precio${i + 1}`]}</strong>
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

        // Agregar producto al arreglo productosEnVenta
        productosEnVenta.push({
            _id: productoSeleccionado._id,
            nombre: productoSeleccionado.name,
            cantidad,
            precio,
            total,
            totalSinRangos // Se agrega el total calculado con precio1
        });
    }

    // Actualizar el total de productos y el total de la venta
    actualizarResumenVenta();

    // Limpiar el input de búsqueda y la cantidad
    inputProducto.value = '';
    inputCantidad.value = 1;
    inputProducto.focus();
}

// Manejo de cambios en precios y cantidades
document.getElementById('productos').addEventListener('input', (event) => {
    if (event.target.classList.contains('cantidad') || event.target.classList.contains('precio')) {
        const fila = event.target.closest('tr');
        const cantidad = parseInt(fila.querySelector('.cantidad').value) || 0;
        const precioInput = fila.querySelector('.precio');
        let precio = parseFloat(precioInput.value) || 0;

        // Obtener el nombre del producto y buscar el producto en el arreglo
        const productoNombre = fila.children[0].textContent;
        const producto = productos.find(p => p.name === productoNombre);

        if (producto) {
            // Actualizar el precio basado en el rango de la cantidad
            if (event.target.classList.contains('cantidad')) {
                for (let i = 1; i <= 10; i++) {
                    const rangoInicial = producto.datosFinancieros[`rangoInicial${i}`];
                    const rangoFinal = producto.datosFinancieros[`rangoFinal${i}`];
                    if (cantidad >= rangoInicial && cantidad <= rangoFinal) {
                        precio = parseFloat(producto.datosFinancieros[`precio${i}`]) || precio;
                        break;
                    }
                }
                precioInput.value = precio.toFixed(2);
            }

            // Calcular el total de la fila basado en la cantidad y el precio actualizado
            const total = cantidad * precio;
            const totalSinRangos = cantidad * producto.datosFinancieros.precio1; // Total con precio1
            fila.querySelector('.total').textContent = `$${total.toFixed(2)}`;

            const index = productosEnVenta.findIndex(p => p.nombre === productoNombre);
            if (index !== -1) {
                productosEnVenta[index] = {
                    ...productosEnVenta[index],
                    cantidad,
                    precio,
                    total,
                    totalSinRangos // Actualizar el totalSinRangos
                };
            }
        }

        // Actualizar el resumen de la venta
        actualizarResumenVenta();
    }
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
    let totalVenta = parseFloat(document.getElementById('totalVenta').textContent);
    document.getElementById('totalAPagar').value = totalVenta;
    verificarFactura();
    modalPago.show();
    
});



// Manejo del clic en el botón de eliminar producto
document.getElementById('productos').addEventListener('click', event => {
    if (event.target.classList.contains('eliminarProducto')) {
        const fila = event.target.closest('tr');
        const productoNombre = fila.children[0].textContent;

        // Eliminar la fila de la tabla
        fila.remove();

        // Eliminar el producto del arreglo productosEnVenta
        productosEnVenta = productosEnVenta.filter(p => p.nombre !== productoNombre);

        // Actualizar el resumen de la venta
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
            location.reload()
        }
    });
}

function limpiarVenta(){
    // Limpiar la tabla y el resumen
    document.getElementById('productos').innerHTML = '';
    document.getElementById('totalProductos').textContent = '0';
    document.getElementById('totalVenta').textContent = '0.00';
    document.getElementById('ventaCliente').textContent = '';
    document.getElementById('ventaCliente').style.color = 'black';
    document.getElementById('btnCancelarCliente').style.visibility = 'hidden';
    document.getElementById('btnCancelarFactura').style.visibility = 'hidden';
    document.getElementById('monederoCliente').textContent = '';

    if (esFactura == true) {
        facturarVenta();
    }

    limpiarCliente();
    clienteSeleccionado = [];

    // Limpiar los campos de producto y cantidad
    document.getElementById('producto').value = '';
    let inputCantidad = document.getElementById('cantidad');
    inputCantidad.value = '';
    inputCantidad.focus();

    // Limpiar las formas de pago adicionales (exceptuando la default)
    const formasDePago = document.querySelectorAll('.formaDePago');
    formasDePago.forEach((formaDePago, index) => {
        if (index > 0) { // No elimina la primera forma de pago
            formaDePago.remove();
        }
    });

    // Reiniciar los valores de la forma de pago principal (si es necesario)
    document.getElementsByClassName('importePago')[0].value = 0;
    document.getElementsByClassName('cambio')[0].value = 0;

    inputCantidad.focus();  // Volver a enfocar el campo de cantidad
}


function completarVenta(resumenVenta, metodoEnvio, email = null) {
    const filas = document.querySelectorAll('#productos tr');
    if (filas.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No hay productos en la venta. Agrega productos antes de completar.'
        });
        return;
    }

    let venta = {
        sucursalId: sucursalInfo._id,
        usuario: infoUser,
        fecha: new Date().toISOString(),
        direccion: sucursalInfo.datosTicket.direccion,
        productos: productosEnVenta,
        totalVenta: parseFloat(document.getElementById('totalVenta').textContent),
        totalProductos: parseInt(document.getElementById('totalProductos').textContent)
    };

    const ventaYResumen = {
        venta,
        resumenVenta,
        infoUser,
        metodoEnvio, // 'impreso' o 'correo'
        email // correo si se proporcionó
    };

    // Aquí haces la llamada para completar la venta
    fetch('/api/ventas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ventaYResumen)
    })
    .then(response => {
        if (response.status === 304) {
            Swal.fire({
                icon: 'warning',
                title: 'Corte parcial necesario',
                text: 'Se han acumulado más de $2000 en efectivo. Realiza un corte parcial antes de proceder.',
                showCancelButton: true,
                confirmButtonText: 'Realizar corte parcial',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/corteparcial';
                }
            });
        } else if (response.status === 201) {
            return response.json();
        } else {
            throw new Error('Error en la respuesta del servidor.');
        }
    })
    .then(data => {
        if (data) {
            // Venta completada con éxito
            if (metodoEnvio === 'impreso') {
                Swal.fire({
                    icon: 'success',
                    title: 'Venta completada',
                    text: 'La venta se ha registrado exitosamente.'
                });
                imprimirTicket(venta, resumenVenta);
                window.location.reload();
            } else if (metodoEnvio === 'correo' && email) {
                Swal.fire({
                    icon: 'success',
                    title: 'Venta completada',
                    text: 'La venta se ha registrado exitosamente y enviado al correo electrónico.'
                });
                
                // Esperar 1.5 segundos antes de recargar la página
                setTimeout(() => {
                    window.location.reload();
                }, 1500); // 1500 ms = 1.5 segundos
            }
        }

    })
    .catch(error => {
        console.log(error)
        Swal.fire('Error', 'Hubo un problema al completar la venta. Por favor, inténtalo de nuevo.', 'error');
    });
}

function imprimirTicket(venta, resumenVenta) {
    console.log(venta);
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
                        - ${p.nombre || 'Nombre no disponible'} - ${p.cantidad} x ${p.precio.toFixed(2)} = $${p.total.toFixed(2)}
                    </li>
                `).join('')}
            </ul>
        `;
    }

    // Calcular el cambio
    const totalAPagar = parseFloat(resumenVenta.totalAPagar);
    const totalPagado = parseFloat(resumenVenta.totalPagado);
    const cambio = totalPagado - totalAPagar;

    // Formatear las formas de pago con condiciones para los valores
    function formatFormasDePago(formasDePago) {
        return formasDePago.map(fp => {
            let tipoPago = '';
            if (fp.tipo === 'cash') {
                tipoPago = 'Efectivo';
            } else if (fp.tipo === 'credit-card') {
                tipoPago = 'Tarjeta crédito';
            } else if (fp.tipo === 'debit-card') {
                tipoPago = 'Tarjeta débito';
            } else if (fp.tipo === 'transfer') {
                tipoPago = 'Transferencia';
            } else {
                tipoPago = fp.tipo; // Default por si acaso
            }

            // Aseguramos que fp.cambio sea un número antes de usar toFixed
            const cambioTexto = typeof fp.cambio === 'number' ? `$${fp.cambio.toFixed(2)}` : `$${cambio.toFixed(2)}`;

            // Solo muestra el cambio si es pago en efectivo
            return `
                <p style="margin: 2px 0;">Pago con ${tipoPago}: ${formatLine(`$${fp.importe.toFixed(2)}`, ticketWidth, true)}</p>
                ${fp.tipo === 'cash' ? `<p style="margin: 2px 0;">Cambio: ${formatLine(cambioTexto, ticketWidth, true)}</p>` : ''}
            `;
        }).join('');
    }

    // Calcular el total de ahorro sumando la diferencia entre total y totalSinRangos para cada producto
    function calcularAhorro(productos) {
        return productos.reduce((ahorro, producto) => {
            const totalSinRangos = producto.totalSinRangos || 0;
            const totalConDescuento = producto.total || 0;
            const diferencia = totalSinRangos - totalConDescuento;
            return ahorro + diferencia;
        }, 0);
    }

    const totalAhorro = calcularAhorro(venta.productos); // Calcular el ahorro total del cliente

    const ticketContent = `
        <div style="width: 55mm; padding: 10px; font-size: 12px;">
            <img id="logo" src="/img/logoColor.png" style="width: 90px; height: 80px; display: block; margin: 0 auto;">
            <h2 style="text-align: center;">Mundi Novi</h2>
            <p style="text-align: center; margin: 2px 0;">JESUS MARIA AGUIRRE VEGA</p>
            <p style="text-align: center; margin: 2px 0;">REGIMEN ACTIVIDAD EMPRESARIAL</p>
            <p style="text-align: center; margin: 2px 0;">RFC: AUVJ750221RB8</p>
            <p style="text-align: center; margin: 2px 0;">Dirección: Sur Norte 14 BC y CD, Central de Abastos, 91637, Ejido FDO Gutierrez, Ver.</p>
            <hr style="border: 1px solid black;">
            <p style="margin: 2px 0;">Venta No: ${Math.floor(Math.random() * 90000) + 10000}</p>
            <p style="margin: 2px 0;">Fecha: ${new Date(venta.fecha).toLocaleDateString()}</p>
            <p style="margin: 2px 0;">Cajero: ${infoUser.name}</p>
            <p style="margin: 2px 0;">Expedido en: ${sucursalInfo.datosTicket.direccion}</p>
            <hr style="border: 1px solid black;">
            Productos:
            
            ${formatProductos(venta.productos)}
            <hr style="border: 1px solid black;">
            <p style="margin: 2px 0;">Total productos: ${formatLine(venta.totalProductos.toString(), ticketWidth, true)}</p>
            <p style="margin: 2px 0; font-weight: bold;">Total venta: ${formatLine(`$${venta.totalVenta.toFixed(2)}`, ticketWidth, true)}</p>

            ${formatFormasDePago(resumenVenta.formasDePago)}
            
            <hr style="border: 1px solid black;">
            <p style="text-align: center;">Usted ahorró: ${formatLine(`$${totalAhorro.toFixed(2)}`, ticketWidth, true)}</p>
            <p style="text-align: center;">Este no es un comprobante fiscal</p>
            <p style="text-align: center;">¡Super limpios a super precio!</p>
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

    // Espera a que la imagen se cargue antes de imprimir
    printWindow.document.getElementById('logo').onload = function() {
        printWindow.print();
        printWindow.close();
    };
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
            <option value="">Selecciona un metodo de pago</option>
            <option value="cash">Efectivo</option>
            <option value="credit-card">Tarjeta credito</option>
            <option value="debit-card">Tarjeta debito</option>
            <option value="transfer">Transferencia</option>
            <option value="monedero">Monedero</option>
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


function verificarCortesPendientes(userId) {
    fetch(`/api/cortes/verificar/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log(response.status)
        if (response.status === 404) {
           window.location.href = '/corteparcial';
        } else if (response.status === 200) {
            console.log('No hay cortes pendientes');
        } else {
            throw new Error('Error al verificar cortes.');
        }
    })
    .catch(error => {
        console.error('Error al verificar cortes pendientes:', error);
        Swal.fire('Error', 'Hubo un problema al verificar los cortes pendientes. Por favor, inténtalo de nuevo.', 'error');
    });
}

function verificar() {
    fetch(verifyToken)
        .then(response => response.json())
        .then(data => {
            verificarCortesPendientes(data._id);
            console.log(data._id)
        })
        .catch(error => console.log(error));
}
verificar()




