
  function mostrarSucursal(elemento) {
    const nombre = elemento.dataset.nombre;
    const direccion = elemento.dataset.direccion;
    const telefono = elemento.dataset.telefono;
    const horario = elemento.dataset.horario;

    document.getElementById('modalSucursalLabel').innerText = nombre;
    document.getElementById('direccionSucursal').innerText = `📍 ${direccion}`;
    document.getElementById('telefonoSucursal').innerText = `📞 ${telefono}`;
    document.getElementById('horarioSucursal').innerText = `🕒 ${horario}`;

    const modal = new bootstrap.Modal(document.getElementById('modalSucursal'));
    modal.show();
  }
