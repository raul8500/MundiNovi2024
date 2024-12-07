const preguntas = [];
const examenModal = new mdb.Modal(document.getElementById('ModalExamenes'));

// Configuración de la tabla de exámenes
$('#tablaExamenes').DataTable({
    ajax: {
        url: '/api/examenes',
        dataSrc: ''
    },
    columns: [
        { data: 'titulo', title: 'Título' },
        { data: 'descripcion', title: 'Descripción' },
        {
            data: 'activo',
            title: 'Estado',
            render: (data) => data
                ? '<span class="badge bg-success">Activo</span>'
                : '<span class="badge bg-danger">Inactivo</span>'
        },
        {
            data: null,
            title: 'Acciones',
            render: (data, type, row) => `
                <button class="btn btn-primary btn-sm btn-ver" data-id="${row._id}" title="Ver">
                    <i class="fa-solid fa-question"></i>
                </button>
                <button class="btn btn-${row.activo ? 'danger' : 'success'} btn-sm btn-estado" 
                        data-id="${row._id}" title="${row.activo ? 'Desactivar' : 'Activar'}">
                    <i class="fa-solid ${row.activo ? 'fa-toggle-off' : 'fa-toggle-on'}"></i>
                </button>
                <button class="btn btn-secondary btn-sm btn-editar" data-id="${row._id}" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm btn-eliminar" data-id="${row._id}" title="Eliminar">
                    <i class="fas fa-trash-alt"></i>
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

$(document).on('click', '.btn-ver', async function () {
    const examenId = $(this).data('id'); // Obtener el ID del examen

    try {
        // Obtener las respuestas desde el backend
        const response = await fetch(`/api/respuestas/${examenId}`);
        const respuestas = await response.json();

        if (response.ok) {
            // Llenar el select con los usuarios que respondieron
            const usuarioSelect = document.getElementById('usuarioSelect');
            usuarioSelect.innerHTML = '<option value="">Seleccionar usuario</option>';
            respuestas.forEach((respuesta) => {
                usuarioSelect.innerHTML += `
                    <option value="${respuesta.usuarioId._id}">
                        ${respuesta.usuarioId.name}
                    </option>`;
            });

            // Mostrar el modal
            const respuestasModal = new mdb.Modal(document.getElementById('ModalRespuestas'));
            respuestasModal.show();

            // Manejar la selección de usuario
            usuarioSelect.addEventListener('change', () => {
                const usuarioId = usuarioSelect.value;
                if (usuarioId) {
                    const usuarioRespuesta = respuestas.find((r) => r.usuarioId._id === usuarioId);

                    // Mostrar respuestas del usuario seleccionado
                    mostrarRespuestasDeUsuario(usuarioRespuesta);
                } else {
                    document.getElementById('detalleRespuestas').innerHTML = ''; // Limpiar detalle si no hay selección
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: respuestas.error || 'No se pudo cargar las respuestas.'
            });
        }
    } catch (error) {
        console.error('Error al cargar respuestas:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo conectar con el servidor.'
        });
    }
});


function mostrarRespuestasDeUsuario(usuarioRespuesta) {
    const detalleRespuestas = document.getElementById('detalleRespuestas');

    detalleRespuestas.innerHTML = `
        <h5>Respuestas de: ${usuarioRespuesta.usuarioId.name}</h5>
        <p><strong>Calificación:</strong> ${usuarioRespuesta.calificacion}%</p>
        <ul>
            ${usuarioRespuesta.examenId.preguntas
                .map((pregunta, index) => {
                    const respuestaUsuario = usuarioRespuesta.respuestas.find(
                        (respuesta) => respuesta.pregunta === pregunta.pregunta
                    );

                    return `
                        <li>
                            <strong>Pregunta:</strong> ${pregunta.pregunta} <br>
                            <strong>Opciones:</strong>
                            <ul>
                                ${pregunta.opciones
                                    .map((opcion, i) => `
                                        <li>${opcion} ${
                                            i === pregunta.respuestaCorrecta ? '<b>(Correcta)</b>' : ''
                                        }</li>`)
                                    .join('')}
                            </ul>
                            <strong>Respuesta del Usuario:</strong> ${
                                respuestaUsuario
                                    ? pregunta.opciones[respuestaUsuario.respuesta]
                                    : '<i>No respondida</i>'
                            } <br>
                            <strong>Es Correcta:</strong> ${
                                respuestaUsuario
                                    ? (respuestaUsuario.correcta ? 'Sí' : 'No')
                                    : '<i>No respondida</i>'
                            }
                        </li>`;
                })
                .join('')}
        </ul>
    `;
}





// Evento para cambiar el estado de un examen
$(document).on('click', '.btn-estado', async function () {
    const button = $(this);
    const id = button.data('id'); // Obtener el ID del examen
    const isActive = button.hasClass('btn-success'); // Determinar el estado actual basado en la clase

    // Confirmación con SweetAlert2
    Swal.fire({
        title: `¿Estás seguro de ${isActive ? 'activar' : 'desactivar'} este examen?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                // Realizar la solicitud al backend
                const response = await fetch(`/api/examenes/${id}/estado`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ activo: isActive }) // Enviar el nuevo estado
                });

                if (response.ok) {
                    Swal.fire('Éxito', `El examen fue ${isActive ? 'activado' : 'desactivado'} correctamente.`, 'success');

                    // Cambiar la clase y el ícono del botón según el nuevo estado
                    button
                        .toggleClass('btn-success btn-danger')
                        .html(isActive
                            ? '<i class="fa-solid fa-toggle-off"></i>'
                            : '<i class="fa-solid fa-toggle-on"></i>'
                        );

                    // Recargar la tabla para actualizar los datos
                    $('#tablaExamenes').DataTable().ajax.reload();
                } else {
                    const data = await response.json();
                    Swal.fire('Error', data.error || 'No se pudo cambiar el estado del examen.', 'error');
                }
            } catch (error) {
                console.error('Error al cambiar el estado:', error);
                Swal.fire('Error', 'No se pudo conectar con el servidor.', 'error');
            }
        }
    });
});


