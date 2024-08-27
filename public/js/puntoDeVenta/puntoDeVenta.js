let productos = []; // Variable global para almacenar los productos
let sucursalInfo = ''; // Variable global para almacenar la información de la sucursal
let indexSugerencia = -1; // Índice de la sugerencia actualmente seleccionada

// Cargar la información de la sucursal
function cargarSucursal() {
    fetch('/api/sucursal/id/' + infoUser.sucursalId)
        .then(response => response.json())
        .then(data => {
            sucursalInfo = data;
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

// Manejo del input de búsqueda de productos
document.getElementById('producto').addEventListener('input', function () {
    const valorInput = this.value.toLowerCase();
    const contenedorSugerencias = document.getElementById('sugerencias');
    indexSugerencia = -1; // Restablecer el índice de la sugerencia

    if (valorInput === '') {
        contenedorSugerencias.innerHTML = ''; // Limpiar sugerencias si el input está vacío
        return; // Salir si el campo de búsqueda está vacío
    }

    const listaFiltrada = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(valorInput)
    );

    contenedorSugerencias.innerHTML = '';

    listaFiltrada.forEach((producto, index) => {
        const elementoSugerencia = document.createElement('div');
        elementoSugerencia.classList.add('sugerencia');
        elementoSugerencia.textContent = producto.nombre;
        elementoSugerencia.dataset.index = index;
        elementoSugerencia.addEventListener('click', function () {
            seleccionarProducto(producto);
        });
        contenedorSugerencias.appendChild(elementoSugerencia);
    });
});

// Seleccionar un producto de la lista de sugerencias
function seleccionarProducto(producto) {
    document.getElementById('producto').value = producto.nombre;
    document.getElementById('sugerencias').innerHTML = ''; // Limpiar sugerencias después de seleccionar
    document.getElementById('producto').focus(); // Regresar al input de búsqueda
}

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
            const productoSeleccionado = productos.find(p => p.nombre === sugerencias[indexSugerencia].textContent);
            if (productoSeleccionado) {
                seleccionarProducto(productoSeleccionado);
            }
        }
    }
});

// Actualizar las sugerencias con la selección actual
function actualizarSugerencias() {
    const sugerencias = document.querySelectorAll('#sugerencias .sugerencia');
    sugerencias.forEach((sugerencia, index) => {
        if (index === indexSugerencia) {
            sugerencia.classList.add('seleccionado');
        } else {
            sugerencia.classList.remove('seleccionado');
        }
    });
}

// Agregar un producto a la tabla
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

    // Seleccionar el precio basado en la cantidad
    let precio = parseFloat(productoSeleccionado.precio1); // Precio predeterminado para 1 artículo
    for (let i = 10; i >= 1; i--) {
        if (cantidad >= i) {
            precio = parseFloat(productoSeleccionado[`precio${i}`]) || precio;
            break;
        }
    }

    const total = cantidad * precio;

    // Agregar el producto a la tabla
    const nuevaFila = document.createElement('tr');
    nuevaFila.innerHTML = `
        <td>${productoSeleccionado.nombre}</td>
        <td><input type="number" class="form-control precio" value="${precio.toFixed(2)}" step="0.01"></td>
        <td><input type="number" class="form-control cantidad" value="${cantidad}" step="1"></td>
        <td class="total">$${total.toFixed(2)}</td>
        <td><button class="btn btn-warning btn-sm eliminarProducto">Eliminar</button></td>
    `;
    document.getElementById('productos').appendChild(nuevaFila);

    // Actualizar el total de productos y el total de la venta
    actualizarResumenVenta();

    // Limpiar el input de búsqueda y la cantidad
    inputProducto.value = '';
    inputCantidad.value = '1';
    inputProducto.focus(); // Regresar al input de búsqueda
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
    completarVenta();
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

// Manejo de cambios en precios y cantidades
document.getElementById('productos').addEventListener('input', (event) => {
    if (event.target.classList.contains('cantidad') || event.target.classList.contains('precio')) {
        const fila = event.target.closest('tr');
        const cantidad = parseInt(fila.querySelector('.cantidad').value);
        const precioInput = fila.querySelector('.precio');
        let precio = parseFloat(precioInput.value);

        // Actualizar el precio basado en la cantidad si no se está editando manualmente
        if (event.target.classList.contains('cantidad')) {
            if (cantidad >= 10) {
                precio = productos.find(p => p.nombre === fila.children[0].textContent).precio10;
            } else {
                precio = productos.find(p => p.nombre === fila.children[0].textContent)[`precio${cantidad}`] || precioInput.value;
            }
            precioInput.value = precio.toFixed(2);
        }

        const total = cantidad * precio;
        fila.querySelector('.total').textContent = `$${total.toFixed(2)}`;
        actualizarResumenVenta();
    }
});

// Manejo del clic en el botón de eliminar producto
document.getElementById('productos').addEventListener('click', event => {
    if (event.target.classList.contains('eliminarProducto')) {
        event.target.closest('tr').remove();
        actualizarResumenVenta();
    }
});

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
        }
    });
}

function cancelarVenta() {
    document.getElementById('productos').innerHTML = '';
    document.getElementById('totalProductos').textContent = '0';
    document.getElementById('totalVenta').textContent = '0.00';
    document.getElementById('producto').value = '';
    document.getElementById('cantidad').value = '1';
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

    Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres finalizar la venta?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, pagar',
        cancelButtonText: 'No, revisar'
    }).then((result) => {
        if (result.isConfirmed) {
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
        // Si tiene 'btn-success', la cambia a 'btn-primary'
        btnFacturar.classList.remove('btn-success');
        btnFacturar.classList.add('btn-primary');
        var facturaResumenVenta = document.getElementById('facturaResumenVenta')
        facturaResumenVenta.textContent = 'N/A'
        facturaResumenVenta.style.color = 'black'
    } else {
        // Si no tiene 'btn-success', la cambia a 'btn-success'
        btnFacturar.classList.remove('btn-primary');
        btnFacturar.classList.add('btn-success');
        var facturaResumenVenta = document.getElementById('facturaResumenVenta')
        facturaResumenVenta.textContent = 'Con Factura'
        facturaResumenVenta.style.color = 'green'
    }

}


// Manejo del clic en el botón de facturar
document.getElementById('btnFacturar').addEventListener('click', () => {
    facturarVenta();
});




