const urlGetImpuestos = '/api/impuesto'; // Cambia esto según tu endpoint para impuestos
const urlEditImpuesto = '/api/impuesto'; // Cambia esto según tu endpoint para editar impuestos
const urlDeleteImpuesto = '/api/impuesto'; // Cambia esto según tu endpoint para eliminar impuestos

const contenedorImpuestos = document.getElementById('impuestoData');
let currentPageImpuestos = 1;
const itemsPerPageImpuestos = 5;
const maxPageLinksImpuestos = 5;
let impuestos = [];

// Función para mostrar los impuestos
const mostrarImpuestos = (impuestos, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    let resultadosImpuestos = '';

    impuestos.slice(startIndex, endIndex).forEach((item) => {
        resultadosImpuestos += `
            <tr>
                <td class="text-center">${item.clave}</td>
                <td class="text-center">${item.nombre}</td>
                <td class="text-center">${item.descripcion}</td>
                <td class="text-center">
                    <button id="edit-${item._id}" type="button" class="btn btn-secondary btn-rounded btnEditImpuesto" data-id="${item._id}">
                        <i class="fa-solid fa-gear"></i>
                    </button>
                    <button id="delete-${item._id}" type="button" class="btn btn-danger btn-rounded btnDeleteImpuesto" data-id="${item._id}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>`;
    });

    contenedorImpuestos.innerHTML = resultadosImpuestos;
};

// Función para actualizar los controles de paginación
function actualizarControlesPaginacionImpuestos() {
    const botonAnterior = document.querySelector('#anteriorImpuestos');
    const botonSiguiente = document.querySelector('#siguienteImpuestos');

    if (botonAnterior && botonSiguiente) {
        botonAnterior.disabled = currentPageImpuestos === 1;
        botonSiguiente.disabled =
            currentPageImpuestos === Math.ceil(impuestos.length / itemsPerPageImpuestos);
    }
}

// Función para generar los números de página
function generarNumerosDePaginaImpuestos() {
    const paginacionContainer = document.getElementById('paginationImpuestos');

    if (paginacionContainer) {
        const numeroTotalPaginas = Math.ceil(impuestos.length / itemsPerPageImpuestos);

        let paginacionHTML = '';

        let startPage = Math.max(
            1,
            currentPageImpuestos - Math.floor(maxPageLinksImpuestos / 2),
        );
        let endPage = Math.min(
            numeroTotalPaginas,
            startPage + maxPageLinksImpuestos - 1,
        );

        if (startPage > 1) {
            paginacionHTML +=
                '<li class="page-item"><a class="page-link" href="#" onclick="cambiarPaginaImpuestos(1)">1</a></li>';
            if (startPage > 2) {
                paginacionHTML +=
                    '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginacionHTML += `<li class="page-item ${
                i === currentPageImpuestos ? 'active' : ''
            }"><a class="page-link" href="#" onclick="cambiarPaginaImpuestos(${i})">${i}</a></li>`;
        }

        if (endPage < numeroTotalPaginas) {
            if (endPage < numeroTotalPaginas - 1) {
                paginacionHTML +=
                    '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
            paginacionHTML += `<li class="page-item"><a class="page-link" href="#" onclick="cambiarPaginaImpuestos(${numeroTotalPaginas})">${numeroTotalPaginas}</a></li>`;
        }

        paginacionContainer.innerHTML = paginacionHTML;
    }
}

// Función para cargar los impuestos
function cargarImpuestos() {
    fetch(urlGetImpuestos)
        .then((response) => response.json())
        .then((data) => {
            impuestos = data;
            mostrarImpuestos(impuestos, currentPageImpuestos, itemsPerPageImpuestos);
            actualizarControlesPaginacionImpuestos();
            generarNumerosDePaginaImpuestos();
        })
        .catch((error) => console.log(error));
}

// Función para cambiar la página actual
function cambiarPaginaImpuestos(page) {
    if (page > 0 && page <= Math.ceil(impuestos.length / itemsPerPageImpuestos)) {
        currentPageImpuestos = page;
        mostrarImpuestos(impuestos, currentPageImpuestos, itemsPerPageImpuestos);
        actualizarControlesPaginacionImpuestos();
        generarNumerosDePaginaImpuestos();
    }
}

// Función para editar un impuesto
function editarImpuesto(id) {
    fetch(`${urlGetImpuestos}/${id}`)
        .then((response) => response.json())
        .then((impuesto) => {
            document.getElementById('formImpuestoId').value = impuesto._id;
            document.getElementById('formImpuestoClave').value = impuesto.clave;
            document.getElementById('formImpuestoNombre').value = impuesto.nombre;
            document.getElementById('formImpuestoDescripcion').value = impuesto.descripcion;

            const modal = new bootstrap.Modal(document.getElementById('modalImpuesto'));
            modal.show();
        })
        .catch((error) => console.log(error));
}

// Función para eliminar un impuesto
function eliminarImpuesto(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás revertir esto',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`${urlDeleteImpuesto}/${id}`, {
                method: 'DELETE',
            })
                .then((response) => {
                    if (response.ok) {
                        Swal.fire(
                            'Eliminado!',
                            'El impuesto ha sido eliminado.',
                            'success'
                        );
                        cargarImpuestos(); // Recargar la lista después de eliminar
                    } else {
                        Swal.fire(
                            'Error!',
                            'No se pudo eliminar el impuesto.',
                            'error'
                        );
                    }
                })
                .catch((error) => console.log(error));
        }
    });
}

// Event Listener para guardar cambios
document.getElementById('btnSaveImpuesto').addEventListener('click', () => {
    const id = document.getElementById('formImpuestoId').value;
    const clave = document.getElementById('formImpuestoClave').value;
    const nombre = document.getElementById('formImpuestoNombre').value;
    const descripcion = document.getElementById('formImpuestoDescripcion').value;

    const metodo = id ? 'PUT' : 'POST';
    const url = id ? `${urlEditImpuesto}/${id}` : urlEditImpuesto;

    fetch(url, {
        method: metodo,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            clave,
            nombre,
            descripcion,
        }),
    })
        .then((response) => response.json())
        .then(() => {
            Swal.fire(
                'Guardado!',
                'El impuesto ha sido guardado.',
                'success'
            );
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalImpuesto'));
            modal.hide();
            cargarImpuestos(); // Recargar la lista después de guardar
        })
        .catch((error) => console.log(error));
});

// Event Listeners para botones de edición y eliminación
document.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('btnEditImpuesto')) {
        const id = e.target.getAttribute('data-id');
        editarImpuesto(id);
    }

    if (e.target && e.target.classList.contains('btnDeleteImpuesto')) {
        const id = e.target.getAttribute('data-id');
        eliminarImpuesto(id);
    }
});

// Cargar los impuestos al iniciar
cargarImpuestos();