// Función para renderizar preguntas en el modal
function renderizarPreguntas() {
    const listaPreguntas = document.getElementById('preguntasAgregadas');
    listaPreguntas.innerHTML = ''; // Limpiar lista visual

    preguntas.forEach((pregunta, index) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.setAttribute('id', `pregunta_${index}`); // Identificador único basado en el índice

        li.innerHTML = `
            <strong>${pregunta.pregunta}</strong>
            <ul>
                ${pregunta.opciones
                    .map((opcion, i) =>
                        i === pregunta.respuestaCorrecta
                            ? `<li><b>${opcion} (Correcta)</b></li>`
                            : `<li>${opcion}</li>`
                    )
                    .join('')}
            </ul>
            <div class="d-flex justify-content-end gap-2">
                <button class="btn btn-secondary btn-sm subirPregunta" data-index="${index}" ${index === 0 ? 'disabled' : ''}>Subir</button>
                <button class="btn btn-secondary btn-sm bajarPregunta" data-index="${index}" ${index === preguntas.length - 1 ? 'disabled' : ''}>Bajar</button>
                <button class="btn btn-primary btn-sm editarPregunta" data-index="${index}">Editar</button>
                <button class="btn btn-danger btn-sm eliminarPregunta" data-index="${index}">Eliminar</button>
            </div>
        `;
        listaPreguntas.appendChild(li);
    });
}

// Evento para abrir el modal de agregar examen
document.getElementById('btnAñadirExamen').addEventListener('click', () => {
    document.getElementById('formExamenes').reset();
    document.getElementById('preguntasAgregadas').innerHTML = '';
    preguntas.length = 0;
    document.getElementById('guardarExamen').removeAttribute('data-id');
    examenModal.show();
});

// Evento para editar examen
$(document).on('click', '.btn-editar', async function () {
    const id = $(this).data('id');

    try {
        const response = await fetch(`/api/examenes/${id}`);
        const examen = await response.json();

        // Cargar datos principales del examen en el formulario
        document.getElementById('nombreExamen').value = examen.titulo;
        document.getElementById('descripcionExamen').value = examen.descripcion;

        const tiposPermitidos = document.getElementById('tiposPermitidos');
        Array.from(tiposPermitidos.options).forEach(option => {
            option.selected = examen.tiposPermitidos.includes(parseInt(option.value));
        });

        // Cargar preguntas
        preguntas.length = 0;
        examen.preguntas.forEach((pregunta) => preguntas.push({ ...pregunta }));

        // Renderizar preguntas
        renderizarPreguntas();

        // Configurar el botón de guardar
        document.getElementById('guardarExamen').setAttribute('data-id', id);

        // Mostrar el modal
        examenModal.show();
    } catch (error) {
        console.error('Error al cargar el examen:', error);
        Swal.fire('Error', 'No se pudo cargar la información del examen seleccionado.', 'error');
    }
});

// Manejo de preguntas
document.getElementById('agregarPregunta').addEventListener('click', () => {
    const preguntaTexto = document.getElementById('preguntaTexto').value.trim();
    const opciones = Array.from(document.querySelectorAll('.opcion')).map((input) => input.value.trim());
    const respuestaCorrecta = parseInt(document.getElementById('respuestaCorrecta').value);

    if (!preguntaTexto || opciones.some((opcion) => !opcion)) {
        Swal.fire('Error', 'Completa todos los campos antes de agregar o actualizar la pregunta.', 'error');
        return;
    }

    const preguntaIndex = document.getElementById('agregarPregunta').getAttribute('data-index');
    if (preguntaIndex !== null && preguntaIndex !== '') {
        preguntas[parseInt(preguntaIndex)] = { pregunta: preguntaTexto, opciones, respuestaCorrecta };
        document.getElementById('agregarPregunta').removeAttribute('data-index');
    } else {
        preguntas.push({ pregunta: preguntaTexto, opciones, respuestaCorrecta });
    }

    document.getElementById('preguntaTexto').value = '';
    document.querySelectorAll('.opcion').forEach((input) => (input.value = ''));
    document.getElementById('respuestaCorrecta').value = '0';
    renderizarPreguntas();
});

