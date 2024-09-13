

const contenedorVentas = document.getElementById('ventasData');
let currentPageVentas = 1;
const itemsPerPageVentas = 30; // Ajusta según tus necesidades
const maxPageLinksVentas = 5;
let ventas = [];
let ventasShow = [];


let nombreCliente = ''

function cargarClienteNombre(id) {
    return fetch('/api/clientesNombre/' + id)
        .then((response) => response.json())
        .then((data) => {
            return data.cliente; // Asegúrate de que el campo sea 'nombre' en la respuesta
        })
        .catch((error) => {
            console.log(error);
            return 'Error al cargar nombre';
        });
}

// Mostrar los datos de ventas
const mostrarVentas = async (ventas, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    let resultadosVentas = '';

    // Procesar cada venta
    for (const item of ventas.slice(startIndex, endIndex)) {
        const tipoVentaBadge = item.tipoVenta === 'true'
        ? '<span class="badge bg-success rounded-pill d-inline">Con Factura</span>'
        : '<span class="badge bg-warning rounded-pill d-inline">Sin Factura</span>';


        // Cargar el nombre del cliente
        let nombreCliente = 'Público General'; // Valor por defecto

        if (item.cliente) {
            try {
                nombreCliente = await cargarClienteNombre(item.cliente);
            } catch (error) {
                console.log(error);
                nombreCliente = 'Error al cargar nombre';
            }
        }

        resultadosVentas += `
            <tr>
                <td class="text-center">${item.noVenta}</td>
                <td class="text-center">${tipoVentaBadge}</td>
                <td class="text-center">${nombreCliente}</td>
                <td class="text-center">$${item.totalVenta}</td>
                <td class="text-center">${item.formasDePago[0].tipo}</td>
                <td class="text-center">${new Date(item.fecha).toLocaleDateString()}</td>
                <td class="text-center">
                    <button id="${item._id}" type="button" class="btn btn-primary btn-rounded btnVerVenta" >
                        <i class="fa-solid fa-eye"></i>
                    </button>
                    <button id="${item._id}" type="button" class="btn btn-danger btn-rounded btnDeleteVenta" disabled>
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>`;
    }

    contenedorVentas.innerHTML = resultadosVentas;
};


// Actualizar los controles de paginación
function actualizarControlesPaginacionVentas() {
    const botonAnterior = document.querySelector('#anteriorVentas');
    const botonSiguiente = document.querySelector('#siguienteVentas');

    if (botonAnterior && botonSiguiente) {
        botonAnterior.disabled = currentPageVentas === 1;
        botonSiguiente.disabled = currentPageVentas === Math.ceil(ventas.length / itemsPerPageVentas);
    }
}

// Generar los números de página
function generarNumerosDePaginaVentas() {
    const paginacionContainer = document.getElementById('paginationVentas');

    if (paginacionContainer) {
        const numeroTotalPaginas = Math.ceil(ventas.length / itemsPerPageVentas);

        let paginacionHTML = '';

        let startPage = Math.max(1, currentPageVentas - Math.floor(maxPageLinksVentas / 2));
        let endPage = Math.min(numeroTotalPaginas, startPage + maxPageLinksVentas - 1);

        if (startPage > 1) {
            paginacionHTML += '<li class="page-item"><a class="page-link" href="#" onclick="cambiarPaginaVentas(1)">1</a></li>';
            if (startPage > 2) {
                paginacionHTML += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginacionHTML += `<li class="page-item ${i === currentPageVentas ? 'active' : ''}"><a class="page-link" href="#" onclick="cambiarPaginaVentas(${i})">${i}</a></li>`;
        }

        if (endPage < numeroTotalPaginas) {
            if (endPage < numeroTotalPaginas - 1) {
                paginacionHTML += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
            paginacionHTML += `<li class="page-item"><a class="page-link" href="#" onclick="cambiarPaginaVentas(${numeroTotalPaginas})">${numeroTotalPaginas}</a></li>`;
        }

        paginacionContainer.innerHTML = paginacionHTML;
    }
}

// Cambiar la página actual
function cambiarPaginaVentas(page) {
    if (page > 0 && page <= Math.ceil(ventas.length / itemsPerPageVentas)) {
        currentPageVentas = page;
        mostrarVentas(ventas, currentPageVentas, itemsPerPageVentas);
        actualizarControlesPaginacionVentas();
        generarNumerosDePaginaVentas();
    }
}


document.getElementById('btnCargarVenta').addEventListener('click', cargarVenta);

// Cargar los datos del Kardex
function cargarVenta() {
    let fechaInicio = document.getElementById('fechaInicial').value;
    let fechaFin = document.getElementById('fechaFinal').value;
    let sucursal = document.getElementById('sucursal').value;

    fechaInicio = convertirFecha(fechaInicio)
    fechaFin = convertirFecha(fechaFin)



    fetch(`/api/ventas/${sucursal}/${fechaInicio}/${fechaFin}`, {
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
        ventasShow = data.data;
        ventas = data.data;
        mostrarVentas(ventas, currentPageVentas, itemsPerPageVentas);
        actualizarControlesPaginacionVentas();
        generarNumerosDePaginaVentas();
    })
    .catch((error) => console.error('Error al cargar Kardex:', error));

}

function convertirFecha(fecha) {
    // Convertir la fecha en un objeto Date
    const [ano, mes, dia] = fecha.split('-');
    const fechaObj = new Date(ano, mes - 1, dia); // Mes es 0-indexado en Date
  
    // Obtener el mes, día y año
    const mesFormateado = String(fechaObj.getMonth() + 1).padStart(2, '0'); // Mes es 0-indexado
    const diaFormateado = String(fechaObj.getDate()).padStart(2, '0');
    const anoFormateado = fechaObj.getFullYear();
  
    // Formatear la fecha en mm/dd/aaaa
    return `${mesFormateado}-${diaFormateado}-${anoFormateado}`;
}
