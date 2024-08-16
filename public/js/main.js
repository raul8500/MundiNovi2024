// Configuración base y verificación de token
const base = 'http://localhost:3000';
const verifyToken = base + '/api/verifySesion';
const obtenerFunciones = base + '/api/auth/functions/';

const nameRol = document.getElementById('name');
const rol = document.getElementById('rol');
const options = document.getElementById('options');
const profilePicture = document.getElementById('profilePicture');
verificarTokenYMostrar();

function verificarTokenYMostrar() {
    fetch(verifyToken)
        .then(response => response.json())
        .then(data => {
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
            return "Editor";
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

// Configuración del chat
const socket = io();

// Alternar visibilidad del chat
document.getElementById('chatToggle').addEventListener('click', () => {
    const chatBox = document.getElementById('chatBox');
    const notificationBadge = document.getElementById('notificationBadge');
    chatBox.classList.toggle('d-none');
    if (!chatBox.classList.contains('d-none')) {
        // Cuando el chat está visible, oculta el ícono de notificación
        notificationBadge.classList.add('d-none');
        restoreScrollPosition();
    }
});

// Función para mostrar un mensaje
function addMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageElem = document.createElement('li');
    messageElem.className = 'mb-2';
    messageElem.innerHTML = `
        <div><strong>${message.user.name}</strong> [Sucursal: ${message.user.sucursal}] <small>[${new Date(message.date).toLocaleString()}]</small></div>
        <div>${message.text}</div>
    `;

    chatMessages.appendChild(messageElem);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Siempre al final
}

// Cargar mensajes al iniciar
socket.on('loadMessages', (messages) => {
    messages.forEach(message => addMessage(message));
    restoreScrollPosition(); // Asegúrate de que el scroll esté al final después de cargar todos los mensajes
});

// Mostrar mensajes nuevos
socket.on('newMessage', (message) => {
    addMessage(message);
    // Mostrar el ícono de notificación si el chat está oculto
    const chatBox = document.getElementById('chatBox');
    if (chatBox.classList.contains('d-none')) {
        const notificationBadge = document.getElementById('notificationBadge');
        notificationBadge.classList.remove('d-none');
    }
});

// Enviar mensaje
document.getElementById('chatForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const chatInput = document.getElementById('chatInput');
    const text = chatInput.value.trim(); // Elimina espacios en blanco al principio y al final

    if (text) {
        const userName = nameRol.textContent; // Obtener el nombre del usuario
        socket.emit('sendMessage', { text, userName }); // Incluir el nombre del usuario
        chatInput.value = '';
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Campo vacío',
            text: 'No se pueden enviar mensajes vacíos.',
            confirmButtonText: 'OK'
        });
    }
});

// Enviar mensaje al presionar Enter
document.getElementById('chatInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('sendMessage').click();
    }
});

// Restaurar la posición del scroll al abrir el chat
function restoreScrollPosition() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Guardar posición del scroll antes de cerrar el chat
window.addEventListener('beforeunload', () => {
    const chatMessages = document.getElementById('chatMessages');
    localStorage.setItem('scrollPosition', chatMessages.scrollTop);
});
