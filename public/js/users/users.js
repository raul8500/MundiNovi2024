const urlGetSucursales = '/api/sucursal';
const urlGetFunctions = '/api/functions';
const urlGetUsuarios =  '/api/auth/users';
const urlPostUser = '/api/auth/register'

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
  document.getElementById('sucursalesEdit').innerHTML = sucursales;
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
  document.getElementById('rolesEdit').innerHTML = roles;
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

document.querySelectorAll('.imgDrop').forEach((item) => {
    item.addEventListener('click', function (event) {
        event.preventDefault();
        // Obtener la URL de la imagen seleccionada
        const imgSrc = this.getAttribute('data-img-src');
        
        // Extraer el número al final de "profile"
        const numberMatch = imgSrc.match(/profile(\d+)\.png/);
        selectedImageNumber = numberMatch ? numberMatch[1] : '';

        // Actualizar el contenedor de la imagen seleccionada
        document.getElementById('selectedImageContainer').innerHTML = `
            <img src="${imgSrc}" class="rounded-circle" height="35" alt="Selected Image" />
            <span>Imagen ${selectedImageNumber}</span>
        `;

        // Marcar la opción correspondiente en el menú desplegable
        const items = document.querySelectorAll('dropMenuAdd .imgDrop');
        items.forEach(item => {
            if (item.getAttribute('data-img-src') === imgSrc) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Actualizar el texto del botón del menú desplegable
        document.getElementById('dropdownMenuButton').innerText = `Imagen ${selectedImageNumber}`;
        
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

