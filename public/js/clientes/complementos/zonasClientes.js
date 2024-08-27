// Definición de URLs
const urlZonaClientes = '/api/zonasClientes';
const urlEditZonaClientes = '/api/zonasClientes'; // Cambiar si es diferente para edición
const urlDeleteZonaClientes = '/api/zonasClientes';

let currentPageZonaClientes = 1;
const itemsPerPageZonaClientes = 5;
let zonaClientes = [];
let idZonaClienteEnEdicion = null;

// Función para mostrar las zonas de clientes
const mostrarZonaClientes = (zonaClientes, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    let resultadosZonaClientes = '';

    zonaClientes.slice(startIndex, endIndex).forEach((item) => {
        resultadosZonaClientes += `
            <tr>
                <td class="text-center">${item.clave}</td>
                <td class="text-center">${item.nombre}</td>
                <td class="text-center">${item.descripcion}</td>
                <td class="text-center">
                    <button id="${item._id}" type="button" class="btn btn-danger btn-rounded btnDeleteZonaClientes">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                    <button id="${item._id}" type="button" class="btn btn-secondary btn-rounded btnEditZonaClientes">
                        <i class="fa-solid fa-gear"></i>
                    </button>
                </td>
            </tr>`;
    });

    document.getElementById('zonaClienteData').innerHTML = resultadosZonaClientes;

    // Añadir manejadores de eventos para botones de eliminar y editar
    document.querySelectorAll('.btnDeleteZonaClientes').forEach(button => {
        button.addEventListener('click', (event) => confirmarEliminarZonaCliente(event.target.id));
    });

    document.querySelectorAll('.btnEditZonaClientes').forEach(button => {
        button.addEventListener('click', (event) => editarZonaCliente(event.target.id));
    });
};

// Función para confirmar la eliminación de una zona de cliente
const confirmarEliminarZonaCliente = (id) => {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esto",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarZonaCliente(id);
        }
    });
};

// Función para eliminar una zona de cliente
const eliminarZonaCliente = (id) => {
    fetch(`${urlDeleteZonaClientes}/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            Swal.fire(
                'Eliminado!',
                'La zona de cliente ha sido eliminada.',
                'success'
            );
            cargarZonaClientes(); // Recargar la lista después de eliminar
        } else {
            Swal.fire(
                'Error!',
                'Hubo un problema al eliminar la zona de cliente.',
                'error'
            );
        }
    })
    .catch(error => console.log('Error:', error));
};

// Función para editar una zona de cliente
const editarZonaCliente = (id) => {
    fetch(`${urlEditZonaClientes}/${id}`)
    .then(response => response.json())
    .then(data => {
        // Llenar los campos del modal con los datos recibidos
        document.getElementById('formZonaClave').value = data.clave || ''; // Incluye el campo clave
        document.getElementById('formZonaNombre').value = data.nombre || '';
        document.getElementById('formZonaDescripcion').value = data.descripcion || '';

        // Cambiar el texto del botón de agregar a guardar
        const btnAgregarZonaCliente = document.getElementById('btnAddZonaCliente');
        btnAgregarZonaCliente.textContent = 'Guardar';

        // Guardar el ID de la zona en edición
        idZonaClienteEnEdicion = id;

        // Mostrar el modal
        const modalZonaCliente = new bootstrap.Modal(document.getElementById('modalZonaCliente'));
        modalZonaCliente.show();
    })
    .catch(error => console.log('Error:', error));
};

// Manejador para el botón de agregar/guardar zona de cliente
document.getElementById('btnAddZonaCliente').addEventListener('click', () => {
    const zonaClienteData = {
        clave: document.getElementById('formZonaClave').value,
        nombre: document.getElementById('formZonaNombre').value,
        descripcion: document.getElementById('formZonaDescripcion').value
    };

    if (idZonaClienteEnEdicion) {
        // Si hay un ID de zona en edición, actualizar la zona existente
        fetch(`${urlEditZonaClientes}/${idZonaClienteEnEdicion}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(zonaClienteData)
        })
        .then(response => {
            if (response.ok) {
                Swal.fire(
                    'Guardado!',
                    'La zona de cliente ha sido actualizada.',
                    'success'
                );
                cargarZonaClientes(); // Recargar la lista después de guardar
                resetFormulario(); // Limpiar el formulario y resetear el estado
            } else {
                Swal.fire(
                    'Error!',
                    'Hubo un problema al actualizar la zona de cliente.',
                    'error'
                );
            }
        })
        .catch(error => console.log('Error:', error));
    } else {
        // Si no hay un ID, significa que es un nuevo registro
        fetch(urlEditZonaClientes, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(zonaClienteData)
        })
        .then(response => {
            if (response.ok) {
                Swal.fire(
                    'Agregado!',
                    'La zona de cliente ha sido agregada.',
                    'success'
                );
                cargarZonaClientes(); // Recargar la lista después de agregar
                resetFormulario(); // Limpiar el formulario
            } else {
                Swal.fire(
                    'Error!',
                    'Hubo un problema al agregar la zona de cliente.',
                    'error'
                );
            }
        })
        .catch(error => console.log('Error:', error));
    }
});


