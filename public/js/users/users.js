const urlGetSucursales = base + '/api/sucursal';
const urlGetFunctions = base + '/api/functions';
const urlGetUsuarios = base + '/api/auth/users';
const urlPostUser = base + '/api/auth/register'

const modalUser = new mdb.Modal(document.getElementById('ModalAddUser'));

getSucursales();

function getSucursales() {
  fetch(urlGetSucursales)
    .then((response) => response.json())
    .then((data) => {
      cargarSucursales(data);
    })
    .catch((error) => console.log(error));
}
function cargarSucursales(data) {
  let sucursales = '<option value="0" selected>Seleccione una opción</option>';
  data.forEach((item, index) => {
    sucursales += `
            <option value="${item._id}"><b>${item.nombre}</b> de: ${item.idFranquicia.nombre}</option>

        `;
  });
  document.getElementById('sucursales').innerHTML = sucursales;
}

getFunctions();

function getFunctions() {
  fetch(urlGetFunctions)
    .then((response) => response.json())
    .then((data) => {
      cargarRoles(data);
    })
    .catch((error) => console.log(error));
}
function cargarRoles(data) {
  let roles = '<option  value="0" selected>Seleccione una opción</option>';
  data.forEach((item, index) => {
    roles += `
            <option id="${item._id}:" value="${item.type}">${
      item.nameRol
    }</option>
        `;
  });
  document.getElementById('roles').innerHTML = roles;
}

//get usuarios
const contenedorUsuarios = document.getElementById('usuariosData');
let currentPageUsuarios = 1;
const itemsPerPageUsuarios = 5; // Puedes ajustar este número según tus necesidades
const maxPageLinksUsuarios = 5;
let usuarios = [];

const formatearFecha = (fecha) => {
  const meses = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'Septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];

  const fechaObj = new Date(fecha);
  const dia = fechaObj.getDate();
  const mes = meses[fechaObj.getMonth()];
  const anio = fechaObj.getFullYear();

  return `${dia} ${'de'} ${mes} ${'de'} ${anio}`;
};

const mostrarUsuarios = (usuarios, currentPage, itemsPerPage) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  let resultadosUsuarios = '';

  usuarios.slice(startIndex, endIndex).forEach((item) => {
    resultadosUsuarios += `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <img
                            src="img/profile${item.img}.png"
                            alt=""
                            style="width: 45px; height: 45px"
                            class="rounded-circle"
                        />
                        <div class="ms-4">
                            <p class="fw-bold mb-1">${item.name}</p>
                        </div>
                    </div>
                </td>
                <td class="text-center">${item.username}</td>
                <td class="text-center">${obtenerNombreRol(item.rol)}</td>
                <td class="text-center">${item.sucursalId.nombre}</td>
                <td class="text-center">${formatearFecha(item.createdAt)}</td>
                <td class="text-center">
                    <button id="${
                      item._id
                    }" type="button" class="btn btn-primary btn-rounded btnEditSucursal">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button id="${
                      item._id
                    }" type="button" class="btn btn-danger btn-rounded btnDeleteSucursal">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>`;
  });

  contenedorUsuarios.innerHTML = resultadosUsuarios;
};

function actualizarControlesPaginacionUsuarios() {
  const botonAnterior = document.querySelector('#anteriorUsuarios');
  const botonSiguiente = document.querySelector('#siguienteUsuarios');

  if (botonAnterior && botonSiguiente) {
    botonAnterior.disabled = currentPageUsuarios === 1;
    botonSiguiente.disabled =
      currentPageUsuarios === Math.ceil(usuarios.length / itemsPerPageUsuarios);
  }
}

