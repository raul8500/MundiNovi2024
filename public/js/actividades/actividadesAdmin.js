document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    const ModalActividades = new mdb.Modal(document.getElementById('ModalActividades'));
    const ModalCrearActividades = new mdb.Modal(document.getElementById('ModalCrearActividad'));
    let actividadSeleccionadaId = null;
    let actividadSeleccionadaFecha = null;
    let actividadSeleccionadaEsPeriodica = false; // Nueva variable global para el estado periódico


    // Función para generar fechas periódicas en un rango específico
    function generarFechasPeriodicas(actividad, start, end) {
        const fechas = [];
        const inicio = new Date(start);
        const fin = new Date(end);

        if (actividad.periodicidad === 'diaria') {
            // Generar eventos diarios
            for (let d = new Date(inicio); d <= fin; d.setDate(d.getDate() + 1)) {
                const fechaISO = d.toISOString().split('T')[0];
                fechas.push(fechaISO);
            }
        } else if (actividad.periodicidad === 'semanal') {
            // Generar eventos semanales
            const diasSemanaNormalizados = actividad.diasSemana.map(dia =>
                dia.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
            );

            for (let d = new Date(inicio); d <= fin; d.setDate(d.getDate() + 1)) {
                const diaSemana = d.toLocaleDateString('es', { weekday: 'long' }).toLowerCase();
                if (diasSemanaNormalizados.includes(diaSemana)) {
                    const fechaISO = d.toISOString().split('T')[0];
                    fechas.push(fechaISO);
                }
            }
        } else if (actividad.periodicidad === 'mensual') {
            // Generar eventos mensuales
            for (let d = new Date(inicio); d <= fin; d.setDate(d.getDate() + 1)) {
                if (d.getDate() === actividad.diaMes) {
                    const fechaISO = d.toISOString().split('T')[0];
                    fechas.push(fechaISO);
                }
            }
        }

        return fechas;
    }

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
        },
        buttonText: {
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            list: 'Lista'
        },
        events: [], // Los eventos se cargarán dinámicamente
        datesSet: function (info) {
            obtenerActividadesPorRango(info.start, info.end);
        },
        eventClick: function (info) {
            actividadSeleccionadaId = info.event.id;
            actividadSeleccionadaFecha = info.event.start.toISOString().split('T')[0];
            actividadSeleccionadaEsPeriodica = info.event.extendedProps.esPeriodica || false; // Recuperar correctamente

            console.log('Actividad seleccionada ID:', actividadSeleccionadaId);
            console.log('Actividad seleccionada Fecha:', actividadSeleccionadaFecha);
            console.log('Actividad es periódica:', actividadSeleccionadaEsPeriodica);

            document.getElementById('titulo').textContent = info.event.title;
            document.getElementById('descripcion').textContent = info.event.extendedProps.description;
            document.getElementById('horaInicio').textContent = new Date(info.event.start).toLocaleTimeString('es');
            document.getElementById('horaFinal').textContent = new Date(info.event.end).toLocaleTimeString('es');
            document.getElementById('estado').textContent = info.event.extendedProps.estado ? 'Finalizada' : 'Pendiente';

            const usuariosTabla = document.getElementById('usuariosTabla');
            usuariosTabla.innerHTML = '';
            const usuarios = info.event.extendedProps.usuarios;
            if (usuarios && usuarios.length > 0) {
                usuarios.forEach(usuario => {
                    const fila = `
                        <tr class="text-center">
                            <td>${usuario.name}</td>
                            <td>${usuario.sucursalId?.nombre || 'Sin sucursal'}</td>
                        </tr>
                    `;
                    usuariosTabla.insertAdjacentHTML('beforeend', fila);
                });
            } else {
                usuariosTabla.innerHTML = '<tr><td colspan="2" class="text-center">No hay usuarios asignados</td></tr>';
            }

            ModalActividades.show();
        }

    });

    // Función para cargar actividades desde el backend
    async function obtenerActividadesPorRango(start, end) {
        try {
            const response = await fetch('/api/obtenerTodasLasActividades');
            const data = await response.json();

            const eventos = [];
            const rangoInicio = new Date(start).toISOString().split('T')[0];
            const rangoFin = new Date(end).toISOString().split('T')[0];

            data.actividades.forEach(actividad => {
                if (actividad.esPeriodica) {
                    const fechas = generarFechasPeriodicas(actividad, start, end);
                    fechas.forEach(fecha => {
                        if (actividad.excepciones.map(e => e.split('T')[0]).includes(fecha)) return;

                        const estado = actividad.estadosPorFecha?.[fecha] || false;

                        eventos.push({
                            id: actividad._id,
                            title: actividad.titulo,
                            start: `${fecha}T${actividad.horaInicio}`,
                            end: `${fecha}T${actividad.horaFinal}`,
                            description: actividad.descripcion,
                            extendedProps: {
                                estado,
                                esPeriodica: actividad.esPeriodica,
                                usuarios: actividad.usuariosAsignados,
                            },
                            color: estado ? '#28A745' : '#FF5733',
                        });
                    });
                } else {
                    // Normalizar la fecha de la actividad
                    const fechaActividad = new Date(actividad.fechaDesignada).toISOString().split('T')[0];

                    // Verificar que la fecha esté dentro del rango
                    if (fechaActividad >= rangoInicio && fechaActividad <= rangoFin) {
                        const estado = actividad.estadosPorFecha?.[fechaActividad] || actividad.finalizada;

                        eventos.push({
                            id: actividad._id,
                            title: actividad.titulo,
                            start: `${fechaActividad}T${actividad.horaInicio}`,
                            end: `${fechaActividad}T${actividad.horaFinal}`,
                            description: actividad.descripcion,
                            extendedProps: {
                                estado,
                                esPeriodica: actividad.esPeriodica,
                                usuarios: actividad.usuariosAsignados,
                            },
                            color: estado ? '#28A745' : '#FF5733',
                        });
                    }
                }
            });

            // Limpiar y agregar los eventos al calendario
            calendar.removeAllEvents();
            calendar.addEventSource(eventos);
        } catch (error) {
            console.error('Error al recuperar actividades:', error);
        }
    }



    // Renderizar el calendario
    calendar.render();


    document.getElementById('createActivityBtn').addEventListener('click', () => {
        ModalCrearActividades.show()
    });

    document.getElementById('btnFinalizarActividad').addEventListener('click', async () => {
        if (!actividadSeleccionadaId || !actividadSeleccionadaFecha) {
            console.error('No hay actividad seleccionada o no se encontró una fecha válida.');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No hay una actividad seleccionada para finalizar o falta información.',
            });
            return;
        }

        try {
            // Construir el cuerpo de la solicitud
            const requestBody = {
                fecha: actividadSeleccionadaFecha,
                estado: true
            };

            // Realizar la petición fetch
            const response = await fetch(`/api/marcarEstadoPorFecha/${actividadSeleccionadaId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Actividad finalizada con éxito:', result);

                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'La actividad se ha actualizado.',
                }).then(() => {
                    ModalActividades.hide()
                    // Recargar el calendario para reflejar los cambios
                    const calendarStart = calendar.view.activeStart;
                    const calendarEnd = calendar.view.activeEnd;
                    
                    // Limpiar eventos existentes
                    calendar.removeAllEvents();

                    // Volver a cargar las actividades
                    obtenerActividadesPorRango(calendarStart, calendarEnd);
                });

            } else {
                const error = await response.json();
                console.error('Error al finalizar la actividad:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo marcar la actividad como finalizada.',
                });
            }

        } catch (error) {
            console.error('Error al procesar la solicitud:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error inesperado',
                text: 'Ocurrió un error al intentar finalizar la actividad.',
            });
        }
    });

    document.getElementById('btnEliminarActividad').addEventListener('click', async () => {
        if (!actividadSeleccionadaId) {
            console.error('No hay actividad seleccionada para eliminar.');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No hay una actividad seleccionada para eliminar.',
            });
            return;
        }

        if (actividadSeleccionadaEsPeriodica) {
            const result = await Swal.fire({
                title: 'Eliminar actividad periódica',
                text: "¿Deseas eliminar esta ocurrencia o todas las actividades periódicas?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Eliminar esta ocurrencia',
                cancelButtonText: 'Eliminar todas',
                showDenyButton: true,
                denyButtonText: 'Cancelar',
            });

            if (result.isConfirmed) {
                await excluirDiaEspecifico();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                await eliminarActividadCompleta();
            }
        } else {
            await eliminarActividadCompleta();
        }
    });

    // Función para excluir un día específico de una actividad periódica
    async function excluirDiaEspecifico() {
        try {
            const requestBody = {
                fecha: actividadSeleccionadaFecha,
            };
            const response = await fetch(`/api/excluirDiaEspecifico/${actividadSeleccionadaId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Día excluido con éxito:', result);
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'El día de la actividad se ha eliminado con éxito.',
                }).then(() => {
                    ModalActividades.hide()
                    const calendarStart = calendar.view.activeStart;
                    const calendarEnd = calendar.view.activeEnd;
                    obtenerActividadesPorRango(calendarStart, calendarEnd);
                });
            } else {
                const error = await response.json();
                console.error('Error al excluir día:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo excluir el día de la actividad.',
                });
            }
        } catch (error) {
            console.error('Error al procesar la exclusión del día:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error inesperado',
                text: 'Ocurrió un error al intentar excluir el día.',
            });
        }
    }

    // Función para eliminar una actividad completa
    async function eliminarActividadCompleta() {
        try {
            const response = await fetch(`/api/eliminarActividad/${actividadSeleccionadaId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Actividad eliminada con éxito:', result);
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'La actividad se ha eliminado con éxito.',
                }).then(() => {
                    ModalActividades.hide()
                    const calendarStart = calendar.view.activeStart;
                    const calendarEnd = calendar.view.activeEnd;
                    obtenerActividadesPorRango(calendarStart, calendarEnd);
                });
            } else {
                const error = await response.json();
                console.error('Error al eliminar actividad:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo eliminar la actividad.',
                });
            }
        } catch (error) {
            console.error('Error al procesar la eliminación de la actividad:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error inesperado',
                text: 'Ocurrió un error al intentar eliminar la actividad.',
            });
        }
    }







    const esPeriodica = document.getElementById('esPeriodica');
    const periodicidadOptions = document.getElementById('periodicidadOptions');
    const tipoPeriodicidad = document.getElementById('tipoPeriodicidad');
    const opcionesPeriodicas = document.getElementById('opcionesPeriodicas');
    const opcionSemanal = document.getElementById('opcionSemanal');
    const opcionMensual = document.getElementById('opcionMensual');
    const fechaEspecifica = document.getElementById('fechaEspecifica');
    const diaMesSelect = document.getElementById('diaMes');

    // Generar opciones para días del mes (1-31)
    const generarDiasDelMes = () => {
        diaMesSelect.innerHTML = '<option value="" selected>Selecciona el día</option>';
        for (let i = 1; i <= 31; i++) {
            diaMesSelect.innerHTML += `<option value="${i}">${i}</option>`;
        }
    };

   // Mostrar/ocultar opciones según si es periódica
    esPeriodica.addEventListener('change', () => {
        if (esPeriodica.checked) {
            periodicidadOptions.style.display = 'block'; // Mostrar opciones de periodicidad
            fechaEspecifica.style.display = 'none'; // Ocultar fecha específica
        } else {
            periodicidadOptions.style.display = 'none'; // Ocultar opciones de periodicidad
            opcionesPeriodicas.style.display = 'none'; // Ocultar subopciones
            opcionSemanal.style.display = 'none'; // Ocultar días de la semana
            opcionMensual.style.display = 'none'; // Ocultar días del mes
            fechaEspecifica.style.display = 'block'; // Mostrar fecha específica
        }
    });

    // Cambiar comportamiento según el tipo de periodicidad seleccionada
    tipoPeriodicidad.addEventListener('change', () => {
        opcionesPeriodicas.style.display = 'block'; // Mostrar el contenedor de opciones
        opcionSemanal.style.display = tipoPeriodicidad.value === 'semanal' ? 'block' : 'none';
        opcionMensual.style.display = tipoPeriodicidad.value === 'mensual' ? 'block' : 'none';

        // Si es diaria, no despliega nada adicional
        if (tipoPeriodicidad.value === 'diaria') {
            opcionesPeriodicas.style.display = 'none';
        }
    });

    // Inicializar el select de días del mes
    generarDiasDelMes();

    const buscarUsuarioInput = document.getElementById('buscarUsuario');
    const sugerenciasUsuarios = document.getElementById('sugerenciasUsuarios');
    const tablaUsuariosSeleccionados = document.getElementById('tablaUsuariosSeleccionados');
    let usuariosCargados = []; // Usuarios ya seleccionados
    let usuariosFiltrados = []; // Usuarios que se muestran en las sugerencias
    let indiceSeleccionado = -1; // Índice del usuario seleccionado en las sugerencias

    // === Funciones de Usuarios ===

    // Función para buscar usuarios en la API y filtrar resultados
    const buscarUsuarios = async (query) => {
        try {
            const response = await fetch('/api/auth/users');
            if (!response.ok) throw new Error('Error al cargar usuarios');
            const usuarios = await response.json();

            // Filtrar usuarios por nombre o username
            usuariosFiltrados = usuarios.filter(usuario =>
                usuario.name.toLowerCase().includes(query.toLowerCase()) ||
                usuario.username.toLowerCase().includes(query.toLowerCase())
            );

            mostrarSugerencias(usuariosFiltrados);
        } catch (error) {
            console.error('Error al buscar usuarios:', error);
        }
    };

    // Función para mostrar las sugerencias debajo del input
    const mostrarSugerencias = (usuarios) => {
        sugerenciasUsuarios.innerHTML = ''; // Limpiar las sugerencias

        if (usuarios.length === 0) {
            sugerenciasUsuarios.style.display = 'none';
            return;
        }

        usuarios.forEach((usuario, index) => {
            const item = document.createElement('li');
            item.className = 'list-group-item list-group-item-action';
            item.textContent = `${usuario.name} (${usuario.username})`;
            item.dataset.index = index;

            // Evento para seleccionar el usuario con clic
            item.addEventListener('click', () => {
                agregarUsuarioSeleccionado(usuario._id, usuario.name, usuario.sucursalId?.nombre || 'Sin sucursal');
                sugerenciasUsuarios.style.display = 'none';
                buscarUsuarioInput.value = '';
                indiceSeleccionado = -1; // Reiniciar la selección
            });

            sugerenciasUsuarios.appendChild(item);
        });

        sugerenciasUsuarios.style.display = 'block';
    };

    const navegarSugerencias = (e) => {
        const items = sugerenciasUsuarios.querySelectorAll('li');
        if (sugerenciasUsuarios.style.display === 'none' || items.length === 0) return;

        if (e.key === 'ArrowDown') {
            indiceSeleccionado = (indiceSeleccionado + 1) % items.length;
            actualizarSeleccion(items);
        } else if (e.key === 'ArrowUp') {
            indiceSeleccionado = (indiceSeleccionado - 1 + items.length) % items.length;
            actualizarSeleccion(items);
        } else if (e.key === 'Enter' && indiceSeleccionado >= 0) {
            e.preventDefault(); // Prevenir el comportamiento por defecto de Enter
            const usuario = usuariosFiltrados[indiceSeleccionado];
            agregarUsuarioSeleccionado(usuario._id, usuario.name, usuario.sucursalId?.nombre || 'Sin sucursal');
            sugerenciasUsuarios.style.display = 'none';
            buscarUsuarioInput.value = '';
            indiceSeleccionado = -1; // Reiniciar la selección
        }
    };

    const actualizarSeleccion = (items) => {
        items.forEach((item, index) => {
            if (index === indiceSeleccionado) {
                item.classList.add('active');
                // Solo desplazar si está fuera del área visible
                if (!isElementInViewport(item)) {
                    item.scrollIntoView({ block: 'nearest' });
                }
            } else {
                item.classList.remove('active');
            }
        });
    };

    // Función para verificar si un elemento está dentro del área visible
    const isElementInViewport = (el) => {
        const rect = el.getBoundingClientRect();
        const parentRect = sugerenciasUsuarios.getBoundingClientRect();
        return (
            rect.top >= parentRect.top &&
            rect.bottom <= parentRect.bottom
        );
    };

   const agregarUsuarioSeleccionado = (id, name, sucursal) => {
    if (usuariosCargados.some(usuario => usuario.id === id)) {
        alert('El usuario ya está seleccionado.');
        return;
    }

    // Eliminar la fila de "No hay usuarios seleccionados" si existe
    const noUsuariosFila = document.querySelector('#tablaUsuariosSeleccionados .no-usuarios');
    if (noUsuariosFila) {
        noUsuariosFila.remove();
    }

    // Agregar el usuario al arreglo
    usuariosCargados.push({ id, name, sucursal });

    // Agregar la fila del usuario seleccionado
    const filaSeleccionada = `
        <tr>
            <td>${name}</td>
            <td>${sucursal}</td>
            <td>
                <button class="btn btn-sm btn-danger eliminar-usuario" data-id="${id}">Eliminar</button>
            </td>
        </tr>
    `;
    tablaUsuariosSeleccionados.innerHTML += filaSeleccionada;

    // Agregar evento al botón de eliminar
    document.querySelector(`.eliminar-usuario[data-id="${id}"]`).addEventListener('click', (e) => {
        eliminarUsuarioSeleccionado(e.target.dataset.id);
    });
    };

    const eliminarUsuarioSeleccionado = (id) => {
        // Filtrar el usuario eliminado del arreglo
        usuariosCargados = usuariosCargados.filter(usuario => usuario.id !== id);

        // Eliminar la fila de la tabla
        document.querySelector(`.eliminar-usuario[data-id="${id}"]`).closest('tr').remove();

        // Si no quedan usuarios seleccionados, mostrar la fila inicial
        if (usuariosCargados.length === 0) {
            tablaUsuariosSeleccionados.innerHTML = `
                <tr class="no-usuarios">
                    <td colspan="3" class="text-center">No hay usuarios seleccionados</td>
                </tr>
            `;
        }
    };

    // === Eventos ===

    // Buscar usuarios al escribir en el input
    buscarUsuarioInput.addEventListener('input', (e) => {
        const query = e.target.value;
        indiceSeleccionado = -1; // Reiniciar la selección

        if (query.trim() !== '') {
            buscarUsuarios(query);
        } else {
            sugerenciasUsuarios.style.display = 'none';
        }
    });

    // Manejar navegación con teclado
    buscarUsuarioInput.addEventListener('keydown', navegarSugerencias);

    // Cerrar las sugerencias si el input pierde el foco
    buscarUsuarioInput.addEventListener('blur', () => {
        setTimeout(() => {
            sugerenciasUsuarios.style.display = 'none';
        }, 200);
    });

    // Inicializar la tabla de usuarios seleccionados vacía
    tablaUsuariosSeleccionados.innerHTML = `
        <tr>

        </tr>
    `;

    document.getElementById('guardarActividad').addEventListener('click', async () => {
        try {
            // Obtener valores generales con validación
            const tituloInput = document.getElementById('tituloCrear');
            const descripcionInput = document.getElementById('descripcionCrear');
            const horaInicioInput = document.getElementById('horaInicioCrear');
            const horaFinalInput = document.getElementById('horaFinalCrear');
            const esPeriodicaInput = document.getElementById('esPeriodica');

            // Validar existencia de los elementos antes de acceder a sus valores
            const titulo = tituloInput?.value?.trim() || '';
            const descripcion = descripcionInput?.value?.trim() || '';
            const horaInicio = horaInicioInput?.value || '';
            const horaFinal = horaFinalInput?.value || '';
            const esPeriodica = esPeriodicaInput?.checked || false;

            // Validar si faltan valores obligatorios
            if (!titulo) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Faltan datos',
                    text: 'Por favor, completa el campo Título.',
                });
                return;
            }

            if (!horaInicio || !horaFinal) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Faltan datos',
                    text: 'Por favor, completa las horas de inicio y finalización.',
                });
                return;
            }

            // Obtener usuarios seleccionados
            const usuariosAsignados = usuariosCargados.map(usuario => usuario.id);

            // Variables para periodicidad
            let periodicidad = null;
            let diasSemana = [];
            let diaMes = null;
            let fechaDesignada = null;

            // Verificar si es periódica y determinar detalles
            if (esPeriodica) {
                const tipoPeriodicidadInput = document.getElementById('tipoPeriodicidad');
                periodicidad = tipoPeriodicidadInput?.value || null;

                if (periodicidad === 'semanal') {
                    const diasSemanaInput = document.getElementById('diasSemana');
                    diasSemana = diasSemanaInput?.value ? [diasSemanaInput.value] : [];
                } else if (periodicidad === 'mensual') {
                    const diaMesInput = document.getElementById('diaMes');
                    diaMes = diaMesInput?.value ? parseInt(diaMesInput.value, 10) : null;
                }
            } else {
                const fechaInput = document.getElementById('fecha');
                fechaDesignada = fechaInput?.value || null;
            }

            // Construir el objeto de datos
            const actividadData = {
                titulo,
                descripcion,
                horaInicio,
                horaFinal,
                esPeriodica,
                periodicidad,
                diasSemana,
                diaMes,
                fechaDesignada,
                usuariosAsignados,
            };

            // Mostrar en consola para revisión
            console.log('Datos de la actividad:', actividadData);

            // Realizar la petición fetch
            const response = await fetch('/api/crearActividad', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(actividadData),
            });

            // Manejar la respuesta
            if (response.ok) {
                const result = await response.json();
                console.log('Actividad guardada con éxito:', result);
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Actividad creada exitosamente.',
                }).then(() => {
                    // Cerrar el modal y reiniciar el formulario si es necesario
                    ModalCrearActividades.hide();
                    document.getElementById('formCrearActividad').reset();

                    // Recargar los datos del calendario
                    const calendarStart = calendar.view.activeStart;
                    const calendarEnd = calendar.view.activeEnd;
                    obtenerActividadesPorRango(calendarStart, calendarEnd);
                });
            } else {
                const error = await response.json();
                console.error('Error al guardar la actividad:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al guardar la actividad. Por favor, inténtalo nuevamente.',
                });
            }
        } catch (error) {
            console.error('Error al procesar la actividad:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error inesperado',
                text: 'Ocurrió un error inesperado. Por favor, inténtalo nuevamente.',
            });
        }
    });








});
