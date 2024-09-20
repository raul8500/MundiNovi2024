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
          tipoVenta = 'Sin factura'
        }else{
          tipoVenta = 'Con factura'
        }
        let cliente = ''
        if(venta.cliente == null){
          cliente = 'Venta General'
        }

        document.getElementById('fecha').innerHTML = '<strong>Fecha:</strong> ' + fechaFormateada;
        document.getElementById('noVenta').innerHTML = '<strong>No. Venta:</strong> ' + venta.noVenta;
        document.getElementById('sucursal').innerHTML = '<strong>Sucursal:</strong> ' + venta.sucursal.nombre;
        document.getElementById('tipoVenta').innerHTML = '<strong>Tipo de Venta:</strong> ' + tipoVenta;
        document.getElementById('cliente').innerHTML = '<strong>Cliente:</strong> ' + cliente;
        document.getElementById('totalVenta').innerHTML = '<strong>Total de Venta:</strong> ' + venta.totalVenta;
        document.getElementById('totalProductos').innerHTML = '<strong>Total de Productos:</strong> ' + venta.totalProductos;
        mostrarProductos(venta.productos)
        mostrarFormasDePago(venta.formasDePago);
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
                <td class="text-center">${item.precio}</td>
                <td class="text-center">${item.cantidad}</td>
                <td class="text-center">${item.precio * item.cantidad}</td>
                <td class="text-center">${item.kardexFolio}</td>
            </tr>`;
  });

  contenedor.innerHTML = resultadosProductos;
};

function mostrarFormasDePago(formasDePago) {
    const listaFormasDePago = document.querySelector('.list-group-flush');
    listaFormasDePago.innerHTML = ''; // Limpiar contenido previo, si lo hubiera

    formasDePago.forEach(pago => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item');
        
        // Añade el contenido de la forma de pago
        listItem.innerHTML = `
            <strong>Tipo de Pago:</strong> ${pago.tipo}<br>
            <strong>Importe:</strong> $${pago.importe}
        `;

        // Añadir el item a la lista
        listaFormasDePago.appendChild(listItem);
    });
}
