const modalClientes = new mdb.Modal(document.getElementById('ModalAddCliente'));

const btnGuardarCliente = document.getElementById('btnGuardarCliente')

btnAddProducto.addEventListener('click', () => {
    // Recuperar y vaciar los valores de todos los campos
    const fieldsToClear = [
        'nombreCliente', 'rfc', 'telefonoPrincipal', 'telefonoContacto',
        'correoElectronicoContacto', 'calle',
        'numeroExterior', 'numeroInterior', 'colonia', 'localidad',
        'municipioDelegacion', 'estado', 'codigoPostal'
    ];
    fieldsToClear.forEach(id => {
        document.getElementById(id).value = '';
    });

    // Mostrar el modal de clientes
    modalClientes.show();
});

btnGuardarCliente.addEventListener('click', () => {
    // Obtener todos los campos del formulario
    const fields = [
        { id: 'nombreCliente', name: 'name', isRequired: true },
        { id: 'rfc', name: 'identification', isRequired: false, isFacturacionField: true },
        { id: 'regimen', name: 'regime', isRequired: true, isFacturacionField: true },
        { id: 'telefonoPrincipal', name: 'phonePrimary', isRequired: false, isFacturacionField: true },
        { id: 'telefonoContacto', name: 'mobile', isRequired: false, isFacturacionField: true },
        { id: 'correoElectronicoContacto', name: 'email', isRequired: false, isFacturacionField: true },
        { id: 'calle', name: 'street', isRequired: false, isFacturacionField: true },
        { id: 'numeroExterior', name: 'exteriorNumber', isRequired: false, isFacturacionField: true },
        { id: 'numeroInterior', name: 'interiorNumber', isRequired: false, isFacturacionField: true },
        { id: 'colonia', name: 'colony', isRequired: false, isFacturacionField: true },
        { id: 'localidad', name: 'locality', isRequired: false, isFacturacionField: true },
        { id: 'municipioDelegacion', name: 'municipality', isRequired: false, isFacturacionField: true },
        { id: 'estado', name: 'state', isRequired: false, isFacturacionField: true },
        { id: 'codigoPostal', name: 'zipCode', isRequired: true, isFacturacionField: true }
    ];

    // Obtener el valor del campo de "Factura"
    const facturaSi = document.getElementById('factura_si').checked;


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

    // Validar que se haya incluido la dirección completa si es necesario
    const addressFields = ['street', 'exteriorNumber', 'interiorNumber', 'colony', 'locality', 'municipality', 'state', 'zipCode'];
    addressFields.forEach(field => {
        if (clienteData[field]) {
            clienteData.address = clienteData.address || {};
            clienteData.address[field] = clienteData[field];
            delete clienteData[field]; // Eliminar campo no necesario en la raíz
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


    fetch('/api/clientes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(clienteData)
    })
    .then(response => response.json())
    .then(data => {
        Swal.fire({
            icon: 'success',
            title: 'Cliente guardado',
            text: 'Los datos del cliente se han guardado correctamente.'
        });
        
        // Ocultar el modal y limpiar los campos
        modalClientes.hide();
        btnAddProducto.click();
        console.log(data.data)
        clientes.push(data.data); // Añade el nuevo cliente a la lista de clientes
        mostrarClientes(clientes, currentPageClientes, itemsPerPageClientes); // Actualiza la tabla
        actualizarControlesPaginacionClientes(); // Actualiza los controles de paginación
        generarNumerosDePaginaClientes(); // Genera los números de página
        
    })
    .catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al guardar los datos. Inténtelo de nuevo más tarde.'
        });
        console.error('Error:', error);
    });
});

// Función para agregar cliente a la tabla
function agregarClienteATabla(cliente) {
    const clienteRow = `
        <tr>
            <td class="text-center">${cliente.id ?? ''}</td>
            <td class="text-center">${cliente.name ?? ''}</td>
            <td class="text-center">${cliente.identification ?? ''}</td>
            <td class="text-center">${cliente.email ?? ''}</td>
            <td class="text-center">${cliente.phonePrimary ? cliente.phonePrimary : ''}</td>
            <td class="text-center">${cliente.identification ? '<span class="badge badge-success rounded-pill d-inline">Sí</span>' : '<span class="badge badge-danger rounded-pill d-inline">No</span>'}</td>
            <td class="text-center">${formatearFecha(cliente.updatedAt)}</td>
            <td class="text-center">
                <button id="${cliente.id}" type="button" class="btn btn-primary btn-rounded btnEditClientes">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button id="${cliente.id}" type="button" class="btn btn-danger btn-rounded btnDeleteClientes">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    `;
    contenedorClientes.insertAdjacentHTML('beforeend', clienteRow);
}
