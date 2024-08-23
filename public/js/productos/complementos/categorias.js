const urlGetCategorias = '/api/categorias';

// Obtener referencia al contenedor de categorías
const contenedorCategorias = document.getElementById('categoriaData');
let currentPageCategorias = 1;
const itemsPerPageCategorias = 5; // Ajusta este número según tus necesidades
const maxPageLinksCategorias = 5;
let categorias = [];

// Función para mostrar las categorías
const mostrarCategorias = (categorias, currentPage, itemsPerPage) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  let resultadosCategorias = '';

  categorias.slice(startIndex, endIndex).forEach((item) => {
    resultadosCategorias += `
      <tr>
        <td class="text-center">${item.clave}</td>
        <td class="text-center">${item.nombre}</td>
        <td class="text-center">${item.descripcion}</td>
        <td class="text-center">
          <button id="${item._id}" type="button" class="btn btn-danger btn-rounded btnDeleteCategorias">
            <i class="fa-solid fa-trash"></i>
          </button>
          <button id="${item._id}" type="button" class="btn btn-secondary btn-rounded btnEditCategorias">
            <i class="fa-solid fa-gear"></i>
          </button>
        </td>
      </tr>`;
  });

  contenedorCategorias.innerHTML = resultadosCategorias;
};

// Función para actualizar los controles de paginación
function actualizarControlesPaginacionCategorias() {
  const botonAnterior = document.querySelector('#anteriorCategorias');
  const botonSiguiente = document.querySelector('#siguienteCategorias');

  if (botonAnterior && botonSiguiente) {
    botonAnterior.disabled = currentPageCategorias === 1;
    botonSiguiente.disabled =
      currentPageCategorias === Math.ceil(categorias.length / itemsPerPageCategorias);
  }
}

// Función para generar los números de página
function generarNumerosDePaginaCategorias() {
  const paginacionContainer = document.getElementById('paginationCategorias');

  if (paginacionContainer) {
    const numeroTotalPaginas = Math.ceil(categorias.length / itemsPerPageCategorias);

    let paginacionHTML = '';

    let startPage = Math.max(
      1,
      currentPageCategorias - Math.floor(maxPageLinksCategorias / 2),
    );
    let endPage = Math.min(
      numeroTotalPaginas,
      startPage + maxPageLinksCategorias - 1,
    );

    if (startPage > 1) {
      paginacionHTML +=
        '<li class="page-item"><a class="page-link" href="#" onclick="cambiarPaginaCategorias(1)">1</a></li>';
      if (startPage > 2) {
        paginacionHTML +=
          '<li class="page-item disabled"><span class="page-link">...</span></li>';
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      paginacionHTML += `<li class="page-item ${
        i === currentPageCategorias ? 'active' : ''
      }"><a class="page-link" href="#" onclick="cambiarPaginaCategorias(${i})">${i}</a></li>`;
    }

    if (endPage < numeroTotalPaginas) {
      if (endPage < numeroTotalPaginas - 1) {
        paginacionHTML +=
          '<li class="page-item disabled"><span class="page-link">...</span></li>';
      }
      paginacionHTML += `<li class="page-item"><a class="page-link" href="#" onclick="cambiarPaginaCategorias(${numeroTotalPaginas})">${numeroTotalPaginas}</a></li>`;
    }

    paginacionContainer.innerHTML = paginacionHTML;
  }
}

// Función para cargar las categorías
function cargarCategorias() {
  fetch(urlGetCategorias)
    .then((response) => response.json())
    .then((data) => {
      categorias = data;
      console.log(categorias)
      mostrarCategorias(categorias, currentPageCategorias, itemsPerPageCategorias);
      actualizarControlesPaginacionCategorias();
      generarNumerosDePaginaCategorias();
    })
    .catch((error) => console.log(error));
}

// Función para cambiar la página actual
function cambiarPaginaCategorias(page) {
  if (page > 0 && page <= Math.ceil(categorias.length / itemsPerPageCategorias)) {
    currentPageCategorias = page;
    mostrarCategorias(categorias, currentPageCategorias, itemsPerPageCategorias);
    actualizarControlesPaginacionCategorias();
    generarNumerosDePaginaCategorias();
  }
}

// Cargar las categorías al iniciar
cargarCategorias();
