const urlGetKardex = '/api/kardex'; // Cambia esto a la URL de tu endpoint
const contenedorKardex = document.getElementById('kardexData');
let currentPageKardex = 1;
const itemsPerPageKardex = 30; // Ajusta según tus necesidades
const maxPageLinksKardex = 5;
let kardex = [];
let kardexShow = [];
let kardexFiltrados = []; // Nueva variable para almacenar kardex filtrado

// Mostrar los datos del Kardex
const mostrarKardex = (kardex, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    let resultadosKardex = '';

    kardex.slice(startIndex, endIndex).forEach((item) => {
        resultadosKardex += `
            <tr>
                <td class="text-center">${new Date(item.fecha).toLocaleDateString()}</td>
                <td class="text-center">${item.folio}</td>
                <td class="text-center">${item.usuario.username}</td>
                <td class="text-center">${item.movimiento}</td>
                <td class="text-center">${item.sucursal.nombre}</td>
                <td class="text-center">${item.reference}</td>
                <td class="text-center">${item.nombre}</td>
                <td class="text-center">${item.cantidad}</td>
                <td class="text-center">${item.existencia}</td>
                <td class="text-center">${item.costoUnitario}</td>
                <td class="text-center">
                    <button id="${item._id}" type="button" class="btn btn-primary btn-rounded btnEditKardex">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button id="${item._id}" type="button" class="btn btn-danger btn-rounded btnDeleteKardex">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>`;
    });

    contenedorKardex.innerHTML = resultadosKardex;
};

// Actualizar los controles de paginación
function actualizarControlesPaginacionKardex() {
    const botonAnterior = document.querySelector('#anteriorKardex');
    const botonSiguiente = document.querySelector('#siguienteKardex');

    if (botonAnterior && botonSiguiente) {
        botonAnterior.disabled = currentPageKardex === 1;
        botonSiguiente.disabled = currentPageKardex === Math.ceil(kardex.length / itemsPerPageKardex);
    }
}

// Generar los números de página
function generarNumerosDePaginaKardex() {
    const paginacionContainer = document.getElementById('paginationKardex');

    if (paginacionContainer) {
        const numeroTotalPaginas = Math.ceil(kardex.length / itemsPerPageKardex);

        let paginacionHTML = '';

        let startPage = Math.max(1, currentPageKardex - Math.floor(maxPageLinksKardex / 2));
        let endPage = Math.min(numeroTotalPaginas, startPage + maxPageLinksKardex - 1);

        if (startPage > 1) {
            paginacionHTML += '<li class="page-item"><a class="page-link" href="#" onclick="cambiarPaginaKardex(1)">1</a></li>';
            if (startPage > 2) {
                paginacionHTML += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginacionHTML += `<li class="page-item ${i === currentPageKardex ? 'active' : ''}"><a class="page-link" href="#" onclick="cambiarPaginaKardex(${i})">${i}</a></li>`;
        }

        if (endPage < numeroTotalPaginas) {
            if (endPage < numeroTotalPaginas - 1) {
                paginacionHTML += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
            paginacionHTML += `<li class="page-item"><a class="page-link" href="#" onclick="cambiarPaginaKardex(${numeroTotalPaginas})">${numeroTotalPaginas}</a></li>`;
        }

        paginacionContainer.innerHTML = paginacionHTML;
    }
}

function construirQueryString(params) {
    const queryString = new URLSearchParams(params).toString();
    return queryString;
}


// Función para formatear una fecha al estilo "YYYY-MM-DDTHH:mm:ssZ"
function formatearFechaISO(fecha) {
    const date = new Date(fecha);
    return date.toISOString();
}


// Cargar los datos del Kardex
function cargarKardex() {
    const fechaInicio = document.getElementById('fechaInicial').value;
    const fechaFinal = document.getElementById('fechaFinal').value;
    const fechaInicioISO = formatearFechaISO(fechaInicio);
    const fechaFinalISO = formatearFechaISO(fechaFinal);
    const parametros = {
        sucursal: document.getElementById('sucursal').value,
        fechaInicio: fechaInicioISO,
        fechaFinal: fechaFinalISO,
        reference: productoSeleccionado.reference
    };

    

    const queryString = construirQueryString(parametros);
    const urlConParametros = `${urlGetKardex}?${queryString}`;
    console.log(urlConParametros)
    fetch(urlConParametros, {
        method: 'GET', // Cambia a 'POST' si es necesario
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);

        }
        return response.json();

    })
    .then((data) => {
        if (!Array.isArray(data.data)) {
            console.error('Datos del Kardex no están en el formato esperado.');
            return;
        }
        console.log(data)
        kardexShow = data.data;
        kardex = data.data;
        mostrarKardex(kardex, currentPageKardex, itemsPerPageKardex);
        actualizarControlesPaginacionKardex();
        generarNumerosDePaginaKardex();
    })
    .catch((error) => console.error('Error al cargar Kardex:', error));
}

// Cambiar la página actual
function cambiarPaginaKardex(page) {
    if (page > 0 && page <= Math.ceil(kardex.length / itemsPerPageKardex)) {
        currentPageKardex = page;
        mostrarKardex(kardex, currentPageKardex, itemsPerPageKardex);
        actualizarControlesPaginacionKardex();
        generarNumerosDePaginaKardex();
    }
}

/*
// Funcionalidad de búsqueda rápida
document.getElementById('busquedaKardexMain').addEventListener('input', function () {
    const searchText = this.value.toLowerCase();

    kardexFiltrados = kardex.filter((item) => {
        const nombre = item.nombre ? item.nombre.toLowerCase() : '';
        const referencia = item.reference ? item.reference.toLowerCase() : '';
        return nombre.includes(searchText) || referencia.includes(searchText);
    });

    currentPageKardex = 1; // Reinicia a la primera página
    mostrarKardex(kardexFiltrados, currentPageKardex, itemsPerPageKardex);
    actualizarControlesPaginacionKardex();
    generarNumerosDePaginaKardex();
});
*/

// Asignar evento al botón
document.getElementById('btnCargarKardex').addEventListener('click', cargarKardex);

// Cargar Kardex al iniciar
// Puedes comentar esta línea si no quieres que se cargue al inicio
// cargarKardex(); 