// Subir y bajar preguntas
document.getElementById('preguntasAgregadas').addEventListener('click', (e) => {
    const index = parseInt(e.target.getAttribute('data-index'));

    if (e.target.classList.contains('subirPregunta') && index > 0) {
        [preguntas[index - 1], preguntas[index]] = [preguntas[index], preguntas[index - 1]];
        renderizarPreguntas();
    }

    if (e.target.classList.contains('bajarPregunta') && index < preguntas.length - 1) {
        [preguntas[index], preguntas[index + 1]] = [preguntas[index + 1], preguntas[index]];
        renderizarPreguntas();
    }
});

// Guardar examen
document.getElementById('guardarExamen').addEventListener('click', async () => {
    const titulo = document.getElementById('nombreExamen').value.trim();
    const descripcion = document.getElementById('descripcionExamen').value.trim();
    const tiposPermitidos = Array.from(document.getElementById('tiposPermitidos').selectedOptions).map((option) => parseInt(option.value));

    const esEdicion = !!document.getElementById('guardarExamen').dataset.id;
    const examenId = esEdicion ? document.getElementById('guardarExamen').dataset.id : null;

    const examen = { titulo, descripcion, tiposPermitidos, preguntas, creador: infoUser._id };

    try {
        const url = examenId ? `/api/examenes/${examenId}` : '/api/examenes';
        const method = examenId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(examen)
        });

        const data = await response.json();

        if (response.ok) {
            Swal.fire('Éxito', `El examen se ${esEdicion ? 'actualizó' : 'creó'} correctamente.`, 'success');
            $('#tablaExamenes').DataTable().ajax.reload();
            examenModal.hide();
            document.getElementById('formExamenes').reset();
            document.getElementById('preguntasAgregadas').innerHTML = '';
            preguntas.length = 0;
        } else {
            Swal.fire('Error', data.error || 'Error al guardar el examen.', 'error');
        }
    } catch (error) {
        console.error('Error al guardar el examen:', error);
        Swal.fire('Error', 'No se pudo conectar con el servidor.', 'error');
    }
});

// Eliminar preguntas
document.getElementById('preguntasAgregadas').addEventListener('click', (e) => {
    if (e.target.classList.contains('eliminarPregunta')) {
        const preguntaIndex = parseInt(e.target.getAttribute('data-index'));
        preguntas.splice(preguntaIndex, 1);
        renderizarPreguntas();
    }
});
// Editar preguntas
document.getElementById('preguntasAgregadas').addEventListener('click', (e) => {
    e.preventDefault(); // Evitar comportamiento predeterminado del evento

    if (e.target.classList.contains('editarPregunta')) {
        const preguntaIndex = parseInt(e.target.getAttribute('data-index')); // Obtener el índice de la pregunta
        const pregunta = preguntas[preguntaIndex]; // Acceder a la pregunta desde el array global

        if (pregunta) {
            // Rellenar el formulario con los datos de la pregunta seleccionada
            document.getElementById('preguntaTexto').value = pregunta.pregunta;

            const opcionesInputs = document.querySelectorAll('.opcion');
            pregunta.opciones.forEach((opcion, index) => {
                if (opcionesInputs[index]) {
                    opcionesInputs[index].value = opcion; // Cargar cada opción en los inputs
                }
            });

            document.getElementById('respuestaCorrecta').value = pregunta.respuestaCorrecta;

            // Asignar el índice de la pregunta al botón de agregar para actualizarla después
            document.getElementById('agregarPregunta').setAttribute('data-index', preguntaIndex);

            // Opcional: Desplazar el scroll hacia el formulario de preguntas
            document.getElementById('preguntaForm').scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Evento para eliminar examen
$(document).on('click', '.btn-eliminar', async function () {
    const id = $(this).data('id'); // Obtener el ID del examen a eliminar

    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esto eliminará el examen y sus respuestas asociadas. Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`/api/examenes/${id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    Swal.fire('Eliminado', 'El examen ha sido eliminado exitosamente.', 'success');
                    $('#tablaExamenes').DataTable().ajax.reload(); // Recargar la tabla de exámenes
                } else {
                    Swal.fire('Error', 'No se pudo eliminar el examen.', 'error');
                }
            } catch (error) {
                console.error('Error al eliminar el examen:', error);
                Swal.fire('Error', 'No se pudo conectar con el servidor.', 'error');
            }
        }
    });
});

