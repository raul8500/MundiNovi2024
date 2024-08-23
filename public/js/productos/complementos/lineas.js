const urlGetLineas = '/api/linea'; // Cambia esto según tu endpoint para líneas

// Obtener referencia al contenedor de líneas
const contenedorLineas = document.getElementById('lineaData');
let currentPageLineas = 1;
const itemsPerPageLineas = 5; // Ajusta este número según tus necesidades
const maxPageLinksLineas = 5;
let lineas = [];

// Función para mostrar las líneas
const mostrarLineas = (lineas, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    let resultadosLineas = '';

    lineas.slice(startIndex, endIndex).forEach((item) => {
        resultadosLineas += `
            <tr>
                <td class="text-center">${item.clave}</td>
                <td class="text-center">${item.nombre}</td>
                <td class="text-center">${item.descripcion}</td>
                <td class="text-center">
                    <button id="${item._id}" type="button" class="btn btn-danger btn-rounded btnDeleteLineas">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                    <button id="${item._id}" type="button" class="btn btn-secondary btn-rounded btnEditLineas">
                        <i class="fa-solid fa-gear"></i>
                    </button>
                </td>
            </tr>`;
    });

    contenedorLineas.innerHTML = resultadosLineas;
};

// Función para actualizar los controles de paginación
function actualizarControlesPaginacionLineas() {
    const botonAnterior = document.querySelector('#anteriorLineas');
    const botonSiguiente = document.querySelector('#siguienteLineas');

    if (botonAnterior && botonSiguiente) {
        botonAnterior.disabled = currentPageLineas === 1;
        botonSiguiente.disabled =
            currentPageLineas === Math.ceil(lineas.length / itemsPerPageLineas);
    }
}

// Función para generar los números de página
function generarNumerosDePaginaLineas() {
    const paginacionContainer = document.getElementById('paginationLineas');

    if (paginacionContainer) {
        const numeroTotalPaginas = Math.ceil(lineas.length / itemsPerPageLineas);

        let paginacionHTML = '';

        let startPage = Math.max(
            1,
            currentPageLineas - Math.floor(maxPageLinksLineas / 2),
        );
        let endPage = Math.min(
            numeroTotalPaginas,
            startPage + maxPageLinksLineas - 1,
        );

        if (startPage > 1) {
            paginacionHTML +=
                '<li class="page-item"><a class="page-link" href="#" onclick="cambiarPaginaLineas(1)">1</a></li>';
            if (startPage > 2) {
                paginacionHTML +=
                    '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginacionHTML += `<li class="page-item ${
                i === currentPageLineas ? 'active' : ''
            }"><a class="page-link" href="#" onclick="cambiarPaginaLineas(${i})">${i}</a></li>`;
        }

        if (endPage < numeroTotalPaginas) {
            if (endPage < numeroTotalPaginas - 1) {
                paginacionHTML +=
                    '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
            paginacionHTML += `<li class="page-item"><a class="page-link" href="#" onclick="cambiarPaginaLineas(${numeroTotalPaginas})">${numeroTotalPaginas}</a></li>`;
        }

        paginacionContainer.innerHTML = paginacionHTML;
    }
}

// Función para cargar las líneas
function cargarLineas() {
    fetch(urlGetLineas)
        .then((response) => response.json())
        .then((data) => {
            lineas = data;
            mostrarLineas(lineas, currentPageLineas, itemsPerPageLineas);
            actualizarControlesPaginacionLineas();
            generarNumerosDePaginaLineas();
        })
        .catch((error) => console.log(error));
}

// Función para cambiar la página actual
function cambiarPaginaLineas(page) {
    if (page > 0 && page <= Math.ceil(lineas.length / itemsPerPageLineas)) {
        currentPageLineas = page;
        mostrarLineas(lineas, currentPageLineas, itemsPerPageLineas);
        actualizarControlesPaginacionLineas();
        generarNumerosDePaginaLineas();
    }
}

// Cargar las líneas al iniciar
cargarLineas();
