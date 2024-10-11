const btnGuardarProducto = document.getElementById('btnGuardarProducto')

function obtenerDatosPills() {
    // Objeto donde almacenaremos todos los datos
    const datos = {
        generales: {},
        datosFinancieros: {},
        productosAdicionales: [],
        productosKit: [],
        productosGrupo: [],
        productosComplementarios: [],
        proveedoresSeleccionados: []  // Agregar este campo para los proveedores seleccionados
    };

    // Obtener datos de la pestaña "Datos Generales"
    datos.generales = {
        clave: document.getElementById('clave').value,
        nombre: document.getElementById('nombre').value,
        codigoBarras: document.getElementById('codigoBarras').value,
        claveSAT: document.getElementById('claveSAT').value,
        descripcion: document.getElementById('descripcion').value,
        fechaAlta: document.getElementById('fechaAlta').value,
        estadoProducto: document.getElementById('estadoProducto').value,
        tipoKit: document.getElementById('tipoKit').checked,
        tipoGrupo: document.getElementById('tipoGrupo').checked,
        grupo: document.getElementById('grupo').value,
        marca: document.getElementById('marca').value,
        linea: document.getElementById('linea').value,
        departamento: document.getElementById('departamento').value,
        impuesto: document.getElementById('impuesto').value,
        unidad: document.getElementById('unidad').value,
        observaciones: document.getElementById('observaciones').value
    };

    // Obtener datos de la pestaña "Datos Financieros"
    datos.datosFinancieros = {
        tiempoSurtido: document.getElementById('tiempo-surtido').value,
        volumen: document.getElementById('volumen').value,
        peso: document.getElementById('peso').value,
        stockMinimo: document.getElementById('stock-minimo').value,
        stockMaximo: document.getElementById('stock-maximo').value,
        costo: document.getElementById('costo').value,
        ultimoCosto: document.getElementById('ultimo-costo').value,
        costoPromedio: document.getElementById('costo-promedio').value,
        numPrecioMinimo: document.getElementById('num-precio-minimo').value,
        numPrecioMaximo: document.getElementById('num-precio-maximo').value,
        presentacion: document.getElementById('presentacion').value,
        porcentajePrecio1: document.getElementById('porcentaje-precio-1').value,
        precio1: document.getElementById('precio-1').value,
        porcentajePrecio2: document.getElementById('porcentaje-precio-2').value,
        precio2: document.getElementById('precio-2').value,
        porcentajePrecio3: document.getElementById('porcentaje-precio-3').value,
        precio3: document.getElementById('precio-3').value,
        porcentajePrecio4: document.getElementById('porcentaje-precio-4').value,
        precio4: document.getElementById('precio-4').value,
        porcentajePrecio5: document.getElementById('porcentaje-precio-5').value,
        precio5: document.getElementById('precio-5').value,
        porcentajePrecio6: document.getElementById('porcentaje-precio-6').value,
        precio6: document.getElementById('precio-6').value,
        porcentajePrecio7: document.getElementById('porcentaje-precio-7').value,
        precio7: document.getElementById('precio-7').value,
        porcentajePrecio8: document.getElementById('porcentaje-precio-8').value,
        precio8: document.getElementById('precio-8').value,
        porcentajePrecio9: document.getElementById('porcentaje-precio-9').value,
        precio9: document.getElementById('precio-9').value,
        porcentajePrecio10: document.getElementById('porcentaje-precio-10').value,
        precio10: document.getElementById('precio-10').value,

        //Rangos
        rangoInicial1: document.getElementById('rango-inicial-1').value,
        rangoFinal1: document.getElementById('rango-final-1').value,
        rangoInicial2: document.getElementById('rango-inicial-2').value,
        rangoFinal2: document.getElementById('rango-final-2').value,
        rangoInicial3: document.getElementById('rango-inicial-3').value,
        rangoFinal3: document.getElementById('rango-final-3').value,
        rangoInicial4: document.getElementById('rango-inicial-4').value,
        rangoFinal4: document.getElementById('rango-final-4').value,
        rangoInicial5: document.getElementById('rango-inicial-5').value,
        rangoFinal5: document.getElementById('rango-final-5').value,
        rangoInicial6: document.getElementById('rango-inicial-6').value,
        rangoFinal6: document.getElementById('rango-final-6').value,
        rangoInicial7: document.getElementById('rango-inicial-7').value,
        rangoFinal7: document.getElementById('rango-final-7').value,
        rangoInicial8: document.getElementById('rango-inicial-8').value,
        rangoFinal8: document.getElementById('rango-final-8').value,
        rangoInicial9: document.getElementById('rango-inicial-9').value,
        rangoFinal9: document.getElementById('rango-final-9').value,
        rangoInicial10: document.getElementById('rango-inicial-10').value,
        rangoFinal10: document.getElementById('rango-final-10').value,
        
        //Monederos
        porcentajeMonedero1: document.getElementById('porcentaje-monedero-1').value,
        porcentajeMonedero2: document.getElementById('porcentaje-monedero-2').value,
        porcentajeMonedero3: document.getElementById('porcentaje-monedero-3').value,
        porcentajeMonedero4: document.getElementById('porcentaje-monedero-4').value,
        porcentajeMonedero5: document.getElementById('porcentaje-monedero-5').value,
        porcentajeMonedero6: document.getElementById('porcentaje-monedero-6').value,
        porcentajeMonedero7: document.getElementById('porcentaje-monedero-7').value,
        porcentajeMonedero8: document.getElementById('porcentaje-monedero-8').value,
        porcentajeMonedero9: document.getElementById('porcentaje-monedero-9').value,
        porcentajeMonedero10: document.getElementById('porcentaje-monedero-10').value,
    };

    // Obtener proveedores seleccionados en la tabla
    const filasProveedores = document.querySelectorAll('#providerTable tbody tr');
    filasProveedores.forEach(fila => {
        const proveedorId = fila.getAttribute('data-id');  // Asume que el _id está en un atributo 'data-id'
        if (proveedorId) {
            datos.proveedoresSeleccionados.push(proveedorId);
        }
    });

    // Obtener productos adicionales seleccionados
    const filasAdicionales = document.querySelectorAll('#providerTableProductAditional tbody tr');
    filasAdicionales.forEach(fila => {
        const producto = {
            referencia: fila.cells[0].textContent,
            acciones: fila.cells[1].textContent
        };
        datos.productosAdicionales.push(producto);
    });

    // Obtener productos kit seleccionados
    const filasKit = document.querySelectorAll('#providerTableKit tbody tr');
    filasKit.forEach(fila => {
        const producto = {
            codigo: fila.cells[0].textContent,
            descripcion: fila.cells[1].textContent,
            cantidad: fila.cells[2].textContent,
            visible: fila.cells[3].querySelector('input').checked,
            sumable: fila.cells[4].querySelector('input').checked,
            costo: fila.cells[5].textContent,
            costoTotal: fila.cells[6].textContent
        };
        datos.productosKit.push(producto);
    });

    // Obtener productos grupo seleccionados
    const filasGrupo = document.querySelectorAll('#providerTableGroup tbody tr');
    filasGrupo.forEach(fila => {
        const producto = {
            referencia: fila.cells[0].textContent,
            acciones: fila.cells[1].textContent
        };
        datos.productosGrupo.push(producto);
    });

    // Obtener productos complementarios seleccionados
    const filasComplementarias = document.querySelectorAll('#providerTableComplementProducts tbody tr');
    filasComplementarias.forEach(fila => {
        const producto = {
            referencia: fila.cells[0].textContent,
            acciones: fila.cells[1].textContent
        };
        datos.productosComplementarios.push(producto);
    });

    // Devolver el objeto con toda la información
    return datos;
}

