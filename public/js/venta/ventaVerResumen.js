const modalVentaResumen = new mdb.Modal(document.getElementById('ventaResumenModal'));
let ventasResumen = '';

document.addEventListener('click', function(e) {
    const button = e.target.closest('.btnVerVenta');

    if (button) {
        const idVenta = button.id;
        cargarVentas(idVenta);
        modalVentaResumen.show();
    }
});

function cargarVentas(id) {
    fetch('/api/venta/' + id)
      .then((response) => response.json())
      .then((data) => {
        const venta = data.data;

        const fechaOriginal = new Date(venta.fecha);
        const fechaFormateada = fechaOriginal.getDate().toString().padStart(2, '0') + '/' +
                        (fechaOriginal.getMonth() + 1).toString().padStart(2, '0') + '/' +
                        fechaOriginal.getFullYear();
        console.log(venta)

        let tipoVenta = ''
        if (venta.tipoVenta == 'false'){
          tipoVenta = 'No facturada'
        }else{
          tipoVenta = 'Facturada'
        }
        let cliente = ''
        if(venta.cliente == null){
          cliente = 'Venta General'
        }

        document.getElementById('fecha').innerHTML = '<strong>Fecha:</strong> ' + fechaFormateada;
        document.getElementById('noVenta').innerHTML = '<strong>No. Venta:</strong> ' + venta.noVenta;
        document.getElementById('tipoVenta').innerHTML = '<strong>Tipo de Venta:</strong> ' + tipoVenta;
        document.getElementById('cliente').innerHTML = '<strong>Cliente:</strong> ' + cliente;
        document.getElementById('totalVenta').innerHTML = '<strong>Total de Venta:</strong> ' + venta.totalVenta;
        document.getElementById('totalProductos').innerHTML = '<strong>Total de Productos:</strong> ' + venta.totalProductos;
        mostrarProductos(venta.productos)
        mostrarFormasDePago(venta.pagos);
        venta.formasDePago 

      })
      .catch((error) => console.log(error));
}

const mostrarProductos = (productos) => {
  let resultadosProductos = ''
  let contenedor = document.getElementById('tablaProductos')
  productos.forEach((item) => {
    resultadosProductos += `
            <tr>
                <td class="text-center">${item.nombre}</td>
                <td class="text-center">${item.precioConIva}</td>
                <td class="text-center">${item.cantidad}</td>
                <td class="text-center">${(item.precioConIva * item.cantidad).toFixed(2)}</td>
                <td class="text-center">${item.kardexFolio}</td>
            </tr>`;
  });

  contenedor.innerHTML = resultadosProductos;
};
function mostrarFormasDePago(pagos) {
  const listaFormasDePago = document.querySelector('.list-group-flush');
  listaFormasDePago.innerHTML = ''; // Limpiar contenido previo, si lo hubiera

  let formasDePago = pagos.formasDePago;
  let cambio = pagos.cambio;

  // Mostrar las formas de pago
  formasDePago.forEach(pago => {
      const listItem = document.createElement('li');
      listItem.classList.add('list-group-item');
      
      // Añade el contenido de la forma de pago
      listItem.innerHTML = `
          <strong>Tipo de Pago:</strong> ${pago.forma}<br>
          <strong>Importe:</strong> $${pago.importe}
      `;

      // Añadir el item a la lista
      listaFormasDePago.appendChild(listItem);
  });

  // Mostrar el cambio si existe
  if (cambio !== undefined && cambio !== null) {
      const listItemCambio = document.createElement('li');
      listItemCambio.classList.add('list-group-item');
      
      // Añadir el contenido del cambio
      listItemCambio.innerHTML = `
          <strong>Cambio:</strong> $${cambio.toFixed(2)}
      `;

      // Añadir el item de cambio a la lista
      listaFormasDePago.appendChild(listItemCambio);
  }
}

