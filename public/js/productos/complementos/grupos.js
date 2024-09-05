const urlGetGrupos = '/api/grupos';

// Obtener referencia al contenedor de grupos
const contenedorGrupos = document.getElementById('grupoData');
let editarGrupoId = ''
let currentPageGrupos = 1;
const itemsPerPageGrupos = 5; // Ajusta este número según tus necesidades
const maxPageLinksGrupos = 5;
let grupos = [];
let opcion = 'crear';

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
          <button id="${
                      item._id
                    }" type="button" class="btn btn-danger btn-rounded btnDeleteGrupos">
                        <i class="fa-solid fa-trash"></i>
          </button>
          <button id="${item._id}" type="button" class="btn btn-secondary btn-rounded btnEditGrupos">
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


//create - Editar
document.getElementById('btnAddGrupo').addEventListener('click', () => {

  const clave = document.getElementById('claveGrupo').value.trim();
  const nombre = document.getElementById('nombreGrupo').value.trim();
  const descripcion = document.getElementById('descripcionGrupo').value.trim();

  if (validarCampos(clave, nombre, descripcion)) {
    if(opcion == 'crear'){
      fetch('/api/grupos', {
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
            'El Grupo ha sido guardado.',
            'success'
        );
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalGrupo'));
        document.getElementById('claveGrupo').value = ''
        document.getElementById('nombreGrupo').value = ''
        document.getElementById('descripcionGrupo').value = ''
        document.getElementById('btnAddGrupo').textContent = 'Agregar'
        cargarGrupos();
        opcion = 'crear';
      })
      .catch((error) => console.log(error));
    }else{
      fetch(`/api/grupos/${editarGrupoId}`, {
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
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalGrupo'));
        document.getElementById('claveGrupo').value = ''
        document.getElementById('nombreGrupo').value = ''
        document.getElementById('descripcionGrupo').value = ''
        document.getElementById('btnAddGrupo').textContent = 'Agregar'
        cargarGrupos();
        opcion = 'crear';
      })
      .catch((error) => console.log(error));
    }
  }

});

document.getElementById('btnAgregarGrupoModal').addEventListener('click', () => {
  document.getElementById('claveGrupo').value = ''
  document.getElementById('nombreGrupo').value = ''
  document.getElementById('descripcionGrupo').value = ''
    document.getElementById('btnAddGrupo').textContent = 'Agregar'
});

function validarCampos(clave, nombre, descripcion) {
  if (clave === "") {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'El campo Clave no puede estar vacío.'
    });
    return false;
  }

  if (nombre === "") {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'El campo Nombre no puede estar vacío.'
    });
    return false;
  }

  if (descripcion === "") {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'El campo Descripción no puede estar vacío.'
    });
    return false;
  }

  // Si todas las validaciones pasan
  return true;
}

//delete 

const urlDeleteGrupo ='/api/grupos/'; // Define la URL base para eliminar

document.addEventListener('click', function(e) {
  // Busca el elemento más cercano que tenga la clase 'btnDeleteGrupos'
  const button = e.target.closest('.btnDeleteGrupos');
  
  if (button) {
      const idGrupo = button.id;

      Swal.fire({
          title: '¿Estás seguro?',
          text: "No podrás revertir esto.",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
      }).then(async (result) => {
          if (result.isConfirmed) {
              await deleteGrupo(idGrupo);
          }
      });
  }
});

async function deleteGrupo(id) {
    try {
        const response = await fetch(`${urlDeleteGrupo}${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            Swal.fire({
                title: 'Eliminado',
                text: 'El grupo ha sido eliminado.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                cargarGrupos()
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al eliminar el usuario.',
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

on(document, 'click', '.btnEditGrupos', async e => {
  const button = e.target.closest('.btnEditGrupos');
  editarGrupoId = button.id
  const row = button.closest('tr');
  const rowData = Array.from(row.querySelectorAll('td')).map(cell => cell.textContent.trim());

  // Asigna los valores a los inputs
  document.getElementById('claveGrupo').value = rowData[0];
  document.getElementById('nombreGrupo').value = rowData[1];
  document.getElementById('descripcionGrupo').value = rowData[2];
  document.getElementById('btnAddGrupo').textContent = 'Editar'

  // Revalida los inputs para que la animación de MDB se aplique correctamente
  document.getElementById('claveGrupo').focus();
  document.getElementById('claveGrupo').blur();
  
  document.getElementById('nombreGrupo').focus();
  document.getElementById('nombreGrupo').blur();
  
  document.getElementById('descripcionGrupo').focus();
  document.getElementById('descripcionGrupo').blur();

  opcion = 'editar'

});

