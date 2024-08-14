//API URL'S
const urlGetFranquicias = base + '/api/franquicia';
const urlPostFranquicia = base + '/api/franquicia/add';

//Variables
const modalSucursal = new mdb.Modal(document.getElementById('ModalAddFranquicia'))
const contenedorFranquicias = document.getElementById('franquiciasData');
let currentPageFranquicias = 1;
const itemsPerPageFranquicias = 5; // Puedes ajustar este número según tus necesidades
const maxPageLinksFranquicias = 5;
let franquicias = [];

//Funciones para mostrar datos
const mostrarFranquicias = (franquicias, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    let resultadosFranquicias = '';

    franquicias.slice(startIndex, endIndex).forEach(item => {
        resultadosFranquicias += `
            <tr>
                <td class="text-center">${item.nombre}</td>
                <td class="text-center">${item.encargado}</td>
                <td class="text-center">
                    <span class="badge ${item.permitirVenta ? 'badge-success' : 'badge-danger'} rounded-pill d-inline">
                        ${item.permitirVenta ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
                <td class="text-center">
                    <button id="${item._id}" type="button" class="btn btn-primary btn-rounded btnEdit">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button id="${item._id}" type="button" class="btn btn-danger btn-rounded btnDelete">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>`;
    });

    contenedorFranquicias.innerHTML = resultadosFranquicias;
};

function actualizarControlesPaginacionFranquicias() {
    const botonAnterior = document.querySelector('#anteriorFranquicias');
    const botonSiguiente = document.querySelector('#siguienteFranquicias');

    if (botonAnterior && botonSiguiente) {
        botonAnterior.disabled = currentPageFranquicias === 1;
        botonSiguiente.disabled = currentPageFranquicias === Math.ceil(franquicias.length / itemsPerPageFranquicias);
    }
}

