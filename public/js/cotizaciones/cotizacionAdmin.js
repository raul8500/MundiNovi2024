// Recuperar los clientes y manejarlos
const clientes = [];
const clientesSeleccionados = []; // Arreglo para guardar los clientes seleccionados

// Función para recuperar clientes desde la API
async function fetchClientes() {
    try {
        const response = await fetch('/api/clientes');
        if (!response.ok) {
            throw new Error('Error al recuperar los clientes');
        }
        const data = await response.json();
        clientes.push(...data); // Guardar los clientes en el arreglo global
    } catch (error) {
        console.error('Error:', error);
    }
}

// Llamar a la función para cargar los clientes al inicio
fetchClientes();

// Función para mostrar sugerencias
function mostrarSugerencias(inputValue) {
    const sugerenciasContainer = document.getElementById('sugerenciasContainer');
    sugerenciasContainer.innerHTML = ''; // Limpiar sugerencias previas

    if (inputValue.trim() === '') {
        return; // No mostrar sugerencias si el input está vacío
    }

    // Filtrar clientes por nombre o teléfono
    const resultados = clientes.filter(cliente => {
        const nombre = cliente.clientData.name.toLowerCase();
        const telefono = cliente.clientData.phonePrimary?.toLowerCase() || '';
        return nombre.includes(inputValue.toLowerCase()) || telefono.includes(inputValue.toLowerCase());
    });

    // Mostrar las sugerencias
    resultados.forEach(cliente => {
        const sugerencia = document.createElement('div');
        sugerencia.className = 'sugerencia';
        sugerencia.textContent = `${cliente.clientData.name} - ${cliente.clientData.phonePrimary || 'Sin teléfono'}`;
        sugerencia.addEventListener('click', () => seleccionarCliente(cliente));
        sugerenciasContainer.appendChild(sugerencia);
    });
}

// Función para manejar la selección de un cliente
function seleccionarCliente(cliente) {
    document.getElementById('nombreCliente').value = cliente.clientData.name || '';
    document.getElementById('telefonoCliente').value = cliente.clientData.phonePrimary || '';
    document.getElementById('correoCliente').value = cliente.clientData.email || '';

    document.getElementById('streetCliente').value = cliente.clientData.address.street || '';
    document.getElementById('exteriorNumberCliente').value = cliente.clientData.address.exteriorNumber || '';
    document.getElementById('interiorNumberCliente').value = cliente.clientData.address.interiorNumber || '';
    document.getElementById('colonyCliente').value = cliente.clientData.address.colony || '';
    document.getElementById('localityCliente').value = cliente.clientData.address.locality || '';
    document.getElementById('municipalityCliente').value = cliente.clientData.address.municipality || '';
    document.getElementById('zipCodeCliente').value = cliente.clientData.address.zipCode || '';
    document.getElementById('stateCliente').value = cliente.clientData.address.state || '';
    document.getElementById('countryCliente').value = cliente.clientData.address.country || '';

    // Agregar al cliente seleccionado al arreglo
    if (!clientesSeleccionados.some(c => c._id === cliente._id)) {
        clientesSeleccionados.push(cliente);
    }

    // Limpiar las sugerencias
    document.getElementById('sugerenciasContainer').innerHTML = '';
}

// Evento para capturar la entrada en el input
const inputBuscarCliente = document.getElementById('buscarCliente');
inputBuscarCliente.addEventListener('input', () => {
    mostrarSugerencias(inputBuscarCliente.value);
});

// Función para manejar el botón "Siguiente" y cambiar a la sección de productos
document.getElementById('btnSiguienteProductos').addEventListener('click', () => {
    const productosTab = document.getElementById('productos-tab');
    productosTab.disabled = false; // Habilitar la pestaña de productos
    productosTab.click(); // Cambiar a la pestaña de productos
});


//==========================================================

let productos = [];
let productosSeleccionados = [];
let indiceSeleccionado = -1; // Índice para la navegación con teclado

// Función para cargar productos desde el endpoint
async function cargarProductos() {
    try {
        const response = await fetch("/api/productos");
        const data = await response.json();
        if (data.products) {
            productos = data.products; // Acceder al array de productos
        } else {
            console.error("No se encontraron productos en la respuesta del servidor");
        }
    } catch (error) {
        console.error("Error al cargar los productos:", error);
    }
}

