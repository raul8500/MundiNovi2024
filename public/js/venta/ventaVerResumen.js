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

        // Asegúrate de que los elementos del DOM donde se mostrará la información estén presentes
        document.getElementById('ventaFecha').innerText = new Date(venta.fecha).toLocaleString(); // Mostrar la fecha
        document.getElementById('ventaSucursal').innerText = venta.sucursal.nombre; // Mostrar la sucursal

        // Mostrar productos en la tabla del resumen
        const productosContainer = document.getElementById('ventaProductos');
        productosContainer.innerHTML = ''; // Limpiar antes de agregar nuevos productos

        venta.productos.forEach(producto => {
          const row = `
            <tr>
              <td>${producto.product.nombre}</td>
              <td>${producto.cantidad}</td>
              <td>${producto.precio}</td>
              <td>${(producto.cantidad * producto.precio).toFixed(2)}</td>
            </tr>
          `;
          productosContainer.insertAdjacentHTML('beforeend', row);
        });

        // Actualizar el total de la venta
        const totalVenta = venta.productos.reduce((total, producto) => total + (producto.cantidad * producto.precio), 0);
        document.getElementById('ventaTotal').innerText = totalVenta.toFixed(2);

      })
      .catch((error) => console.log(error));
}
