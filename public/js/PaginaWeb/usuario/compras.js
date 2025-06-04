document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('/api/clientes/verificar', {
      method: 'GET',
      credentials: 'include', // necesario para enviar cookies
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error('No autorizado');
    }

    const cliente = await res.json();
    console.log(cliente)

    // Mostrar nombre del cliente en el panel
    document.getElementById('nombreCliente').textContent = cliente.clientData?.name || 'Cliente';
    document.getElementById('saldoCliente').textContent = `$${(cliente.monedero || 0).toFixed(2)}`;
    document.getElementById('nombreTarjeta').textContent = cliente.clientData?.name || 'Cliente';

    // Aquí puedes hacer más cosas: llenar inputs, cargar historial, etc.

  } catch (error) {
    console.error('Error al obtener datos del cliente:', error);
    window.location.href = '/facturacion'; // redirige si no está autenticado
  }
});

$(document).ready(function () {
  const tablaVentasCliente = $('#tablaVentasCliente').DataTable({
    ajax: {
      url: '/api/clientes/ventas',
      method: 'GET',
      dataSrc: 'ventas'
    },
    pageLength: 10,
    lengthChange: false,
    columns: [
      { data: 'noVenta', className: 'text-center align-middle' },
      {
        data: 'fecha',
        className: 'text-center align-middle',
        render: function (data) {
          const fecha = new Date(data);
          return fecha.toLocaleString('es-MX', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          });
        }
      },
      {
        data: 'totalVenta',
        className: 'text-center align-middle',
        render: data => `<span class="fw-semibold" style="color:rgb(53, 127, 73);">$${parseFloat(data).toFixed(2)}</span>`
      },
      { data: 'totalProductos', className: 'text-center align-middle' },
      {
        data: 'factura.estado',
        className: 'text-center align-middle',
        render: function (data) {
          const badgeClass = data === 1 ? 'success' : 'warning';
          const texto = data === 1 ? 'Facturado' : 'No facturado';
          return `<span class="badge bg-${badgeClass}">${texto}</span>`;
        }
      },
      {
        data: null,
        className: 'text-center align-middle',
        render: function (data) {
          if (data.factura?.estado === 0) {
            return `<button class="btn btn-outline-primary" style="background-color: white;" onclick="facturarVenta('${data._id}')" title="Generar factura de esta venta">
                      <i class="fas fa-file-invoice"></i> Facturar
                    </button>`;
          } else {
            return `
              <div class="btn-group" role="group">
                <button class="btn btn-outline-primary" style="background-color: white;" onclick="reenviarFactura('${data._id}')" title="Reenviar factura al correo">
                  <i class="fas fa-envelope"></i>
                </button>
                <a href="${data.factura?.pdfUrl}" target="_blank" class="btn btn-outline-success" style="background-color: white;" title="Descargar PDF">
                  <i class="fas fa-file-pdf"></i>
                </a>
                <a href="${data.factura?.xmlUrl}" target="_blank" class="btn btn-outline-info" style="background-color: white;" title="Descargar XML">
                  <i class="fas fa-file-code"></i>
                </a>
              </div>
            `;
          }
        }
      }
    ],
    order: [[1, 'desc']],
    language: {
      "sProcessing": "Procesando...",
      "sLengthMenu": "Mostrar _MENU_ registros",
      "sZeroRecords": "No se encontraron resultados",
      "sInfo": "Mostrando _START_ a _END_ de _TOTAL_ registros",
      "sInfoEmpty": "Mostrando 0 a 0 de 0 registros",
      "sInfoFiltered": "(filtrado de _MAX_ registros totales)",
      "sSearch": "Buscar:",
      "sLoadingRecords": "Cargando...",
      "oPaginate": {
        "sFirst": "Primera",
        "sLast": "Última",
        "sNext": "Siguiente",
        "sPrevious": "Anterior"
      }
    }
  });
});

function toggleMenu() {
  const dropdown = document.getElementById('usuarioDropdown');
  dropdown.classList.toggle('active');
}

// Cerrar menú al hacer clic fuera
document.addEventListener('click', function (e) {
  const btn = document.querySelector('.usuario-button');
  const dropdown = document.getElementById('usuarioDropdown');
  if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.remove('active');
  }
});
