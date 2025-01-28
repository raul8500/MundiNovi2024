document.addEventListener('DOMContentLoaded', () => {
    const selectSucursal = document.getElementById('selectSucursal');
    const fechaInicio = document.getElementById('fechaInicio');
    const fechaFin = document.getElementById('fechaFin');
    const limiteProductos = document.getElementById('limiteProductos');
    const btnCargar = document.getElementById('btnCargar');
    const tablaProductos = document.getElementById('tablaProductos');

    // Configuración para cargar opciones de sucursales
    const selectOptions = [
        { url: '/api/sucursal', selectId: 'selectSucursal' }
    ];

    // Función para cargar sucursales
    const loadSelectOptions = async (options) => {
        try {
            const loadOptions = async (url, selectId) => {
                const select = document.getElementById(selectId);

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Error al obtener los datos de ${selectId}`);
                }

                const data = await response.json();
                select.innerHTML = '';

                // Opción predeterminada
                const defaultOption = document.createElement('option');
                defaultOption.textContent = 'Selecciona una sucursal';
                defaultOption.value = '';
                select.appendChild(defaultOption);

                // Cargar las sucursales
                data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item._id;
                    option.textContent = item.nombre;
                    select.appendChild(option);
                });
            };

            for (const option of options) {
                await loadOptions(option.url, option.selectId);
            }
        } catch (error) {
            console.error('Error al cargar sucursales:', error);
        }
    };

    // Cargar el reporte de productos vendidos
    const cargarReporte = async () => {
        try {
            if (!selectSucursal.value || !fechaInicio.value || !fechaFin.value) {
                alert('Por favor, completa todos los campos.');
                return;
            }

            const sucursal = selectSucursal.value;
            const inicio = fechaInicio.value;
            const fin = fechaFin.value;

            // Interpretar el límite: si es 0, mandamos vacío para traer todos
            let limite = parseInt(limiteProductos.value, 10);
            limite = isNaN(limite) || limite <= 0 ? 0 : limite;

            const url = `/api/venta/reporteVentasProductosSucursal/${sucursal}/${inicio}/${fin}/${limite}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.error) {
                alert(`Error: ${data.error}`);
                return;
            }

            tablaProductos.innerHTML = '';

            data.data.forEach(producto => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${producto.clave}</td>
                    <td>${producto.cantidad}</td>
                    <td>${producto.nombre}</td>
                `;
                tablaProductos.appendChild(row);
            });
        } catch (error) {
            console.error('Error al cargar el reporte:', error);
        }
    };

    // Inicializar
    loadSelectOptions(selectOptions);
    btnCargar.addEventListener('click', cargarReporte);
});
