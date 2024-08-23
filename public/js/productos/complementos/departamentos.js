const urlGetDepartamentos = '/api/departamento'; // Cambia esto según tu endpoint para departamentos

// Obtener referencia al contenedor de departamentos
const contenedorDepartamentos = document.getElementById('departamentoData');
let currentPageDepartamentos = 1;
const itemsPerPageDepartamentos = 5; // Ajusta este número según tus necesidades
const maxPageLinksDepartamentos = 5;
let departamentos = [];

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
