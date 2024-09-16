const urlGetZonasClientes = '/api/zonasClientes';

// Obtener referencia al contenedor de zonas de clientes
const contenedorZonasClientes = document.getElementById('zonaClienteData');
let currentPageZonasClientes = 1;
const itemsPerPageZonasClientes = 5; // Ajusta este número según tus necesidades
const maxPageLinksZonasClientes = 5;
let zonasClientes = [];

// Función para mostrar las zonas de clientes
const mostrarZonasClientes = (zonasClientes, currentPage, itemsPerPage) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  let resultadosZonasClientes = '';

  zonasClientes.slice(startIndex, endIndex).forEach((item) => {
    resultadosZonasClientes += `
      <tr>
        <td class="text-center">${item.clave}</td>
        <td class="text-center">${item.nombre}</td>
        <td class="text-center">${item.descripcion}</td>
        <td class="text-center">
          <button id="${item._id}" type="button" class="btn btn-danger btn-rounded btnDeleteZonasClientes">
            <i class="fa-solid fa-trash"></i>
          </button>
          <button id="${item._id}" type="button" class="btn btn-secondary btn-rounded btnEditZonasClientes">
            <i class="fa-solid fa-gear"></i>
          </button>
        </td>
      </tr>`;
  });

  contenedorZonasClientes.innerHTML = resultadosZonasClientes;
};

// Función para actualizar los controles de paginación
function actualizarControlesPaginacionZonasClientes() {
  const botonAnterior = document.querySelector('#anteriorZonasClientes');
  const botonSiguiente = document.querySelector('#siguienteZonasClientes');

  if (botonAnterior && botonSiguiente) {
    botonAnterior.disabled = currentPageZonasClientes === 1;
    botonSiguiente.disabled =
      currentPageZonasClientes === Math.ceil(zonasClientes.length / itemsPerPageZonasClientes);
  }
}

// Función para generar los números de página
function generarNumerosDePaginaZonasClientes() {
  const paginacionContainer = document.getElementById('paginationZonasClientes');

  if (paginacionContainer) {
    const numeroTotalPaginas = Math.ceil(zonasClientes.length / itemsPerPageZonasClientes);

    let paginacionHTML = '';

    let startPage = Math.max(
      1,
      currentPageZonasClientes - Math.floor(maxPageLinksZonasClientes / 2),
    );
    let endPage = Math.min(
      numeroTotalPaginas,
      startPage + maxPageLinksZonasClientes - 1,
    );

    if (startPage > 1) {
      paginacionHTML +=
        '<li class="page-item"><a class="page-link" href="#" onclick="cambiarPaginaZonasClientes(1)">1</a></li>';
      if (startPage > 2) {
        paginacionHTML +=
          '<li class="page-item disabled"><span class="page-link">...</span></li>';
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      paginacionHTML += `<li class="page-item ${
        i === currentPageZonasClientes ? 'active' : ''
      }"><a class="page-link" href="#" onclick="cambiarPaginaZonasClientes(${i})">${i}</a></li>`;
    }

    if (endPage < numeroTotalPaginas) {
      if (endPage < numeroTotalPaginas - 1) {
        paginacionHTML +=
          '<li class="page-item disabled"><span class="page-link">...</span></li>';
      }
      paginacionHTML += `<li class="page-item"><a class="page-link" href="#" onclick="cambiarPaginaZonasClientes(${numeroTotalPaginas})">${numeroTotalPaginas}</a></li>`;
    }

    paginacionContainer.innerHTML = paginacionHTML;
  }
}

// Función para cargar las zonas de clientes
function cargarZonasClientes() {
  fetch(urlGetZonasClientes)
    .then((response) => response.json())
    .then((data) => {
      zonasClientes = data;
      mostrarZonasClientes(zonasClientes, currentPageZonasClientes, itemsPerPageZonasClientes);
      actualizarControlesPaginacionZonasClientes();
      generarNumerosDePaginaZonasClientes();
    })
    .catch((error) => console.log(error));
}

// Función para cambiar la página actual
function cambiarPaginaZonasClientes(page) {
  if (page > 0 && page <= Math.ceil(zonasClientes.length / itemsPerPageZonasClientes)) {
    currentPageZonasClientes = page;
    mostrarZonasClientes(zonasClientes, currentPageZonasClientes, itemsPerPageZonasClientes);
    actualizarControlesPaginacionZonasClientes();
    generarNumerosDePaginaZonasClientes();
  }
}

// Cargar las zonas de clientes al iniciar
cargarZonasClientes();
