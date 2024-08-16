
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
