document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    const ModalActividades = new mdb.Modal(document.getElementById('ModalActividades'));
    const ModalCrearActividades = new mdb.Modal(document.getElementById('ModalCrearActividad'));

    // Función para generar fechas periódicas en un rango específico
    function generarFechasPeriodicas(actividad, start, end) {
        const fechas = [];
        const inicio = new Date(start);
        const fin = new Date(end);

        // Función para eliminar acentos y normalizar cadenas
        const normalizeString = str => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

        if (actividad.periodicidad === 'diaria') {
            // Generar eventos diarios, excluyendo excepciones
            for (let d = new Date(inicio); d <= fin; d.setDate(d.getDate() + 1)) {
                const fechaISO = d.toISOString().split('T')[0];
                fechas.push(fechaISO);
            }
        } else if (actividad.periodicidad === 'semanal') {
            // Generar eventos semanales para los días indicados
            for (let d = new Date(inicio); d <= fin; d.setDate(d.getDate() + 1)) {
                const diaSemana = normalizeString(d.toLocaleDateString('es', { weekday: 'long' }));
                const fechaISO = d.toISOString().split('T')[0];
                const diasSemanaNormalizados = actividad.diasSemana.map(normalizeString);

                if (diasSemanaNormalizados.includes(diaSemana)) {
                    fechas.push(fechaISO);
                }
            }
        } else if (actividad.periodicidad === 'mensual') {
            // Generar eventos mensuales para el día del mes indicado
            for (let d = new Date(inicio); d <= fin; d.setDate(d.getDate() + 1)) {
                if (d.getDate() === actividad.diaMes) {
                    const fechaISO = d.toISOString().split('T')[0];
                    fechas.push(fechaISO);
                }
            }
        }

        return fechas;
    }

    // Configuración inicial del calendario
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        buttonText: {
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
            list: 'Lista'
        },
        events: [], // Los eventos se cargarán dinámicamente
        datesSet: function (info) {
            // Cargar eventos según el rango visible
            obtenerActividadesPorRango(info.start, info.end);
        },
        eventClick: function (info) {
            // Asignar información al modal
            document.getElementById('titulo').textContent = info.event.title;
            document.getElementById('descripcion').textContent = info.event.extendedProps.description;
            document.getElementById('horaInicio').textContent = new Date(info.event.start).toLocaleTimeString('es');
            document.getElementById('horaFinal').textContent = new Date(info.event.end).toLocaleTimeString('es');
            document.getElementById('estado').textContent = info.event.extendedProps.estado ? 'Finalizada' : 'Pendiente';

            // Llenar la tabla de usuarios
            const usuariosTabla = document.getElementById('usuariosTabla');
            usuariosTabla.innerHTML = ''; // Limpiar la tabla antes de añadir los nuevos usuarios
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

            // Mostrar modal
            ModalActividades.show();
        }
    });

    // Función para cargar actividades desde el backend
    async function obtenerActividadesPorRango(start, end) {
        try {
            const response = await fetch('/api/obtenerTodasLasActividades');
            const data = await response.json();

            // Procesar actividades para convertirlas en eventos
            const eventos = [];
            data.actividades.forEach(actividad => {
                if (actividad.esPeriodica) {
                    // Generar eventos según periodicidad dentro del rango visible
                    const fechas = generarFechasPeriodicas(actividad, start, end);
                    fechas.forEach(fecha => {
                        // Excluir fechas en excepciones
                        if (actividad.excepciones.map(e => e.split('T')[0]).includes(fecha)) return;

                        // Estado de la actividad para la fecha específica
                        const estado = actividad.estadosPorFecha?.[fecha] || false;

                        eventos.push({
                            title: actividad.titulo,
                            start: `${fecha}T${actividad.horaInicio}`, // Fecha y hora de inicio
                            end: `${fecha}T${actividad.horaFinal}`, // Fecha y hora de finalización
                            description: actividad.descripcion,
                            estado, // Añadir el estado al evento
                            usuarios: actividad.usuariosAsignados, // Añadir usuarios al evento
                            color: estado ? '#28A745' : '#FF5733' // Verde si está finalizada, naranja si no
                        });
                    });
                } else {
                    // Actividades no periódicas dentro del rango visible
                    const fechaActividad = new Date(actividad.fechaDesignada).toISOString().split('T')[0];
                    if (new Date(fechaActividad) >= new Date(start) && new Date(fechaActividad) <= new Date(end)) {
                        // Excluir si la fecha está en excepciones
                        if (actividad.excepciones.map(e => e.split('T')[0]).includes(fechaActividad)) return;

                        const estado = actividad.estadosPorFecha?.[fechaActividad] || actividad.finalizada;
                        eventos.push({
                            title: actividad.titulo,
                            start: `${fechaActividad}T${actividad.horaInicio}`, // Fecha y hora de inicio
                            end: `${fechaActividad}T${actividad.horaFinal}`, // Fecha y hora de finalización
                            description: actividad.descripcion,
                            estado, // Añadir el estado al evento
                            usuarios: actividad.usuariosAsignados, // Añadir usuarios al evento
                            color: estado ? '#28A745' : '#FF5733'
                        });
                    }
                }
            });

            // Limpiar eventos existentes y agregar los nuevos
            calendar.removeAllEvents();
            calendar.addEventSource(eventos);
        } catch (error) {
            console.error('Error al recuperar actividades:', error);
        }
    }

    // Renderizar el calendario inicial
    calendar.render();

    document.getElementById('createActivityBtn').addEventListener('click', () => {
        ModalCrearActividades.show()
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
