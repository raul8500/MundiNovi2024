const urlPutSucursal = base + '/api/sucursal/id/';
const modalSucursalEdit = new mdb.Modal(document.getElementById('ModalEditSucursal'));
let idSucursal = '';

// Manejador de clic para editar sucursales
on(document, 'click', '.btnEditSucursal', async e => {
    const button = e.target.closest('.btnEditSucursal');
    idSucursal = button.id;
    fetchSucursal(idSucursal);
});

// Guardar los cambios
document.getElementById('btnGuardarSucursal').addEventListener('click', async () => {
    if (validarCamposNoVaciosSucursal()) {
        await postData(idSucursal);
    }
});

// Función para obtener los datos de la sucursal
async function fetchSucursal(id) {
    try {
        const response = await fetch(`/api/sucursal/id/${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener los datos');
        }
        const data = await response.json();

        seleccionarFranquicia(data.idFranquicia._id)
        document.getElementById('claveEdit').value = data.clave;
        document.getElementById('nombreSucursalEdit').value = data.nombre;
        document.getElementById('mensajeTicketEdit').value = data.mensajeTicket;
        document.getElementById('precioDevolucionMercanciaEdit').value = data.precioDevolucionMercancia;
        document.getElementById('ventaBoleanEdit').value = data.status === 'Activo' ? 'Activo' : 'Inactivo';


        document.getElementById('razonSocialEdit').value = data.datosFiscales.razonSocial;
        document.getElementById('rfcEdit').value = data.datosFiscales.rfc;
        document.getElementById('direccionFiscalEdit').value = data.datosFiscales.direccionFiscal;

        document.getElementById('direccionEdit').value = data.datosTicket.direccion;
        document.getElementById('coloniaEdit').value = data.datosTicket.colonia;
        document.getElementById('ciudadEdit').value = data.datosTicket.ciudad;
        document.getElementById('codigoPostalEdit').value = data.datosTicket.codigoPostal;
        document.getElementById('telefonoEdit').value = data.datosTicket.telefonos[0] || '';
        document.getElementById('tamañoTicketEdit').value = data.datosTicket.tamanoTicket;

        // Aquí podrías cargar las opciones de franquicias en el select si es necesario

        modalSucursalEdit.show();
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'Error al cargar los datos de la sucursal.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
}

// Función para enviar los datos actualizados
async function postData(id) {
    if (!validarCamposNumericosSucursal()) {
        Swal.fire({
            title: 'Error',
            text: 'Uno o más campos no son válidos. Por favor, corrígelos.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    const idFranquicia = document.getElementById('franquiciaEdit').value;
    const status = document.getElementById('ventaBoleanEdit').value;
    const clave = document.getElementById('claveEdit').value;
    const nombre = document.getElementById('nombreSucursalEdit').value;
    const mensajeTicket = document.getElementById('mensajeTicketEdit').value;
    const precioDevolucionMercancia = parseFloat(document.getElementById('precioDevolucionMercanciaEdit').value) || 0;

    const razonSocial = document.getElementById('razonSocialEdit').value;
    const rfc = document.getElementById('rfcEdit').value;
    const direccionFiscal = document.getElementById('direccionFiscalEdit').value;

    const direccion = document.getElementById('direccionEdit').value;
    const colonia = document.getElementById('coloniaEdit').value;
    const ciudad = document.getElementById('ciudadEdit').value;
    const codigoPostal = document.getElementById('codigoPostalEdit').value;
    const telefono = document.getElementById('telefonoEdit').value;
    const tamanoTicket = document.getElementById('tamañoTicketEdit').value;

    const data = {
        clave,
        nombre,
        mensajeTicket,
        precioDevolucionMercancia,
        status,
        datosFiscales: {
            razonSocial,
            rfc,
            direccionFiscal,
        },
        datosTicket: {
            direccion,
            colonia,
            ciudad,
            codigoPostal,
            telefonos: [telefono],
            tamanoTicket
        },
        idFranquicia
    };

    try {
        const response = await fetch(`${urlPutSucursal}${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            Swal.fire({
                title: 'Éxito',
                text: 'Sucursal actualizada correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                window.location.reload(); // Refrescar la página después de guardar
            });
        } else if (response.status === 409) {
            Swal.fire({
                title: 'Error',
                text: 'La clave ya existe en otra sucursal. Por favor, elige una clave diferente.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al actualizar la sucursal.',
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

// Función para validar campos numéricos
function validarCamposNumericosSucursal() {
    let todosValidos = true;
    const camposNumericos = [
        'precioDevolucionMercanciaEdit',
        // Añadir otros campos numéricos si es necesario
    ];

    camposNumericos.forEach(idCampo => {
        const campo = document.getElementById(idCampo);
        const valor = parseFloat(campo.value);

        if (isNaN(valor)) {
            campo.classList.add('is-invalid');
            todosValidos = false;
        } else {
            campo.classList.remove('is-invalid');
            campo.classList.add('is-valid');
        }
    });

    return todosValidos;
}

// Función para validar campos no vacíos
function validarCamposNoVaciosSucursal() {
    const elementos = [
        document.getElementById('claveEdit'),
        document.getElementById('nombreSucursalEdit'),
        document.getElementById('mensajeTicketEdit'),
        document.getElementById('precioDevolucionMercanciaEdit'),
        document.getElementById('ventaBoleanEdit'),
        document.getElementById('razonSocialEdit'),
        document.getElementById('rfcEdit'),
        document.getElementById('direccionFiscalEdit'),
        document.getElementById('coloniaEdit'),
        document.getElementById('ciudadEdit'),
        document.getElementById('codigoPostalEdit'),
        document.getElementById('telefonoEdit'),
        document.getElementById('tamañoTicketEdit')
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

function seleccionarFranquicia(selectedId){
    let selectElement = document.getElementById('franquiciaEdit');
    let options = selectElement.children;

    for (let i = 0; i < options.length; i++) {
        if (options[i].value === selectedId) {
            options[i].selected = true;
            break;
        }
    }
}



getFranquiciasEdit()

function getFranquiciasEdit(){
    fetch(urlGetFranquicias)
    .then(response => response.json())
    .then(data => {
        cargarFranquiciasEdit(data);
    })
    .catch(error => console.log(error));
}
function cargarFranquiciasEdit(data, idFranquiciaSeleccionada) {
    let franquiciasHtml = '<option value="">Seleccione una opción</option>';

    data.forEach(item => {
        const seleccionado = item._id === idFranquiciaSeleccionada ? 'selected' : '';
        franquiciasHtml += `
            <option value="${item._id}" ${seleccionado}>${item.nombre}</option>
        `;
    });

    document.getElementById('franquiciaEdit').innerHTML = franquiciasHtml;
}