function generarNumerosDePaginaUsuarios() {
  const paginacionContainer = document.getElementById('paginationUsuarios');

  if (paginacionContainer) {
    const numeroTotalPaginas = Math.ceil(
      usuarios.length / itemsPerPageUsuarios,
    );

    let paginacionHTML = '';

    let startPage = Math.max(
      1,
      currentPageUsuarios - Math.floor(maxPageLinksUsuarios / 2),
    );
    let endPage = Math.min(
      numeroTotalPaginas,
      startPage + maxPageLinksUsuarios - 1,
    );

    if (startPage > 1) {
      paginacionHTML +=
        '<li class="page-item"><a class="page-link" href="#" onclick="cambiarPaginaUsuarios(1)">1</a></li>';
      if (startPage > 2) {
        paginacionHTML +=
          '<li class="page-item disabled"><span class="page-link">...</span></li>';
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      paginacionHTML += `<li class="page-item ${
        i === currentPageUsuarios ? 'active' : ''
      }"><a class="page-link" href="#" onclick="cambiarPaginaUsuarios(${i})">${i}</a></li>`;
    }

    if (endPage < numeroTotalPaginas) {
      if (endPage < numeroTotalPaginas - 1) {
        paginacionHTML +=
          '<li class="page-item disabled"><span class="page-link">...</span></li>';
      }
      paginacionHTML += `<li class="page-item"><a class="page-link" href="#" onclick="cambiarPaginaUsuarios(${numeroTotalPaginas})">${numeroTotalPaginas}</a></li>`;
    }

    paginacionContainer.innerHTML = paginacionHTML;
  }
}

function cargarUsuarios() {
  fetch(urlGetUsuarios)
    .then((response) => response.json())
    .then((data) => {
      usuarios = data;
      mostrarUsuarios(usuarios, currentPageUsuarios, itemsPerPageUsuarios);
      actualizarControlesPaginacionUsuarios();
      generarNumerosDePaginaUsuarios();
    })
    .catch((error) => console.log(error));
}

function cambiarPaginaUsuarios(page) {
  if (page > 0 && page <= Math.ceil(usuarios.length / itemsPerPageUsuarios)) {
    currentPageUsuarios = page;
    mostrarUsuarios(sucursales, currentPageUsuarios, itemsPerPageUsuarios);
    actualizarControlesPaginacionUsuarios();
    generarNumerosDePaginaUsuarios();
  }
}

cargarUsuarios();





document.querySelectorAll('.imgDrop').forEach((item) => {
    item.addEventListener('click', function (event) {
        event.preventDefault();
        // Obtener la URL de la imagen seleccionada
        const imgSrc = this.getAttribute('data-img-src');
        
        // Extraer el número al final de "profile"
        const numberMatch = imgSrc.match(/profile(\d+)\.png/);
        selectedImageNumber = numberMatch ? numberMatch[1] : '';

        // Mostrar el número en la consola
        console.log(`Imagen seleccionada: ${selectedImageNumber}`);

        // Actualizar el contenedor de la imagen seleccionada
        document.getElementById('selectedImageContainer').innerHTML = `
            <img src="${imgSrc}" class="rounded-circle" height="35" alt="Selected Image" />
            <span>Imagen ${selectedImageNumber}</span>
        `;
    });
});

let img = '';

function setupImageDropdown() {
    document.querySelectorAll('.imgDrop').forEach((item) => {
        item.addEventListener('click', function (event) {
            event.preventDefault();

            // Obtener la URL de la imagen seleccionada
            const imgSrc = this.getAttribute('data-img-src');

            // Extraer el número al final de "profile"
            const numberMatch = imgSrc.match(/profile(\d+)\.png/);
            img = numberMatch ? numberMatch[1] : '';

            // Mostrar el número en la consola
            console.log(`Número de imagen seleccionada: ${img}`);

            // Actualizar el contenedor de la imagen seleccionada
            document.getElementById('selectedImageContainer').innerHTML = `
                <img src="${imgSrc}" class="rounded-circle" height="35" alt="Selected Image" />
                <span>Imagen ${img}</span>
            `;
        });
    });
}
// Llamar a la función para configurar el dropdown
setupImageDropdown();
// Función para obtener el número de imagen seleccionado
function getSelectedImageNumber() {
    return img;
}

//Add user
btnAddUser.addEventListener('click', () => {
  const sucursalesSelect = document.getElementById('sucursales');
  sucursalesSelect.value = sucursalesSelect.options[0].value;

  const rolesSelect = document.getElementById('roles');
  rolesSelect.value = rolesSelect.options[0].value;

  const fullnameInput = (document.getElementById('fullname').value = '');
  const usernameInput = (document.getElementById('username').value = '');
  const passwordInput = (document.getElementById('password').value = '');

  document.getElementById('selectedImageContainer').innerHTML = `
    `;
  modalUser.show();
});

function validarCamposNoVaciosYSeleccion() {

    const sucursalesSelect = document.getElementById('sucursales');
    const rolesSelect = document.getElementById('roles');

    const camposUsuario = [
        document.getElementById('fullname'),
        document.getElementById('username'),
        document.getElementById('password')
    ];

    let todosLlenos = true;

    // Validar campos vacíos
    camposUsuario.forEach(campo => {
        if (campo.value.trim() === '') {
            campo.classList.add('is-invalid');
            todosLlenos = false;
        } else {
            campo.classList.remove('is-invalid');
            campo.classList.add('is-valid');
        }
    });

    // Validar selecciones
    const sucursalesValue = sucursalesSelect.value;
    const rolesValue = rolesSelect.value;

    if (sucursalesValue === '0') {
        sucursalesSelect.classList.add('is-invalid');
        todosLlenos = false;
    } else {
        sucursalesSelect.classList.remove('is-invalid');
        sucursalesSelect.classList.add('is-valid');
    }

    if (rolesValue === '0') {
        rolesSelect.classList.add('is-invalid');
        todosLlenos = false;
    } else {
        rolesSelect.classList.remove('is-invalid');
        rolesSelect.classList.add('is-valid');
    }

    return todosLlenos;
}

async function postUserData() {
    if (!validarCamposNoVaciosYSeleccion()) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor, completa todos los campos correctamente.',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    // Obtener los valores de los campos
    const name = document.getElementById('fullname').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rol = parseInt(document.getElementById('roles').value);
    const img = getSelectedImageNumber()
    const sucursalId = document.getElementById('sucursales').value;

    // Crear el objeto para enviar
    const data = {
        name,
        username,
        rol,
        password,
        img,
        sucursalId
    };

    try {
        const response = await fetch(urlPostUser, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            // Mostrar mensaje de éxito
            Swal.fire({
                title: 'Éxito',
                text: 'Datos enviados correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                // Recargar la página
                window.location.reload();
            });

        } else if (response.status === 409) {
            // Mostrar mensaje de error para usuario ya existente
            Swal.fire({
                title: 'Error',
                text: 'El nombre de usuario ya existe. Por favor, elige un nombre de usuario diferente.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        } else {
            // Mostrar mensaje de error genérico
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al enviar los datos.',
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

document.getElementById('bntPostUserData').addEventListener('click', postUserData);

