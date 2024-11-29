const selectOptions = [
    {url: '/api/sucursal', selectId: 'sucursalSelect'}
];

async function loadSelectOptions(options) {
    try {
        // Función para cargar opciones en un select específico
        const loadOptions = async (url, selectId) => {
            const select = document.getElementById(selectId);

            // Realiza una solicitud GET a la API
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error al obtener los datos de ${selectId}`);
            }

            // Convierte la respuesta en JSON
            const data = await response.json();

            // Limpia las opciones existentes
            select.innerHTML = '';

            // Agrega una opción predeterminada (opcional)
            const defaultOption = document.createElement('option');
            defaultOption.textContent = `Selecciona una sucursal`;
            defaultOption.value = '';
            select.appendChild(defaultOption);

            // Agrega una opción para cada ítem
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item._id; // Usa el id del item como valor
                option.textContent = item.nombre; // Usa el nombre del item como texto
                select.appendChild(option);
            });
        };

        // Recorre las opciones y carga cada select
        for (const option of options) {
            await loadOptions(option.url, option.selectId);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

loadSelectOptions(selectOptions);


function validarFormulario() {
        const sucursalId = document.getElementById('sucursalSelect').value;

        if (!sucursalId) {
            Swal.fire({
                icon: 'warning',
                title: 'Falta información',
                text: 'Por favor, seleccione un ID de sucursal.'
            });
            return false;
        }

        return true; // Validación exitosa
    }

    document.getElementById('submitEvaluacion').addEventListener('click', async () => {
        // Validar formulario antes de enviar
        if (!validarFormulario()) {
            return;
        }

        // Obtener los valores del formulario
        const data = {
            sucursalId: document.getElementById('sucursalSelect').value,
            evaluadorId: infoUser._id,
            fechaHora: new Date().toISOString(),
            ordenPisoVenta: parseInt(document.getElementById('ordenPisoVenta').value),
            limpiezaPisoVenta: parseInt(document.getElementById('limpiezaPisoVenta').value),
            ordenLimpiezaBodega: parseInt(document.getElementById('ordenLimpiezaBodega').value),
            ordenLimpiezaBaño: parseInt(document.getElementById('ordenLimpiezaBaño').value),
            ordenLimpiezaMostrador: parseInt(document.getElementById('ordenLimpiezaMostrador').value),
            limpiezaExterior: parseInt(document.getElementById('limpiezaExterior').value),
            frenteoMercancia: parseInt(document.getElementById('frenteoMercancia').value),
            limpiezaTambosGarrafas: parseInt(document.getElementById('limpiezaTambosGarrafas').value),
            uniformePresentacion: parseInt(document.getElementById('uniformePresentacion').value),
            musicaPantallas: parseInt(document.getElementById('musicaPantallas').value),
            capturaRecepcionFaltantes: parseInt(document.getElementById('capturaRecepcionFaltantes').value),
            etiquetadoBaston: parseInt(document.getElementById('etiquetadoBaston').value),
            quimicosBuenasCondicionesPreparado: parseInt(document.getElementById('quimicosBuenasCondicionesPreparado').value),
            preciadoresPromocionales: parseInt(document.getElementById('preciadoresPromocionales').value),
            codigosBarras: parseInt(document.getElementById('codigosBarras').value),
            peps: parseInt(document.getElementById('peps').value),
            segmentosPtsCalientesTorres: parseInt(document.getElementById('segmentosPtsCalientesTorres').value),
            boteEscobas: parseInt(document.getElementById('boteEscobas').value),
            arqueoMercancia: parseInt(document.getElementById('arqueoMercancia').value),
            arqueoEfectivo: parseInt(document.getElementById('arqueoEfectivo').value),
            asignarActividades: parseInt(document.getElementById('asignarActividades').value),
            recepcionCortes: parseInt(document.getElementById('recepcionCortes').value)
        };

        try {
            // Realizar la solicitud POST al backend
            const response = await fetch('/api/evaluaciones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Evaluación guardada exitosamente.'
                });
                document.getElementById('evaluacionForm').reset(); // Limpiar el formulario
            } else {
                const error = await response.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Error al guardar',
                    text: error.message || 'Hubo un problema al guardar la evaluación.'
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor. Intente nuevamente más tarde.'
            });
        }
    });