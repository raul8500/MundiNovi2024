document.addEventListener('DOMContentLoaded', async function () {
    const calendarEl = document.getElementById('calendar');
    const ModalActividades = new mdb.Modal(document.getElementById('ModalActividades'));
    const ModalReagendar = new mdb.Modal(document.getElementById('ModalReagendar'));

    let actividadSeleccionadaId = null;
    let actividadSeleccionadaFecha = null;
    let actividadSeleccionadaEsPeriodica = false; // Nueva variable global para el estado periódico
    let usuarioInfo = ''

    async function cargarUsuario() {
        try {
            const response = await fetch('/api/verifySesion');
            const data = await response.json();
            console.log('Usuario cargado:', data);
            usuarioInfo = data;
        } catch (error) {
            console.error('Error al cargar el usuario:', error);
        }
    }

    // Función para generar fechas periódicas en un rango específico
    function generarFechasPeriodicas(actividad, start, end) {
        const fechas = [];
        const inicio = new Date(start);
        const fin = new Date(end);

        if (actividad.periodicidad === 'diaria') {
            for (let d = new Date(inicio); d <= fin; d.setDate(d.getDate() + 1)) {
                const fechaISO = d.toISOString().split('T')[0];
                fechas.push(fechaISO);
            }
        } else if (actividad.periodicidad === 'semanal') {
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
            for (let d = new Date(inicio); d <= fin; d.setDate(d.getDate() + 1)) {
                if (d.getDate() === actividad.diaMes) {
                    const fechaISO = d.toISOString().split('T')[0];
                    fechas.push(fechaISO);
                }
            }
        }

        return fechas;
    }

    // Función para cargar actividades desde el backend
    async function obtenerActividadesPorRango(start, end) {
        try {
            if (!usuarioInfo || !usuarioInfo._id) {
                console.error('El usuario no está cargado o no tiene un ID válido.');
                return;
            }

            const response = await fetch(`/api/obtenerActividadesPorUsuario/${usuarioInfo._id}`);
            const data = await response.json();
            console.log('Actividades cargadas:', data);

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
                    // Lógica para actividades no periódicas
                    const fechaActividad = new Date(actividad.fechaDesignada).toISOString().split('T')[0];
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

            calendar.removeAllEvents();
            calendar.addEventSource(eventos);
        } catch (error) {
            console.error('Error al recuperar actividades:', error);
        }
    }


    // Cargar usuario y renderizar el calendario
    await cargarUsuario();

    if (!usuarioInfo || !usuarioInfo._id) {
        console.error('No se pudo cargar el usuario. Deteniendo la ejecución.');
        return;
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
        events: [],
        datesSet: async function (info) {
            await obtenerActividadesPorRango(info.start, info.end);
        },
        eventClick: function (info) {
            actividadSeleccionadaId = info.event.id;
            actividadSeleccionadaFecha = info.event.start.toISOString().split('T')[0];
            actividadSeleccionadaEsPeriodica = info.event.extendedProps.esPeriodica || false;

            console.log('Actividad seleccionada ID:', actividadSeleccionadaId);
            console.log('Actividad seleccionada Fecha:', actividadSeleccionadaFecha);
            console.log('Actividad es periódica:', actividadSeleccionadaEsPeriodica);

            document.getElementById('titulo').textContent = info.event.title;
            document.getElementById('descripcion').textContent = info.event.extendedProps.description;
            document.getElementById('horaInicio').textContent = new Date(info.event.start).toLocaleTimeString('es');
            document.getElementById('horaFinal').textContent = new Date(info.event.end).toLocaleTimeString('es');
            document.getElementById('estado').textContent = info.event.extendedProps.estado ? 'Finalizada' : 'Pendiente';

            // Obtener botones
            const btnFinalizarActividad = document.getElementById('btnFinalizarActividad');
            const btnReagendar = document.getElementById('btnReagendar');

            // Verificar si la actividad está finalizada o si ya pasó
            const hoy = new Date().toISOString().split('T')[0]; // Fecha actual en formato ISO
            const esPasada = actividadSeleccionadaFecha < hoy;
            const estaFinalizada = info.event.extendedProps.estado;

            // Lógica para desactivar/activar botones
            if (estaFinalizada || esPasada) {
                btnFinalizarActividad.disabled = true; // No se puede finalizar
            } else {
                btnFinalizarActividad.disabled = false; // Se puede finalizar
            }

            // El botón de reagendar siempre está habilitado si es una actividad pasada
            btnReagendar.disabled = !esPasada;

            // Cargar la tabla de usuarios asignados
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

    calendar.render();


    document.getElementById('btnReagendar').addEventListener('click', () => {
        // Abrir el modal para reagendar
        ModalActividades.hide();
        document.getElementById('reagendarFecha').value = actividadSeleccionadaFecha; // Fecha original por defecto
        document.getElementById('reagendarHoraInicio').value = '';
        document.getElementById('reagendarHoraFinal').value = '';
        ModalReagendar.show();
    });

    // Confirmar el reagendado
    document.getElementById('btnConfirmarReagendar').addEventListener('click', async () => {
        const nuevaFecha = document.getElementById('reagendarFecha').value;
        const horaInicio = document.getElementById('reagendarHoraInicio').value;
        const horaFinal = document.getElementById('reagendarHoraFinal').value;

        if (!nuevaFecha || !horaInicio || !horaFinal) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, completa todos los campos antes de reagendar.',
            });
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/reagendar/${actividadSeleccionadaId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nuevaFecha,
                    horaInicio,
                    horaFinal,
                    fechaOriginal: actividadSeleccionadaFecha
                }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Actividad reagendada con éxito:', result);

                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'La actividad se ha reagendado exitosamente.',
                }).then(() => {
                    ModalReagendar.hide();
                    calendar.removeAllEvents();
                    obtenerActividadesPorRango(calendar.view.activeStart, calendar.view.activeEnd);
                });
            } else {
                const error = await response.json();
                console.error('Error al reagendar la actividad:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo reagendar la actividad.',
                });
            }
        } catch (error) {
            console.error('Error al procesar el reagendado:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error inesperado',
                text: 'Ocurrió un error al intentar reagendar la actividad.',
            });
        }
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
});
