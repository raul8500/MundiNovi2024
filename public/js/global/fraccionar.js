let todoSeleccionado = false;
let ventasCargadas = [];

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnBuscarHoy').addEventListener('click', cargarVentasDelDia);
  document.getElementById('btnToggleSeleccion').addEventListener('click', toggleSeleccion);
  document.getElementById('btnAplicarFraccionamiento').addEventListener('click', aplicarFraccionamientoGlobal);
  document.getElementById('btnGuardarFraccionamiento').addEventListener('click', guardarFraccionamientoManual);

  document.getElementById('contenedorTickets').addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-fraccionar')) {
      const index = e.target.getAttribute('data-index');
      const venta = ventasCargadas[index];
      mostrarFraccionamiento(venta);
    }
  });
});

async function cargarVentasDelDia() {
  try {
    const res = await fetch('/api/ventasHelper');
    if (!res.ok) throw new Error('Error al recuperar ventas del día');

    const data = await res.json();
    ventasCargadas = data.ventas || [];

    const tbody = document.getElementById('contenedorTickets');
    tbody.innerHTML = '';

    ventasCargadas.forEach((venta, index) => {
      const cliente = venta.cliente?.nombre || 'Público en general';
      const fecha = new Date(venta.fecha).toLocaleDateString();
      const total = venta.totalVenta || 0;
      const costo = calcularCostoTotal(venta.productos);

      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td><input type="checkbox" class="check-ticket" data-id="${venta._id}" data-total="${total}" data-costo="${costo}"></td>
        <td>${index + 1}</td>
        <td>${venta.noVenta}</td>
        <td>${cliente}</td>
        <td>${fecha}</td>
        <td>$${total.toFixed(2)}</td>
        <td>$${costo.toFixed(2)}</td>
        <td class="descuento-aplicado">-</td>
        <td class="total-con-descuento">$${total.toFixed(2)}</td>
        <td><button class="btn btn-sm btn-info btn-fraccionar" data-index="${index}">Fraccionar</button></td>
      `;
      tbody.appendChild(fila);
    });

    conectarEventosCheckbox();
    calcularTotalFactura();
  } catch (error) {
    console.error(error);
    Swal.fire('❌ Error', 'No se pudieron cargar las ventas del día.', 'error');
  }
}

function calcularCostoTotal(productos = []) {
  return productos.reduce((total, p) => total + (p.costo || 0) * (p.cantidad || 0), 0);
}

function calcularTotalFactura() {
  const checks = document.querySelectorAll('.check-ticket:checked');
  let total = 0;
  checks.forEach(chk => {
    const fila = chk.closest('tr');
    const totalConDescuento = parseFloat(fila.querySelector('.total-con-descuento').textContent.replace('$', '')) || 0;
    total += totalConDescuento;
  });
  document.getElementById('totalFactura').textContent = total.toFixed(2);
}

function conectarEventosCheckbox() {
  const checks = document.querySelectorAll('.check-ticket');
  checks.forEach(check => check.addEventListener('change', calcularTotalFactura));

  const masterCheck = document.getElementById('checkMaster');
  if (masterCheck) {
    masterCheck.checked = false;
    masterCheck.addEventListener('change', () => {
      const marcado = masterCheck.checked;
      checks.forEach(c => c.checked = marcado);
      calcularTotalFactura();
    });
  }
}

function toggleSeleccion() {
  const checks = document.querySelectorAll('.check-ticket');
  todoSeleccionado = !todoSeleccionado;
  checks.forEach(c => c.checked = todoSeleccionado);
  document.getElementById('btnToggleSeleccion').textContent = todoSeleccionado ? 'Deseleccionar todos' : 'Seleccionar todos';
  calcularTotalFactura();
}

function mostrarFraccionamiento(venta) {
  const tabla = document.getElementById('tablaFraccionada');
  tabla.innerHTML = '';

  const index = ventasCargadas.indexOf(venta);
  document.getElementById('modalFraccionamiento').setAttribute('data-venta-index', index);

  venta.productos.forEach((prod, i) => {
    const cantidad = prod.fraccionadoCantidad || prod.cantidad;
    const precio = prod.fraccionadoPrecio || prod.precioConIva;
    const totalProd = cantidad * precio;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${prod.nombre}</td>
      <td>$${prod.precioConIva.toFixed(2)}</td>
      <td>$${(prod.costo || 0).toFixed(2)}</td>
      <td><input type="number" class="form-control input-cantidad" data-index="${i}" min="1" max="${prod.cantidad}" value="${cantidad}"></td>
      <td><input type="number" class="form-control input-precio" data-index="${i}" step="0.01" value="${precio.toFixed(2)}"></td>
      <td class="total-prod" data-index="${i}">$${totalProd.toFixed(2)}</td>
      <td class="validez" data-index="${i}">-</td>
    `;
    tabla.appendChild(row);
  });

  document.querySelectorAll('.input-cantidad, .input-precio').forEach(input => {
    input.addEventListener('input', () => validarFraccionamientoManual(venta));
  });

  const modal = new bootstrap.Modal(document.getElementById('modalFraccionamiento'));
  modal.show();
}

function validarFraccionamientoManual(venta) {
  venta.productos.forEach((prod, i) => {
    const inputCant = document.querySelector(`.input-cantidad[data-index="${i}"]`);
    const inputPrecio = document.querySelector(`.input-precio[data-index="${i}"]`);
    const celda = document.querySelector(`.validez[data-index="${i}"]`);
    const celdaTotal = document.querySelector(`.total-prod[data-index="${i}"]`);

    const nuevaCant = parseInt(inputCant.value);
    const nuevoPrecio = parseFloat(inputPrecio.value);
    const validoCantidad = !isNaN(nuevaCant) && nuevaCant >= 1 && Number.isInteger(nuevaCant);
    const validoPrecio = !isNaN(nuevoPrecio) && nuevoPrecio >= (prod.costo + 0.01);

    celda.innerHTML = (validoCantidad && validoPrecio)
      ? '<span class="badge bg-success">✅ Válido</span>'
      : '<span class="badge bg-danger">❌ Inválido</span>';

    celdaTotal.textContent = `$${(nuevaCant * nuevoPrecio).toFixed(2)}`;
  });
}

function aplicarFraccionamientoGlobal() {
  const porcentaje = parseFloat(document.getElementById('porcentajeFraccion').value);
  const descuentoPesos = parseFloat(document.getElementById('descuentoPesos').value);
  const checks = document.querySelectorAll('.check-ticket:checked');

  checks.forEach(check => {
    const fila = check.closest('tr');
    const index = fila.querySelector('.btn-fraccionar')?.getAttribute('data-index');
    const venta = ventasCargadas[index];
    let totalOriginal = 0;
    let totalFinal = 0;
    let esValido = true;

    // Calcular total original para proporcionalidad
    venta.productos.forEach(p => {
      totalOriginal += p.precioConIva * p.cantidad;
    });

    venta.productos.forEach(prod => {
      const cantidad = prod.cantidad;
      const costo = prod.costo || 0;
      const precioOriginal = prod.precioConIva;
      let nuevoPrecio = precioOriginal;

      if (!isNaN(porcentaje) && porcentaje > 0 && porcentaje <= 100) {
        nuevoPrecio = +(precioOriginal * (porcentaje / 100)).toFixed(2);
      } else if (!isNaN(descuentoPesos) && descuentoPesos > 0 && totalOriginal > 0) {
        const proporcion = (precioOriginal * cantidad) / totalOriginal;
        const descuentoIndividual = proporcion * descuentoPesos;
        const totalConDescuento = (precioOriginal * cantidad) - descuentoIndividual;
        nuevoPrecio = +(totalConDescuento / cantidad).toFixed(2);
      }

      if (nuevoPrecio < (costo + 0.01)) {
        esValido = false;
      }

      prod.fraccionadoCantidad = cantidad;
      prod.fraccionadoPrecio = nuevoPrecio;

      totalFinal += nuevoPrecio * cantidad;
    });

    if (!esValido) {
      fila.classList.add('table-danger');
      fila.querySelector('.descuento-aplicado').textContent = 'Inválido';
      fila.querySelector('.total-con-descuento').textContent = `$${totalOriginal.toFixed(2)}`;
      return;
    }

    fila.querySelector('.descuento-aplicado').textContent = `$${(totalOriginal - totalFinal).toFixed(2)}`;
    fila.querySelector('.total-con-descuento').textContent = `$${totalFinal.toFixed(2)}`;
    fila.classList.remove('table-danger');
  });

  calcularTotalFactura();
}


function guardarFraccionamientoManual() {
  const index = document.getElementById('modalFraccionamiento').getAttribute('data-venta-index');
  const venta = ventasCargadas[index];

  let totalFinalVenta = 0;
  let totalOriginal = 0;
  let esValido = true;

  venta.productos.forEach((prod, i) => {
    const inputCant = document.querySelector(`.input-cantidad[data-index="${i}"]`);
    const inputPrecio = document.querySelector(`.input-precio[data-index="${i}"]`);
    const nuevaCant = parseInt(inputCant.value);
    const nuevoPrecio = parseFloat(inputPrecio.value);

    const validoCantidad = !isNaN(nuevaCant) && nuevaCant >= 1 && Number.isInteger(nuevaCant);
    const validoPrecio = !isNaN(nuevoPrecio) && nuevoPrecio >= (prod.costo + 0.01);
    if (!validoCantidad || !validoPrecio) esValido = false;

    prod.fraccionadoCantidad = nuevaCant;
    prod.fraccionadoPrecio = nuevoPrecio;

    totalOriginal += prod.cantidad * prod.precioConIva;
    totalFinalVenta += nuevaCant * nuevoPrecio;
  });

  if (!esValido) {
    Swal.fire('⚠️ Fraccionamiento inválido', 'Verifica los valores ingresados. Ningún precio puede ser menor al costo + $0.01, y las cantidades deben ser enteras.', 'warning');
    return;
  }

  const fila = document.querySelector(`.btn-fraccionar[data-index="${index}"]`).closest('tr');
  fila.querySelector('.descuento-aplicado').textContent = `$${(totalOriginal - totalFinalVenta).toFixed(2)}`;
  fila.querySelector('.total-con-descuento').textContent = `$${totalFinalVenta.toFixed(2)}`;
  fila.classList.remove('table-danger');

  calcularTotalFactura();

  const modal = bootstrap.Modal.getInstance(document.getElementById('modalFraccionamiento'));
  modal.hide();
}
