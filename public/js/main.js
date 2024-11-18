// Configuración base y verificación de token
const base = 'http://localhost:3000';
const verifyToken = '/api/verifySesion';
const obtenerFunciones = '/api/auth/functions/';

const nameRol = document.getElementById('name');
const rol = document.getElementById('rol');
const options = document.getElementById('options');
const profilePicture = document.getElementById('profilePicture');
let infoUser = '';
verificarTokenYMostrar();

function verificarTokenYMostrar() {
    fetch(verifyToken)
        .then(response => response.json())
        .then(data => {
            infoUser = data;
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

    if (infoUser.rol === 1) {
        const estadisticasMain = document.getElementById('estadisticasMain');

        if (estadisticasMain != null) {
            estadisticasMain.style.visibility = 'visible';
            mostrarInfoPanel();
        }
    }
}

function capitalizeWords(str) {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
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
            return "STPS";
        case 4:
            return "AAdministrativo";
        case 5:
            return "Administrador";
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
            // Si no hay subfunciones, verificar si es "Preciador" y mostrar la cantidad de productos
            if (item.name === 'Preciador') {
                fetch(`/api/preciador/${infoUser.sucursalId}`)
                    .then(response => response.json())
                    .then(preciadorData => {
                        const cantidadProductos = preciadorData?.productos?.length || 0; // Verificar si 'productos' existe
                        resultados += `
                            <li class="nav-item">
                                <a class="nav-link" href="${item.path}">
                                    ${item.name} 
                                    ${cantidadProductos > 0 ? `<span class="text-danger">(${cantidadProductos})</span> <i class="fas fa-exclamation-circle text-danger"></i>` : ''}
                                </a>
                            </li>
                        `;
                        document.getElementById('options').innerHTML = resultados; // Actualizar el HTML después de obtener la cantidad
                    })
                    .catch(error => console.log(error));
            } else {
                // Mostrar el enlace normalmente
                resultados += `
                    <li class="nav-item">
                        <a class="nav-link" href="${item.path}">${item.name}</a>
                    </li>
                `;
            }
        }
    });
    document.getElementById('options').innerHTML = resultados;
}

function mostrarInfoPanel() {
    fetch('/api/ventasMainInfo')
        .then(response => response.json())
        .then(data => {
            cargarInfoPanel(data);
        })
        .catch(error => console.log(error)); // Mover .catch() al final
}

function cargarInfoPanel(data) {
    document.getElementById('ingresosDelDia').textContent = '$' + data.totalDinero;
    document.getElementById('ventasRealizadas').textContent = data.totalVentas;
    document.getElementById('productosVendidos').textContent = data.totalProductos;
    document.getElementById('sucursalMasVenta').textContent = data.sucursalQueVendioMas;
}
