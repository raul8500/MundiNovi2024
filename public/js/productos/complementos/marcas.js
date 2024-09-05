const urlGetMarcas = '/api/marca'; // Cambia esto según tu endpoint para marcas
const urlPostMarca = '/api/marca';
const urlPutMarca = '/api/marca/';
const urlDeleteMarca = '/api/marca/'; // Define la URL base para eliminar marcas

// Obtener referencia al contenedor de marcas
const contenedorMarcas = document.getElementById('marcaData');
let currentPageMarcas = 1;
const itemsPerPageMarcas = 5; // Ajusta este número según tus necesidades
const maxPageLinksMarcas = 5;
let marcas = [];
let editarMarcaId = ''; // ID de la marca a editar

// Función para mostrar las marcas
const mostrarMarcas = (marcas, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    let resultadosMarcas = '';

    marcas.slice(startIndex, endIndex).forEach((item) => {
        resultadosMarcas += `
            <tr>
                <td class="text-center">${item.clave}</td>
                <td class="text-center">${item.nombre}</td>
                <td class="text-center">${item.descripcion}</td>
                <td class="text-center">
                    <button id="${item._id}" type="button" class="btn btn-danger btn-rounded btnDeleteMarcas">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                    <button id="${item._id}" type="button" class="btn btn-secondary btn-rounded btnEditMarcas">
                        <i class="fa-solid fa-gear"></i>
                    </button>
                </td>
            </tr>`;
    });

    contenedorMarcas.innerHTML = resultadosMarcas;
};

// Función para actualizar los controles de paginación
function actualizarControlesPaginacionMarcas() {
    const botonAnterior = document.querySelector('#anteriorMarcas');
    const botonSiguiente = document.querySelector('#siguienteMarcas');

    if (botonAnterior && botonSiguiente) {
        botonAnterior.disabled = currentPageMarcas === 1;
        botonSiguiente.disabled =
            currentPageMarcas === Math.ceil(marcas.length / itemsPerPageMarcas);
    }
}

// Función para generar los números de página
function generarNumerosDePaginaMarcas() {
    const paginacionContainer = document.getElementById('paginationMarcas');

    if (paginacionContainer) {
        const numeroTotalPaginas = Math.ceil(marcas.length / itemsPerPageMarcas);

        let paginacionHTML = '';

        let startPage = Math.max(
            1,
            currentPageMarcas - Math.floor(maxPageLinksMarcas / 2),
        );
        let endPage = Math.min(
            numeroTotalPaginas,
            startPage + maxPageLinksMarcas - 1,
        );

        if (startPage > 1) {
            paginacionHTML +=
                '<li class="page-item"><a class="page-link" href="#" onclick="cambiarPaginaMarcas(1)">1</a></li>';
            if (startPage > 2) {
                paginacionHTML +=
                    '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginacionHTML += `<li class="page-item ${
                i === currentPageMarcas ? 'active' : ''
            }"><a class="page-link" href="#" onclick="cambiarPaginaMarcas(${i})">${i}</a></li>`;
        }

        if (endPage < numeroTotalPaginas) {
            if (endPage < numeroTotalPaginas - 1) {
                paginacionHTML +=
                    '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
            paginacionHTML += `<li class="page-item"><a class="page-link" href="#" onclick="cambiarPaginaMarcas(${numeroTotalPaginas})">${numeroTotalPaginas}</a></li>`;
        }

        paginacionContainer.innerHTML = paginacionHTML;
    }
}

// Función para cargar las marcas
function cargarMarcas() {
    fetch(urlGetMarcas)
        .then((response) => response.json())
        .then((data) => {
            marcas = data;
            mostrarMarcas(marcas, currentPageMarcas, itemsPerPageMarcas);
            actualizarControlesPaginacionMarcas();
            generarNumerosDePaginaMarcas();
        })
        .catch((error) => console.log(error));
}

// Función para cambiar la página actual
function cambiarPaginaMarcas(page) {
    if (page > 0 && page <= Math.ceil(marcas.length / itemsPerPageMarcas)) {
        currentPageMarcas = page;
        mostrarMarcas(marcas, currentPageMarcas, itemsPerPageMarcas);
        actualizarControlesPaginacionMarcas();
        generarNumerosDePaginaMarcas();
    }
}

// Cargar las marcas al iniciar
cargarMarcas();

// Crear/Editar
document.getElementById('btnAddMarca').addEventListener('click', () => {
    const clave = document.getElementById('claveMarca').value.trim();
    const nombre = document.getElementById('nombreMarca').value.trim();
    const descripcion = document.getElementById('descripcionMarca').value.trim();

    if (validarCampos(clave, nombre, descripcion)) {
        if (opcion === 'crear') {
            fetch(urlPostMarca, {
                method: 'POST',
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
                    'La marca ha sido guardada.',
                    'success'
                );
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalMarca'));
                document.getElementById('claveMarca').value = '';
                document.getElementById('nombreMarca').value = '';
                document.getElementById('descripcionMarca').value = '';
                document.getElementById('btnAddMarca').textContent = 'Agregar';
                cargarMarcas();
                opcion = 'crear';
            })
            .catch((error) => console.log(error));
        } else {
            fetch(`${urlPutMarca}${editarMarcaId}`, {
                method: 'PUT',
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
                    'La marca ha sido actualizada.',
                    'success'
                );
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalMarca'));
                document.getElementById('claveMarca').value = '';
                document.getElementById('nombreMarca').value = '';
                document.getElementById('descripcionMarca').value = '';
                document.getElementById('btnAddMarca').textContent = 'Agregar';
                cargarMarcas();
                opcion = 'crear';
            })
            .catch((error) => console.log(error));
        }
    }
});

// Resetear formulario y opción de agregar
document.getElementById('btnAgregarMarcaModal').addEventListener('click', () => {
    document.getElementById('claveMarca').value = '';
    document.getElementById('nombreMarca').value = '';
    document.getElementById('descripcionMarca').value = '';
    document.getElementById('btnAddMarca').textContent = 'Agregar';
    opcion = 'crear'; // Resetear la opción a crear
});

// Eliminar
document.addEventListener('click', function(e) {
    const button = e.target.closest('.btnDeleteMarcas');
    
    if (button) {
        const idMarca = button.id;

        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteMarca(idMarca);
            }
        });
    }
});

async function deleteMarca(id) {
    try {
        const response = await fetch(`${urlDeleteMarca}${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            Swal.fire({
                title: 'Eliminado',
                text: 'La marca ha sido eliminada.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                cargarMarcas(); // Actualizar lista de marcas después de la eliminación
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al eliminar la marca.',
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
}

// Editar
document.addEventListener('click', function(e) {
    const button = e.target.closest('.btnEditMarcas');
    
    if (button) {
        const idMarca = button.id;
        opcion = 'editar'; // Cambiar a editar
        editarMarcaId = idMarca;

        const row = button.closest('tr');
        const rowData = Array.from(row.querySelectorAll('td')).map(cell => cell.textContent.trim());

        // Asigna los valores a los inputs
        document.getElementById('claveMarca').value = rowData[0];
        document.getElementById('nombreMarca').value = rowData[1];
        document.getElementById('descripcionMarca').value = rowData[2];
        document.getElementById('btnAddMarca').textContent = 'Editar';

        // Revalida los inputs para que la animación de MDB se aplique correctamente
        document.getElementById('claveMarca').focus();
        document.getElementById('claveMarca').blur();
        
        document.getElementById('nombreMarca').focus();
        document.getElementById('nombreMarca').blur();
        
        document.getElementById('descripcionMarca').focus();
        document.getElementById('descripcionMarca').blur();
    }
});