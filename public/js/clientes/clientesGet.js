const urlGetClientes = '/api/clientes';

// Obtener elementos del DOM
const contenedorClientes = document.getElementById('clientesData');
const loadingSpinner = document.getElementById('loadingSpinner');

let currentPageClientes = 1;
const itemsPerPageClientes = 30;
const maxPageLinksClientes = 5;
let clientes = [];
let clientesFiltrados = [];

const mostrarClientes = (clientes, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    let resultadosClientes = '';
  
    clientes.slice(startIndex, endIndex).forEach((item) => {
      const identificacionBadge = item.esfactura
      ? '<span class="badge badge-success rounded-pill d-inline">Sí</span>'
      : '<span class="badge badge-danger rounded-pill d-inline">No</span>';
    
  
      resultadosClientes += `
              <tr>
                  <td class="text-center">${item.clientData.id ?? ''}</td>
                  <td class="text-center">${item.clientData.name ?? ''}</td>
                  <td class="text-center">${item.clientData.identification ?? ''}</td>
                  <td class="text-center">${item.clientData.email ?? ''}</td>
                  <td class="text-center">${item.clientData.phonePrimary ? item.clientData.phonePrimary : ''}</td>
                  <td class="text-center">${identificacionBadge}</td>
                  <td class="text-center">$ ${item.monedero}</td>
                  <td class="text-center">${formatearFecha(item.updatedAt)}</td>
                  <td class="text-center">
                  
                      <button id="${
                        item.clientData.id
                      }" type="button" class="btn btn-primary btn-rounded btnEditClientes">
                          <i class="fa-solid fa-pen-to-square"></i>
                      </button>
  
                      <button id="${
                        item.clientData.id
                      }" type="button" class="btn btn-danger btn-rounded btnDeleteClientes">
                          <i class="fa-solid fa-trash"></i>
                      </button>
  
                  </td>
              </tr>`;
    });
  
    contenedorClientes.innerHTML = resultadosClientes;
  };
  

function actualizarControlesPaginacionClientes() {
  const botonAnterior = document.querySelector('#anteriorClientes');
  const botonSiguiente = document.querySelector('#siguienteClientes');

  if (botonAnterior && botonSiguiente) {
    botonAnterior.disabled = currentPageClientes === 1;
    botonSiguiente.disabled =
      currentPageClientes === Math.ceil(clientes.length / itemsPerPageClientes);
  }
}

function generarNumerosDePaginaClientes() {
  const paginacionContainer = document.getElementById('paginationClientes');

  if (paginacionContainer) {
    const numeroTotalPaginas = Math.ceil(
      clientes.length / itemsPerPageClientes,
    );

    let paginacionHTML = '';

    let startPage = Math.max(
      1,
      currentPageClientes - Math.floor(maxPageLinksClientes / 2),
    );
    let endPage = Math.min(
      numeroTotalPaginas,
      startPage + maxPageLinksClientes - 1,
    );

    if (startPage > 1) {
      paginacionHTML +=
        '<li class="page-item"><a class="page-link" href="#" onclick="cambiarPaginaClientes(1)">1</a></li>';
      if (startPage > 2) {
        paginacionHTML +=
          '<li class="page-item disabled"><span class="page-link">...</span></li>';
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      paginacionHTML += `<li class="page-item ${
        i === currentPageClientes ? 'active' : ''
      }"><a class="page-link" href="#" onclick="cambiarPaginaClientes(${i})">${i}</a></li>`;
    }

    if (endPage < numeroTotalPaginas) {
      if (endPage < numeroTotalPaginas - 1) {
        paginacionHTML +=
          '<li class="page-item disabled"><span class="page-link">...</span></li>';
      }
      paginacionHTML += `<li class="page-item"><a class="page-link" href="#" onclick="cambiarPaginaClientes(${numeroTotalPaginas})">${numeroTotalPaginas}</a></li>`;
    }

    paginacionContainer.innerHTML = paginacionHTML;
  }
}

function cargarClientes() {
  // Mostrar el spinner
  loadingSpinner.style.display = 'block';

  fetch(urlGetClientes)
    .then((response) => response.json())
    .then((data) => {
      clientes = data;
      mostrarClientes(clientes, currentPageClientes, itemsPerPageClientes);
      actualizarControlesPaginacionClientes();
      generarNumerosDePaginaClientes();

      // Ocultar el spinner después de cargar
      loadingSpinner.style.display = 'none';
    })
    .catch((error) => {
      console.log(error);
      loadingSpinner.style.display = 'none'; // Ocultar también en caso de error
    });
}

function cambiarPaginaClientes(page) {
  if (page > 0 && page <= Math.ceil(clientes.length / itemsPerPageClientes)) {
    currentPageClientes = page;
    mostrarClientes(clientes, currentPageClientes, itemsPerPageClientes);
    actualizarControlesPaginacionClientes();
    generarNumerosDePaginaClientes();
  }
}
// Búsqueda rápida por nombre
document.getElementById('busquedaClientesMain').addEventListener('input', function () {
    const searchText = this.value.toLowerCase();
    clientesFiltrados = clientes.filter((cliente) =>
      cliente.clientData.name && cliente.clientData.name.toLowerCase().includes(searchText)
    );
    currentPageClientes = 1; // Reinicia a la primera página
    mostrarClientes(clientesFiltrados, currentPageClientes, itemsPerPageClientes);
    actualizarControlesPaginacionClientes();
    generarNumerosDePaginaClientes();
});

function formatearFecha(fecha) {
    const fechaObj = new Date(fecha);
    const dia = String(fechaObj.getDate()).padStart(2, '0');
    const mes = String(fechaObj.getMonth() + 1).padStart(2, '0'); // Los meses son indexados desde 0
    const anio = fechaObj.getFullYear();
  
    return `${dia}/${mes}/${anio}`;
  }

cargarClientes();
