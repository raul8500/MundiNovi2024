const modalClientesEdit = new mdb.Modal(document.getElementById('ModalEditCliente'));
const btnGuardarClienteEdit = document.getElementById('btnGuardarClienteEdit')
let clienteEdit = '';
let idClienteEdit = ''


on(document, 'click', '.btnEditClientes', async e => {
    const button = e.target.closest('.btnEditClientes'); // Obtiene el botón que fue clicado
    const idCliente = button.id;
    cargarCliente(idCliente);
    modalClientesEdit.show();
});

function cargarCliente(id) {
    fetch('/api/clientes/' + id)
        .then((response) => response.json())
        .then((data) => {
            clienteEdit = data;
            idClienteEdit = data.clientData.id
            mostrarDatoEdit(clienteEdit);
        })
        .catch((error) => {
            console.log(error);
            loadingSpinner.style.display = 'none'; // Ocultar también en caso de error
        });
}

function mostrarDatoEdit(clienteEdit) {
    document.getElementById('clientIdEdit').value = clienteEdit.clientData.id;
    document.getElementById('nombreClienteEdit').value = clienteEdit.clientData.name;
    document.getElementById('rfcEdit').value = clienteEdit.clientData.identification;
    document.getElementById('telefonoPrincipalEdit').value = clienteEdit.clientData.phonePrimary;
    document.getElementById('telefonoContactoEdit').value = clienteEdit.clientData.phoneSecondary;
    document.getElementById('correoElectronicoContactoEdit').value = clienteEdit.clientData.email;
    document.getElementById('calleEdit').value = clienteEdit.clientData.address?.street || '';
    document.getElementById('numeroExteriorEdit').value = clienteEdit.clientData.address?.exteriorNumber || '';
    document.getElementById('numeroInteriorEdit').value = clienteEdit.clientData.address?.interiorNumber || '';
    document.getElementById('coloniaEdit').value = clienteEdit.clientData.address?.colony || '';
    document.getElementById('localidadEdit').value = clienteEdit.clientData.address?.locality || '';
    document.getElementById('municipioDelegacionEdit').value = clienteEdit.clientData.address?.municipality || '';
    document.getElementById('estadoEdit').value = clienteEdit.clientData.address?.state || '';
    document.getElementById('codigoPostalEdit').value = clienteEdit.clientData.address?.zipCode || '';

    // Cargar factura y regimen si es necesario
    if (clienteEdit.esfactura === true) {
        document.getElementById('factura_siEdit').checked = true;
    } else {
        document.getElementById('factura_noEdit').checked = true;
    }

    // Llamar a la función de carga de opciones del régimen
    loadRegimenOptionsEdit();

    // Seleccionar el régimen fiscal actual si ya está definido
    const currentRegimen = clienteEdit.clientData.regimeObject[0]; // Suponiendo que el régimen fiscal esté en 'clientData.fiscalRegimen'
    if (currentRegimen) {
        regimenSelectEdit.value = currentRegimen; // Selecciona el régimen actual del cliente
    }
}

// Función para cargar las opciones del select de régimen fiscal
const regimenSelectEdit = document.getElementById('regimenEdit');
const rfcInputEdit = document.getElementById('rfcEdit');

function loadRegimenOptionsEdit() {
    const rfcValue = rfcInputEdit.value.trim();
    // Limpiar las opciones actuales del select
    regimenSelectEdit.innerHTML = '';

    if (rfcValue.length === 12) {
        // Opciones para RFC con 12 caracteres (Personas Morales)
        const opciones12 = [
            { value: 'NO_REGIME', text: 'Sin régimen' },
            { value: 'GENERAL_REGIME_OF_MORAL_PEOPLE_LAW', text: 'Régimen General de Ley Personas Morales' },
            { value: 'REGIME_OF_MORAL_PEOPLE_NOT_PROFIT', text: 'Personas Morales con Fines no Lucrativos' },
            { value: 'PRIMARY_SECTOR_REGIME', text: 'Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras (AGAPES)' },
            { value: 'REGIME_OF_THE_COORDINATED', text: 'Coordinados' },
            { value: 'REGIME_OF_COOPERATIVE_PRODUCTION_SOCIETIES', text: 'Sociedades Cooperativas de Producción que optan por diferir sus ingresos' },
            { value: 'REGIME_OF_TRUST', text: 'Regimen simplificado de confianza (RESICO)' },
            { value: 'SIMPLIFIED_REGIME', text: 'Sin obligaciones fiscales' },
            { value: 'SOCIETIES_OPTIONAL_REGIME', text: 'Opcional para Grupos de Sociedades' }
        ];

        opciones12.forEach(opcion => {
            const opt = document.createElement('option');
            opt.value = opcion.value;
            opt.text = opcion.text;
            regimenSelectEdit.add(opt);
        });

    } else if (rfcValue.length === 13) {
        // Opciones para RFC con 13 caracteres (Personas Físicas)
        const opciones13 = [
            { value: 'NO_REGIME', text: 'Sin régimen' },
            { value: 'BUSINESS_ACTIVITIES_REGIME', text: 'Personas Físicas con Actividades Empresariales y Profesionales' },
            { value: 'FISCAL_INCORPORATION_REGIME', text: 'Incorporación Fiscal' },
            { value: 'LEASEHOLD_REGIME', text: 'Arrendamiento' },
            { value: 'REGIME_OF_THE_TECHNOLOGICAL_PLATFORMS_INCOME_ACTIVITIES', text: 'Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas' },
            { value: 'SALARIED_REGIME', text: 'Sueldos y Salarios e Ingresos Asimilados a Salarios' },
            { value: 'REGIME_OF_TRUST', text: 'Regimen simplificado de confianza (RESICO)' },
            { value: 'SIMPLIFIED_REGIME', text: 'Sin obligaciones fiscales' },
            { value: 'DIVIDEND_INCOME', text: 'Ingresos por Dividendos (socios y accionistas)' },
        ];

        opciones13.forEach(opcion => {
            const opt = document.createElement('option');
            opt.value = opcion.value;
            opt.text = opcion.text;
            regimenSelectEdit.add(opt);
        });
    } else {
        // Opciones cuando no hay un RFC válido
        const opt = document.createElement('option');
        opt.value = 'SIMPLIFIED_REGIME';
        opt.text = 'Sin Obligaciones Fiscales';
        regimenSelectEdit.add(opt);
    }
}

