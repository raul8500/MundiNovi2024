const urlGetMarcas = '/api/marca';

// Obtener referencia al contenedor de marcas
const contenedorMarcas = document.getElementById('marcaData');
let currentPageMarcas = 1;
const itemsPerPageMarcas = 5; // Ajusta este número según tus necesidades
const maxPageLinksMarcas = 5;
let marcas = [];

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
