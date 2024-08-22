//API URL'S
const urlGetSucursales = '/api/sucursal';
const urlGetFranquicias = '/api/franquicia';
const urlPostSucursal = '/api/sucursal/add'

const modalSucursal = new mdb.Modal(document.getElementById('ModalAddSucursal'));

const contenedorSucursales = document.getElementById('sucursalesData');
let currentPageSucursales = 1;
const itemsPerPageSucursales = 5; // Puedes ajustar este número según tus necesidades
const maxPageLinksSucursales = 5;
let sucursales = [];

//Funciones para mostrar datos
const mostrarSucursales = (sucursales, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    let resultadosSucursales = '';

    sucursales.slice(startIndex, endIndex).forEach(item => {
        resultadosSucursales += `
            <tr>
                <td class="text-center">${item.clave}</td>
                <td class="text-center">${item.nombre}</td>
                <td class="text-center">${item.idFranquicia.nombre}</td>
                <td class="text-center">
                    <span class="badge ${item.status === 'Activo' ? 'badge-success' : 'badge-danger'} rounded-pill d-inline">
                        ${item.status === 'Activo' ? 'Activo' : 'Inactivo'}
                    </span>

                </td>
                <td class="text-center">
                    <button id="${item._id}" type="button" class="btn btn-primary btn-rounded btnEditSucursal">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button id="${item._id}" type="button" class="btn btn-danger btn-rounded btnDeleteSucursal">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>`;
    });

    contenedorSucursales.innerHTML = resultadosSucursales;
};

function actualizarControlesPaginacionSucursales() {
    const botonAnterior = document.querySelector('#anteriorSucursales');
    const botonSiguiente = document.querySelector('#siguienteSucursales');

    if (botonAnterior && botonSiguiente) {
        botonAnterior.disabled = currentPageSucursales === 1;
        botonSiguiente.disabled = currentPageSucursales === Math.ceil(sucursales.length / itemsPerPageSucursales);
    }
}