// Agregar el event listener al input para que cargue las opciones cada vez que cambie
rfcInputEdit.addEventListener('input', loadRegimenOptionsEdit);


btnGuardarClienteEdit.addEventListener('click', () => {
    // Obtener todos los campos del formulario
    const fields = [
        { id: 'nombreClienteEdit', name: 'name', isRequired: true },
        { id: 'rfcEdit', name: 'identification', isRequired: false, isFacturacionField: true },
        { id: 'regimenEdit', name: 'regime', isRequired: true, isFacturacionField: true },
        { id: 'telefonoPrincipalEdit', name: 'phonePrimary', isRequired: false, isFacturacionField: true },
        { id: 'correoElectronicoContactoEdit', name: 'email', isRequired: false, isFacturacionField: true },
        { id: 'calleEdit', name: 'street', isRequired: false, isFacturacionField: true },
        { id: 'numeroExteriorEdit', name: 'exteriorNumber', isRequired: false, isFacturacionField: true },
        { id: 'numeroInteriorEdit', name: 'interiorNumber', isRequired: false, isFacturacionField: true },
        { id: 'coloniaEdit', name: 'colony', isRequired: false, isFacturacionField: true },
        { id: 'localidadEdit', name: 'locality', isRequired: false, isFacturacionField: true },
        { id: 'municipioDelegacionEdit', name: 'municipality', isRequired: false, isFacturacionField: true },
        { id: 'estadoEdit', name: 'state', isRequired: false, isFacturacionField: true },
        { id: 'codigoPostalEdit', name: 'zipCode', isRequired: true, isFacturacionField: true }
    ];

    // Obtener el valor del campo de "Factura"
    const facturaSi = document.getElementById('factura_siEdit').checked;

    // Construir el objeto con los datos del cliente
    const clienteData = {
        esFactura: facturaSi
    };

    // Validar campos y construir el JSON
    let todosLlenos = true;
    fields.forEach(field => {
        const element = document.getElementById(field.id);
        const value = element.value.trim();

        // Determinar si el campo es obligatorio
        const isRequired = field.isRequired || (facturaSi && field.isFacturacionField);

        if (isRequired && value === '') {
            element.classList.add('is-invalid');
            todosLlenos = false;
        } else {
            element.classList.remove('is-invalid');
            element.classList.add('is-valid');
            if (value !== '') {
                clienteData[field.name] = value;
            }
        }
    });

    if (!todosLlenos) {
        Swal.fire({
            icon: 'error',
            title: 'Campos obligatorios faltantes',
            text: 'Por favor, complete los campos obligatorios.'
        });
        return;
    }

    console.log(clienteData)

    // Realizar la solicitud PUT para editar el cliente
    fetch(`/api/clientesUpdateCompleto/${idClienteEdit}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(clienteData)
    })
    .then(response => response.json())
    .then(data => {
        Swal.fire({
            icon: 'success',
            title: 'Cliente actualizado',
            text: 'Los datos del cliente se han actualizado correctamente.'
        }).then(() => {
            setTimeout(() => {
                window.location.reload();
            }, 1000); // Espera 1500 milisegundos (1.5 segundos)
        });
        

    })
    .catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al actualizar los datos. Inténtelo de nuevo más tarde.'
        });
        console.error('Error:', error);
    });
});