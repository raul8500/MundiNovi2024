const urlGetLineas = '/api/linea'; // Cambia esto según tu endpoint para líneas

// Obtener referencia al contenedor de líneas
const contenedorLineas = document.getElementById('lineaData');
let currentPageLineas = 1;
const itemsPerPageLineas = 5; // Ajusta este número según tus necesidades
const maxPageLinksLineas = 5;
let lineas = [];
let editarLinea = ''
let opcionLinea = 'crear';

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


//create - Editar
document.getElementById('btnAddLinea').addEventListener('click', () => {

    const clave = document.getElementById('claveLinea').value.trim();
    const nombre = document.getElementById('nombreLinea').value.trim();
    const descripcion = document.getElementById('descripcionLinea').value.trim();
  
    if (validarCampos(clave, nombre, descripcion)) {
      if(opcion == 'crear'){
        fetch('/api/linea', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              clave,
              nombre,
              descripcion,
          }),
        })
        .then((response) => response.json())
        .then(() => {
          Swal.fire(
              'Guardado!',
              'La linea ha sido guardada.',
              'success'
          );
          const modal = bootstrap.Modal.getInstance(document.getElementById('modalLinea'));
          document.getElementById('claveLinea').value = ''
          document.getElementById('nombreLinea').value = ''
          document.getElementById('descripcionLinea').value = ''
          document.getElementById('btnAddLinea').textContent = 'Agregar'
          cargarLineas();
        })
        .catch((error) => console.log(error));
      }else{
        fetch(`/api/linea/${editarLinea}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              clave,
              nombre,
              descripcion,
          }),
        })
        .then((response) => response.json())
        .then(() => {
          Swal.fire(
              'Guardado!',
              'El grupo ha sido actualizado.',
              'success'
          );
          const modal = bootstrap.Modal.getInstance(document.getElementById('modalLinea'));
          document.getElementById('claveLinea').value = ''
          document.getElementById('nombreLinea').value = ''
          document.getElementById('descripcionLinea').value = ''
          document.getElementById('btnAddLinea').textContent = 'Agregar'
          cargarLineas();
        })
        .catch((error) => console.log(error));
      }
    }
  
  });
  
  document.getElementById('btnAgregarLineaModal').addEventListener('click', () => {
    document.getElementById('claveLinea').value = ''
    document.getElementById('nombreLinea').value = ''
    document.getElementById('descripcionLinea').value = ''
      document.getElementById('btnAddLinea').textContent = 'Agregar'
  });
  
  //delete 
  
  const urlDeleteLinea ='/api/linea/'; // Define la URL base para eliminar
  
  document.addEventListener('click', function(e) {
    // Busca el elemento más cercano que tenga la clase 'btnDeleteGrupos'
    const button = e.target.closest('.btnDeleteLineas');
    
    if (button) {
        const idLinea = button.id;
  
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteLinea(idLinea);
            }
        });
    }
  });
  
  async function deleteLinea(id) {
      try {
          const response = await fetch(`${urlDeleteLinea}${id}`, {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json'
              }
          });
  
          if (response.ok) {
              Swal.fire({
                  title: 'Eliminado',
                  text: 'La linea ha sido eliminado.',
                  icon: 'success',
                  confirmButtonText: 'Aceptar'
              }).then(() => {
                  cargarLineas()
              });
          } else {
              Swal.fire({
                  title: 'Error',
                  text: 'Hubo un problema al eliminar la linea.',
                  icon: 'error',
                  confirmButtonText: 'Aceptar'
              });
          }
      } catch (error) {
          console.error('Error:', error);
          Swal.fire({
              title: 'Error',
              text: 'Error en la conexión con el servidor.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
          });
      }
  }
  
  //Editar
  on(document, 'click', '.btnEditLineas', async e => {
    const button = e.target.closest('.btnEditLineas');
    editarLinea = button.id

    const row = button.closest('tr');
    const rowData = Array.from(row.querySelectorAll('td')).map(cell => cell.textContent.trim());
  
    // Asigna los valores a los inputs
    document.getElementById('claveLinea').value = rowData[0];
    document.getElementById('nombreLinea').value = rowData[1];
    document.getElementById('descripcionLinea').value = rowData[2];
    document.getElementById('btnAddLinea').textContent = 'Editar'
  
    // Revalida los inputs para que la animación de MDB se aplique correctamente
    document.getElementById('claveLinea').focus();
    document.getElementById('claveLinea').blur();
    
    document.getElementById('nombreLinea').focus();
    document.getElementById('nombreLinea').blur();
    
    document.getElementById('descripcionLinea').focus();
    document.getElementById('descripcionLinea').blur();
  
    opcion = 'editar'
  
  });
  
  