// Función para buscar productos
function buscarProducto(query) {
    const options = {
        keys: ["reference", "inventory.unit"], // Claves para buscar
        threshold: 0.4, // Nivel de coincidencia flexible
    };

    const fuse = new Fuse(productos, options);
    return fuse.search(query).map((result) => result.item);
}

// Manejo de input de búsqueda
document.getElementById("buscarProducto").addEventListener("input", (e) => {
    const query = e.target.value.trim();
    const sugerenciasContainer = document.getElementById("sugerenciasProducto");

    // Reiniciar el índice de selección
    indiceSeleccionado = -1;

    // Limpiar sugerencias anteriores
    sugerenciasContainer.innerHTML = "";

    if (query.length > 0) {
        const sugerencias = buscarProducto(query);

        sugerencias.forEach((producto, index) => {
            const item = document.createElement("button");
            item.className = "list-group-item list-group-item-action";
            const precio = producto.datosFinancieros?.precio1 
                ? producto.datosFinancieros.precio1.toFixed(2) 
                : "0.00";
            item.textContent = `${producto.reference} - ${producto.inventory.unit} (${precio})`;

            // Evento para seleccionar con clic
            item.addEventListener("click", () => {
                agregarProducto(producto._id);
                sugerenciasContainer.innerHTML = ""; // Limpiar sugerencias
                document.getElementById("buscarProducto").value = ""; // Limpiar input
            });

            // Añadir al contenedor
            sugerenciasContainer.appendChild(item);
        });
    }
});

// Manejo de teclas para navegación y selección
document.getElementById("buscarProducto").addEventListener("keydown", (e) => {
    const sugerenciasContainer = document.getElementById("sugerenciasProducto");
    const items = sugerenciasContainer.querySelectorAll(".list-group-item");

    if (e.key === "ArrowDown") {
        e.preventDefault();
        if (indiceSeleccionado < items.length - 1) {
            indiceSeleccionado++;
        }
        actualizarSeleccion(items);
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (indiceSeleccionado > 0) {
            indiceSeleccionado--;
        }
        actualizarSeleccion(items);
    } else if (e.key === "Enter") {
        e.preventDefault();
        if (indiceSeleccionado >= 0 && indiceSeleccionado < items.length) {
            items[indiceSeleccionado].click();
        }
    }
});

// Actualizar la selección visual en las sugerencias
function actualizarSeleccion(items) {
    items.forEach((item, index) => {
        if (index === indiceSeleccionado) {
            item.classList.add("active");
            item.scrollIntoView({ block: "nearest" });
        } else {
            item.classList.remove("active");
        }
    });
}

// Agregar producto a la tabla
function agregarProducto(id) {
    const producto = productos.find((p) => p._id === id);
    if (producto) {
        const existente = productosSeleccionados.find((p) => p._id === id);
        if (existente) {
            existente.cantidad++;
            existente.precio = obtenerPrecioPorCantidad(producto.datosFinancieros, existente.cantidad);
            existente.total = existente.cantidad * existente.precio;
        } else {
            const precio = obtenerPrecioPorCantidad(producto.datosFinancieros, 1);
            productosSeleccionados.push({
                ...producto,
                cantidad: 1,
                precio: precio,
                total: precio,
            });
        }
        actualizarTabla();
        actualizarResumen();
    }
}

// Actualizar cantidad de producto
function actualizarCantidad(id, cantidad) {
    const producto = productosSeleccionados.find((p) => p._id === id);
    const originalProducto = productos.find((p) => p._id === id); // Producto completo con datosFinancieros
    if (producto && originalProducto) {
        cantidad = parseInt(cantidad, 10);
        if (!isNaN(cantidad) && cantidad > 0) {
            producto.cantidad = cantidad;
            producto.precio = obtenerPrecioPorCantidad(originalProducto.datosFinancieros, cantidad);
            producto.total = producto.cantidad * producto.precio;
            actualizarTabla();
            actualizarResumen();
        }
    }
}


