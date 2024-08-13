
const urlPutFranquicia = base + '/api/franquicia/add';
const modalfranquiciaEdit = new mdb.Modal(document.getElementById('ModalEditFranquicia'))
let idFranquicia = '' 


on(document, 'click', '.btnEdit', async e => {
    const button = e.target.closest('.btnEdit'); // Obtiene el botón que fue clicado
    idFranquicia = button.id;

    fetchFranquicia(idFranquicia);
});

btnGuardarFranquiciaEdit.addEventListener('click', async () => {
    if (validarCamposNoVacios()) {
        await postData(idFranquicia);
    }
});


async function fetchFranquicia(id) {
    try {
        const response = await fetch(`/api/franquicia/${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener los datos');
        }
        const data = await response.json();

        document.getElementById('fullnameEdit').value = data.nombre;
        document.getElementById('telefonoEdit').value = data.telefono;
        document.getElementById('sitioWebEdit').value = data.sitioWeb;
        document.getElementById('encargadoEdit').value = data.encargado;
        document.getElementById('razonSocialEdit').value = data.razonSocial;
        document.getElementById('tickteMensajeEdit').value = data.mensajeTicket;
        document.getElementById('ventaBoleanEdit').value = data.permitirVenta ? 'opcion1' : 'opcion2';
        
        // Rellenar porcentajes
        for (let i = 1; i <= 10; i++) {
            document.getElementById(`porcentaje${i}Edit`).value = data[`porcentajePrecio${i}`] || '';
        }

        // Rellenar datos fiscales
        document.getElementById('propietarioEdit').value = data.datosFiscales.nombrePropietario;
        document.getElementById('regimenFiscalEdit').value = data.datosFiscales.regimenFiscal;
        document.getElementById('direccionFiscalEdit').value = data.datosFiscales.direccionFiscal;
        document.getElementById('coloniaEdit').value = data.datosFiscales.colonia;
        document.getElementById('ciudadEdit').value = data.datosFiscales.ciudad;
        document.getElementById('codigoPostalEdit').value = data.datosFiscales.codigoPostal;
        document.getElementById('rfcEdit').value = data.datosFiscales.rfc;
        document.getElementById('telefonoFiscalEdit').value = data.datosFiscales.telefonos[0] || '';
        document.getElementById('correoFacturacionEdit').value = data.datosFiscales.correoFacturacion;

        modalfranquiciaEdit.show()
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'Error al cargar los datos de la franquicia.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
}

async function postData(id) {
    const nombre = document.getElementById('fullnameEdit').value;
    const telefono = document.getElementById('telefonoEdit').value;
    const sitioWeb = document.getElementById('sitioWebEdit').value;
    const encargado = document.getElementById('encargadoEdit').value;
    const razonSocial = document.getElementById('razonSocialEdit').value;
    const tickteMensaje = document.getElementById('tickteMensajeEdit').value;
    const permitirVentaSeleccionado = document.getElementById('ventaBoleanEdit').value;
    const permitirVenta = permitirVentaSeleccionado === 'opcion1';

    const porcentajes = [];
    for (let i = 1; i <= 10; i++) {
        porcentajes.push(parseFloat(document.getElementById(`porcentaje${i}Edit`).value) || 0);
    }

    const propietario = document.getElementById('propietarioEdit').value;
    const regimenFiscal = document.getElementById('regimenFiscalEdit').value;
    const direccionFiscal = document.getElementById('direccionFiscalEdit').value;
    const colonia = document.getElementById('coloniaEdit').value;
    const ciudad = document.getElementById('ciudadEdit').value;
    const codigoPostal = document.getElementById('codigoPostalEdit').value;
    const rfc = document.getElementById('rfcEdit').value;
    const telefonoFiscal = document.getElementById('telefonoFiscalEdit').value;
    const correoFacturacion = document.getElementById('correoFacturacionEdit').value;

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
            telefonos: [telefonoFiscal],
            correoFacturacion
        }
    };
    console.log(data)

    try {
        const response = await fetch(`/api/franquicia/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            Swal.fire({
                title: 'Éxito',
                text: 'Franquicia actualizada correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                window.location.reload(); // Refrescar la página después de guardar
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al actualizar la franquicia.',
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

function validarCamposNoVacios() {
    const elementos = [
        document.getElementById('fullnameEdit'),
        document.getElementById('telefonoEdit'),
        document.getElementById('sitioWebEdit'),
        document.getElementById('encargadoEdit'),
        document.getElementById('razonSocialEdit'),
        document.getElementById('tickteMensajeEdit'),
        document.getElementById('ventaBoleanEdit'),
        document.getElementById('porcentaje1Edit'),
        document.getElementById('porcentaje2Edit'),
        document.getElementById('porcentaje3Edit'),
        document.getElementById('porcentaje4Edit'),
        document.getElementById('porcentaje5Edit'),
        document.getElementById('porcentaje6Edit'),
        document.getElementById('porcentaje7Edit'),
        document.getElementById('porcentaje8Edit'),
        document.getElementById('porcentaje9Edit'),
        document.getElementById('porcentaje10Edit'),
        document.getElementById('propietarioEdit'),
        document.getElementById('regimenFiscalEdit'),
        document.getElementById('direccionFiscalEdit'),
        document.getElementById('coloniaEdit'),
        document.getElementById('ciudadEdit'),
        document.getElementById('codigoPostalEdit'),
        document.getElementById('rfcEdit'),
        document.getElementById('telefonoFiscalEdit'),
        document.getElementById('correoFacturacionEdit')
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
