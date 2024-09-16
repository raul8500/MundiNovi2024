const urlGetUnidades = '/api/unidad'; // Cambia esto según tu endpoint para unidades

// Obtener referencia al contenedor de unidades
const contenedorUnidades = document.getElementById('unidadData');
let currentPageUnidades = 1;
const itemsPerPageUnidades = 5; // Ajusta este número según tus necesidades
const maxPageLinksUnidades = 5;
let unidades = [];

// Función para mostrar las unidades
const mostrarUnidades = (unidades, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    let resultadosUnidades = '';

    unidades.slice(startIndex, endIndex).forEach((item) => {
        resultadosUnidades += `
            <tr>
                <td class="text-center">${item.clave}</td>
                <td class="text-center">${item.nombre}</td>
                <td class="text-center">${item.descripcion}</td>
                <td class="text-center">
                    <button id="${item._id}" type="button" class="btn btn-danger btn-rounded btnDeleteUnidades">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                    <button id="${item._id}" type="button" class="btn btn-secondary btn-rounded btnEditUnidades">
                        <i class="fa-solid fa-gear"></i>
                    </button>
                </td>
            </tr>`;
    });

    contenedorUnidades.innerHTML = resultadosUnidades;
};

// Función para actualizar los controles de paginación
function actualizarControlesPaginacionUnidades() {
    const botonAnterior = document.querySelector('#anteriorUnidades');
    const botonSiguiente = document.querySelector('#siguienteUnidades');

    if (botonAnterior && botonSiguiente) {
        botonAnterior.disabled = currentPageUnidades === 1;
        botonSiguiente.disabled =
            currentPageUnidades === Math.ceil(unidades.length / itemsPerPageUnidades);
    }
}

// Función para generar los números de página
function generarNumerosDePaginaUnidades() {
    const paginacionContainer = document.getElementById('paginationUnidades');

    if (paginacionContainer) {
        const numeroTotalPaginas = Math.ceil(unidades.length / itemsPerPageUnidades);

        let paginacionHTML = '';

        let startPage = Math.max(
            1,
            currentPageUnidades - Math.floor(maxPageLinksUnidades / 2),
        );
        let endPage = Math.min(
            numeroTotalPaginas,
            startPage + maxPageLinksUnidades - 1,
        );

        if (startPage > 1) {
            paginacionHTML +=
                '<li class="page-item"><a class="page-link" href="#" onclick="cambiarPaginaUnidades(1)">1</a></li>';
            if (startPage > 2) {
                paginacionHTML +=
                    '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginacionHTML += `<li class="page-item ${
                i === currentPageUnidades ? 'active' : ''
            }"><a class="page-link" href="#" onclick="cambiarPaginaUnidades(${i})">${i}</a></li>`;
        }

        if (endPage < numeroTotalPaginas) {
            if (endPage < numeroTotalPaginas - 1) {
                paginacionHTML +=
                    '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
            paginacionHTML += `<li class="page-item"><a class="page-link" href="#" onclick="cambiarPaginaUnidades(${numeroTotalPaginas})">${numeroTotalPaginas}</a></li>`;
        }

        paginacionContainer.innerHTML = paginacionHTML;
    }
}

// Función para cargar las unidades
function cargarUnidades() {
    fetch(urlGetUnidades)
        .then((response) => response.json())
        .then((data) => {
            unidades = data;
            mostrarUnidades(unidades, currentPageUnidades, itemsPerPageUnidades);
            actualizarControlesPaginacionUnidades();
            generarNumerosDePaginaUnidades();
        })
        .catch((error) => console.log(error));
}

// Función para cambiar la página actual
function cambiarPaginaUnidades(page) {
    if (page > 0 && page <= Math.ceil(unidades.length / itemsPerPageUnidades)) {
        currentPageUnidades = page;
        mostrarUnidades(unidades, currentPageUnidades, itemsPerPageUnidades);
        actualizarControlesPaginacionUnidades();
        generarNumerosDePaginaUnidades();
    }
}

// Cargar las unidades al iniciar
cargarUnidades();
