const modalClientes = new mdb.Modal(document.getElementById('ModalAddCliente'));
btnAddProducto.addEventListener('click', () => {
  // Recuperar y vaciar los valores de todos los campos
  document.getElementById('nombreCliente').value = '';
  document.getElementById('rfc').value = '';
  document.getElementById('telefonoPrincipal').value = '';
  document.getElementById('telefonoContacto').value = '';
  document.getElementById('correoElectronicoPersonal').value = '';
  document.getElementById('correoElectronicoContacto').value = '';
  document.getElementById('calle').value = '';
  document.getElementById('numeroExterior').value = '';
  document.getElementById('numeroInterior').value = '';
  document.getElementById('colonia').value = '';
  document.getElementById('localidad').value = '';
  document.getElementById('municipioDelegacion').value = '';
  document.getElementById('estado').value = '';
  document.getElementById('codigoPostal').value = '';

  // Mostrar el modal de clientes
  modalClientes.show();
});

btnGuardarCliente.addEventListener('click', () => {
  // Obtener todos los campos del formulario
  const fields = [
      { id: 'nombreCliente', name: 'name', isRequired: true },
      { id: 'rfc', name: 'identification', isRequired: false },
      { id: 'regimen', name: 'regime', isRequired: true },
      { id: 'regimen', name: 'regimeObject', isRequired: true },
      { id: 'telefonoPrincipal', name: 'telephone', isRequired: false },
      { id: 'telefonoContacto', name: 'contactTelephone', isRequired: false },
      { id: 'correoElectronicoPersonal', name: 'personalEmail', isRequired: false },
      { id: 'correoElectronicoContacto', name: 'contactEmail', isRequired: false },
      { id: 'calle', name: 'street', isRequired: false },
      { id: 'numeroExterior', name: 'exteriorNumber', isRequired: false },
      { id: 'numeroInterior', name: 'interiorNumber', isRequired: false },
      { id: 'colonia', name: 'colony', isRequired: false },
      { id: 'localidad', name: 'locality', isRequired: false },
      { id: 'municipioDelegacion', name: 'municipality', isRequired: false },
      { id: 'estado', name: 'state', isRequired: false },
      { id: 'codigoPostal', name: 'zipCode', isRequired: true }
  ];

  // Obtener el valor del campo de "Factura"
  const facturaSi = document.getElementById('factura_si').checked;

  // Crear objeto JSON
  const clienteData = {};

  // Validar campos y construir el JSON
  let todosLlenos = true;
  fields.forEach(field => {
      const element = document.getElementById(field.id);
      const value = element.value.trim();

      if (field.isRequired && value === '') {
          element.classList.add('is-invalid');
          todosLlenos = false;
      } else {
          element.classList.remove('is-invalid');
          element.classList.add('is-valid');
          if (value !== '') {
              if (field.name === 'regimeObject') {
                  // Se maneja por separado para el objeto del régimen
                  clienteData[field.name] = [value];
              } else if (field.name === 'regime') {
                  // Se maneja por separado para el régimen
                  clienteData[field.name] = value;
              } else if (field.name === 'address') {
                  // Se maneja por separado para la dirección
                  clienteData.address = clienteData.address || {};
                  clienteData.address[field.name] = value;
              } else {
                  clienteData[field.name] = value;
              }
          }
      }
  });

  // Validar que se haya incluido la dirección completa
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

  // Determinar la URL según el estado del campo "Factura"
  const url = facturaSi ? '/api/createClient' : '/api/createClientNoBilling';

  // Enviar datos con POST (ejemplo usando fetch)
  fetch(url, {
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
      // Opcional: Ocultar el modal o limpiar los campos
      modalClientes.hide();
      // Limpiar campos después de guardar
      btnAddProducto.click(); // Llama al click del botón de agregar producto para limpiar los campos
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













