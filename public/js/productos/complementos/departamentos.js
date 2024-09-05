const urlGetDepartamentos = '/api/departamento'; // Cambia esto según tu endpoint para departamentos
const urlPostDepartamento = '/api/departamento';
const urlPutDepartamento = '/api/departamento/';
const urlDeleteDepartamento = '/api/departamento/'; // Define la URL base para eliminar marcas
// Obtener referencia al contenedor de departamentos
const contenedorDepartamentos = document.getElementById('departamentoData');
let currentPageDepartamentos = 1;
const itemsPerPageDepartamentos = 5; // Ajusta este número según tus necesidades
const maxPageLinksDepartamentos = 5;
let departamentos = [];

let editarDepartamentoId = ''

// Función para mostrar los departamentos
const mostrarDepartamentos = (departamentos, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    let resultadosDepartamentos = '';

    departamentos.slice(startIndex, endIndex).forEach((item) => {
        resultadosDepartamentos += `
            <tr>
                <td class="text-center">${item.clave}</td>
                <td class="text-center">${item.nombre}</td>
                <td class="text-center">${item.descripcion}</td>
                <td class="text-center">
                    <button id="${item._id}" type="button" class="btn btn-danger btn-rounded btnDeleteDepartamentos">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                    <button id="${item._id}" type="button" class="btn btn-secondary btn-rounded btnEditDepartamentos">
                        <i class="fa-solid fa-gear"></i>
                    </button>
                </td>
            </tr>`;
    });

    contenedorDepartamentos.innerHTML = resultadosDepartamentos;
};

// Función para actualizar los controles de paginación
function actualizarControlesPaginacionDepartamentos() {
    const botonAnterior = document.querySelector('#anteriorDepartamentos');
    const botonSiguiente = document.querySelector('#siguienteDepartamentos');

    if (botonAnterior && botonSiguiente) {
        botonAnterior.disabled = currentPageDepartamentos === 1;
        botonSiguiente.disabled =
            currentPageDepartamentos === Math.ceil(departamentos.length / itemsPerPageDepartamentos);
    }
}

// Función para generar los números de página
function generarNumerosDePaginaDepartamentos() {
    const paginacionContainer = document.getElementById('paginationDepartamentos');

    if (paginacionContainer) {
        const numeroTotalPaginas = Math.ceil(departamentos.length / itemsPerPageDepartamentos);

        let paginacionHTML = '';

        let startPage = Math.max(
            1,
            currentPageDepartamentos - Math.floor(maxPageLinksDepartamentos / 2),
        );
        let endPage = Math.min(
            numeroTotalPaginas,
            startPage + maxPageLinksDepartamentos - 1,
        );

        if (startPage > 1) {
            paginacionHTML +=
                '<li class="page-item"><a class="page-link" href="#" onclick="cambiarPaginaDepartamentos(1)">1</a></li>';
            if (startPage > 2) {
                paginacionHTML +=
                    '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginacionHTML += `<li class="page-item ${
                i === currentPageDepartamentos ? 'active' : ''
            }"><a class="page-link" href="#" onclick="cambiarPaginaDepartamentos(${i})">${i}</a></li>`;
        }

        if (endPage < numeroTotalPaginas) {
            if (endPage < numeroTotalPaginas - 1) {
                paginacionHTML +=
                    '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
            paginacionHTML += `<li class="page-item"><a class="page-link" href="#" onclick="cambiarPaginaDepartamentos(${numeroTotalPaginas})">${numeroTotalPaginas}</a></li>`;
        }

        paginacionContainer.innerHTML = paginacionHTML;
    }
}

// Función para cargar los departamentos
function cargarDepartamentos() {
    fetch(urlGetDepartamentos)
        .then((response) => response.json())
        .then((data) => {
            departamentos = data;
            mostrarDepartamentos(departamentos, currentPageDepartamentos, itemsPerPageDepartamentos);
            actualizarControlesPaginacionDepartamentos();
            generarNumerosDePaginaDepartamentos();
        })
        .catch((error) => console.log(error));
}

// Función para cambiar la página actual
function cambiarPaginaDepartamentos(page) {
    if (page > 0 && page <= Math.ceil(departamentos.length / itemsPerPageDepartamentos)) {
        currentPageDepartamentos = page;
        mostrarDepartamentos(departamentos, currentPageDepartamentos, itemsPerPageDepartamentos);
        actualizarControlesPaginacionDepartamentos();
        generarNumerosDePaginaDepartamentos();
    }
}

// Cargar los departamentos al iniciar
cargarDepartamentos();

document.getElementById('btnAddDepartamento').addEventListener('click', () => {
    const clave = document.getElementById('claveDepartamento').value.trim();
    const nombre = document.getElementById('nombreDepartamento').value.trim();
    const descripcion = document.getElementById('descripcionDepartamento').value.trim();

    if (validarCampos(clave, nombre, descripcion)) {
        if (opcion === 'crear') {
            fetch(urlPostDepartamento, {
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
                    'El departamento ha sido guardado.',
                    'success'
                );
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalDepartamento'));
                document.getElementById('claveDepartamento').value = '';
                document.getElementById('nombreDepartamento').value = '';
                document.getElementById('descripcionDepartamento').value = '';
                document.getElementById('btnAddDepartamento').textContent = 'Agregar';
                cargarDepartamentos(); // Actualizar lista de departamentos
                opcion = 'crear';
            })
            .catch((error) => console.log(error));
        } else {
            fetch(`${urlPutDepartamento}${editarDepartamentoId}`, {
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
                    'El departamento ha sido actualizado.',
                    'success'
                );
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalDepartamento'));
                document.getElementById('claveDepartamento').value = '';
                document.getElementById('nombreDepartamento').value = '';
                document.getElementById('descripcionDepartamento').value = '';
                document.getElementById('btnAddDepartamento').textContent = 'Agregar';
                cargarDepartamentos(); // Actualizar lista de departamentos
                opcion = 'crear';
            })
            .catch((error) => console.log(error));
        }
    }
});

