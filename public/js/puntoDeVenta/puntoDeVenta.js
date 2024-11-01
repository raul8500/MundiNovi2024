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

    const filas = document.querySelectorAll('#productos tr');
    let productoExistente = false;

    filas.forEach(fila => {
        const nombreProducto = fila.children[0].textContent;
        if (nombreProducto === productoSeleccionado.name) {
            const cantidadActual = parseInt(fila.querySelector('.cantidad').value);
            const nuevaCantidad = cantidadActual + cantidad;
            fila.querySelector('.cantidad').value = nuevaCantidad;

            let precioNormal = productoSeleccionado.datosFinancieros.precio1;
            let precioParaArreglo = precioNormal / 1.16;
            let precioConIVA = precioNormal;
            let monedero = 0;
            const totalSinRango = productoSeleccionado.datosFinancieros.precio1 * nuevaCantidad; // Total sin rango

            for (let i = 1; i <= 10; i++) {
                const rangoInicial = productoSeleccionado.datosFinancieros[`rangoInicial${i}`];
                const rangoFinal = productoSeleccionado.datosFinancieros[`rangoFinal${i}`];
                if (nuevaCantidad >= rangoInicial && nuevaCantidad <= rangoFinal) {
                    precioNormal = productoSeleccionado.datosFinancieros[`precio${i}`] || precioNormal;
                    precioParaArreglo = precioNormal / 1.16;
                    precioConIVA = precioNormal;
                    const porcentajeMonedero = productoSeleccionado.datosFinancieros[`porcentajeMonedero${i}`] || 0;
                    monedero = (nuevaCantidad * precioNormal) * (porcentajeMonedero / 100);
                    break;
                }
            }

            const nuevoTotal = nuevaCantidad * precioNormal;
            const totalConIVA = nuevoTotal;

            fila.querySelector('.precio').value = precioNormal.toFixed(2);
            fila.querySelector('.total').textContent = `$${nuevoTotal.toFixed(2)}`;

            const index = productosEnVenta.findIndex(p => p.nombre === productoSeleccionado.name);
            if (index !== -1) {
                productosEnVenta[index].cantidad = nuevaCantidad;
                productosEnVenta[index].precio = precioParaArreglo;
                productosEnVenta[index].precioConIVA = precioConIVA; // Precio con IVA
                productosEnVenta[index].total = nuevaCantidad * precioParaArreglo;
                productosEnVenta[index].monedero = monedero;
                productosEnVenta[index].totalConIVA = totalConIVA;
                productosEnVenta[index].totalSinRango = totalSinRango; // Total sin rango
            }

            productoExistente = true;
        }
    });

    if (!productoExistente) {
        let precioNormal = parseFloat(productoSeleccionado.datosFinancieros.precio1);
        let precioParaArreglo = precioNormal / 1.16;
        let precioConIVA = precioNormal;
        let monedero = 0;
        const totalSinRango = precioNormal * cantidad; // Total sin rango

        for (let i = 1; i <= 10; i++) {
            const rangoInicial = productoSeleccionado.datosFinancieros[`rangoInicial${i}`];
            const rangoFinal = productoSeleccionado.datosFinancieros[`rangoFinal${i}`];
            if (cantidad >= rangoInicial && cantidad <= rangoFinal) {
                precioNormal = parseFloat(productoSeleccionado.datosFinancieros[`precio${i}`]) || precioNormal;
                precioParaArreglo = precioNormal / 1.16;
                precioConIVA = precioNormal;
                const porcentajeMonedero = productoSeleccionado.datosFinancieros[`porcentajeMonedero${i}`] || 0;
                monedero = (cantidad * precioNormal) * (porcentajeMonedero / 100);
                break;
            }
        }

        const total = cantidad * precioNormal;
        const totalConIVA = total;

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
            <td><input type="number" class="form-control precio" value="${precioNormal.toFixed(2)}" step="0.01"></td>
            <td><input type="number" class="form-control cantidad" value="${cantidad}" step="1"></td>
            <td class="total">$${total.toFixed(2)}</td>
            <td><button class="btn btn-warning btn-sm eliminarProducto">Eliminar</button></td>
        `;

        document.getElementById('productos').appendChild(nuevaFila);

        productosEnVenta.push({
            _id: productoSeleccionado._id,
            nombre: productoSeleccionado.name,
            cantidad,
            precio: precioParaArreglo,
            precioConIVA, // Precio con IVA
            total: cantidad * precioParaArreglo,
            monedero,
            totalConIVA,
            totalSinRango // Total sin rango
        });
    }

    actualizarResumenVenta();

    inputProducto.value = '';
    inputCantidad.value = 1;
    inputProducto.focus();
    console.log(productosEnVenta);
}

document.getElementById('productos').addEventListener('input', (event) => {
    if (event.target.classList.contains('cantidad') || event.target.classList.contains('precio')) {
        const fila = event.target.closest('tr');
        const cantidad = parseInt(fila.querySelector('.cantidad').value) || 0;
        const precioInput = fila.querySelector('.precio');
        let precioNormal = parseFloat(precioInput.value) || 0;

        const productoNombre = fila.children[0].textContent;
        const producto = productos.find(p => p.name === productoNombre);

        if (producto) {
            let monedero = 0;
            let precioConIVA = precioNormal;
            const totalSinRango = producto.datosFinancieros.precio1 * cantidad; // Total sin rango
            if (event.target.classList.contains('cantidad')) {
                for (let i = 1; i <= 10; i++) {
                    const rangoInicial = producto.datosFinancieros[`rangoInicial${i}`];
                    const rangoFinal = producto.datosFinancieros[`rangoFinal${i}`];
                    if (cantidad >= rangoInicial && cantidad <= rangoFinal) {
                        precioNormal = parseFloat(producto.datosFinancieros[`precio${i}`]) || precioNormal;
                        precioConIVA = precioNormal;
                        const porcentajeMonedero = producto.datosFinancieros[`porcentajeMonedero${i}`] || 0;
                        monedero = (cantidad * precioNormal) * (porcentajeMonedero / 100);
                        break;
                    }
                }
                precioInput.value = precioNormal.toFixed(2);
            }

            const total = cantidad * precioNormal;
            const totalConIVA = total;

            fila.querySelector('.total').textContent = `$${total.toFixed(2)}`;

            const index = productosEnVenta.findIndex(p => p.nombre === productoNombre);
            if (index !== -1) {
                productosEnVenta[index] = {
                    ...productosEnVenta[index],
                    cantidad,
                    precio: precioNormal / 1.16,
                    precioConIVA, // Precio con IVA
                    total: cantidad * (precioNormal / 1.16),
                    monedero,
                    totalConIVA,
                    totalSinRango // Total sin rango
                };
            }
            console.log(productosEnVenta);
        }

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
        console.log(response.status)
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
        console.log(data)
        if(data.ventaCreada == true){
            if(resumenVenta.cliente.esfactura == true){
                if(data.facturaCreada == true){
                    if(data.facturaEnviada == true){
                        Swal.fire({
                            icon: 'success',
                            title: 'Venta completada',
                            text: 'La venta registrada, la factura fue creada y enviada exitosamente.'
                        });
                    }else{
                        Swal.fire({
                            icon: 'success',
                            title: 'Venta completada',
                            text: 'La venta registrada, la factura fue creada pero no fue enviada porque no pudeo ser timbrada por el SAT.'
                        });
                    }
                }
            }
            if(metodoEnvio == 'impreso'){
                Swal.fire({
                    icon: 'success',
                    title: 'Venta completada',
                    text: 'La venta se ha registrado exitosamente.'
                });
                imprimirTicket(venta, resumenVenta);
                
                //window.location.reload();
            }
            if(metodoEnvio == 'correo'){
                if(data.correoEnviado == true){
                    Swal.fire({
                        icon: 'success',
                        title: 'Venta completada y enviada al correo electronico',
                        text: 'La venta se ha registrado exitosamente.'
                    });
                    /*
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                    */
                }
            }
        }
    })
    .catch(error => {
        console.log(error)
        Swal.fire('Error', 'Hubo un problema al completar la venta. Por favor, inténtalo de nuevo.', 'error');
    });
}

function imprimirTicket(venta, resumenVenta) {
        console.log(venta.productos)

    const ticketWidth = 32; // Ancho máximo del ticket en caracteres
    const separator = '-'.repeat(ticketWidth);

    function formatLine(text, width, rightAlign = false) {
        return rightAlign ? text.padStart(width) : text.padEnd(width);
    }

    function formatProductos(productos) {
        return `
            <ul style="list-style: none; padding: 0; margin: 0; font-size: 9px;">
                <li>
                    <span style="display: inline-block; width: 30px; text-align: left;">Cant.</span>
                    <span style="display: inline-block; width: 90px; text-align: left;">Artículo</span>
                    <span style="display: inline-block; width: 40px; text-align: right;">Precio</span>
                    <span style="display: inline-block; width: 40px; text-align: right;">Total</span>
                </li>
                ${productos.map(p => {
                    const nombreDividido = p.nombre.split(" ");
                    let nombreHtml = "";
                    let lineaActual = "";

                    nombreDividido.forEach((palabra) => {
                        if ((lineaActual + palabra).length > 15) {
                            nombreHtml += `<div>${lineaActual.trim()}</div>`;
                            lineaActual = palabra + " ";
                        } else {
                            lineaActual += palabra + " ";
                        }
                    });
                    nombreHtml += `<div>${lineaActual.trim()}</div>`;

                    return `
                        <li style="word-break: break-word; margin-bottom: 5px;">
                            <span style="display: inline-block; width: 30px; text-align: left; vertical-align: middle;">${p.cantidad}</span>
                            <span style="display: inline-block; width: 90px; text-align: left;">${nombreHtml}</span>
                            <span style="display: inline-block; width: 40px; text-align: right;">$${p.precioConIVA.toFixed(2)}</span>
                            <span style="display: inline-block; width: 40px; text-align: right;">$${p.totalConIVA.toFixed(2)}</span>
                        </li>
                    `;
                }).join('')}
            </ul>
        `;
    }

    function formatFormasDePago(formasDePago) {
        let formasDePagoHtml = formasDePago.map(fp => {
            let tipoPago = {
                'cash': 'Efectivo',
                'credit-card': 'Tarjeta crédito',
                'debit-card': 'Tarjeta débito',
                'transfer': 'Transferencia'
            }[fp.tipo] || fp.tipo;

            return `<p style="margin: 2px 0;">Pago con ${tipoPago}: ${formatLine(`$${fp.importe.toFixed(2)}`, ticketWidth, true)}</p>`;
        }).join('');

        const cambioTexto = typeof formasDePago.find(fp => fp.tipo === 'cash')?.cambio === 'number'
            ? `$${formasDePago.find(fp => fp.tipo === 'cash').cambio.toFixed(2)}`
            : `$${(parseFloat(resumenVenta.totalPagado) - parseFloat(resumenVenta.totalAPagar)).toFixed(2)}`;

        formasDePagoHtml += `<p style="margin: 2px 0;">Cambio: ${formatLine(cambioTexto, ticketWidth, true)}</p>`;
        
        return formasDePagoHtml;
    }

    function calcularAhorro(productos) {
        return productos.reduce((ahorro, producto) => {
            const totalSinRango = producto.totalSinRango || 0;  // Propiedad totalSinRango debe estar correctamente calculada
            const totalConIVA = producto.totalConIVA || 0;      // totalConIVA debe corresponder al total con descuento
            return ahorro + Math.max(0, totalSinRango - totalConIVA); // Aseguramos no restar más de lo que hay
        }, 0);
    }


    const totalAhorro = calcularAhorro(venta.productos);

    const ticketContent = `
        <div style="width: 55mm; padding: 10px; font-size: 10px;">
            <img id="logo" src="/img/logoColor.png" style="width: 90px; height: 80px; display: block; margin: 0 auto;">
            <h2 style="text-align: center;">Mundi Novi</h2>
            <p style="text-align: center; margin: 2px 0;">JESUS MARIA AGUIRRE VEGA</p>
            <p style="text-align: center; margin: 2px 0;">REGIMEN ACTIVIDAD EMPRESARIAL</p>
            <p style="text-align: center; margin: 2px 0;">RFC: AUVJ750221RB8</p>
            <p style="text-align: center; margin: 2px 0;">Dirección: Sur Norte 14 BC y CD, Central de Abastos, 91637, Ejido FDO Gutierrez, Ver.</p>
            <hr style="border: 1px solid black;">
            <p style="margin: 2px 0;">Folio: ${Math.floor(Math.random() * 90000) + 10000}</p>
            <p style="margin: 2px 0;">Fecha: ${new Date(venta.fecha).toLocaleString()}</p>
            <p style="margin: 2px 0;">Cajero: ${infoUser.name}</p>
            <p style="margin: 2px 0;">Expedido en: ${sucursalInfo.datosTicket.direccion}</p>
            <hr style="border: 1px solid black;">
            ${formatProductos(venta.productos)}
            <hr style="border: 1px solid black;">
            <p style="text-align: right; margin: 2px 0; font-weight: bold;">Total venta: $${venta.totalVenta.toFixed(2)}</p>
            <p style="text-align: right; margin: 2px 0;">Total productos: ${venta.totalProductos}</p>
            <div style="text-align: right;">
                ${formatFormasDePago(resumenVenta.formasDePago)}
            </div>
            <hr style="border: 1px solid black;">
            <p style="text-align: center;">Usted ahorró: ${formatLine(`$${totalAhorro.toFixed(2)}`, ticketWidth, true)}</p>
            <p style="text-align: center;">Este no es un comprobante fiscal</p>
            <p style="text-align: center;">¡Super limpios a super precio!</p>
        </div>
    `;

    const printWindow = window.open('', '', 'width=320,height=500');
    if (printWindow) {
        printWindow.document.write('<style>body { font-family: Arial, sans-serif; }</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(ticketContent);
        printWindow.document.write('</body></html>');

        printWindow.document.close();
        printWindow.focus();

        const logoImage = printWindow.document.getElementById('logo');
        if (logoImage) {
            logoImage.onload = function() {
                printWindow.print();
                printWindow.close();
            };
        } else {
            printWindow.print();
            printWindow.close();
        }
    } else {
        console.error("Error al abrir la ventana de impresión.");
        Swal.fire('Error', 'No se pudo abrir la ventana de impresión. Asegúrate de permitir ventanas emergentes.', 'error');
    }
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




