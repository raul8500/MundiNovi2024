const urlGetTipoProductos = '/api/tipoProducto';

// Obtener referencia al contenedor de tipos de productos
const contenedorTipoProductos = document.getElementById('tipoProductoData');
let currentPageTipoProductos = 1;
const itemsPerPageTipoProductos = 5; // Ajusta este número según tus necesidades
const maxPageLinksTipoProductos = 5;
let tipoProductos = [];

// Función para mostrar los tipos de productos
const mostrarTipoProductos = (tipoProductos, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    let resultadosTipoProductos = '';

    tipoProductos.slice(startIndex, endIndex).forEach((item) => {
        resultadosTipoProductos += `
            <tr>
                <td class="text-center">${item.clave}</td>
                <td class="text-center">${item.nombre}</td>
                <td class="text-center">${item.descripcion}</td>
                <td class="text-center">
                    <button id="${item._id}" type="button" class="btn btn-danger btn-rounded btnDeleteTipoProductos">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                    <button id="${item._id}" type="button" class="btn btn-secondary btn-rounded btnEditTipoProductos">
                        <i class="fa-solid fa-gear"></i>
                    </button>
                </td>
            </tr>`;
    });

    contenedorTipoProductos.innerHTML = resultadosTipoProductos;
};

// Función para actualizar los controles de paginación
function actualizarControlesPaginacionTipoProductos() {
    const botonAnterior = document.querySelector('#anteriorTipoProductos');
    const botonSiguiente = document.querySelector('#siguienteTipoProductos');

    if (botonAnterior && botonSiguiente) {
        botonAnterior.disabled = currentPageTipoProductos === 1;
        botonSiguiente.disabled =
            currentPageTipoProductos === Math.ceil(tipoProductos.length / itemsPerPageTipoProductos);
    }
}

// Función para generar los números de página
function generarNumerosDePaginaTipoProductos() {
    const paginacionContainer = document.getElementById('paginationTipoProductos');

    if (paginacionContainer) {
        const numeroTotalPaginas = Math.ceil(tipoProductos.length / itemsPerPageTipoProductos);

        let paginacionHTML = '';

        let startPage = Math.max(
            1,
            currentPageTipoProductos - Math.floor(maxPageLinksTipoProductos / 2),
        );
        let endPage = Math.min(
            numeroTotalPaginas,
            startPage + maxPageLinksTipoProductos - 1,
        );

        if (startPage > 1) {
            paginacionHTML +=
                '<li class="page-item"><a class="page-link" href="#" onclick="cambiarPaginaTipoProductos(1)">1</a></li>';
            if (startPage > 2) {
                paginacionHTML +=
                    '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginacionHTML += `<li class="page-item ${
                i === currentPageTipoProductos ? 'active' : ''
            }"><a class="page-link" href="#" onclick="cambiarPaginaTipoProductos(${i})">${i}</a></li>`;
        }

        if (endPage < numeroTotalPaginas) {
            if (endPage < numeroTotalPaginas - 1) {
                paginacionHTML +=
                    '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
            paginacionHTML += `<li class="page-item"><a class="page-link" href="#" onclick="cambiarPaginaTipoProductos(${numeroTotalPaginas})">${numeroTotalPaginas}</a></li>`;
        }

        paginacionContainer.innerHTML = paginacionHTML;
    }
}

// Función para cargar los tipos de productos
function cargarTipoProductos() {
    fetch(urlGetTipoProductos)
        .then((response) => response.json())
        .then((data) => {
            tipoProductos = data;
            mostrarTipoProductos(tipoProductos, currentPageTipoProductos, itemsPerPageTipoProductos);
            actualizarControlesPaginacionTipoProductos();
            generarNumerosDePaginaTipoProductos();
        })
        .catch((error) => console.log(error));
}

// Función para cambiar la página actual
function cambiarPaginaTipoProductos(page) {
    if (page > 0 && page <= Math.ceil(tipoProductos.length / itemsPerPageTipoProductos)) {
        currentPageTipoProductos = page;
        mostrarTipoProductos(tipoProductos, currentPageTipoProductos, itemsPerPageTipoProductos);
        actualizarControlesPaginacionTipoProductos();
        generarNumerosDePaginaTipoProductos();
    }
}

// Cargar los tipos de productos al iniciar
cargarTipoProductos();
