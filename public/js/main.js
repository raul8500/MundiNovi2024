// Configuración base y verificación de token
const base = 'http://localhost:3000';
const verifyToken = '/api/verifySesion';
const obtenerFunciones = '/api/auth/functions/';

const nameRol = document.getElementById('name');
const rol = document.getElementById('rol');
const options = document.getElementById('options');
const profilePicture = document.getElementById('profilePicture');
let infoUser = ''
verificarTokenYMostrar();

function verificarTokenYMostrar() {
    fetch(verifyToken)
        .then(response => response.json())
        .then(data => {
            infoUser = data
            mostrarRolUsuario(data); // Primero, muestra el rol del usuario
            return data; // Devuelve 'data' para poder usarlo en la siguiente promesa
        })
        .then(data => {
            mostrarFunciones(data); // Luego, muestra las funciones
        })
        .catch(error => console.log(error));
}

function mostrarRolUsuario(data) {
    data.name = capitalizeWords(data.name);
    nameRol.textContent = data.name;
    rol.textContent = obtenerNombreRol(data.rol);
    profilePicture.setAttribute("src", `img/profile${data.img}.png`);
}

function capitalizeWords(str) {
    return str
        .toLowerCase() // Asegura que el texto esté en minúsculas
        .split(' ')    // Divide el texto en palabras
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitaliza la primera letra de cada palabra
        .join(' ');    // Une las palabras de nuevo en una cadena
}

const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e);
        }
    });
};

function obtenerNombreRol(rol) {
    switch (rol) {
        case 1:
            return "GerenteGeneral";
        case 2:
            return "Cajero";
        case 3:
            return "Admin Sucursal";
        case 4:
            return "Autor";
        case 5:
            return "Colaborador";
        case 6:
            return "Usuario registrado";
        case 7:
            return "Usuario invitado";
        case 8:
            return "Visitante";
        default:
            return "Rol desconocido";
    }
}

function mostrarFunciones(data) {
    const rol = data.rol;

    fetch(obtenerFunciones + obtenerNombreRol(rol))
        .then(response => response.json())
        .then(data => {
            funciones(data.functions);
        })
        .catch(error => console.log(error));
}

function funciones(data) {
    let resultados = '';
    data.forEach(item => {
        if (item.subFunctions && item.subFunctions.length > 0) {
            // Si hay subfunciones, crea un menú desplegable
            resultados += `
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenu${item.name.replace(/\s+/g, '')}" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        ${item.name}
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenu${item.name.replace(/\s+/g, '')}">
                        ${item.subFunctions.map(subFunc => `
                            <li><a class="dropdown-item" href="${subFunc.path}">${subFunc.name}</a></li>
                        `).join('')}
                    </ul>
                </li>
            `;
        } else {
            // Si no hay subfunciones, simplemente muestra el enlace
            resultados += `
                <li class="nav-item">
                    <a class="nav-link" href="${item.path}">${item.name}</a>
                </li>
            `;
        }
    });
    document.getElementById('options').innerHTML = resultados;
}

