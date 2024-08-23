const urlGetGrupos = '/api/grupos';

// Obtener referencia al contenedor de grupos
const contenedorGrupos = document.getElementById('grupoData');
let currentPageGrupos = 1;
const itemsPerPageGrupos = 5; // Ajusta este número según tus necesidades
const maxPageLinksGrupos = 5;
let grupos = [];

// Función para mostrar los grupos
const mostrarGrupos = (grupos, currentPage, itemsPerPage) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  let resultadosGrupos = '';

  grupos.slice(startIndex, endIndex).forEach((item) => {
    resultadosGrupos += `
      <tr>
        <td class="text-center">${item.clave}</td>
        <td class="text-center">${item.nombre}</td>
        <td class="text-center">${item.descripcion}</td>
        <td class="text-center">
          <button id="${item._id}" type="button" class="btn btn-danger btn-rounded btnDeleteGrupos">
            <i class="fa-solid fa-trash"></i>
          </button>
          <button id="${item._id}" type="button" class="btn btn-secondary btn-rounded btnEditGrupos" data-bs-toggle="modal" data-bs-target="#modalGrupo">
            <i class="fa-solid fa-gear"></i>
          </button>
        </td>
      </tr>`;
  });

  contenedorGrupos.innerHTML = resultadosGrupos;
};

// Función para actualizar los controles de paginación
function actualizarControlesPaginacionGrupos() {
  const botonAnterior = document.querySelector('#anteriorGrupos');
  const botonSiguiente = document.querySelector('#siguienteGrupos');

  if (botonAnterior && botonSiguiente) {
    botonAnterior.disabled = currentPageGrupos === 1;
    botonSiguiente.disabled =
      currentPageGrupos === Math.ceil(grupos.length / itemsPerPageGrupos);
  }
}

// Función para generar los números de página
function generarNumerosDePaginaGrupos() {
  const paginacionContainer = document.getElementById('paginationGrupos');

  if (paginacionContainer) {
    const numeroTotalPaginas = Math.ceil(grupos.length / itemsPerPageGrupos);

    let paginacionHTML = '';

    let startPage = Math.max(
      1,
      currentPageGrupos - Math.floor(maxPageLinksGrupos / 2),
    );
    let endPage = Math.min(
      numeroTotalPaginas,
      startPage + maxPageLinksGrupos - 1,
    );

    if (startPage > 1) {
      paginacionHTML +=
        '<li class="page-item"><a class="page-link" href="#" onclick="cambiarPaginaGrupos(1)">1</a></li>';
      if (startPage > 2) {
        paginacionHTML +=
          '<li class="page-item disabled"><span class="page-link">...</span></li>';
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      paginacionHTML += `<li class="page-item ${
        i === currentPageGrupos ? 'active' : ''
      }"><a class="page-link" href="#" onclick="cambiarPaginaGrupos(${i})">${i}</a></li>`;
    }

    if (endPage < numeroTotalPaginas) {
      if (endPage < numeroTotalPaginas - 1) {
        paginacionHTML +=
          '<li class="page-item disabled"><span class="page-link">...</span></li>';
      }
      paginacionHTML += `<li class="page-item"><a class="page-link" href="#" onclick="cambiarPaginaGrupos(${numeroTotalPaginas})">${numeroTotalPaginas}</a></li>`;
    }

    paginacionContainer.innerHTML = paginacionHTML;
  }
}

// Función para cargar los grupos
function cargarGrupos() {
  fetch(urlGetGrupos)
    .then((response) => response.json())
    .then((data) => {
      grupos = data;
      mostrarGrupos(grupos, currentPageGrupos, itemsPerPageGrupos);
      actualizarControlesPaginacionGrupos();
      generarNumerosDePaginaGrupos();
    })
    .catch((error) => console.log(error));
}

// Función para cambiar la página actual
function cambiarPaginaGrupos(page) {
  if (page > 0 && page <= Math.ceil(grupos.length / itemsPerPageGrupos)) {
    currentPageGrupos = page;
    mostrarGrupos(grupos, currentPageGrupos, itemsPerPageGrupos);
    actualizarControlesPaginacionGrupos();
    generarNumerosDePaginaGrupos();
  }
}

// Cargar los grupos al iniciar
cargarGrupos();
