let clienteIdGlobal = null; // Guardamos el ID del cliente globalmente

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('/api/clientes/verificar', {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) throw new Error('No autorizado');
    const cliente = await res.json();

    clienteIdGlobal = cliente._id; // Guardamos el ID para después

    document.getElementById('nombreCliente').textContent = cliente.clientData?.name || 'Cliente';
    document.getElementById('saldoCliente').textContent = `$${(cliente.monedero || 0).toFixed(2)}`;
    document.getElementById('nombreTarjeta').textContent = cliente.clientData?.name || 'Cliente';

    cargarDatosUsuarios(cliente);
  } catch (error) {
    console.error('Error al obtener datos del cliente:', error);
    window.location.href = '/facturacion';
  }
});

function cargarDatosUsuarios(cliente) {
  document.getElementById('nombre').value = cliente.clientData.name || '';
  document.getElementById('rfc').value = cliente.clientData.identification || '';
  document.getElementById('correo').value = cliente.clientData.email || '';
  document.getElementById('telefono').value = cliente.clientData.mobile || '';
  document.getElementById('calle').value = cliente.clientData.address.street || '';
  document.getElementById('numeroExterior').value = cliente.clientData.address.exterior || '';
  document.getElementById('numeroInterior').value = cliente.clientData.address.interior || '';
  document.getElementById('cp').value = cliente.clientData.address.zip || '';
  document.getElementById('colonia').value = cliente.clientData.address.neighborhood || '';
  document.getElementById('ciudad').value = cliente.clientData.address.city || '';
  document.getElementById('municipio').value = cliente.clientData.address.municipality || '';
  document.getElementById('estado').value = cliente.clientData.address.state || '';

  loadRegimenOptions();
  setTimeout(() => {
    document.getElementById('regimenFiscal').value = cliente.clientData.regime || '';
  }, 50);
}

function loadRegimenOptions() {
  const rfcValue = document.getElementById('rfc').value.trim();
  const regimenSelect = document.getElementById('regimenFiscal');
  regimenSelect.innerHTML = '';

  const defaultOpt = document.createElement('option');
  defaultOpt.value = '';
  defaultOpt.text = 'Seleccione un régimen fiscal';
  regimenSelect.appendChild(defaultOpt);

  const opciones12 = [
    { value: '616', text: 'Régimen General de Ley Personas Morales' },
    { value: '616', text: 'Personas Morales con Fines no Lucrativos' },
    { value: '616', text: 'Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras (AGAPES)' },
    { value: '624', text: 'Coordinados' },
    { value: '620', text: 'Sociedades Cooperativas de Producción que optan por diferir sus ingresos' },
    { value: '620', text: 'Regimen simplificado de confianza (RESICO)' },
    { value: '616', text: 'Sin obligaciones fiscales' },
    { value: '623', text: 'Opcional para Grupos de Sociedades' }
  ];

  const opciones13 = [
    { value: '612', text: 'Personas Físicas con Actividades Empresariales y Profesionales' },
    { value: '621', text: 'Incorporación Fiscal' },
    { value: '606', text: 'Arrendamiento' },
    { value: '625', text: 'Régimen de Actividades Empresariales vía Plataformas' },
    { value: '605', text: 'Sueldos y Salarios e Ingresos Asimilados a Salarios' },
    { value: '626', text: 'RESICO' },
    { value: '616', text: 'Sin obligaciones fiscales' },
    { value: '611', text: 'Ingresos por Dividendos (socios y accionistas)' }
  ];

  if (rfcValue.length === 12) {
    opciones12.forEach(op => {
      const option = new Option(op.text, op.value);
      regimenSelect.add(option);
    });
  } else if (rfcValue.length === 13) {
    opciones13.forEach(op => {
      const option = new Option(op.text, op.value);
      regimenSelect.add(option);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('actualizarBtn').addEventListener('click', actualizarDatosPersonales);
});

async function actualizarDatosPersonales() {
  const btn = document.getElementById('actualizarBtn');
  const spinner = document.getElementById('spinnerActualizar');

  if (!clienteIdGlobal) {
    return Swal.fire({ icon: 'error', text: 'ID del cliente no disponible' });
  }

  // Mostrar spinner y desactivar botón
  btn.disabled = true;
  spinner.classList.remove('d-none');
  btn.textContent = ' Actualizando...';
  btn.prepend(spinner);

  const payload = {
    facturapi: {
      name: document.getElementById('nombre').value.trim(),
      identification: document.getElementById('rfc').value.trim(),
      regime: document.getElementById('regimenFiscal').value,
      email: document.getElementById('correo').value.trim(),
      phonePrimary: document.getElementById('telefono').value.trim(),
      address: {
        street: document.getElementById('calle').value.trim(),
        exterior: document.getElementById('numeroExterior').value.trim(),
        interior: document.getElementById('numeroInterior').value.trim(),
        zip: document.getElementById('cp').value.trim(),
        neighborhood: document.getElementById('colonia').value.trim(),
        city: document.getElementById('ciudad').value.trim(),
        municipality: document.getElementById('municipio').value.trim(),
        state: document.getElementById('estado').value.trim()
      }
    },
    client: {
      login: { pasword: '' }
    }
  };

  try {
    const res = await fetch(`/api/clientes/update/${clienteIdGlobal}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (res.ok) {
      Swal.fire({
        icon: 'success',
        title: '¡Actualizado!',
        text: 'Los datos personales se actualizaron correctamente.',
        timer: 2000,
        showConfirmButton: false
      }).then(() => location.reload());
    } else {
      const mensaje = data.facturapiError
        ? 'Error al validar los datos en Facturapi. Verifica que el RFC, régimen o dirección sean válidos.'
        : data.message || 'Error al actualizar';

      Swal.fire({ icon: 'error', title: 'Error al actualizar', text: mensaje      }).then(() => location.reload());
    }
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: 'error',
      title: 'Error inesperado',
      text: 'No se pudieron actualizar los datos.'
          }).then(() => location.reload());
  } finally {
    btn.disabled = false;
    spinner.classList.add('d-none');
    btn.innerHTML = '<i class="fas fa-save me-1"></i> Actualizar';
  }
}
