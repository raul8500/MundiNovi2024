let productos = []; // Variable global para almacenar los productos
let sucursalInfo = ''; // Variable global para almacenar la información de la sucursal

function cargarSucursal() {
    fetch('/api/sucursal/id/' + infoUser.sucursalId)
        .then(response => response.json())
        .then(data => {
            sucursalInfo = data;
        })
        .catch(error => console.error('Error al cargar sucursal:', error));
}

function cargarProductos() {
    fetch('/api/productos/cobros/load')
        .then(response => response.json())
        .then(data => {
            productos = data;
            cargarSucursal();
        })
        .catch(error => console.error('Error al cargar productos:', error));
}

cargarProductos();

document.getElementById('producto').addEventListener('input', function () {
    const valorInput = this.value.toLowerCase();
    const contenedorSugerencias = document.getElementById('sugerencias');

    if (valorInput === '') {
        contenedorSugerencias.innerHTML = ''; // Limpiar sugerencias si el input está vacío
        return; // Salir si el campo de búsqueda está vacío
    }

    const listaFiltrada = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(valorInput)
    );

    contenedorSugerencias.innerHTML = '';

    listaFiltrada.forEach(producto => {
        const elementoSugerencia = document.createElement('div');
        elementoSugerencia.classList.add('sugerencia');
        elementoSugerencia.textContent = producto.nombre;
        elementoSugerencia.addEventListener('click', function () {
            document.getElementById('producto').value = producto.nombre;
            contenedorSugerencias.innerHTML = ''; // Limpiar sugerencias después de seleccionar
        });
        contenedorSugerencias.appendChild(elementoSugerencia);
    });
});

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
    let precio = productoSeleccionado.precio1; // Default price for 1 item
    if (cantidad >= 10) {
        precio = productoSeleccionado.precio10;
    } else {
        precio = productoSeleccionado[`precio${cantidad}`] || productoSeleccionado.precio1; // Use default price if not available
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
}

document.getElementById('agregarProducto').addEventListener('click', () => {
    agregarProducto();
});

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
    }
});

document.getElementById('completarVenta').addEventListener('click', () => {
    completarVenta();
});

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

document.getElementById('productos').addEventListener('click', (event) => {
    if (event.target.classList.contains('eliminarProducto')) {
        const fila = event.target.closest('tr');
        fila.remove();
        actualizarResumenVenta();
    }
});

document.getElementById('cancelarVenta').addEventListener('click', () => {
    confirmarCancelarVenta();
});

function confirmarCancelarVenta() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres cancelar la venta y borrar todos los datos?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'No, mantener'
    }).then((result) => {
        if (result.isConfirmed) {
            cancelarVenta();
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
                        ${p.nombre || 'Nombre no disponible'} - Cantidad: ${p.cantidad} - Importe: $${p.total.toFixed(2)}
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