function generarNumerosDePaginaSucursales() {
    const paginacionContainer = document.getElementById('paginationSucursales');

    if (paginacionContainer) {
        const numeroTotalPaginas = Math.ceil(sucursales.length / itemsPerPageSucursales);

        let paginacionHTML = '';

        let startPage = Math.max(1, currentPageSucursales - Math.floor(maxPageLinksSucursales / 2));
        let endPage = Math.min(numeroTotalPaginas, startPage + maxPageLinksSucursales - 1);

        if (startPage > 1) {
            paginacionHTML += '<li class="page-item"><a class="page-link" href="#" onclick="cambiarPaginaSucursales(1)">1</a></li>';
            if (startPage > 2) {
                paginacionHTML += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginacionHTML += `<li class="page-item ${i === currentPageSucursales ? 'active' : ''}"><a class="page-link" href="#" onclick="cambiarPaginaSucursales(${i})">${i}</a></li>`;
        }

        if (endPage < numeroTotalPaginas) {
            if (endPage < numeroTotalPaginas - 1) {
                paginacionHTML += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
            paginacionHTML += `<li class="page-item"><a class="page-link" href="#" onclick="cambiarPaginaSucursales(${numeroTotalPaginas})">${numeroTotalPaginas}</a></li>`;
        }

        paginacionContainer.innerHTML = paginacionHTML;
    }
}

function cargarSucursales() {
    fetch(urlGetSucursales)
        .then(response => response.json())
        .then(data => {
            sucursales = data;
            mostrarSucursales(sucursales, currentPageSucursales, itemsPerPageSucursales);
            actualizarControlesPaginacionSucursales();
            generarNumerosDePaginaSucursales();
        })
        .catch(error => console.log(error));
}

function cambiarPaginaSucursales(page) {
    if (page > 0 && page <= Math.ceil(sucursales.length / itemsPerPageSucursales)) {
        currentPageSucursales = page;
        mostrarSucursales(sucursales, currentPageSucursales, itemsPerPageSucursales);
        actualizarControlesPaginacionSucursales();
        generarNumerosDePaginaSucursales();
    }
}

cargarSucursales();


getFranquicias()

function getFranquicias(){
    fetch(urlGetFranquicias)
    .then(response => response.json())
    .then(data => {
        cargarFranquicias(data);
    })
    .catch(error => console.log(error));
}
function cargarFranquicias(data) {
    let franquicias = '<option selected>Seleccione una opción</option>';
    data.forEach((item, index) => {
        franquicias += `
            <option id="${item._id}" value="${index + 1}">${item.nombre}</option>
        `;
    });
    document.getElementById('franquicia').innerHTML = franquicias;
}



//funciones post

getFranquicias()
// Función para obtener franquicias
function getFranquicias() {
    fetch(urlGetFranquicias)
        .then(response => response.json())
        .then(data => {
            cargarFranquicias(data);
        })
        .catch(error => console.log(error));
}

function cargarFranquicias(data) {
    let franquicias = '<option selected>Seleccione una opción</option>';
    data.forEach(item => {
        franquicias += `
            <option id="${item._id}" value="${item._id}">${item.nombre}</option>
        `;
    });
    document.getElementById('franquicia').innerHTML = franquicias;
}

btnAddSucursal.addEventListener('click', () => {
    // Restablecer todos los campos del formulario
    document.getElementById('clave').value = '';
    document.getElementById('nombreSucursal').value = '';
    document.getElementById('mensajeTicket').value = '';
    document.getElementById('precioDevolucionMercancia').value = '';
    document.getElementById('ventaBolean').value = '';
    
    document.getElementById('direccion').value = '';
    document.getElementById('colonia').value = '';
    document.getElementById('ciudad').value = '';
    document.getElementById('codigoPostal').value = '';
    document.getElementById('telefono').value = '';
    document.getElementById('tamañoTicket').value = '';
    
    document.getElementById('razonSocial').value = '';
    document.getElementById('rfc').value = '';
    document.getElementById('direccionFiscal').value = '';

    // Activar la primera pestaña (pill) de información general
    const pill1 = document.getElementById('ex1-tab-1');


    pill1.classList.add('active');


    const content1 = document.getElementById('ex1-pills-1');
    const content2 = document.getElementById('ex1-pills-2');
    const content3 = document.getElementById('ex1-pills-3');

    content1.classList.add('show', 'active');
    content2.classList.remove('show', 'active');
    content3.classList.remove('show', 'active');

    // Mostrar el modal
    modalSucursal.show();
});

function validarCamposNoVaciosPost() {
    const elementos = [
        document.getElementById('clave'),
        document.getElementById('nombreSucursal'),
        document.getElementById('mensajeTicket'),
        document.getElementById('precioDevolucionMercancia'),
        document.getElementById('direccion'),
        document.getElementById('colonia'),
        document.getElementById('ciudad'),
        document.getElementById('codigoPostal'),
        document.getElementById('telefono'),
        document.getElementById('tamañoTicket'),
        document.getElementById('razonSocial'),
        document.getElementById('rfc'),
        document.getElementById('direccionFiscal')
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

    // Validar que el campo "Precio Devolución" sea un número
    const precioDevolucionMercancia = document.getElementById('precioDevolucionMercancia');
    const valorPrecioDevolucion = parseFloat(precioDevolucionMercancia.value);
    
    if (isNaN(valorPrecioDevolucion) || valorPrecioDevolucion < 0) {
        precioDevolucionMercancia.classList.add('is-invalid');
        todosLlenos = false;
    } else {
        precioDevolucionMercancia.classList.remove('is-invalid');
        precioDevolucionMercancia.classList.add('is-valid');
    }

    return todosLlenos;
}

async function postData() {
    if (!validarCamposNoVaciosPost()) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor, completa todos los campos correctamente.',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    // Obtener los valores de los campos principales
    const clave = document.getElementById('clave').value;
    const nombre = document.getElementById('nombreSucursal').value;
    const mensajeTicket = document.getElementById('mensajeTicket').value;
    const precioDevolucionMercancia = parseFloat(document.getElementById('precioDevolucionMercancia').value);
    const status = document.getElementById('ventaBolean').value;

    // Obtener el valor del combo box y determinar estado
    const idFranquicia = document.getElementById('franquicia').value;
    
    // Obtener los valores de dirección
    const direccion = document.getElementById('direccion').value;
    const colonia = document.getElementById('colonia').value;
    const ciudad = document.getElementById('ciudad').value;
    const codigoPostal = document.getElementById('codigoPostal').value;
    const telefonos = [document.getElementById('telefono').value];
    const tamanoTicket = document.getElementById('tamañoTicket').value;

    // Obtener los valores fiscales
    const razonSocial = document.getElementById('razonSocial').value;
    const rfc = document.getElementById('rfc').value;
    const direccionFiscal = document.getElementById('direccionFiscal').value;

    // Crear el objeto para enviar
    const data = {
        clave,
        nombre,
        mensajeTicket,
        precioDevolucionMercancia,
        status,
        datosTicket: {
            direccion,
            colonia,
            ciudad,
            codigoPostal,
            telefonos,
            tamanoTicket
        },
        datosFiscales: {
            razonSocial,
            rfc,
            direccionFiscal
        },
        idFranquicia
    };

    try {
        const response = await fetch(urlPostSucursal, {
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

        } else if (response.status === 409) {
            // Mostrar mensaje de error para clave ya existente
            Swal.fire({
                title: 'Error',
                text: 'La clave de sucursal ya existe. Por favor, elige una clave diferente.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        } else {
            // Mostrar mensaje de error genérico
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

