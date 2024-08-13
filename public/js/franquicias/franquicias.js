const urlGetSucursales = base + '/api/sucursal';
const urlGetFunctions = base + '/api/functions';
const urlGetFranquicias = base + '/api/franquicia';
const urlPostFranquicia = base + '/api/franquicia/add';


const modalUser = new mdb.Modal(document.getElementById('ModalAddFranquicia'))


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
    modalUser.show();
});


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
    let franquicia = ''
    data.forEach((item, index) => {
        franquicia += `
            <tr>
            <td>
                <p class="fw-normal mb-1">${item.nombre}</p>
            </td>
            <td>
                <p class="fw-normal mb-1">${item.encargado}</p>
            </td>
            <td>
                <span class="badge ${item.permitirVenta ? 'badge-success' : 'badge-danger'} rounded-pill d-inline">
                    ${item.permitirVenta ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td>
                <button id="${item._id}" type="button" class="btn btn-primary btn-rounded btnEdit">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>

                <button id="${item._id}" type="button" class="btn btn-danger btn-rounded btnDelete">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
            </tr>
        `;
    });
    document.getElementById('franquiciasData').innerHTML = franquicia;
}

function validarCamposNoVacios() {
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

// Función para enviar los datos al servidor
async function postData() {
    if (!validarCamposNoVacios()) {
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

    // Recoger los porcentajes
    const porcentajes = [];
    for (let i = 1; i <= 10; i++) {
        porcentajes.push(parseFloat(document.getElementById(`porcentaje${i}`).value) || 0);
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

// Asignar el event listener al botón
document.getElementById('btnGuardarFranquicia').addEventListener('click', postData);


