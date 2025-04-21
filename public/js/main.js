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
        case 4:
            return "AuxiliarAdministrativo";
        case 5:
            return "Administrador";
        case 6:
            return "Produccion";
        case 7:
            return "Supervisor";
        case 8:
            return "AClientes";
        case 9:
            return "Almacen";
        case 10:
            return "Reparto";
        case 11: 
            return "Ventas"
        case 12: 
            return "Contraloria"
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

async function funciones(data) {
    let resultados = '';

    const fetches = data.map(async item => {
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
        } else if (item.name === 'Preciador') {
            try {
                const response = await fetch(`/api/preciador/${infoUser.sucursalId}`);
                const preciadorData = await response.json();
                const cantidadProductos = preciadorData?.productos?.length || 0;

                resultados += `
                    <li class="nav-item">
                        <a class="nav-link" href="${item.path}">
                            ${item.name}
                            ${cantidadProductos > 0 ? `<span class="text-danger">(${cantidadProductos})</span> <i class="fas fa-exclamation-circle text-danger"></i>` : ''}
                        </a>
                    </li>
                `;
            } catch (error) {
                console.error('Error al cargar preciador:', error);
            }
        } else if (item.name === 'Actividades') {
            try {
                const response = await fetch(`/api/obtenerActividadesNoPorUsuario/${infoUser._id}`);
                const data = await response.json();
                const totalPendientes = data.totalPendientes || 0;
                console.log(data)
                resultados += `
                    <li class="nav-item">
                        <a class="nav-link" href="${item.path}">
                            ${item.name}
                            ${totalPendientes > 0 ? `<span class="text-danger">(${totalPendientes})</span> <i class="fas fa-exclamation-circle text-danger"></i>` : ''}
                        </a>
                    </li>
                `;
            } catch (error) {
                console.error('Error al cargar actividades:', error);
            }
        } else {
            // Elemento simple sin notificación
            resultados += `
                <li class="nav-item">
                    <a class="nav-link" href="${item.path}">${item.name}</a>
                </li>
            `;
        }
    });

    // Esperar todos los fetches
    await Promise.all(fetches);

    // Una sola vez se actualiza el DOM
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
