document.addEventListener('DOMContentLoaded', () => {
    const busquedaInput = document.getElementById('busquedaProductosMain');
    const resultadosDropdown = document.getElementById('resultadosDropdown');
    const productosSeleccionadosList = document.getElementById('productosSeleccionadosList');
    const importeTotal = document.getElementById('importeTotal');
    const sucursalSelect = document.getElementById('sucursalSelect');
    const cantidadInput = document.getElementById('cantidadInput');
    const completarVentaButton = document.getElementById('completarVenta');
    let productos = []; // Variable global para almacenar los productos

    // Cargar productos desde el backend
    function cargarProductos() {
        fetch('/api/productos/cobros/load')
            .then(response => response.json())
            .then(data => {
                productos = data;
            })
            .catch(error => console.error('Error al cargar productos:', error));
    }

    cargarProductos(); // Llamar a la función al cargar la página

    busquedaInput.addEventListener('input', () => {
        const query = busquedaInput.value.toLowerCase();
        if (query.length < 2) {
            resultadosDropdown.innerHTML = ''; // Limpiar resultados si la búsqueda es demasiado corta
            resultadosDropdown.style.display = 'none';
            return;
        }

        // Filtrar productos basados en la búsqueda
        const productosFiltrados = productos.filter(producto => {
            const nombre = producto.nombre ? producto.nombre.toLowerCase() : '';
            const codigoBarras = producto.codigoBarras ? producto.codigoBarras : '';
            const clave = producto.clave ? producto.clave.toLowerCase() : '';

            return nombre.includes(query) ||
                   codigoBarras.includes(query) ||
                   clave.includes(query);
        });

        mostrarResultadosBusqueda(productosFiltrados);
    });

    function mostrarResultadosBusqueda(productos) {
        resultadosDropdown.innerHTML = ''; // Limpiar contenedor
        resultadosDropdown.style.display = productos.length > 0 ? 'block' : 'none'; // Mostrar dropdown si hay resultados
        
        productos.forEach(producto => {
            const option = document.createElement('option');
            option.value = producto._id;
            option.textContent = `${producto.nombre || 'Nombre no disponible'} - ${producto.clave || 'Clave no disponible'}`;
            resultadosDropdown.appendChild(option);
        });
    }

    resultadosDropdown.addEventListener('change', () => {
        const id = resultadosDropdown.value;
        if (!id) return;

        // Obtener el producto desde la variable global
        const producto = productos.find(p => p._id === id);
        if (!producto) return;

        const cantidad = parseInt(cantidadInput.value) || 1;
        let precio = 0;

        if (cantidad >= 1 && cantidad <= 10) {
            precio = producto[`precio${cantidad}`];
        } else if (cantidad > 10) {
            precio = producto.precio10; // Asignar el último precio si la cantidad es mayor que 10
        }

        const importeTotalProducto = cantidad * precio;

        const item = document.createElement('li');
        item.className = 'list-group-item d-flex justify-content-between align-items-center';
        item.dataset.id = id;
        item.dataset.nombre = producto.nombre || 'Nombre no disponible'; // Guardar nombre del producto
        item.innerHTML = `
            ${producto.nombre || 'Nombre no disponible'} - ${producto.clave || 'Clave no disponible'} - Cantidad: ${cantidad} - Importe: $${importeTotalProducto.toFixed(2)}
            <button class="btn btn-danger btn-sm ms-2" onclick="eliminarProducto('${id}', ${importeTotalProducto})">Eliminar</button>
        `;
        productosSeleccionadosList.appendChild(item);
        actualizarImporteTotal(importeTotalProducto);
        
        // Limpiar el input de búsqueda y el dropdown después de agregar el producto
        busquedaInput.value = '';
        cantidadInput.value = 1;
        resultadosDropdown.innerHTML = '';
        resultadosDropdown.style.display = 'none';
    });

    window.eliminarProducto = (id, importeTotal) => {
        document.querySelector(`li[data-id="${id}"]`).remove();
        actualizarImporteTotal(-importeTotal); // Restar el importe al total
    };

    function actualizarImporteTotal(importe) {
        const currentTotal = parseFloat(importeTotal.textContent.replace('Total: $', '')) || 0;
        importeTotal.textContent = `Total: $${(currentTotal + importe).toFixed(2)}`;
    }

    completarVentaButton.addEventListener('click', () => {
        const sucursal = sucursalSelect.value;
        if (!sucursal) {
            alert('Por favor, seleccione una sucursal antes de completar la venta.');
            return;
        }

        const productosSeleccionados = Array.from(productosSeleccionadosList.querySelectorAll('li')).map(item => {
            const productoId = item.dataset.id;
            const productoNombre = item.dataset.nombre;
            const cantidad = parseInt(item.innerHTML.match(/Cantidad: (\d+)/)[1]);
            const importe = parseFloat(item.innerHTML.match(/Importe: \$([\d.]+)/)[1]);
            return { id: productoId, nombre: productoNombre, cantidad, importe };
        });

        const total = parseFloat(importeTotal.textContent.replace('Total: $', ''));

        const venta = {
            sucursal,
            productos: productosSeleccionados,
            total,
            fecha: new Date().toISOString()
        };

        // Guardar venta en el backend
        fetch('/api/productos/cobros/venta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(venta)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Venta guardada:', data);
            imprimirVenta(venta);
        })
        .catch(error => console.error('Error al guardar venta:', error));
    });

    function imprimirVenta(venta) {
        const impresionDiv = document.getElementById('impresion');
        impresionDiv.innerHTML = ''; // Limpiar el contenido previo

        // Crear el contenido HTML para la impresión
        const contenido = `
    <div style="width: 55mm; padding: 10px; font-size: 12px;">
        <h3>Mundi Novi</h3>
        <p><strong>RFC:</strong> AUVJ750221RB8</p>
        <p><strong>Nombre:</strong> Jesus Maria Aguirre Vega</p>
        <p><strong>Regimen:</strong> Regimen Empresarial</p>
        <p><strong>Fecha:</strong> ${new Date(venta.fecha).toLocaleString()}</p>
        <p><strong>Sucursal:</strong> ${venta.sucursal}</p>
        <hr>
        <ul>
            ${venta.productos.map(p => `
                <li>${p.nombre || 'Nombre no disponible'} - Cantidad: ${p.cantidad} - Importe: $${p.importe.toFixed(2)}</li>
            `).join('')}
        </ul>
        <hr>
        <p><strong>Total:</strong> $${venta.total.toFixed(2)}</p>
    </div>
`;


        impresionDiv.innerHTML = contenido;

        // Crear un nuevo ventana para la impresión
        const ventanaImpresion = window.open('', '', 'width=600,height=600');
        ventanaImpresion.document.write('<html><head><title>Impresión de Venta</title>');
        ventanaImpresion.document.write('<style>body { font-family: Arial, sans-serif; }</style>');
        ventanaImpresion.document.write('</head><body>');
        ventanaImpresion.document.write(impresionDiv.innerHTML);
        ventanaImpresion.document.write('</body></html>');

        ventanaImpresion.document.close(); // Necesario para IE >= 10
        ventanaImpresion.focus(); // Necesario para IE >= 10
        ventanaImpresion.print(); // Ejecutar impresión
        
        // Refrescar la página después de un breve retraso para asegurar que la impresión haya terminado
        setTimeout(() => {
            window.location.reload();
        }, 1000); // Esperar 1 segundo
    }
});