// Actualizar la tabla
function actualizarTabla() {
    const tbody = document.getElementById("tablaProductos");
    tbody.innerHTML = productosSeleccionados
        .map(
            (p) => {
                const descripcionRangos = construirDescripcionRangos(p.datosFinancieros);
                return `
            <tr>
                <td>${p.reference}</td>
                <td>
                    <input style="width: 75px" type="number" value="${p.cantidad}" min="1" onchange="actualizarCantidad('${p._id}', this.value)" />
                </td>
                <td>
                    <input style="width: 75px" type="number" value="${p.precio.toFixed(2)}" step="0.01" onchange="actualizarPrecio('${p._id}', this.value)" />
                </td>
                <td>${p.total.toFixed(2)}</td>
                <td>${descripcionRangos}</td>
                <td><button class="btn btn-danger btn-sm" onclick="eliminarProducto('${p._id}')">Eliminar</button></td>
            </tr>
        `;
            }
        )
        .join("");
}


// Eliminar producto de la tabla
function eliminarProducto(id) {
    productosSeleccionados = productosSeleccionados.filter((p) => p._id !== id);
    actualizarTabla();
    actualizarResumen();
}

// Actualizar resumen
function actualizarResumen() {
    const total = productosSeleccionados.reduce((acc, p) => acc + p.total, 0);

    document.getElementById("subtotalCotizacion").textContent = `$${total.toFixed(2)}`;
    document.getElementById("totalCotizacion").textContent = `$${total.toFixed(2)}`;
}

function obtenerPrecioPorCantidad(datosFinancieros, cantidad) {
    for (let i = 1; i <= 10; i++) {
        const rangoInicial = datosFinancieros[`rangoInicial${i}`];
        const rangoFinal = datosFinancieros[`rangoFinal${i}`];
        const precio = datosFinancieros[`precio${i}`];

        if (cantidad >= rangoInicial && cantidad <= rangoFinal) {
            return precio; // Retornar el precio correspondiente al rango
        }
    }
    return datosFinancieros.precio1 || 0; // Precio por defecto si no entra en ningún rango
}

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
            lineaActual += `Más de ${rangoInicial} = ${ultimoPrecioValido || 0} | `;
        }

        // Dividir en dos líneas después de cada dos rangos
        if (i % 2 === 0 || i === 4) {
            descripcion += `<span style="font-size: smaller;">${lineaActual.trimEnd().replace(/\|$/, "")}</span><br>`;
            lineaActual = ""; // Reiniciar para la siguiente línea
        }
    }

    return descripcion || "<span style='font-size: smaller;'>Sin rangos disponibles</span>";
}

function actualizarPrecio(id, nuevoPrecio) {
    const producto = productosSeleccionados.find((p) => p._id === id);
    if (producto) {
        nuevoPrecio = parseFloat(nuevoPrecio);
        if (!isNaN(nuevoPrecio) && nuevoPrecio > 0) {
            producto.precio = nuevoPrecio;
            producto.total = producto.cantidad * producto.precio;
            actualizarTabla();
            actualizarResumen();
        }
    }
}

// Inicializar
cargarProductos();



//Listado de cotizaciones

