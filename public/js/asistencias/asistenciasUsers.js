let userId = '';

function verificarTokenYMostrar() {
    fetch('/api/verifySesion')
        .then(response => response.json())
        .then(data => {
            userId = data;
            console.log(userId);
            mostrarOpcionAsistencia(userId._id);
        })
        .catch(error => console.error('Error al verificar sesión:', error));
}

function mostrarOpcionAsistencia(id) {
    fetch(`/api/getAsistenciaByUsuarioForToday/${id}`)
        .then(response => {
            if (response.status === 404) {
                // No hay asistencia registrada, mostrar las 4 opciones habilitadas
                mostrarTarjetas(null);
                return;
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                mostrarTarjetas(data.acciones);
            }
        })
        .catch(error => console.error('Error al obtener asistencia:', error));
}

function mostrarTarjetas(acciones) {
    const contenedor = document.getElementById('accionesAsistencia');
    contenedor.innerHTML = '';

    const opciones = [
        { nombre: 'Registrar Entrada', campo: 'entrada', endpoint: '/api/registrarEntrada' },
        { nombre: 'Salida a Comer', campo: 'salidaComer', endpoint: '/api/registrarSalidaComer' },
        { nombre: 'Regreso de Comer', campo: 'regresoComer', endpoint: '/api/registrarRegresoComer' },
        { nombre: 'Término de Jornada', campo: 'terminoJornada', endpoint: '/api/registrarTerminoJornada' }
    ];

    opciones.forEach(opcion => {
        const realizado = acciones?.[opcion.campo];
        const card = document.createElement('div');
        card.className = 'col-md-3 mb-3';
        card.innerHTML = `
            <div class="card">
                <div class="card-body text-center">
                    <h5 class="card-title">${opcion.nombre}</h5>
                    ${realizado
                        ? `<span class="badge bg-success">Registrado</span>
                           <p>${new Date(realizado).toLocaleString()}</p>`
                        : `<button class="btn btn-primary btn-sm" onclick="registrarAccion('${opcion.endpoint}')">Registrar</button>`}
                </div>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

function registrarAccion(endpoint) {
    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuarioId: userId._id }),
    })
        .then(response => {
            if (response.ok) {
                Swal.fire('Éxito', 'Acción registrada con éxito.', 'success');
                verificarTokenYMostrar(); // Actualiza la vista
            } else {
                throw new Error('Error al registrar la acción.');
            }
        })
        .catch(error => {
            Swal.fire('Error', error.message, 'error');
            console.error('Error al registrar acción:', error);
        });
}

// Inicializar la verificación de token y mostrar opciones
verificarTokenYMostrar();
