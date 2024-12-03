const selectOptions = [
    {url: '/api/sucursal', selectId: 'sucursalSelect'}
];

async function loadSelectOptions(options) {
    try {
        const loadOptions = async (url, selectId) => {
            const select = document.getElementById(selectId);

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error al obtener los datos de ${selectId}`);
            }

            const data = await response.json();

            select.innerHTML = '';

            const defaultOption = document.createElement('option');
            defaultOption.textContent = `Selecciona una sucursal`;
            defaultOption.value = '';
            select.appendChild(defaultOption);

            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item._id; // Usa el id del item como valor
                option.textContent = item.nombre; // Usa el nombre del item como texto
                select.appendChild(option);
            });
        };

        for (const option of options) {
            await loadOptions(option.url, option.selectId);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

loadSelectOptions(selectOptions);


document.addEventListener('click', async (event) => {
    const descargarBtn = event.target.closest('#descargarFormatosBtn');
    if (descargarBtn) {
        const sucursalSelect = document.getElementById('sucursalSelect');
        const sucursalId = sucursalSelect.value;

        if (!sucursalId) {
            Swal.fire({
                title: 'Error',
                text: 'Por favor, selecciona una sucursal antes de descargar.',
                icon: 'error',
                confirmButtonText: 'Ok',
            });
            return;
        }

        try {
            // Petición para descargar el archivo
            const response = await fetch(`/api/reporte/${sucursalId}`);

            if (!response.ok) {
                throw new Error('No se pudo descargar el reporte.');
            }

            // Crear un blob con el contenido recibido
            const blob = await response.blob();
            const urlBlob = URL.createObjectURL(blob);

            // Crear un enlace temporal para la descarga
            const a = document.createElement('a');
            a.href = urlBlob;
            a.download = `reporte_stocks_sucursal_${sucursalId}.csv`; // Nombre sugerido para el archivo
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // Liberar memoria
            URL.revokeObjectURL(urlBlob);
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudo descargar el formato.', 'error');
        }
    }
});

const archivoInput = document.getElementById('archivoInput');
    const tablaEncabezados = document.getElementById('tablaEncabezados');
    const tablaContenido = document.getElementById('tablaContenido').querySelector('tbody');
    const subirArchivosSection = document.getElementById('subirArchivosSection');
    const subirArchivosBtn = document.getElementById('subirFormatosBtn');
    const realizarCargaBtn = document.getElementById('realizarCargaBtn');
    const sucursalSelect = document.getElementById('sucursalSelect');
    const descargarFormatosBtn = document.getElementById('descargarFormatosBtn');
    const endpointBase = 'http://localhost:3000/api/actualizar/';
    const descargarEndpointBase = 'http://localhost:3000/api/reporte/';
    let archivoSeleccionado = null;
    let datosCargados = [];

    // Función para mostrar la sección para subir archivos
    subirArchivosBtn.addEventListener('click', () => {
        if (!sucursalSelect.value) {
            Swal.fire({
                title: 'Error',
                text: 'Por favor, selecciona una sucursal antes de continuar.',
                icon: 'error',
                confirmButtonText: 'Ok',
            });
            return;
        }
        subirArchivosSection.style.display = 'block';
    });

    // Función para descargar formatos
    descargarFormatosBtn.addEventListener('click', async () => {
        const sucursalId = sucursalSelect.value;
        if (!sucursalId) {
            Swal.fire({
                title: 'Error',
                text: 'Por favor, selecciona una sucursal antes de descargar.',
                icon: 'error',
                confirmButtonText: 'Ok',
            });
            return;
        }

        try {
            const response = await fetch(`${descargarEndpointBase}${sucursalId}`);
            if (!response.ok) {
                throw new Error('Error al descargar el formato.');
            }

            const blob = await response.blob();
            const urlBlob = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = urlBlob;
            a.download = `reporte_stocks_sucursal_${sucursalId}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(urlBlob);
        } catch (error) {
            console.error('Error al descargar formatos:', error);
            Swal.fire('Error', 'No se pudo descargar el formato. Inténtalo nuevamente.', 'error');
        }
    });

    // Función para leer y visualizar el archivo Excel
    archivoInput.addEventListener('change', (event) => {
        const archivo = event.target.files[0];
        if (!archivo) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            // Tomar la primera hoja
            const hojaNombre = workbook.SheetNames[0];
            const hoja = workbook.Sheets[hojaNombre];

            // Convertir a JSON
            const datos = XLSX.utils.sheet_to_json(hoja, { header: 1 });

            // Mostrar encabezados
            tablaEncabezados.innerHTML = '';
            if (datos.length > 0) {
                const encabezados = datos[0];
                const filaEncabezados = document.createElement('tr');
                encabezados.forEach((encabezado) => {
                    const th = document.createElement('th');
                    th.textContent = encabezado;
                    filaEncabezados.appendChild(th);
                });
                tablaEncabezados.appendChild(filaEncabezados);
            }

            // Mostrar datos
            tablaContenido.innerHTML = '';
            datosCargados = datos.slice(1); // Guardar los datos (excluyendo encabezados) para la carga
            datosCargados.forEach((fila) => {
                const filaTabla = document.createElement('tr');
                fila.forEach((celda) => {
                    const td = document.createElement('td');
                    td.textContent = celda;
                    filaTabla.appendChild(td);
                });
                tablaContenido.appendChild(filaTabla);
            });

            // Habilitar botón de carga
            realizarCargaBtn.disabled = datosCargados.length === 0;
            archivoSeleccionado = archivo;
        };

        reader.readAsArrayBuffer(archivo);
    });

    // Función para subir el archivo al servidor
    realizarCargaBtn.addEventListener('click', async () => {
        const sucursalId = sucursalSelect.value;
        if (!sucursalId) {
            Swal.fire({
                title: 'Error',
                text: 'Por favor, selecciona una sucursal válida.',
                icon: 'error',
                confirmButtonText: 'Ok',
            });
            return;
        }

        if (!archivoSeleccionado) {
            Swal.fire({
                title: 'Error',
                text: 'No se ha seleccionado un archivo para subir.',
                icon: 'error',
                confirmButtonText: 'Ok',
            });
            return;
        }

        // Mostrar overlay
        const spinnerOverlay = document.getElementById('spinnerOverlay');
        spinnerOverlay.style.display = 'flex';

        try {
            const formData = new FormData();
            formData.append('file', archivoSeleccionado);

            const response = await fetch(`${endpointBase}${sucursalId}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Error al cargar el archivo.');
            }

            const resultado = await response.text();
            Swal.fire('Éxito', resultado, 'success');

            // Limpiar la tabla y el input de archivo
            tablaEncabezados.innerHTML = '';
            tablaContenido.innerHTML = '';
            archivoInput.value = '';
            realizarCargaBtn.disabled = true;
            subirArchivosSection.style.display = 'none';
        } catch (error) {
            console.error('Error al cargar archivo:', error);
            Swal.fire('Error', 'No se pudo cargar el archivo. Inténtalo nuevamente.', 'error');
        } finally {
            // Ocultar overlay
            spinnerOverlay.style.display = 'none';
        }
    });

    document.addEventListener('DOMContentLoaded', () => {
        const spinnerOverlay = document.getElementById('spinnerOverlay');
        spinnerOverlay.style.display = 'none'; // Asegurar que el spinner esté oculto al cargar la página
    });