$('#tablaCotizaciones').DataTable({
    ajax: {
        url: '/api/cotizaciones', // Endpoint para obtener las cotizaciones
        dataSrc: ''
    },
    columns: [
        { data: 'folio', title: 'Folio' },
        { data: 'cliente.nombre', title: 'Cliente' },
        { data: 'cliente.direccion', title: 'Dirección' },
        { 
            data: 'totalGeneral', 
            title: 'Total', 
            render: function (data) {
                return `$${data.toFixed(2)}`;
            }
        },
        {
            data: 'fechaCreacion',
            title: 'Fecha',
            render: function (data) {
                const date = new Date(data);
                const formattedDate = date.toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                });
                const formattedTime = date.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                return `${formattedDate} ${formattedTime}`;
            }
        },
        {
            data: null,
            title: 'Acciones',
            render: function (data, type, row) {
                return `
                    <button class="btn btn-info btn-sm btn-detalles" data-id="${row._id}" title="Ver Detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-warning btn-sm btn-reenviar" data-id="${row._id}" title="Reenviar">
                        <i class="fas fa-envelope"></i>
                    </button>
                    <button class="btn btn-primary btn-sm btn-imprimir" data-id="${row._id}" title="Imprimir">
                        <i class="fas fa-print"></i>
                    </button>
                    <button class="btn btn-success btn-sm btn-convertir" data-id="${row._id}" title="Convertir a Pedido">
                        <i class="fas fa-file-alt"></i>
                    </button>
                    <button class="btn btn-danger btn-sm btn-eliminar" data-id="${row._id}" title="Eliminar">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                `;
            }

        }
    ],
    language: {
        "sProcessing": "Procesando...",
        "sLengthMenu": "Mostrar _MENU_ registros",
        "sZeroRecords": "No se encontraron resultados",
        "sInfo": "Mostrando _START_ a _END_ de _TOTAL_ registros",
        "sInfoEmpty": "Mostrando 0 a 0 de 0 registros",
        "sInfoFiltered": "(filtrado de _MAX_ registros totales)",
        "sSearch": "Buscar:",
        "sLoadingRecords": "Cargando...",
        "oPaginate": {
            "sFirst": "Primera",
            "sLast": "Última",
            "sNext": "Siguiente",
            "sPrevious": "Anterior"
        }
    }
});



$('#tablaCotizaciones').on('click', '.btn-convertir', function () {
    const id = $(this).data('id');
    console.log(`Convertir a pedido cotización con ID: ${id}`);
    // Implementar lógica para convertir a pedido
});


$('#tablaCotizaciones').on('click', '.btn-imprimir', function () {
    const id = $(this).data('id');

    // Mostrar un mensaje mientras se genera el PDF
    Swal.fire({
        title: 'Generando impresión',
        text: 'Por favor, espere...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    // Hacer la solicitud para obtener el PDF
    $.ajax({
        url: `/api/cotizaciones/${id}/imprimir`, // Endpoint para generar o descargar el PDF
        method: 'GET',
        xhrFields: {
            responseType: 'blob' // Importante para manejar archivos binarios como PDF
        },
        success: function (data) {
            Swal.close();

            // Crear un objeto URL para el archivo PDF
            const blob = new Blob([data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);

            // Abrir el PDF en una nueva pestaña
            const pdfWindow = window.open();
            if (pdfWindow) {
                pdfWindow.location.href = url;
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudo abrir el archivo PDF. Verifique su configuración del navegador.',
                    icon: 'error'
                });
            }
        },
        error: function (xhr, status, error) {
            Swal.fire({
                title: 'Error',
                text: 'No se pudo generar el PDF. Intente nuevamente.',
                icon: 'error'
            });
            console.error(`Error al obtener el PDF: ${error}`);
        }
    });
});

$('#tablaCotizaciones').on('click', '.btn-eliminar', function () {
    const id = $(this).data('id');

    // Confirmar la eliminación con SweetAlert
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción eliminará la cotización de manera permanente.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Realizar la solicitud para eliminar la cotización
            $.ajax({
                url: `/api/cotizaciones/${id}`, // Endpoint para eliminar
                method: 'DELETE',
                success: function (response) {
                    Swal.fire({
                        title: 'Eliminada',
                        text: response.message,
                        icon: 'success',
                    }).then(() => {
                        // Recargar la tabla para reflejar los cambios
                        $('#tablaCotizaciones').DataTable().ajax.reload();
                    });
                },
                error: function (xhr, status, error) {
                    Swal.fire({
                        title: 'Error',
                        text: 'No se pudo eliminar la cotización. Intenta de nuevo.',
                        icon: 'error',
                    });
                    console.error(`Error al eliminar la cotización: ${error}`);
                }
            });
        }
    });
});