// Función para resetear el formulario después de guardar o agregar
const resetFormulario = () => {
    document.getElementById('formZonaClave').value = '';
    document.getElementById('formZonaNombre').value = '';
    document.getElementById('formZonaDescripcion').value = '';
    document.getElementById('btnAddZonaCliente').textContent = 'Agregar';
    idZonaClienteEnEdicion = null;
};


// Función para actualizar los controles de paginación
const actualizarControlesPaginacionZonaClientes = () => {
    const botonAnterior = document.querySelector('#anteriorZonaClientes');
    const botonSiguiente = document.querySelector('#siguienteZonaClientes');

    if (botonAnterior && botonSiguiente) {
        botonAnterior.disabled = currentPageZonaClientes === 1;
        botonSiguiente.disabled =
            currentPageZonaClientes === Math.ceil(zonaClientes.length / itemsPerPageZonaClientes);
    }
};

// Función para generar los números de página
const generarNumerosDePaginaZonaClientes = () => {
    const paginacionContainer = document.getElementById('paginationZonaClientes');

    if (paginacionContainer) {
        const numeroTotalPaginas = Math.ceil(zonaClientes.length / itemsPerPageZonaClientes);

        let paginacionHTML = '';

        let startPage = Math.max(
            1,
            currentPageZonaClientes - Math.floor(5 / 2),
        );
        let endPage = Math.min(
            numeroTotalPaginas,
            startPage + 5 - 1,
        );

        if (startPage > 1) {
            paginacionHTML +=
                '<li class="page-item"><a class="page-link" href="#" onclick="cambiarPaginaZonaClientes(1)">1</a></li>';
            if (startPage > 2) {
                paginacionHTML +=
                    '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginacionHTML += `<li class="page-item ${
                i === currentPageZonaClientes ? 'active' : ''
            }"><a class="page-link" href="#" onclick="cambiarPaginaZonaClientes(${i})">${i}</a></li>`;
        }

        if (endPage < numeroTotalPaginas) {
            if (endPage < numeroTotalPaginas - 1) {
                paginacionHTML +=
                    '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
            paginacionHTML +=
                `<li class="page-item"><a class="page-link" href="#" onclick="cambiarPaginaZonaClientes(${numeroTotalPaginas})">${numeroTotalPaginas}</a></li>`;
        }

        paginacionContainer.innerHTML = paginacionHTML;
        actualizarControlesPaginacionZonaClientes();
    }
};

// Función para cargar zonas de clientes y paginación
const cargarZonaClientes = () => {
    fetch(urlZonaClientes)
    .then(response => response.json())
    .then(data => {
        zonaClientes = data;
        mostrarZonaClientes(zonaClientes, currentPageZonaClientes, itemsPerPageZonaClientes);
        generarNumerosDePaginaZonaClientes();
    })
    .catch(error => console.log('Error:', error));
};

// Función para cambiar de página
const cambiarPaginaZonaClientes = (pagina) => {
    if (pagina > 0 && pagina <= Math.ceil(zonaClientes.length / itemsPerPageZonaClientes)) {
        currentPageZonaClientes = pagina;
        mostrarZonaClientes(zonaClientes, currentPageZonaClientes, itemsPerPageZonaClientes);
        generarNumerosDePaginaZonaClientes();
    }
};

// Inicializar la carga de zonas de clientes
cargarZonaClientes();
