const modal = new mdb.Modal(document.getElementById('ajustarModal'));

btnAjustarKardex.addEventListener('click', () => {
    modal.show();
});

let productosAjuste = [];
let productoSeleccionadoAjuste = null;
let elementoSeleccionadoAjuste = null; // Para controlar el elemento actualmente seleccionado en la lista

// Cargar los productos para ajuste
function cargarProductosAjuste() {
    fetch('/api/materiasPrimas')
        .then(response => response.json())
        .then(data => {
            productosAjuste = data;
        })
        .catch(error => console.error('Error al cargar productos:', error));
}

cargarProductosAjuste();

const inputBuscarProductoAjuste = document.getElementById('inputBuscarProducto');
const listaProductosAjuste = document.getElementById('listaProductos');

if (inputBuscarProductoAjuste && listaProductosAjuste) {
    // Manejar la entrada del usuario
    inputBuscarProductoAjuste.addEventListener('input', () => {
        const searchText = inputBuscarProductoAjuste.value.toLowerCase();
        const productosFiltradosAjuste = productosAjuste.filter(producto => {
            const name = producto.nombre ? producto.nombre.toLowerCase() : '';
            const codigoBarras = producto.codigoBarras ? producto.codigoBarras : '';
            const reference = producto.clave ? producto.clave.toLowerCase() : '';

            return name.includes(searchText) || 
                   codigoBarras.includes(searchText) || 
                   reference.includes(searchText);
        });

        mostrarProductosEnListaAjuste(productosFiltradosAjuste);
    });

    function mostrarProductosEnListaAjuste(productos) {
        if (listaProductosAjuste) {
            listaProductosAjuste.innerHTML = '';

            productos.forEach((producto, index) => {
                const item = document.createElement('li');
                item.textContent = `${producto.nombre} (${producto.clave})`;
                item.dataset.id = producto._id; // Guarda el ID del producto en un atributo de datos
                item.tabIndex = 0; // Permite que el elemento sea enfocable con el teclado

                item.addEventListener('click', () => seleccionarProductoAjuste(producto._id));
                listaProductosAjuste.appendChild(item);

                // Si es el primer elemento, seleccionarlo por defecto
                if (index === 0) {
                    elementoSeleccionadoAjuste = item;
                    item.classList.add('selected');
                }
            });

            // Mostrar la lista si hay productos, ocultarla si no
            listaProductosAjuste.style.display = productos.length > 0 ? 'block' : 'none';
        }
    }

    function seleccionarProductoAjuste(productoId) {
        productoSeleccionadoAjuste = productosAjuste.find(p => p._id === productoId);

        if (productoSeleccionadoAjuste) {

            // Muestra el nombre del producto en el input
            inputBuscarProductoAjuste.value = `${productoSeleccionadoAjuste.nombre} (${productoSeleccionadoAjuste.clave})`;

            // Limpia la lista y oculta el scroll
            listaProductosAjuste.innerHTML = '';
            listaProductosAjuste.style.display = 'none';
            elementoSeleccionadoAjuste = null;
        }
    }

    // Manejar la selección con Enter
    inputBuscarProductoAjuste.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            if (elementoSeleccionadoAjuste) {
                seleccionarProductoAjuste(elementoSeleccionadoAjuste.dataset.id);
            }
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            moverSeleccionAjuste('down');
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            moverSeleccionAjuste('up');
        }
    });

    function moverSeleccionAjuste(direccion) {
        if (direccion === 'down') {
            if (elementoSeleccionadoAjuste) {
                const siguienteElemento = elementoSeleccionadoAjuste.nextElementSibling;
                if (siguienteElemento) {
                    actualizarSeleccionAjuste(siguienteElemento);
                }
            } else {
                const primerElemento = listaProductosAjuste.querySelector('li');
                if (primerElemento) {
                    actualizarSeleccionAjuste(primerElemento);
                }
            }
        } else if (direccion === 'up') {
            if (elementoSeleccionadoAjuste) {
                const elementoAnterior = elementoSeleccionadoAjuste.previousElementSibling;
                if (elementoAnterior) {
                    actualizarSeleccionAjuste(elementoAnterior);
                }
            }
        }
    }

    function actualizarSeleccionAjuste(nuevoElemento) {
        if (elementoSeleccionadoAjuste) {
            elementoSeleccionadoAjuste.classList.remove('selected');
        }
        nuevoElemento.classList.add('selected');
        elementoSeleccionadoAjuste = nuevoElemento;
        nuevoElemento.scrollIntoView({ block: 'nearest' }); // Asegura que el elemento seleccionado sea visible
    }

    // Ocultar la lista cuando el input se vacíe
    inputBuscarProductoAjuste.addEventListener('blur', () => {
        setTimeout(() => {
            listaProductosAjuste.style.display = 'none';
        }, 100); // Tiempo para permitir la selección del elemento antes de ocultar
    });

    // Mostrar la lista cuando el input recibe foco
    inputBuscarProductoAjuste.addEventListener('focus', () => {
        if (inputBuscarProductoAjuste.value.length > 0) {
            listaProductosAjuste.style.display = 'block';
        }
    });
}

// Manejar el clic en el botón "Guardar Ajuste"
document.getElementById('ajustarKardexGeneral').addEventListener('click', async () => {

    const sucursalSelect = document.getElementById('sucursalSelect');
    const cantidadAjuste = document.getElementById('inputCantidadAjuste').value;
    const movimientoAjuste = document.getElementById('tipoMovimientoAjuste').value;
    if (!productoSeleccionadoAjuste) {
        alert('Por favor, seleccione un producto.');
        return;
    }

    if (!cantidadAjuste) {
        alert('Por favor, ingrese la cantidad a ajustar.');
        return;
    }

    const bodyData = {
        reference: productoSeleccionadoAjuste.clave,
        name: productoSeleccionadoAjuste.nombre,
        sucursal: sucursalSelect.value,
        cantidad: cantidadAjuste,
        movimiento: movimientoAjuste,
        sucursalDestino: movimientoAjuste,
        usuario: infoUser._id
    };
    

    try {
        const response = await fetch('/api/kardexSinCosto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyData)
        });

        if (response.ok) {
            // Mostrar mensaje de éxito
            Swal.fire({
                title: 'Éxito',
                text: 'Datos enviados correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                // Recargar la página
                window.location.reload();
            });

        } else {
            // Mostrar mensaje de error genérico
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al enviar los datos.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'Error en la conexión con el servidor.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
});

document.getElementById('cerraModalKardexAjuste').addEventListener('click', async () => {
    modal.hide()
});
