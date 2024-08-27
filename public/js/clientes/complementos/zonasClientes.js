const urlGetZonaClientes = '/api/zonasClientes'; // URL para obtener las zonas de clientes
const urlDeleteZonaClientes = '/api/zonasClientes'; // URL para eliminar una zona de clientes
const urlEditZonaClientes = '/api/zonasClientes'; // URL para editar una zona de clientes

// Obtener referencia al contenedor de zonas de clientes
const contenedorZonaClientes = document.getElementById('zonaClienteData');
let currentPageZonaClientes = 1;
const itemsPerPageZonaClientes = 5;
const maxPageLinksZonaClientes = 5;
let zonaClientes = [];

// Función para mostrar las zonas de clientes
const mostrarZonaClientes = (zonaClientes, currentPage, itemsPerPage) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  let resultadosZonaClientes = '';

  zonaClientes.slice(startIndex, endIndex).forEach((item) => {
    resultadosZonaClientes += `
      <tr>
        <td class="text-center">${item.clave}</td>
        <td class="text-center">${item.nombre}</td>
        <td class="text-center">${item.descripcion}</td>
        <td class="text-center">
          <button id="${item._id}" type="button" class="btn btn-danger btn-rounded btnDeleteZonaClientes">
            <i class="fa-solid fa-trash"></i>
          </button>
          <button id="${item._id}" type="button" class="btn btn-secondary btn-rounded btnEditZonaClientes">
            <i class="fa-solid fa-gear"></i>
          </button>
        </td>
      </tr>`;
  });

  contenedorZonaClientes.innerHTML = resultadosZonaClientes;

  // Añadir manejadores de eventos para botones de eliminar y editar
  document.querySelectorAll('.btnDeleteZonaClientes').forEach(button => {
    button.addEventListener('click', (event) => eliminarZonaCliente(event.target.id));
  });

  document.querySelectorAll('.btnEditZonaClientes').forEach(button => {
    button.addEventListener('click', (event) => editarZonaCliente(event.target.id));
  });
};

// Función para eliminar una zona de cliente
const eliminarZonaCliente = (id) => {
  fetch(`${urlDeleteZonaClientes}/${id}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (response.ok) {
        alert('Zona de cliente eliminada exitosamente');
        cargarZonaClientes(); // Recargar la lista después de eliminar
      } else {
        alert('Error al eliminar la zona de cliente');
      }
    })
    .catch(error => console.log('Error:', error));
};

// Función para editar una zona de cliente
const editarZonaCliente = (id) => {
  // Aquí debes mostrar un formulario o modal con los datos de la zona de cliente a editar
  // Puedes cargar los datos de la zona de cliente con otro fetch usando el ID
  fetch(`${urlEditZonaClientes}/${id}`)
    .then(response => response.json())
    .then(data => {
      // Aquí podrías usar un modal o un formulario para editar los datos
      console.log('Datos de la zona a editar:', data);
      // Actualiza los campos del formulario/modal con los datos recibidos
    })
    .catch(error => console.log('Error:', error));
};

// Función para actualizar los controles de paginación
function actualizarControlesPaginacionZonaClientes() {
  const botonAnterior = document.querySelector('#anteriorZonaClientes');
  const botonSiguiente = document.querySelector('#siguienteZonaClientes');

  if (botonAnterior && botonSiguiente) {
    botonAnterior.disabled = currentPageZonaClientes === 1;
    botonSiguiente.disabled =
      currentPageZonaClientes === Math.ceil(zonaClientes.length / itemsPerPageZonaClientes);
  }
}

// Función para generar los números de página
function generarNumerosDePaginaZonaClientes() {
  const paginacionContainer = document.getElementById('paginationZonaClientes');

  if (paginacionContainer) {
    const numeroTotalPaginas = Math.ceil(zonaClientes.length / itemsPerPageZonaClientes);

    let paginacionHTML = '';

    let startPage = Math.max(
      1,
      currentPageZonaClientes - Math.floor(maxPageLinksZonaClientes / 2),
    );
    let endPage = Math.min(
      numeroTotalPaginas,
      startPage + maxPageLinksZonaClientes - 1,
    );

    if (startPage > 1) {
      paginacionHTML +=
        '<li class="page-item"><a class="page-link" href="#" onclick="cambiarPaginaZonaClientes(1)">1</a></li>';
      if (startPage > 2) {
        paginacionHTML +=
          '<li class="page-item disabled"><span class="page-link">...</span></li>';
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      paginacionHTML += `<li class="page-item ${
        i === currentPageZonaClientes ? 'active' : ''
      }"><a class="page-link" href="#" onclick="cambiarPaginaZonaClientes(${i})">${i}</a></li>`;
    }

    if (endPage < numeroTotalPaginas) {
      if (endPage < numeroTotalPaginas - 1) {
        paginacionHTML +=
          '<li class="page-item disabled"><span class="page-link">...</span></li>';
      }
      paginacionHTML += `<li class="page-item"><a class="page-link" href="#" onclick="cambiarPaginaZonaClientes(${numeroTotalPaginas})">${numeroTotalPaginas}</a></li>`;
    }

    paginacionContainer.innerHTML = paginacionHTML;
  }
}

// Función para cargar las zonas de clientes
function cargarZonaClientes() {
  fetch(urlGetZonaClientes)
    .then((response) => response.json())
    .then((data) => {
      zonaClientes = data;
      console.log(zonaClientes);
      mostrarZonaClientes(zonaClientes, currentPageZonaClientes, itemsPerPageZonaClientes);
      actualizarControlesPaginacionZonaClientes();
      generarNumerosDePaginaZonaClientes();
    })
    .catch((error) => console.log(error));
}

// Función para cambiar la página actual
function cambiarPaginaZonaClientes(page) {
  if (page > 0 && page <= Math.ceil(zonaClientes.length / itemsPerPageZonaClientes)) {
    currentPageZonaClientes = page;
    mostrarZonaClientes(zonaClientes, currentPageZonaClientes, itemsPerPageZonaClientes);
    actualizarControlesPaginacionZonaClientes();
    generarNumerosDePaginaZonaClientes();
  }
}

// Cargar las zonas de clientes al iniciar
cargarZonaClientes();
