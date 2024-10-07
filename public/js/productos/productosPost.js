const btnGuardarProducto = document.getElementById('btnGuardarProducto')

function obtenerValores() {
    // Obtener valores del formulario general
    const clave = document.getElementById("clave")?.value || "";
    const nombre = document.getElementById("nombre")?.value || "";
    const codigoBarras = document.getElementById("codigoBarras")?.value || "";
    const claveSAT = document.getElementById("claveSAT")?.value || "";
    const descripcion = document.getElementById("descripcion")?.value || "";
    const fechaAlta = document.getElementById("fechaAlta")?.value || "";
    const estadoProducto = document.getElementById("estadoProducto")?.value || "";

    // Valores de los checkboxes (Kit y Grupo)
    const tipoKit = document.getElementById("tipoKit")?.checked || false;
    const tipoGrupo = document.getElementById("tipoGrupo")?.checked || false;

    // Select inputs
    const grupo = document.getElementById("grupo")?.value || "";
    const marca = document.getElementById("marca")?.value || "";
    const linea = document.getElementById("linea")?.value || "";
    const departamento = document.getElementById("departamento")?.value || "";
    const impuesto = document.getElementById("impuesto")?.value || "";
    const unidad = document.getElementById("unidad")?.value || "";

    // Textarea
    const observaciones = document.getElementById("observaciones")?.value || "";

    // Obtener los valores de precios, porcentajes, rangos y monederos
    const preciosIds = [
        'precio-1', 'precio-2', 'precio-3', 'precio-4', 'precio-5',
        'precio-6', 'precio-7', 'precio-8', 'precio-9', 'precio-10'
    ];

    const porcentajesIds = [
        'porcentaje-precio-1', 'porcentaje-precio-2', 'porcentaje-precio-3', 'porcentaje-precio-4', 'porcentaje-precio-5',
        'porcentaje-precio-6', 'porcentaje-precio-7', 'porcentaje-precio-8', 'porcentaje-precio-9', 'porcentaje-precio-10'
    ];

    const rangosInicialesIds = [
        'rango-inicial-1', 'rango-inicial-2', 'rango-inicial-3', 'rango-inicial-4', 'rango-inicial-5',
        'rango-inicial-6', 'rango-inicial-7', 'rango-inicial-8', 'rango-inicial-9', 'rango-inicial-10'
    ];

    const rangosFinalesIds = [
        'rango-final-1', 'rango-final-2', 'rango-final-3', 'rango-final-4', 'rango-final-5',
        'rango-final-6', 'rango-final-7', 'rango-final-8', 'rango-final-9', 'rango-final-10'
    ];

    const monederosIds = [
        'porcentaje-monedero-1', 'porcentaje-monedero-2', 'porcentaje-monedero-3', 'porcentaje-monedero-4',
        'porcentaje-monedero-5', 'porcentaje-monedero-6', 'porcentaje-monedero-7', 'porcentaje-monedero-8',
        'porcentaje-monedero-9', 'porcentaje-monedero-10'
    ];

    // Validar y obtener los valores de precios, porcentajes, rangos y monederos
    const precios = preciosIds.map(id => document.getElementById(id)?.value || "");
    const porcentajes = porcentajesIds.map(id => document.getElementById(id)?.value || "");
    const rangosIniciales = rangosInicialesIds.map(id => document.getElementById(id)?.value || "");
    const rangosFinales = rangosFinalesIds.map(id => document.getElementById(id)?.value || "");
    const monederos = monederosIds.map(id => document.getElementById(id)?.value || "");

    // Crear objeto con los valores obtenidos
    const datosFormulario = {
        clave,
        nombre,
        codigoBarras,
        claveSAT,
        descripcion,
        fechaAlta,
        estadoProducto,
        tipoKit,
        tipoGrupo,
        grupo,
        marca,
        linea,
        departamento,
        impuesto,
        unidad,
        observaciones,
        precios,
        porcentajes,
        rangos: {
            iniciales: rangosIniciales,
            finales: rangosFinales
        },
        monederos
    };

    console.log(datosFormulario);
    return datosFormulario;
}


btnGuardarProducto.addEventListener('click', () => {
    const datos = obtenerValores();
    console.log(datos);

    //pendiente
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