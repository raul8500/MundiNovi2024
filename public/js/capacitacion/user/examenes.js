// Función para cargar infoUser y luego inicializar la tabla
function cargarUserYTabla() {
    fetch('/api/verifySesion')
        .then(response => response.json())
        .then(data => {
            if (data) {
                console.log(data)
                inicializarTablaExamenes(data); // Inicializa la tabla con la información del usuario
            } else {
                console.error('No se pudo cargar la información del usuario.');
            }
        })
        .catch(error => console.error('Error al cargar el usuario:', error));
}

// Función para inicializar la tabla de exámenes
function inicializarTablaExamenes(infoUser) {
    $('#tablaExamenes').DataTable({
        ajax: {
            url: `/api/examenes/usuario/${infoUser.rol}/${infoUser._id}`,
            dataSrc: ''
        },
        columns: [
            { data: 'titulo', title: 'Título' },
            { data: 'descripcion', title: 'Descripción' },
            {
                data: 'respondido',
                title: 'Respondido',
                render: (data) => data
                    ? '<span class="badge bg-success">Respondido</span>'
                    : '<span class="badge bg-danger">Sin responder</span>'
            },
            {
                data: 'calificacion',
                title: 'Calificación',
                render: (data) => data !== null ? `${data}%` : 'N/A'
            },
            {
                data: null,
                title: 'Acciones',
                render: (data, type, row) => `
                    <button 
                        class="btn btn-primary btn-sm btn-responder" 
                        data-id="${row._id}" 
                        title="Responder" 
                        ${row.respondido ? 'disabled' : ''}>
                        Responder
                    </button>`
            }
        ],
        language: {
            sProcessing: "Procesando...",
            sLengthMenu: "Mostrar _MENU_ registros",
            sZeroRecords: "No se encontraron resultados",
            sInfo: "Mostrando _START_ a _END_ de _TOTAL_ registros",
            sInfoEmpty: "Mostrando 0 a 0 de 0 registros",
            sInfoFiltered: "(filtrado de _MAX_ registros totales)",
            sSearch: "Buscar:",
            oPaginate: {
                sFirst: "Primera",
                sLast: "Última",
                sNext: "Siguiente",
                sPrevious: "Anterior"
            }
        }
    });
}

// Llamar a la función para cargar el usuario y luego inicializar la tabla
cargarUserYTabla();


// Evento para manejar el clic en "Responder"
$(document).on('click', '.btn-responder', async function () {
    const examenId = $(this).data('id'); // Obtener el ID del examen

    try {
        // Obtener el examen por ID
        const response = await fetch(`/api/examenes/${examenId}`);
        const examen = await response.json();

        if (response.ok) {
            // Confirmación antes de iniciar
            Swal.fire({
                title: '¿Estás listo para iniciar el examen?',
                text: 'Una vez iniciado, no podrás salir hasta que lo termines.',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Iniciar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Mostrar el examen
                    mostrarExamenParaResponder(examen);
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: examen.error || 'No se pudo cargar el examen.'
            });
        }
    } catch (error) {
        console.error('Error al cargar el examen:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo conectar con el servidor.'
        });
    }
});

// Función para mostrar el examen en el modal
function mostrarExamenParaResponder(examen) {
    // Título y descripción del examen
    document.getElementById('examenTitulo').innerText = examen.titulo;
    document.getElementById('examenDescripcion').innerText = examen.descripcion;

    // Renderizar preguntas
    const preguntasContainer = document.getElementById('preguntasExamen');
    preguntasContainer.innerHTML = ''; // Limpiar preguntas previas

    examen.preguntas.forEach((pregunta, index) => {
        const preguntaDiv = document.createElement('div');
        preguntaDiv.classList.add('mb-3');

        preguntaDiv.innerHTML = `
            <h6>${index + 1}. ${pregunta.pregunta}</h6>
            ${pregunta.opciones.map((opcion, i) => `
                <div class="form-check">
                    <input 
                        class="form-check-input" 
                        type="radio" 
                        name="pregunta_${index}" 
                        id="pregunta_${index}_opcion_${i}" 
                        value="${i}">
                    <label class="form-check-label" for="pregunta_${index}_opcion_${i}">
                        ${opcion}
                    </label>
                </div>
            `).join('')}
        `;
        preguntasContainer.appendChild(preguntaDiv);
    });

    // Configurar el botón "Terminar"
    const terminarBtn = document.getElementById('terminarExamen');
    terminarBtn.dataset.id = examen._id;

    // Configurar el modal para no cerrarse
    const responderModalElement = document.getElementById('ModalResponder');
    responderModalElement.addEventListener('hidden.bs.modal', (e) => {
        e.preventDefault();
        e.stopPropagation();
    });

    const responderModal = new mdb.Modal(responderModalElement, {
        backdrop: 'static', // Evitar cierre al hacer clic fuera
        keyboard: false    // Evitar cierre con "Escape"
    });
    responderModal.show();
}

// Evento para manejar el clic en "Terminar Examen"
document.getElementById('terminarExamen').addEventListener('click', async function () {
    const examenId = this.dataset.id; // Obtener el ID del examen
    const respuestas = [];

    // Recopilar respuestas del usuario
    document.querySelectorAll('#preguntasExamen > div').forEach((preguntaDiv, index) => {
        const seleccionada = preguntaDiv.querySelector(`input[name="pregunta_${index}"]:checked`);
        let preguntaTexto = preguntaDiv.querySelector('h6').innerText;

        // Remover numeración de la pregunta usando expresión regular
        preguntaTexto = preguntaTexto.replace(/^\d+\.\s*/, '');

        respuestas.push({
            pregunta: preguntaTexto,
            respuesta: seleccionada ? parseInt(seleccionada.value) : null
        });
    });

    // Validar que todas las preguntas tengan una respuesta
    if (respuestas.some((r) => r.respuesta === null)) {
        Swal.fire({
            icon: 'warning',
            title: 'Faltan respuestas',
            text: 'Por favor responde todas las preguntas antes de terminar.'
        });
        return;
    }

    // Confirmación para terminar el examen
    Swal.fire({
        title: '¿Estás seguro de terminar el examen?',
        text: 'No podrás cambiar tus respuestas después de enviarlo.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, terminar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            // Enviar las respuestas al backend
            const body = {
                usuarioId: infoUser._id, // Asumiendo que infoUser está cargado globalmente
                respuestas
            };

            try {
                const response = await fetch(`/api/examenes/${examenId}/responder`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                });

                const data = await response.json();

                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Examen terminado',
                    });

                    // Cerrar el modal y limpiar
                    const responderModal = mdb.Modal.getInstance(document.getElementById('ModalResponder'));
                    responderModal.hide();
                    document.getElementById('preguntasExamen').innerHTML = '';

                    // Actualizar la tabla
                    $('#tablaExamenes').DataTable().ajax.reload();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error || 'Ocurrió un error al enviar tus respuestas.'
                    });
                }
            } catch (error) {
                console.error('Error al enviar las respuestas:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo conectar con el servidor.'
                });
            }
        }
    });
});