function generarNumerosDePaginaFranquicias() {
    const paginacionContainer = document.getElementById('paginationFranquicias');

    if (paginacionContainer) {
        const numeroTotalPaginas = Math.ceil(franquicias.length / itemsPerPageFranquicias);

        let paginacionHTML = '';

        let startPage = Math.max(1, currentPageFranquicias - Math.floor(maxPageLinksFranquicias / 2));
        let endPage = Math.min(numeroTotalPaginas, startPage + maxPageLinksFranquicias - 1);

        if (startPage > 1) {
            paginacionHTML += '<li class="page-item"><a class="page-link" href="#" onclick="cambiarPaginaFranquicias(1)">1</a></li>';
            if (startPage > 2) {
                paginacionHTML += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginacionHTML += `<li class="page-item ${i === currentPageFranquicias ? 'active' : ''}"><a class="page-link" href="#" onclick="cambiarPaginaFranquicias(${i})">${i}</a></li>`;
        }

        if (endPage < numeroTotalPaginas) {
            if (endPage < numeroTotalPaginas - 1) {
                paginacionHTML += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
            paginacionHTML += `<li class="page-item"><a class="page-link" href="#" onclick="cambiarPaginaFranquicias(${numeroTotalPaginas})">${numeroTotalPaginas}</a></li>`;
        }

        paginacionContainer.innerHTML = paginacionHTML;
    }
}

function cargarFranquicias() {
    fetch(urlGetFranquicias)
        .then(response => response.json())
        .then(data => {
            franquicias = data;
            mostrarFranquicias(franquicias, currentPageFranquicias, itemsPerPageFranquicias);
            actualizarControlesPaginacionFranquicias();
            generarNumerosDePaginaFranquicias();
        })
        .catch(error => console.log(error));
}

function cambiarPaginaFranquicias(page) {
    if (page > 0 && page <= Math.ceil(franquicias.length / itemsPerPageFranquicias)) {
        currentPageFranquicias = page;
        mostrarFranquicias(franquicias, currentPageFranquicias, itemsPerPageFranquicias);
        actualizarControlesPaginacionFranquicias();
        generarNumerosDePaginaFranquicias();
    }
}

cargarFranquicias();





//Agregar franquicia logica
btnAddFranquicia.addEventListener('click', () => {
    // Restablecer todos los campos del formulario
    document.getElementById('fullname').value = ''
    document.getElementById('telefono').value = ''
    document.getElementById('sitioWeb').value = ''
    document.getElementById('encargado').value = ''
    document.getElementById('razonSocial').value = ''
    document.getElementById('tickteMensaje').value = ''
    document.getElementById('ventaBolean').value = ''

    for (let i = 1; i <= 10; i++) {
        document.getElementById(`porcentaje${i}`).value = ''
    }

    document.getElementById('propietario').value = ''
    document.getElementById('regimenFiscal').value = ''
    document.getElementById('direccionFiscal').value = ''
    document.getElementById('colonia').value = ''
    document.getElementById('ciudad').value = ''
    document.getElementById('codigoPostal').value = ''
    document.getElementById('rfc').value = ''
    document.getElementById('telefonoFiscal').value = ''
    document.getElementById('correoFacturacion').value = ''

    // Activar la primera pestaña (pill) de información general
    const pill1 = document.getElementById('ex1-tab-1');
    const pill2 = document.getElementById('ex1-tab-2');

    pill1.classList.add('active');
    pill2.classList.remove('active');

    const content1 = document.getElementById('ex1-pills-1');
    const content2 = document.getElementById('ex1-pills-2');

    content1.classList.add('show', 'active');
    content2.classList.remove('show', 'active');

    // Mostrar el modal
    modalSucursal.show();
});

function validarCamposNoVaciosPost() {
    const elementos = [
        document.getElementById('fullname'),
        document.getElementById('telefono'),
        document.getElementById('sitioWeb'),
        document.getElementById('encargado'),
        document.getElementById('razonSocial'),
        document.getElementById('tickteMensaje'),
        document.getElementById('ventaBolean'),
        document.getElementById('porcentaje1'),
        document.getElementById('porcentaje2'),
        document.getElementById('porcentaje3'),
        document.getElementById('porcentaje4'),
        document.getElementById('porcentaje5'),
        document.getElementById('porcentaje6'),
        document.getElementById('porcentaje7'),
        document.getElementById('porcentaje8'),
        document.getElementById('porcentaje9'),
        document.getElementById('porcentaje10'),
        document.getElementById('propietario'),
        document.getElementById('regimenFiscal'),
        document.getElementById('direccionFiscal'),
        document.getElementById('colonia'),
        document.getElementById('ciudad'),
        document.getElementById('codigoPostal'),
        document.getElementById('rfc'),
        document.getElementById('telefonoFiscal'),
        document.getElementById('correoFacturacion')
    ];

    let todosLlenos = true;

    elementos.forEach(elemento => {
        if (elemento.value.trim() === '') {
            elemento.classList.add('is-invalid');
            todosLlenos = false;
        } else {
            elemento.classList.remove('is-invalid');
            elemento.classList.add('is-valid');
        }
    });

    return todosLlenos;
}

async function postData() {
    if (!validarCamposNoVaciosPost()) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor, completa todos los campos.',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    // Obtener los valores de los campos principales
    const nombre = document.getElementById('fullname').value;
    const telefono = document.getElementById('telefono').value;
    const sitioWeb = document.getElementById('sitioWeb').value;
    const encargado = document.getElementById('encargado').value;
    const razonSocial = document.getElementById('razonSocial').value;
    const tickteMensaje = document.getElementById('tickteMensaje').value;

    // Obtener el valor del combo box y determinar permitirVenta
    const permitirVentaSeleccionado = document.getElementById('ventaBolean').value;
    const permitirVenta = permitirVentaSeleccionado === 'opcion1'; // True si "opcion1", False si cualquier otra

    // Recoger los porcentajes con validación de números y marcar visualmente los errores
    const porcentajes = [];
    let todosValidos = true;

    for (let i = 1; i <= 10; i++) {
        const campoPorcentaje = document.getElementById(`porcentaje${i}`);
        const valorPorcentaje = parseFloat(campoPorcentaje.value);
        
        if (isNaN(valorPorcentaje)) {
            campoPorcentaje.classList.add('is-invalid');
            todosValidos = false;
        } else {
            campoPorcentaje.classList.remove('is-invalid');
            campoPorcentaje.classList.add('is-valid');
            porcentajes.push(valorPorcentaje);
        }
    }

    if (!todosValidos) {
        Swal.fire({
            title: 'Error',
            text: 'Uno o más porcentajes no son números válidos. Por favor, corrígelos.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    // Obtener los valores fiscales
    const propietario = document.getElementById('propietario').value;
    const regimenFiscal = document.getElementById('regimenFiscal').value;
    const direccionFiscal = document.getElementById('direccionFiscal').value;
    const colonia = document.getElementById('colonia').value;
    const ciudad = document.getElementById('ciudad').value;
    const codigoPostal = document.getElementById('codigoPostal').value;
    const rfc = document.getElementById('rfc').value;
    const telefonoFiscal = document.getElementById('telefonoFiscal').value;
    const correoFacturacion = document.getElementById('correoFacturacion').value;

    // Crear el objeto para enviar
    const data = {
        nombre,
        telefono,
        sitioWeb,
        encargado,
        razonSocial,
        porcentajePrecio1: porcentajes[0],
        porcentajePrecio2: porcentajes[1],
        porcentajePrecio3: porcentajes[2],
        porcentajePrecio4: porcentajes[3],
        porcentajePrecio5: porcentajes[4],
        porcentajePrecio6: porcentajes[5],
        porcentajePrecio7: porcentajes[6],
        porcentajePrecio8: porcentajes[7],
        porcentajePrecio9: porcentajes[8],
        porcentajePrecio10: porcentajes[9],
        mensajeTicket: tickteMensaje,
        permitirVenta,
        datosFiscales: {
            nombrePropietario: propietario,
            regimenFiscal,
            direccionFiscal,
            colonia,
            ciudad,
            codigoPostal,
            rfc,
            telefonos: [telefonoFiscal], // Puedes ajustar esto si necesitas un array de teléfonos
            correoFacturacion
        }
    };

    try {
        const response = await fetch(urlPostFranquicia, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            // Mostrar mensaje de éxito
            Swal.fire({
                title: 'Éxito',
                text: 'Datos enviados correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                // Recargar la página
                window.location.reload();
            });

        } else {
            // Mostrar mensaje de error
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al enviar los datos.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'Error en la conexión con el servidor.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
}

document.getElementById('btnGuardarFranquicia').addEventListener('click', postData);


