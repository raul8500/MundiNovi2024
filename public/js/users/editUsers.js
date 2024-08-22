const urlPutUsers ='/api/auth/users/';
const modalUsersEdit = new mdb.Modal(document.getElementById('ModalEditUser'));
let idUser = '';



// Manejador de clic para editar sucursales
on(document, 'click', '.btnEditUsers', async e => {
    const button = e.target.closest('.btnEditUsers');
    idUser = button.id;
    fetchUsers(idUser);
});


// Función para obtener los datos de la sucursal
async function fetchUsers(id) {
    try {
        const response = await fetch(`/api/auth/users/${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener los datos');
        }
        const data = await response.json();
        
        seleccionarSucursal(data.sucursalId._id)
        seleccionarRol(data.rol)
        seleccionarImagen(data.img)
        imgEdit = data.img
        document.getElementById('fullnameEdit').value = data.name;
        document.getElementById('usernameEdit').value = data.username;

        modalUsersEdit.show();

    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'Error al cargar los datos de la sucursal.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
}

function seleccionarSucursal(selectedId){
    let selectElement = document.getElementById('sucursalesEdit');
    let options = selectElement.children;

    for (let i = 0; i < options.length; i++) {
        if (options[i].value === selectedId) {
            options[i].selected = true;
            break;
        }
    }
}

function seleccionarRol(rol){
    console.log(rol)
    let selectElement = document.getElementById('rolesEdit');
    let options = selectElement.children;
    console.log(options)

    for (let i = 0; i < options.length; i++) {
        if (parseInt(options[i].value) === rol) {
            options[i].selected = true;
            break;
        }
    }
}
// Ejemplo de uso: Seleccionar la imagen número 3
function seleccionarImagen(numeroImagen) {
    // Mapeo de números de imagen a los valores de data-img-src
    const imagenes = [
        'img/profile1.png',
        'img/profile2.png',
        'img/profile3.png',
        'img/profile4.png',
        'img/profile5.png'
    ];

    // Validar que el número de imagen esté dentro del rango permitido
    if (numeroImagen < 1 || numeroImagen > imagenes.length) {
        console.error('Número de imagen fuera de rango');
        return;
    }

    // Obtener la imagen correspondiente al número dado
    const imgSrc = imagenes[numeroImagen - 1];

    // Actualizar el contenedor de la imagen seleccionada
    document.getElementById('selectedImageContainerEdit').innerHTML = `
        <img src="${imgSrc}" class="rounded-circle" height="35" alt="Selected Image" />
        <span>Imagen ${numeroImagen}</span>
    `;

    // Marcar la opción correspondiente en el menú desplegable
    const items = document.querySelectorAll('.dropdown-menu .imgDropEdit');
    items.forEach(item => {
        if (item.getAttribute('data-img-src') === imgSrc) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Actualizar el texto del botón del menú desplegable
    document.getElementById('dropdownMenuButtonEdit').innerText = `Imagen ${numeroImagen}`;
}


function validarCamposNoVaciosYSeleccionEdit() {

    const sucursalesSelect = document.getElementById('sucursalesEdit');
    const rolesSelect = document.getElementById('rolesEdit');

    const camposUsuario = [
        document.getElementById('fullnameEdit'),
        document.getElementById('usernameEdit'),
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

async function putUserData() {
    if (!validarCamposNoVaciosYSeleccionEdit()) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor, completa todos los campos correctamente.',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    // Obtener los valores de los campos
    const name = document.getElementById('fullnameEdit').value;
    const username = document.getElementById('usernameEdit').value;
    const rol = parseInt(document.getElementById('rolesEdit').value);
    const img = getSelectedImageNumberEdit();
    const sucursalId = document.getElementById('sucursalesEdit').value;

    // Crear el objeto para enviar
    const data = {
        name,
        username,
        rol,
        img,
        sucursalId
    };

    try {
        const response = await fetch(urlPutUsers + idUser, {
            method: 'PUT',
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

document.getElementById('bntPutUserData').addEventListener('click', putUserData);


let imgEdit = '';

function setupImageDropdownEdit() {
    document.querySelectorAll('.imgDropEdit').forEach((item) => {
        item.addEventListener('click', function (event) {
            event.preventDefault();

            // Obtener la URL de la imagen seleccionada
            const imgSrc = this.getAttribute('data-img-src');

            // Extraer el número al final de "profile"
            const numberMatch = imgSrc.match(/profile(\d+)\.png/);
            imgEdit = numberMatch ? numberMatch[1] : '';


            // Actualizar el contenedor de la imagen seleccionada
            document.getElementById('selectedImageContainerEdit').innerHTML = `
                <img src="${imgSrc}" class="rounded-circle" height="35" alt="Selected Image" />
                <span>Imagen ${imgEdit}</span>
            `;
        });
    });
}
// Llamar a la función para configurar el dropdown
setupImageDropdownEdit();
// Función para obtener el número de imagen seleccionado
function getSelectedImageNumberEdit() {
    return imgEdit;
}