// Resetear formulario y opción de agregar
document.getElementById('btnAgregarDepartamentoModal').addEventListener('click', () => {
    document.getElementById('claveDepartamento').value = '';
    document.getElementById('nombreDepartamento').value = '';
    document.getElementById('descripcionDepartamento').value = '';
    document.getElementById('btnAddDepartamento').textContent = 'Agregar';
    opcion = 'crear'; // Resetear la opción a crear
});

// Eliminar
document.addEventListener('click', function(e) {
    const button = e.target.closest('.btnDeleteDepartamentos');
    
    if (button) {
        const idDepartamento = button.id;

        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteDepartamento(idDepartamento);
            }
        });
    }
});

async function deleteDepartamento(id) {
    try {
        const response = await fetch(`${urlDeleteDepartamento}${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            Swal.fire({
                title: 'Eliminado',
                text: 'El departamento ha sido eliminado.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                cargarDepartamentos(); // Actualizar lista de departamentos después de la eliminación
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al eliminar el departamento.',
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
    const button = e.target.closest('.btnEditDepartamentos');
    
    if (button) {
        const idDepartamento = button.id;
        opcion = 'editar'; // Cambiar a editar
        editarDepartamentoId = idDepartamento;

        const row = button.closest('tr');
        const rowData = Array.from(row.querySelectorAll('td')).map(cell => cell.textContent.trim());

        // Asigna los valores a los inputs
        document.getElementById('claveDepartamento').value = rowData[0];
        document.getElementById('nombreDepartamento').value = rowData[1];
        document.getElementById('descripcionDepartamento').value = rowData[2];
        document.getElementById('btnAddDepartamento').textContent = 'Editar';

        // Revalida los inputs para que la animación de MDB se aplique correctamente
        document.getElementById('claveDepartamento').focus();
        document.getElementById('claveDepartamento').blur();
        
        document.getElementById('nombreDepartamento').focus();
        document.getElementById('nombreDepartamento').blur();
        
        document.getElementById('descripcionDepartamento').focus();
        document.getElementById('descripcionDepartamento').blur();
    }
});