$('#tablaCotizaciones').on('click', '.btn-detalles', function () {
    const id = $(this).data('id');

    // Mostrar un mensaje de carga mientras se obtienen los datos
    Swal.fire({
        title: 'Cargando detalles',
        text: 'Por favor, espere...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    // Hacer la solicitud para obtener los detalles de la cotización
    $.ajax({
        url: `/api/cotizaciones/${id}`, // Endpoint para obtener los detalles
        method: 'GET',
        success: function (response) {
            Swal.close();

            // Llenar los detalles en el modal
            $('#detalleFolio').text(response.folio);
            $('#detalleCliente').text(response.cliente.nombre);
            $('#detalleDireccion').text(response.cliente.direccion);
            $('#detalleTotalGeneral').text(response.totalGeneral.toFixed(2));
            $('#detalleFecha').text(new Date(response.fechaCreacion).toLocaleString('es-ES'));
            
            // Llenar la lista de productos
            const productosHtml = response.productos
                .map(
                    (producto) =>
                        `<li>${producto.nombre} - ${producto.cantidad} x $${producto.precio.toFixed(
                            2
                        )} = $${producto.total.toFixed(2)}</li>`
                )
                .join('');
            $('#detalleProductos').html(productosHtml);

            // Mostrar el modal
            $('#modalDetallesCotizacion').modal('show');
        },
        error: function (xhr, status, error) {
            Swal.fire({
                title: 'Error',
                text: 'No se pudieron cargar los detalles. Intente nuevamente.',
                icon: 'error'
            });
            console.error(`Error al obtener los detalles: ${error}`);
        }
    });
});

$('#tablaCotizaciones').on('click', '.btn-reenviar', function () {
    const id = $(this).data('id');

    // Confirmar reenvío con SweetAlert
    Swal.fire({
        title: '¿Reenviar cotización?',
        text: 'Se enviará nuevamente la cotización al cliente.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, reenviar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Realizar la solicitud para reenviar la cotización
            $.ajax({
                url: `/api/cotizaciones/${id}/reenviar`, // Endpoint para reenviar
                method: 'POST',
                success: function (response) {
                    Swal.fire({
                        title: 'Reenvío exitoso',
                        text: response.message,
                        icon: 'success',
                    });
                },
                error: function (xhr, status, error) {
                    Swal.fire({
                        title: 'Error',
                        text: 'No se pudo reenviar la cotización. Intente nuevamente.',
                        icon: 'error',
                    });
                    console.error(`Error al reenviar la cotización: ${error}`);
                }
            });
        }
    });
});


//Crear

function generarJsonCotizacion() {
    // Recuperar información del cliente
    const cliente = {
        nombre: document.getElementById('nombreCliente').value.trim(),
        telefono: document.getElementById('telefonoCliente').value.trim(),
        correo: document.getElementById('correoCliente').value.trim(),
        direccion: `${document.getElementById('streetCliente').value.trim()} #${document.getElementById('exteriorNumberCliente').value.trim()} ${document.getElementById('interiorNumberCliente').value.trim()}, ${document.getElementById('colonyCliente').value.trim()}, CP: ${document.getElementById('zipCodeCliente').value.trim()},`
    };

    // Recuperar información de los productos seleccionados
    const productos = productosSeleccionados.map(producto => ({
        nombre: producto.reference,
        cantidad: producto.cantidad,
        precio: producto.precio
    }));

    // Recuperar información de la sucursal
    const sucursal = {
        nombre: 'Nave C',
        direccion: 'Direccion Nave C',
        telefono: '2282546598'
    };

    // Recuperar ID del usuario actual
    const usuario = infoUser._id;

    // Construir el JSON final
    const jsonCotizacion = {
        cliente,
        productos,
        sucursal,
        usuario
    };

    console.log('JSON generado:', jsonCotizacion);
    return jsonCotizacion;
}

document.getElementById('btnGenerarCotizacion').addEventListener('click', async () => {
    try {
        const jsonCotizacion = generarJsonCotizacion();

        // Enviar la cotización al backend
        const response = await fetch('/api/cotizaciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonCotizacion)
        });

        if (!response.ok) {
            throw new Error('Error al generar la cotización');
        }

        const data = await response.json();
        Swal.fire({
            title: 'Cotización generada',
            text: `Folio: ${data.folio}`,
            icon: 'success'
        }).then(() => {
            // Refrescar la página después de que el usuario cierre el mensaje
            window.location.reload();
        });
    } catch (error) {
        console.error('Error al generar la cotización:', error);
        Swal.fire({
            title: 'Error',
            text: 'No se pudo generar la cotización. Intente nuevamente.',
            icon: 'error'
        });
    }
});