btnGuardarProducto.addEventListener('click', () => {
    const datos = obtenerDatosPills();

    fetch('/api/productos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            
            // Mostrar alerta de éxito con SweetAlert2
            Swal.fire({
                title: 'Éxito',
                text: 'Proveedor agregado correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                location.reload();
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

const selectOptions = [
    { url: '/api/grupos', selectId: 'grupo' },
    {url: '/api/marca', selectId: 'marca'},
    {url: '/api/linea', selectId: 'linea'},
    {url: '/api/departamento', selectId: 'departamento'},
    {url: '/api/unidad', selectId: 'unidad'},
    {url: '/api/impuesto', selectId: 'impuesto'}
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
            defaultOption.textContent = `Selecciona ${selectId}`;
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

loadSelectOptions(selectOptions)

function mostrarOcultarPills() {
        // Obtener los checkboxes
        const tipoKit = document.getElementById("tipoKit").checked;
        const tipoGrupo = document.getElementById("tipoGrupo").checked;

        // Obtener los pills
        const pillKit = document.getElementById("ex1-tab-6");
        const pillGrupo = document.getElementById("ex1-tab-7");

        // Mostrar/ocultar pill para Kit
        if (tipoKit) {
            pillKit.style.display = 'block';
        } else {
            pillKit.style.display = 'none';
        }

        // Mostrar/ocultar pill para Grupo
        if (tipoGrupo) {
            pillGrupo.style.display = 'block';
        } else {
            pillGrupo.style.display = 'none';
        }
}

// Inicializar ocultos al cargar la página
document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById("ex1-tab-6").style.display = 'none';
    document.getElementById("ex1-tab-7").style.display = 'none';
});

// Función para activar/desactivar los inputs de precio
function togglePrecios() {
    // Obtener el estado del checkbox
    const calcularPrecio = document.getElementById("calcular-precio").checked;

    // Lista de IDs de los inputs de precios
    const preciosIds = [
        'precio-1', 'precio-2', 'precio-3', 'precio-4', 'precio-5',
        'precio-6', 'precio-7', 'precio-8', 'precio-9', 'precio-10'
    ];


    // Activar o desactivar los inputs de precios y porcentajes
    preciosIds.forEach(function(id) {
        document.getElementById(id).disabled = !calcularPrecio;
    });
}
// Inicializar desactivados los inputs al cargar la página
document.addEventListener('DOMContentLoaded', (event) => {
    togglePrecios();
});


