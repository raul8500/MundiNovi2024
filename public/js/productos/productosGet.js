const urlGetProductos = base + '/api/productos';

//get usuarios
const contenedorProductos = document.getElementById('productosData');
let currentPageProductos = 1;
const itemsPerPageProductos = 2; // Puedes ajustar este número según tus necesidades
const maxPageLinksProductos = 5;
let productos = [];
let productosFiltrados = []; // Nueva variable para almacenar productos filtrados


const mostrarProductos = (productos, currentPage, itemsPerPage) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  let resultadosProductos = '';

  productos.slice(startIndex, endIndex).forEach((item) => {
    resultadosProductos += `
            <tr>
                <td class="text-center">${item.clave}</td>
                <td class="text-center">${item.estado ? '<span class="badge badge-success rounded-pill d-inline">Activado</span>' : '<span class="badge badge-danger rounded-pill d-inline">Desactivado</span>'}</td>
                <td class="text-center">${item.codigoBarras}</td>
                <td class="text-center">${item.claveAlterna}</td>
                <td class="text-center">${item.nombre}</td>
                <td class="text-center">${item.datosFinancieros.costo}</td>
                <td class="text-center">${item.datosFinancieros.precio1}</td>
                <td class="text-center">${'-'}</td>
                <td class="text-center">
                
                    <button id="${
                      item._id
                    }" type="button" class="btn btn-primary btn-rounded btnEditUsers">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>

                    <button id="${
                      item._id
                    }" type="button" class="btn btn-secondary btn-rounded btnChangePassword">
                        <i class="fa-solid fa-key"></i>
                    </button>

                    <button id="${item._id}" 
                            type="button" 
                            class="btn ${item.status === 1 ? 'btn-success' : 'btn-danger'} btn-rounded btnChangeStatus"
                            data-status="${item.status}">
                      <i class="fa-regular fa-circle"></i>
                    </button>

                    <button id="${
                      item._id
                    }" type="button" class="btn btn-danger btn-rounded btnDeleteUsers">
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </td>
            </tr>`;
  });

  contenedorProductos.innerHTML = resultadosProductos;
};

function actualizarControlesPaginacionProductos() {
  const botonAnterior = document.querySelector('#anteriorProductos');
  const botonSiguiente = document.querySelector('#siguienteProductos');

  if (botonAnterior && botonSiguiente) {
    botonAnterior.disabled = currentPageProductos === 1;
    botonSiguiente.disabled =
      currentPageProductos === Math.ceil(productos.length / itemsPerPageProductos);
  }
}

function generarNumerosDePaginaProductos() {
  const paginacionContainer = document.getElementById('paginationProductos');

  if (paginacionContainer) {
    const numeroTotalPaginas = Math.ceil(
      productos.length / itemsPerPageProductos,
    );

    let paginacionHTML = '';

    let startPage = Math.max(
      1,
      currentPageProductos - Math.floor(maxPageLinksProductos / 2),
    );
    let endPage = Math.min(
      numeroTotalPaginas,
      startPage + maxPageLinksProductos - 1,
    );

    if (startPage > 1) {
      paginacionHTML +=
        '<li class="page-item"><a class="page-link" href="#" onclick="cambiarPaginaProductos(1)">1</a></li>';
      if (startPage > 2) {
        paginacionHTML +=
          '<li class="page-item disabled"><span class="page-link">...</span></li>';
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      paginacionHTML += `<li class="page-item ${
        i === currentPageProductos ? 'active' : ''
      }"><a class="page-link" href="#" onclick="cambiarPaginaProductos(${i})">${i}</a></li>`;
    }

    if (endPage < numeroTotalPaginas) {
      if (endPage < numeroTotalPaginas - 1) {
        paginacionHTML +=
          '<li class="page-item disabled"><span class="page-link">...</span></li>';
      }
      paginacionHTML += `<li class="page-item"><a class="page-link" href="#" onclick="cambiarPaginaProductos(${numeroTotalPaginas})">${numeroTotalPaginas}</a></li>`;
    }

    paginacionContainer.innerHTML = paginacionHTML;
  }
}

function cargarProductos() {
  fetch(urlGetProductos)
    .then((response) => response.json())
    .then((data) => {
      productos = data;
      mostrarProductos(productos, currentPageProductos, itemsPerPageProductos);
      actualizarControlesPaginacionProductos();
      generarNumerosDePaginaProductos();
    })
    .catch((error) => console.log(error));
}

function cambiarPaginaProductos(page) {
  if (page > 0 && page <= Math.ceil(productos.length / itemsPerPageProductos)) {
    currentPageProductos = page;
    mostrarProductos(productos, currentPageProductos, itemsPerPageProductos);
    actualizarControlesPaginacionProductos();
    generarNumerosDePaginaProductos();
  }
}

// Nueva funcionalidad para búsqueda rápida
document.getElementById('busquedaProductosMain').addEventListener('input', function () {
    const searchText = this.value.toLowerCase();
    productosFiltrados = productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(searchText) ||
      producto.codigoBarras.includes(searchText) ||
      producto.clave.toLowerCase().includes(searchText) // Incluye búsqueda por clave
    );
    currentPageProductos = 1; // Reinicia a la primera página
    mostrarProductos(productosFiltrados, currentPageProductos, itemsPerPageProductos);
    actualizarControlesPaginacionProductos();
    generarNumerosDePaginaProductos();
  });

cargarProductos();